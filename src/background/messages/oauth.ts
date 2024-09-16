import type { PlasmoMessaging } from "@plasmohq/messaging";
import { Storage } from "@plasmohq/storage";
import browser from "webextension-polyfill";
import {
  getNotionToken,
  getUserDatabase,
  getAuthUrl,
} from "@/services/api/notion";

const storage = new Storage();

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const AUTH_URL = getAuthUrl();

  const redirectURL = await browser.identity.launchWebAuthFlow({
    interactive: true,
    url: AUTH_URL,
  });
  const urlParams = new URLSearchParams(redirectURL);
  const tempAuthToken = urlParams.entries().next().value[1];

  const userData = await getNotionToken(tempAuthToken);
  await storage.set("user_data", userData);

  const database = await getUserDatabase();
  if (!database.results.length) return;
  storage.set("database", database.results[0]);
  res.send({ success: true });
};

export default handler;
