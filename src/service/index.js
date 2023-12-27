import request, { wsFetch, post } from '../utils/request'
import api from '../api'
export function get_devices() {
  return request({
    method: 'get',
    url: api.device,
  })
}


export function install(formData) {
  return request({
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: api.install,
    data: formData
  })
}
export function connect_ws(uri, host, forward_port) {
  return wsFetch(uri, host, forward_port)
}

export function script({ script, serial = "", args = [] }) {
  let params = { script };
  if (serial) {
    params.serial = serial
  }

  if (args.length > 0) {
    params.args = args.join(',')
  }

  return request({
    method: 'get',
    url: api.script,
    params
  })
}

export function get_materials_byused({ used }) {
  return request({
    method: 'get',
    url: api.material,
    params: { used }
  })
}
export function get_materials() {
  return request({
    method: 'get',
    url: api.material,
  })
}
export function get_material_count({ used, group_id }) {
  return request({
    method: 'get',
    url: api.material_count,
    params: { used, group_id }
  })
}

export function upload_material(formData) {
  return post({
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: api.material,
    data: formData
  })
}

export function delete_material({ id }) {
  return request({
    method: 'delete',
    url: api.material,
    params: { id }
  })
}
export function get_accounts() {
  return request({
    method: 'get',
    url: api.account,
  })
}
export function get_jobs() {
  return request({
    method: 'get',
    url: api.job,
  })
}
export function add_account({ email, pwd, fans, device, shop_creator, group_id }) {
  return request({
    method: 'post',
    url: api.account,
    data: { email, pwd, fans, device, shop_creator, group_id }
  })
}
export function update_account({ id, email, pwd, fans, device, shop_creator, group_id }) {
  return request({
    method: 'put',
    url: api.account,
    data: { id, email, pwd, fans, device, shop_creator, group_id }
  })
}
export function delete_account({ id }) {
  return request({
    method: 'delete',
    url: api.account,
    params: { id }
  })
}

export function add_job({ start_time, material, account, title, tags }) {
  return request({
    method: 'post',
    url: api.job,
    data: { start_time, material, account, title, tags }
  })
}
export function delete_job({ id }) {
  return request({
    method: 'delete',
    url: api.job,
    params: { id }
  })
}
export function update_job_status({ id, status }) {
  return request({
    method: 'get',
    url: api.update_job_status,
    params: { id, status }
  })
}
export function shell({ serial, cmd }) {
  return request({
    method: 'post',
    url: api.shell,
    data: { serial, cmd }
  })
}
//repair
export function init({ serial, init }) {
  return request({
    method: 'get',
    url: api.init,
    params: { serial, init }
  })
}
export function get_groups() {
  return request({
    method: 'get',
    url: api.group,
  })
}
export function add_group({ name, auto_train, auto_publish, start_time, title, tags }) {
  return request({
    method: 'post',
    url: api.group,
    data: { name, auto_train, auto_publish, start_time, title, tags }
  })
}
export function update_group({ id, name, auto_train, auto_publish, start_time, title, tags }) {
  return request({
    method: 'put',
    url: api.group,
    data: { id, name, auto_train, auto_publish, start_time, title, tags }
  })
}
export function delete_group({ id }) {
  return request({
    method: 'delete',
    url: api.group,
    params: { id }
  })
}

