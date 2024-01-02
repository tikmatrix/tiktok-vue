import api from '../api'
let devices = [];
for (let i = 1; i <= 200; i++) {
  devices.push({
    'id': i,
    'serial': 'device' + i,
    'forward_port': '10800',
    'ip': '192.168.0.' + i,
  });
}
let groups = [];
for (let i = 1; i <= 20; i++) {
  groups.push({
    'id': i,
    'name': 'Group' + i,
    'autoTrain': 1,
    'autoPublish': 1,
  });
}
let materials = [];
for (let i = 1; i <= 100; i++) {
  materials.push({
    "id": i.toString(),
    "md5": "6aed71a8304f9dc68a9acd66fc5e057d",
    "name": "preview.jpg",
    "create_time": "2023-11-13 13:43:49",
    "used": Math.round(Math.random()), // 生成0或1的随机整数
    "group_id": Math.floor(Math.random() * 10) + 1, // 生成1到10之间的随机整数
  });
}
let accounts = [];
for (let i = 1; i <= 10; i++) {
  accounts.push({
    "id": i,
    "email": "admin" + i + "@niostack.com",
    "pwd": "123qwe...",
    "register_time": "2023-11-13 13:43:49",
    "last_login_time": "2023-11-13 13:43:49",
    "fans": 0,
    "shop_creator": 0,
    "device": "device" + i,
    "automated": 0,
    "online": 1,
    "group_id": Math.floor(Math.random() * 10) + 1, // 生成1到10之间的随机整数
  });
}
let publish_jobs = [];
for (let i = 1; i <= 100; i++) {
  publish_jobs.push({
    "id": i.toString(),
    "create_time": "2023-11-13 13:43:49",
    "start_time": "2023-11-13 13:43:49",
    "end_time": "2023-11-13 13:43:49",
    "status": Math.floor(Math.random() * 4), // 生成0到3之间的随机整数
    "material": "/preview.jpg",
    "account": "admin@niostack.com",
    "title": "title",
    "device": "deviceid" + i,
    "tags": "tag1 tag2 tag3",
    "group_id": Math.floor(Math.random() * 10) + 1, // 生成1到10之间的随机整数
  });
}
let train_jobs = [];
for (let i = 1; i <= 100; i++) {
  train_jobs.push({
    "id": i.toString(),
    "create_time": "2023-11-13 13:43:49",
    "start_time": "2023-11-13 13:43:49",
    "end_time": "2023-11-13 13:43:49",
    "status": Math.floor(Math.random() * 4), // 生成0到3之间的随机整数
    "click": 1,
    "favorites": 1,
    "follow": 1,
    "account": "admin@niostack.com",
    "device": "deviceid" + i,
    "group_id": Math.floor(Math.random() * 10) + 1, // 生成1到10之间的随机整数
  });
}
let watchers = [];
for (let i = 1; i <= 100; i++) {
  watchers.push({
    "id": i.toString(),
    "name": "name",
    "conditions": "hello,ok",
    "action": "click",
    "status": Math.floor(Math.random() * 4), // 生成0到3之间的随机整数
  });
}
const data = {
  post: {
    [api.shell]: {}
  },
  get: {
    [api.device]: devices,
    [api.material]: materials,
    [api.account]: accounts,
    [api.publish_job]: publish_jobs,
    [api.train_job]: train_jobs,
    [api.group]: groups,
    [api.material_count]: Math.floor(Math.random() * 100),
    [api.watcher]: watchers,
  },
}

const mock = (url, method) => {
  return {
    code: 1,
    message: '成功',
    data: data[method][url],
  }
}
export default mock
