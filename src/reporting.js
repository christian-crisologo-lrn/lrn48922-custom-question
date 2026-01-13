import { signLearnosityRequest } from "./signLearnosityRequest";
import { loadScript } from "./loadScript";
import { getScriptUrl, getIgnoreQuestionAttributes, USER_ID } from "./util";

function getLearnosityRequest(sessionId, userId = USER_ID) {
  let ignoreQuestionAttr = getIgnoreQuestionAttributes();

  return {
    reports: [
      {
        id: "session-detail",
        type: "session-detail-by-item",
        user_id: userId,
        session_id: sessionId,
        questions_api_init_options:{
          ...(ignoreQuestionAttr.length > 0 ? { ignore_question_attributes: ignoreQuestionAttr } : {}),
          showCorrectAnswers: true
        }
      },
    ],
  };
}

function createReportContainer() {
  const container = document.createElement("div");
  container.innerHTML = `
    <div>
      <div id="session-detail"></div>
    </div>
  `;
  return container;
}

export async function runReporting(sessionId, userId) {
  try {
    console.log("Initializing Learnosity Reports API");
    console.log("Session ID:", sessionId);
    console.log("User ID:", userId || USER_ID);

    await loadScript(getScriptUrl("reports"));

    const container = createReportContainer();
    document.body.appendChild(container);

    const data = await signLearnosityRequest(getLearnosityRequest(sessionId, userId));

    if (!window.LearnosityReports) {
      throw new Error("LearnosityReports is not available");
    }

    window.LearnosityReports.init(data, {
      readyListener() {
        console.log("Learnosity Reports API ready");
      },
      errorListener(err) {
        console.error("Learnosity Reports API error:", err);
      },
    });
  } catch (error) {
    console.error("Error initializing reports:", error);
    throw error;
  }
}
