import { signLearnosityRequest } from "./signLearnosityRequest";
import { loadScript } from "./loadScript";
import questionTypeJson from "./questions/test/CustomQuestionType.json";
import questionTemplateJson from "./questions/test/QuestionTypeTemplate.json";

const SCRIPT_URL = "https://authorapi.learnosity.com/?latest-lts";
const BASE_URL = "https://sergiubucur-oup.github.io/learnosity-issue/docs";

function getLearnosityRequest() {
  const questionType = JSON.parse(
    JSON.stringify(questionTypeJson).split("{BASE_URL}").join(BASE_URL)
  );
  const questionTemplate = JSON.parse(
    JSON.stringify(questionTemplateJson).split("{BASE_URL}").join(BASE_URL)
  );

  return {
    mode: "activity_list",
    config: {
      item_edit: {
        item: {
          actions: {
            show: true,
          },
          status: {
            show: true,
          },
          title: {
            show: true,
          },
          reference: {
            show: true,
          },
        },
      },
      dependencies: {
        question_editor_api: {
          init_options: {
            custom_question_types: [questionType],
            question_type_templates: Object.assign({}, questionTemplate),
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

export async function runAuthoring() {
  await loadScript(SCRIPT_URL);

  const container = document.createElement("div");

  container.innerHTML = `
    <div>
      <div id="learnosity-author"></div>
    </div>
  `;

  document.body.appendChild(container);

  const data = await signLearnosityRequest(getLearnosityRequest());

  window.LearnosityAuthor.init(data, {
    readyListener() {
      console.log("learnosity author ready");
    },
    errorListener(err) {
      console.log("learnosity author error", err);
    },
  });
}
