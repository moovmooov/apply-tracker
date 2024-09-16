import axios from "axios";
import { Storage } from "@plasmohq/storage";
import type { UserData } from "@/types";

const storage = new Storage();

const api = axios.create({
  baseURL: "https://api.notion.com/v1",
});

api.interceptors.request.use(async (config) => {
  const userData = await storage.get<UserData>("user_data");
  if (userData?.access_token) {
    config.headers.Authorization = `Bearer ${userData.access_token}`;
    config.headers["Notion-Version"] = "2022-06-28";
  }
  return config;
});

export default api;
