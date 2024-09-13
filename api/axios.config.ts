import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.notion.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Notion-Version': '2022-06-28'
  }
})

export default api
