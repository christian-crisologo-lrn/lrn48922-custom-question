// scoreing via validation

class ScorerV2 {
  constructor(question, responseValue) {
    this.question = question;
    this.responseValue = responseValue;
    this.validResponse = this.question?.validation?.valid_response;
  }

  isValid() {
    const responseValue = this.responseValue ?? null;
    const validResponse = this.validResponse?.value ?? null;

    if (responseValue === null || validResponse === null) {
      return false;
    }

    return responseValue === validResponse;
  }

  validateIndividualResponses() {
    return this.isValid();
  }

  score() {
    return this.isValid() ? this.maxScore() : 0;
  }

  maxScore() {
    return this.validResponse?.score || 0;
  }

  canValidateResponse() {
    return !!this.validResponse?.value;
  }
}

LearnosityAmd.define([], () => ({
  Scorer: ScorerV2
}));
