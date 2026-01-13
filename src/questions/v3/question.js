(() => {
    "use strict";
    
    const CUSTOM_QUESTION_CLASS = "lrn-custom-question";
    
    // UUID generation utilities
    const crypto = {
        randomUUID: typeof globalThis.crypto !== "undefined" && 
                                globalThis.crypto.randomUUID && 
                                globalThis.crypto.randomUUID.bind(globalThis.crypto)
    };
    
    let getRandomValues;
    const randomBytes = new Uint8Array(16);
    
    function getRandomValuesFunc() {
        if (!getRandomValues) {
            getRandomValues = typeof globalThis.crypto !== "undefined" && 
                                             globalThis.crypto.getRandomValues && 
                                             globalThis.crypto.getRandomValues.bind(globalThis.crypto);
            
            if (!getRandomValues) {
                throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
            }
        }
        return getRandomValues(randomBytes);
    }
    
    // Hex lookup table for UUID generation
    const hexLookup = [];
    for (let i = 0; i < 256; ++i) {
        hexLookup.push((i + 256).toString(16).slice(1));
    }
    
    const generateUUID = (options = {}, buffer, offset) => {
        if (crypto.randomUUID && !buffer && !options) {
            return crypto.randomUUID();
        }
        
        const randomValues = options.random || (options.rng || getRandomValuesFunc)();
        
        // Set version (4) and variant bits
        randomValues[6] = (randomValues[6] & 0x0f) | 0x40;
        randomValues[8] = (randomValues[8] & 0x3f) | 0x80;
        
        if (buffer) {
            offset = offset || 0;
            for (let i = 0; i < 16; ++i) {
                buffer[offset + i] = randomValues[i];
            }
            return buffer;
        }
        
        return formatUUID(randomValues);
    };
    
    function formatUUID(bytes, offset = 0) {
        return (
            hexLookup[bytes[offset + 0]] + hexLookup[bytes[offset + 1]] +
            hexLookup[bytes[offset + 2]] + hexLookup[bytes[offset + 3]] + "-" +
            hexLookup[bytes[offset + 4]] + hexLookup[bytes[offset + 5]] + "-" +
            hexLookup[bytes[offset + 6]] + hexLookup[bytes[offset + 7]] + "-" +
            hexLookup[bytes[offset + 8]] + hexLookup[bytes[offset + 9]] + "-" +
            hexLookup[bytes[offset + 10]] + hexLookup[bytes[offset + 11]] +
            hexLookup[bytes[offset + 12]] + hexLookup[bytes[offset + 13]] +
            hexLookup[bytes[offset + 14]] + hexLookup[bytes[offset + 15]]
        ).toLowerCase();
    }
    
    // Utility functions
    function arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        const newArray = new Array(len);
        for (let i = 0; i < len; i++) {
            newArray[i] = arr[i];
        }
        return newArray;
    }
    
    // Custom Question Class
    class CustomQuestion {
        constructor(init, lrnUtils) {
            this.init = init;
            this.events = init.events;
            this.lrnUtils = lrnUtils;
            this.el = init.$el.get(0);
            this.disabled = false;
            
            this.render().then(() => {
                this.registerPublicMethods();
                this.handleEvents();
                
                if (init.state === "review") {
                    init.getFacade().disable();
                }
                
                init.events.trigger("ready");
            });
        }
        
        async render() {
            const { el, init, lrnUtils } = this;
            const { question, response, state } = init;
            
            // Set up the HTML structure
            el.innerHTML = `
                <div class="${CUSTOM_QUESTION_CLASS} lrn-response-validation-wrapper">
                    <div class="lrn_response_input"></div>
                    <div class="${CUSTOM_QUESTION_CLASS}-checkAnswer-wrapper"></div>
                    <div class="${CUSTOM_QUESTION_CLASS}-suggestedAnswers-wrapper"></div>
                </div>
            `;
            
            // Render components
            const [suggestedAnswersList] = await Promise.all([
                lrnUtils.renderComponent("SuggestedAnswersList", 
                    el.querySelector(`.${CUSTOM_QUESTION_CLASS}-suggestedAnswers-wrapper`)),
                lrnUtils.renderComponent("CheckAnswerButton", 
                    el.querySelector(`.${CUSTOM_QUESTION_CLASS}-checkAnswer-wrapper`))
            ]);
            
            this.suggestedAnswersList = suggestedAnswersList;
            this.renderChoices(el, question, response, state);
        }
        
        renderChoices(container, question, response, state) {
            const inputContainer = container.querySelector(".lrn_response_input");
            const form = document.createElement("form");
            
            if (Array.isArray(question.choices)) {
                question.choices.forEach(choice => {
                    const optionContainer = document.createElement("div");
                    optionContainer.classList.add("option-container");
                    
                    const uniqueId = generateUUID();
                    const input = document.createElement("input");
                    const label = document.createElement("label");
                    
                    input.setAttribute("type", "radio");
                    input.setAttribute("id", uniqueId);
                    input.setAttribute("value", choice.value);
                    input.setAttribute("name", question.response_id);
                    
                    label.setAttribute("for", uniqueId);
                    label.innerHTML = choice.label;
                    
                    optionContainer.appendChild(input);
                    optionContainer.appendChild(label);
                    form.appendChild(optionContainer);
                });
                
                inputContainer.appendChild(form);
            }
            
            // Restore previous response if resuming or reviewing
            if ((state === "resume" || state === "review") && response) {
                const selectedInput = container.querySelector(`input[value="${response.value}"]`);
                if (selectedInput) {
                    selectedInput.checked = true;
                }
            }
        }
        
        registerPublicMethods() {
            const { init, el } = this;
            const facade = init.getFacade();
            
            facade.disable = () => {
                this.disabled = true;
                el.querySelectorAll("input").forEach(input => input.disabled = true);
                el.querySelector(".lrn_response_input").classList.add("disabled");
                el.querySelectorAll("label").forEach(label => label.classList.add("disabled"));
            };
            
            facade.enable = () => {
                this.disabled = false;
                el.querySelectorAll("input").forEach(input => input.disabled = false);
                el.querySelector(".lrn_response_input").classList.remove("disabled");
                el.querySelectorAll("label").forEach(label => label.classList.remove("disabled"));
            };
            
            facade.resetResponse = () => {
                const currentResponse = facade.getResponse();
                this.events.trigger("resetResponse");
                
                if (currentResponse?.value) {
                    const selectedInput = el.querySelector(`input[value="${currentResponse.value}"]`);
                    if (selectedInput) {
                        selectedInput.checked = false;
                    }
                }
            };
            
            facade.showValidationUI = () => {
                const inputContainer = el.querySelector(".lrn_response_input");
                if (facade.isValid()) {
                    inputContainer.classList.add("lrn_correct");
                } else {
                    inputContainer.classList.add("lrn_incorrect");
                }
            };
            
            facade.resetValidationUI = () => {
                const inputContainer = el.querySelector(".lrn_response_input");
                inputContainer.classList.remove("lrn_correct", "lrn_incorrect");
                this.suggestedAnswersList.reset();
            };
        }
        
        handleEvents() {
            const { events, el, init } = this;
            const { question } = init;
            const facade = init.getFacade();
            
            // Handle radio button clicks
            el.querySelectorAll('input[type="radio"]').forEach(input => {
                input.addEventListener("click", (event) => {
                    facade.resetValidationUI();
                    
                    const response = { value: event.target.value };
                    events.trigger("changed", response);
                    
                    console.log("You clicked a choice! The current response is: ", facade.getResponse());
                });
            });
            
            // Handle validation events
            events.on("validate", (validationData) => {
                facade.showValidationUI();
                
                const { choices, valid_response: validResponse } = question;
                const correctChoice = choices.find(choice => choice.value === validResponse.value);
                
                if (!facade.isValid() && validationData.showCorrectAnswers) {
                    this.suggestedAnswersList.setAnswers(correctChoice.label);
                }
            });
        }
    }
    
    // AMD module definition
    LearnosityAmd.define([], () => ({
        Question: CustomQuestion
    }));
})();