import { sendToBackground } from "@plasmohq/messaging";
import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["https://www.linkedin.com/jobs/*"],
};

const BUTTON_CLASS =
  "jobs-save-button artdeco-button artdeco-button--secondary artdeco-button--3 custom-button";
const BUTTON_TEXT = "Adicionar no Notion";

function initializeContentScript() {
  console.log("Initializing content script");
  observeDOM();
}

function createCustomButton() {
  const button = document.createElement("button");
  button.className = BUTTON_CLASS;
  button.type = "button";
  button.style.marginLeft = "10px";
  button.innerHTML = `<span aria-hidden="true">${BUTTON_TEXT}</span>`;
  button.addEventListener("click", handleButtonClick);
  return button;
}

function addCustomButton(container: Element) {
  console.log("Attempting to add custom button to container");
  if (!container.querySelector(".custom-button")) {
    container.appendChild(createCustomButton());
    console.log("Custom button added successfully");
  } else {
    console.log("Custom button already exists in container");
  }
}

async function handleButtonClick() {
  const title =
    document
      .querySelector(".job-details-jobs-unified-top-card__job-title")
      ?.textContent?.trim() || "";
  const company =
    document
      .querySelector(".job-details-jobs-unified-top-card__company-name")
      ?.textContent?.trim() || "";
  const url = window.location.href.trim();

  console.log(`Title: ${title}, Company: ${company}, URL: ${url}`);

  await sendToBackground({
    name: "embeed-button",
    body: { title, company, url },
  });
}

function observeDOM() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        const container = document
          .querySelector(".jobs-apply-button--top-card")
          ?.closest(".display-flex");
        if (container) {
          addCustomButton(container);
          observer.disconnect();
          break;
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

window.addEventListener("load", initializeContentScript);
document.addEventListener("DOMContentLoaded", initializeContentScript);
setTimeout(initializeContentScript, 3000);
