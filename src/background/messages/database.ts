import type { PlasmoMessaging } from "@plasmohq/messaging";
import { Storage } from "@plasmohq/storage";
import { getUserDatabase } from "@/services/api/notion";

const storage = new Storage();

const handler: PlasmoMessaging.MessageHandler = async () => {
  console.log("Fetching user database...");
  const database = await getUserDatabase();
  storage.set("database", database.results[0]);
};

export default handler;
