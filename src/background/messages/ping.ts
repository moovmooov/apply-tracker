import type { PlasmoMessaging } from "@plasmohq/messaging";
import api from "~/api/axios.config";

const DATABASE_ID = process.env.PLASMO_PUBLIC_DATABASE_ID;

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { title, company, url } = req.body;
  try {
    const response = await api.post("/pages", {
      parent: { database_id: DATABASE_ID },
      properties: {
        Company: {
          title: [{ text: { content: company } }],
        },
        Position: {
          rich_text: [{ text: { content: title } }],
        },
        Stage: {
          status: { name: "Ready to apply" },
        },
        "Posting URL": {
          url: url,
        },
        "Due Date": {
          date: { start: new Date().toISOString().split("T")[0] },
        },
      },
    });

    console.log("New row added:", response.data);
    res.send({ success: true, data: response.data });
  } catch (error) {
    console.error("Error adding new row:", error);
    res.send({ success: false, error: error });
  }
};

export default handler;
