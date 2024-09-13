import axios from 'axios'

const API_TOKEN = process.env.PLASMO_PUBLIC_API_TOKEN
const api = axios.create({
  baseURL: 'https://api.notion.com/v1',
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
    'Notion-Version': '2022-06-28'
  }
})

export default api
