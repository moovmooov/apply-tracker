import { sendToBackground } from "@plasmohq/messaging";
import type { PlasmoCSConfig } from "plasmo";
import { Storage } from "@plasmohq/storage";

export const config: PlasmoCSConfig = {
  matches: ["https://www.linkedin.com/jobs/collections/*"],
};

const BUTTON_CLASS =
  "jobs-save-button artdeco-button artdeco-button--secondary artdeco-button--3 custom-button";
const BUTTON_TEXT = "Add to Notion";
const BUTTON_LOADING_TEXT = "Adding...";
const BUTTON_SUCCESS_TEXT = "Added!";
const BUTTON_ERROR_TEXT = "Error adding";
const BUTTON_UNAUTHENTICATED_TEXT = "Authenticate on ApplyTracker";

async function createCustomButton() {
  const storage = new Storage();
  const isAuthenticated = await storage.get("user_data");
  const button = document.createElement("button");
  button.className = BUTTON_CLASS;
  button.type = "button";
  button.style.marginLeft = "10px";

  if (isAuthenticated) {
    button.innerHTML = `<span aria-hidden="true">${BUTTON_TEXT}</span>`;
    button.addEventListener("click", handleButtonClick);
  } else {
    button.innerHTML = `<span aria-hidden="true">${BUTTON_UNAUTHENTICATED_TEXT}</span>`;
    button.disabled = true;
    button.style.cursor = "not-allowed";
    button.style.opacity = "0.6";
  }

  return button;
}

async function addCustomButton(container: Element) {
  console.log("Attempting to add custom button to container");
  if (!container.querySelector(".custom-button")) {
    container.appendChild(await createCustomButton());
    console.log("Custom button added successfully");
  } else {
    console.log("Custom button already exists in container");
  }
}

function setButtonState(
  button: HTMLButtonElement,
  state: "default" | "loading" | "success" | "error",
) {
  const span = button.querySelector("span");
  if (!span) return;

  button.disabled = state === "loading";

  switch (state) {
    case "default":
      span.textContent = BUTTON_TEXT;
      button.style.backgroundColor = "";
      break;
    case "loading":
      span.textContent = BUTTON_LOADING_TEXT;
      button.style.backgroundColor = "#f5f5f5";
      break;
    case "success":
      span.textContent = BUTTON_SUCCESS_TEXT;
      button.style.backgroundColor = "#d4edda";
      break;
    case "error":
      span.textContent = BUTTON_ERROR_TEXT;
      button.style.backgroundColor = "#f8d7da";
      break;
  }
}

async function handleButtonClick(event: MouseEvent) {
  const button = event.currentTarget as HTMLButtonElement;
  setButtonState(button, "loading");

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

  try {
    await sendToBackground({
      name: "embeed-button",
      body: { title, company, url },
    });
    setButtonState(button, "success");
  } catch (error) {
    console.error("Error saving to Notion:", error);
    setButtonState(button, "error");
  }

  // Reset button state after 2 seconds
  setTimeout(() => setButtonState(button, "default"), 2000);
}

function observeJobDetailsChanges() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        const jobDetailsCard = document.querySelector(
          ".job-details-jobs-unified-top-card__job-title",
        );
        if (jobDetailsCard) {
          handleButton();
          observer.disconnect();
          break;
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

async function handleButton() {
  const container = document
    .querySelector(".jobs-apply-button--top-card")
    ?.closest(".display-flex");

  if (container && !container.querySelector(".custom-button")) {
    await addCustomButton(container);
    console.log("Custom button added after job details update");
  }
}

function initializeContentScript() {
  console.log("Initializing content script");
  observeJobDetailsChanges();
}

window.addEventListener("load", initializeContentScript);
