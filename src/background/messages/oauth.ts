import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import browser from "webextension-polyfill"
import api from "~api/axios.config"

const storage = new Storage()
const CLIENT_ID = process.env.PLASMO_PUBLIC_NOTION_CLIENT_ID
const REDIRECT_URI = browser.identity.getRedirectURL()

const getNotionToken = async (tempAuthToken: string) => {
  const clientId = process.env.PLASMO_PUBLIC_NOTION_CLIENT_ID
  const clientSecret = process.env.PLASMO_PUBLIC_NOTION_CLIENT_SECRET 

  const encodedToken = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const response = await api.post("/oauth/token", 
    {
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
      code: tempAuthToken,
    },
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedToken}`,
      }
    }
  )
  return response.data
}


const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const AUTH_URL = `https://api.notion.com/v1/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&owner=user&redirect_uri=${REDIRECT_URI}`

  const redirectURL = await browser.identity.launchWebAuthFlow({
    interactive: true,
    url: AUTH_URL
  })
  const urlParams = new URLSearchParams(redirectURL)
  const tempAuthToken = urlParams.entries().next().value[1]

  const userData = await getNotionToken(tempAuthToken)
  await storage.set("user_data", userData)
}

export default handler
