import { signLearnosityRequest } from "./signLearnosityRequest";
import { loadScript } from "./loadScript";
import { getScriptUrl, getBaseUrl } from "./util";
import questionTypeJson from "./questions/test/CustomQuestionType.json";
import questionTemplateJson from "./questions/test/QuestionTypeTemplate.json";

function replaceBaseUrl(json, baseUrl) {
  return JSON.parse(JSON.stringify(json).split("{BASE_URL}").join(baseUrl));
}

function getLearnosityRequest() {
  const baseUrl = getBaseUrl();
  const questionType = replaceBaseUrl(questionTypeJson, baseUrl);
  const questionTemplate = replaceBaseUrl(questionTemplateJson, baseUrl);

  return {
    mode: "activity_list",
    config: {
      item_edit: {
        item: {
          actions: { show: true },
          status: { show: true },
          title: { show: true },
          reference: { show: true },
        },
      },
      dependencies: {
        question_editor_api: {
          init_options: {
            custom_question_types: [questionType],
            question_type_templates: { ...questionTemplate },
          },
        },
      },
    },
    user: {
      id: "demos-site",
      firstname: "Demos",
      lastname: "User",
      email: "demos@learnosity.com",
    },
  };
}

function createContainer() {
  const container = document.createElement("div");
  container.innerHTML = `<div><div id="learnosity-author"></div></div>`;
  return container;
}

export async function runAuthoring() {
  await loadScript(getScriptUrl("authorapi"));

  const container = createContainer();
  document.body.appendChild(container);

  const data = await signLearnosityRequest(getLearnosityRequest());

  window.LearnosityAuthor.init(data, {
    readyListener() {
      console.log("Learnosity Author API ready");
    },
    errorListener(err) {
      console.error("Learnosity Author API error:", err);
    },
  });
}
