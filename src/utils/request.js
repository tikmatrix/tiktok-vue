import axios from 'axios'
import mock from '../mock'


export function wsFetch(uri, host, forward_port) {
  // if (import.meta.env.VITE_APP_MOCK === 'true') {
  //   return {
  //     send: function (data) {
  //       console.log('send', data)
  //     },
  //     close: function () {
  //       console.log('close')
  //     },
  //     onmessage: function (data) {
  //       console.log('onmessage', data)
  //     },
  //     onopen: function () {
  //       console.log('onopen')
  //     },
  //     onclose: function () {
  //       console.log('onclose')
  //     },
  //     onerror: function () {
  //       console.log('onerror')
  //     }
  //   }
  // }
  // 创建 WebSocket 连接
  // const socket = new WebSocket(`ws://${host}:${forward_port}/${uri}`);
  const socket = new WebSocket(`ws://${host}:7092`);
  return socket
}
export function post(config) {
  !config && (config = { headers: {} })
  !config.headers && (config.headers = {})
  !config.data && (config.data = {})
  config.baseURL = `http://${window.location.hostname}:7090`
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
  !config.baseURL && (config.baseURL = `http://${window.location.hostname}:7090`)
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
