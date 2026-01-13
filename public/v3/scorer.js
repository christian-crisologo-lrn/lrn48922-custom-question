(() => {
    "use strict";
    
    class Scorer {
        constructor(question, response) {
            this.question = question;
            this.response = response;
        }
        
        isValid() {
            const { question, response } = this;
            return !(!response || question.valid_response.value !== response.value);
        }
        
        validateIndividualResponses() {
            return null;
        }
        
        score() {
            return this.isValid() ? this.maxScore() : 0;
        }
        
        maxScore() {
            return this.question.score;
        }
        
        canValidateResponse() {
            return true;
        }
    }
    
    LearnosityAmd.define([], () => ({
        Scorer
    }));
})();
