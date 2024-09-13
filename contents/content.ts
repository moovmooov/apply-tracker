import { sendToBackground } from "@plasmohq/messaging";
import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["https://www.linkedin.com/jobs/*"],
};

const createCustomButton = () => {
  const button = document.createElement("button");
  button.className =
    "jobs-save-button artdeco-button artdeco-button--secondary artdeco-button--3 custom-button";
  button.type = "button";
  button.style.marginLeft = "10px";
  button.innerHTML = '<span aria-hidden="true">Adicionar no Notion</span>';
  button.addEventListener("click", () => {
    const title = document
      .querySelector(".job-details-jobs-unified-top-card__job-title")
      .textContent.trim();
    const company = document
      .querySelector(".job-details-jobs-unified-top-card__company-name")
      .textContent.trim();
    const url = window.location.href.trim();
    sendToBackground({
      name: "ping",
      body: {
        title,
        company,
        url,
      },
      extensionId: "dffofjfkidpjnolhflcodpjllggbehhp",
    });
  });
  return button;
};

const addCustomButton = (container: Element) => {
  if (!container.querySelector(".custom-button")) {
    container.appendChild(createCustomButton());
  }
};

const observeDOM = () => {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        const container = document
          .querySelector(".jobs-apply-button--top-card")
          ?.closest(".display-flex");
        if (container) {
          addCustomButton(container);
          break;
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

window.addEventListener("load", () => {
  observeDOM();
});
