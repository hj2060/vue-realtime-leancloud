import axios from 'axios'
const $http = axios.create({
  baseURL: 'https://xdfaqwh5.api.lncld.net',
  headers: {
    'Content-type': 'application/json',
    'X-LC-Id': process.env.VUE_APP_APPID,
    'X-LC-Key': `${process.env.VUE_APP_MASTERKEY},master`
  }
})
export default {
  broadcast(message: {[key: string]: any}) {
    $http.post('/1.1/rtm/broadcast', {
      from_peer: 'system',
      conv_id: '5c0e47804773f7005ff6cf6b',
      message: JSON.stringify(message)
    })
  }
}