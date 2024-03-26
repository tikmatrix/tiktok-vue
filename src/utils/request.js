import axios from 'axios'
import mock from '../mock'



export function post(config) {
  !config && (config = { headers: {} })
  !config.headers && (config.headers = {})
  !config.data && (config.data = {})
  !config.baseURL && (config.baseURL = `http://${window.location.hostname}:${import.meta.env.VITE_SERVER_PORT}`)
  const { method, url, data, params, headers } = config
  const mockMethod = method || 'get'
  if (import.meta.env.VITE_APP_MOCK === 'true') {
    return Promise.resolve(mock(url, mockMethod.toLowerCase()))
  }
  console.log('request', config)
  return axios.post(`${config.baseURL}${url}`, data, { headers: headers })
    .then(ret => {
      let res
      if (typeof ret === 'string') {
        res = JSON.parse(ret.data)
      } else {
        res = ret.data
      }
      return res
    })
}

const request = function request(config) {
  !config && (config = { headers: {} })
  !config.headers && (config.headers = {})
  !config.data && (config.data = {})
  !config.params && (config.params = {})
  !config.baseURL && (config.baseURL = `http://${window.location.hostname}:${import.meta.env.VITE_SERVER_PORT}`)
  const { method, url, data, params, headers } = config
  const mockMethod = method || 'get'
  if (import.meta.env.VITE_APP_MOCK === 'true') {
    return Promise.resolve(mock(url, mockMethod.toLowerCase()))
  }
  // console.log('request', config)
  return axios(config).then(ret => {
    let res
    if (typeof ret === 'string') {
      res = JSON.parse(ret.data)
    } else {
      res = ret.data
    }
    return res
  })
}
export default request
