import axios from 'axios'

const HTTP = axios.create({
  baseURL: 'https://api.simbachain.com/v1-management/',
  headers: {
    'APIKEY': 'YourAppConfigureAPIkey'
  }
})

export default {
  requestFund (name, data) {
    HTTP.defaults.headers.common['Content-Type'] = 'application/json'
    return HTTP.post(name, data)
  }
}
