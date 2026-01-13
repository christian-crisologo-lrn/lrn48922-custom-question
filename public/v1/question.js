const LRN_CQ_PREFIX1 = "lrn-test-question-v1";

class QuestionV1 {
  constructor(init, lrnUtils) {
    this.init = init;
    this.events = init.events;
    this.lrnUtils = lrnUtils;
    this.el = init.$el.get(0);
    this.componentStates = {};

    this.render().then(() => {
      this.registerPublicMethods();
      this.registerEventsListener();

      if (init.state === "review") {
        init.getFacade().disable();
      }

      init.events.trigger("ready");
    });
  }

  render() {
    this.el.innerHTML = `
      <div class="${LRN_CQ_PREFIX1} lrn-response-validation-wrapper">
        <div class="${LRN_CQ_PREFIX1}-root"></div>
      </div>
    `;

    return Promise.all([]).then(() => {
      this.renderComponent();
    });
  }

  renderComponent(options = {}) {
    const container = this.el.querySelector(`.${LRN_CQ_PREFIX1}-root`);
    let validResponseValue = "";
    if (this.init.question?.valid_response) {
      validResponseValue = this.init.question.valid_response.value;
    }
    
    container.innerHTML = `
      <div>
        ${
          this.init.state === "review"
            ? `
          <div>
            <div>given answer: ${this.init.response}</div>
            <div>correct answer: ${validResponseValue}</div>
          </div>
        `
            : `<input type="text">`
        }
      </div>
    `;

    if (this.init.state !== "review") {
      container.querySelector("input").addEventListener("change", (event) => {
        this.onValueChange(event.target.value);
      });
    }
  }

  onValueChange = (value) => {
    if (this.componentStates.resetState) {
      this.renderComponent({ resetState: "attemptedAfterReset" });
    }

    this.events.trigger("changed", value);
  };

  resetValidationUIState = () => {
    this.renderComponent({
      validationUIState: "",
    });
  };

  registerPublicMethods() {
    const facade = this.init.getFacade();

    facade.disable = () => {
      this.renderComponent({ disabled: true });
    };
    facade.enable = () => {
      this.renderComponent({ disabled: false });
    };

    facade.resetResponse = () => {
      this.events.trigger("resetResponse");

      this.renderComponent({ resetState: "reset" });
    };
  }

  registerEventsListener() {
    this.onValidateListener();
  }

  onValidateListener() {
    const facade = this.init.getFacade();
    const events = this.init.events;

    events.on("validate", () => {
      const isValid = facade.isValid();

      this.renderComponent({
        validationUIState: isValid ? "correct" : "incorrect",
      });
    });
  }
}

LearnosityAmd.define([], () => ({
  Question: QuestionV1
}));
