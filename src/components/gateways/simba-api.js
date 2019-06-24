import axios from 'axios'

const HTTP = axios.create({
  baseURL: process.env.VUE_APP_SIMBA_APP_BASE_URL,
  headers: {
    'APIKEY': process.env.VUE_APP_SIMBA_API_KEY
  }
})

export default {
  getData (name) {
    HTTP.defaults.headers.common['Content-Type'] = 'multipart/form-data'
    return HTTP.get(name)
  },
  postData (name, data) {
    HTTP.defaults.headers.common['Content-Type'] = 'multipart/form-data'
    return HTTP.post(name, data)
  },
  signTxn (name, data) {
    HTTP.defaults.headers.common['Content-Type'] = 'application/json'
    return HTTP.post(name, data)
  }
}
