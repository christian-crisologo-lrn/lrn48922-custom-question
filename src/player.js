import { signLearnosityRequest } from "./signLearnosityRequest";
import { loadScript } from "./loadScript";
import { runReporting } from "./reporting";

const SCRIPT_URL = "https://items.learnosity.com/?latest-lts";

function getLearnosityRequest() {
  return {
    activity_id: "TestActivitySB",
    name: "Test Activity",
    rendering_type: "assess",
    type: "submit_practice",
    user_id: "labs-site",
    activity_template_id: "TestActivitySB",
    config: {
      ignore_question_attributes:
        document.location.search === "?ignore=1" ? ["valid_response"] : [],
    },
  };
}

export async function runPlayer() {
  await loadScript(SCRIPT_URL);

  const container = document.createElement("div");

  container.innerHTML = `
    <div>
      <div id="learnosity_assess"></div>
    </div>
  `;

  document.body.appendChild(container);

  const data = await signLearnosityRequest(getLearnosityRequest());

  const itemsApp = window.LearnosityItems.init(data, {
    readyListener() {
      console.log("learnosity items ready");

      const sessionId = itemsApp.getActivity().session_id;

      itemsApp.on("test:submit:success", () => {
        container.innerHTML = "";
        runReporting(sessionId);
      });
    },
    errorListener(err) {
      console.log("learnosity items error", err);
    },
  });
}
