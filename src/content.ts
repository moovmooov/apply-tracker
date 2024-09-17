import { sendToBackground } from "@plasmohq/messaging";
import type { PlasmoCSConfig } from "plasmo";
import { Storage } from "@plasmohq/storage";

export const config: PlasmoCSConfig = {
  matches: ["https://www.linkedin.com/*"],
};

const BUTTON_CLASS =
  "jobs-save-button artdeco-button artdeco-button--secondary artdeco-button--3 applytracker-button";
const BUTTON_TEXT = "Add to Notion Tracker";
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
  if (container.querySelector(".applytracker-button")) {
    return;
  }

  try {
    const button = await createCustomButton();
    container.appendChild(button);
    console.log("Custom button added successfully");
  } catch (error) {
    console.error("Error adding custom button:", error);
    container.querySelector(".applytracker-button")?.remove();
  } finally {
  }
}

function setButtonState(
  button: HTMLButtonElement,
  state: "default" | "loading" | "success" | "error",
) {
  const span = button.querySelector("span");
  if (!span) return;

  button.disabled = state === "loading";
  span.textContent = {
    default: BUTTON_TEXT,
    loading: BUTTON_LOADING_TEXT,
    success: BUTTON_SUCCESS_TEXT,
    error: BUTTON_ERROR_TEXT,
  }[state];

  button.style.backgroundColor = {
    default: "",
    loading: "#f5f5f5",
    success: "#d4edda",
    error: "#f8d7da",
  }[state];
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

  setTimeout(() => setButtonState(button, "default"), 2000);
}

function handleJobPage() {
  const container = document
    .querySelector(".jobs-apply-button--top-card")
    ?.closest(".display-flex");
  if (container) {
    addCustomButton(container);
  }
}

function checkForURLChange() {
  let lastURL = location.href;
  const observer = new MutationObserver(() => {
    const currentURL = location.href;
    if (currentURL !== lastURL) {
      lastURL = currentURL;
      handleURLChange(currentURL);
    }
  });
  observer.observe(document, { subtree: true, childList: true });

  handleURLChange(lastURL);
}

function handleURLChange(url: string) {
  if (url.includes("/jobs/")) {
    setTimeout(() => {
      handleJobPage();
    }, 1000);
  } else {
    document.querySelector(".applytracker-button")?.remove();
  }
}

checkForURLChange();
