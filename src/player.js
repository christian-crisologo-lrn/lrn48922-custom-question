import { signLearnosityRequest } from "./signLearnosityRequest";
import { loadScript } from "./loadScript";
import { getQueryParam, getScriptUrl, USER_ID, getActivityTemplateId } from "./util";

function getLearnosityRequest() {
  const activityId = getActivityTemplateId();
  const ignoreQuestionAttr = getQueryParam('ignore') ? ['valid_response'] : [];

  return {
    activity_id: activityId,
    name: "Test Activity",
    rendering_type: "assess",
    type: "submit_practice",
    user_id: USER_ID,
    activity_template_id: activityId,
    config: {
      ignore_question_attributes: ignoreQuestionAttr,
    },
  };
}

function createHeader() {
  const env = getQueryParam('env') || 'prod';
  const activityId = getActivityTemplateId();
  const ignoreParam = getQueryParam('ignore');

  const header = document.createElement('div');
  header.style.cssText = 'padding: 20px; background: #f5f5f5; border-bottom: 1px solid #ddd; font-family: Arial, sans-serif;';
  header.innerHTML = `
    <h1 style="margin: 0 0 10px 0;">Learnosity Custom Question</h1>
    <p style="margin: 0; color: #666;">
      <strong>Activity ID:</strong> ${activityId}
      ${ignoreParam ? `<br><strong>Ignore Attributes:</strong> valid_response` : ''}
      <br><strong>Environment:</strong> ${env}
    </p>
  `;
  return header;
}

function createContainer() {
  const container = document.createElement("div");
  container.innerHTML = `
    <div>
      <div id="learnosity_assess"></div>
    </div>
  `;
  return container;
}

export async function runPlayer() {
  await loadScript(getScriptUrl("items"));

  document.body.appendChild(createHeader());
  const container = createContainer();
  document.body.appendChild(container);

  const data = await signLearnosityRequest(getLearnosityRequest());

  const itemsApp = window.LearnosityItems.init(data, {
    readyListener() {
      console.log("Learnosity Items API ready");

      const sessionId = itemsApp.getActivity().session_id;
      const env = getQueryParam('env') || 'prod';

      itemsApp
        .on("test:submit:success", () => {
          const reportUrl = `report.html?env=${env}&sessionId=${encodeURIComponent(sessionId)}&userId=${encodeURIComponent(USER_ID)}`;
          console.log("Test submitted, navigating to:", reportUrl);
          window.location.href = reportUrl;
        })
        .on("test:submit:error", (err) => {
          console.error("Test submission error:", err);
        });
    },
    errorListener(err) {
      console.error("Learnosity Items API error:", err);
    },
  });
}
