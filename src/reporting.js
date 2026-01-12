import { signLearnosityRequest } from "./signLearnosityRequest";
import { loadScript } from "./loadScript";

const SCRIPT_URL = "https://reports-ie.learnosity.com/?latest-lts";

function getLearnosityRequest(sessionId) {
  return {
    reports: [
      {
        id: "session-detail",
        type: "session-detail-by-item",
        user_id: "labs-site",
        session_id: sessionId,
      },
    ],
  };
}

export async function runReporting(sessionId) {
  await loadScript(SCRIPT_URL);

  const container = document.createElement("div");

  container.innerHTML = `
    <div>
      <div id="session-detail"></div>
    </div>
  `;

  document.body.appendChild(container);

  const data = await signLearnosityRequest(getLearnosityRequest(sessionId));

  window.LearnosityReports.init(data, {
    readyListener() {
      console.log("learnosity reports ready");
    },
    errorListener(err) {
      console.log("learnosity reports error", err);
    },
  });
}
