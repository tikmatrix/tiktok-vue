import api from '../api'
let devices = [];
for (let i = 1; i <= 200; i++) {
  devices.push({
    'id': i,
    'serial': 'deviceid' + i,
    'forward_port': '10800',
    'ip': '192.168.0.' + i,
    'email': Math.random() < 0.5 ? null : i + '11@gmai.com', // 50%的概率设置email为null
  });
}
let materials = [];
for (let i = 1; i <= 100; i++) {
  materials.push({
    "md5": "6aed71a8304f9dc68a9acd66fc5e057d",
    "name": "preview.jpg",
    "create_time": "2023-11-13 13:43:49",
    "used": Math.round(Math.random()) // 生成0或1的随机整数
  });
}
let users = [];
for (let i = 1; i <= 10; i++) {
  users.push({
    "email": "admin" + i + "@niostack.com",
    "pwd": "123qwe...",
    "register_time": "2023-11-13 13:43:49",
    "last_login_time": "2023-11-13 13:43:49",
    "fans": 0,
    "shop_creator": 0,
    "device": "device" + i,
    "automated": 0,
    "online": 1,
  });
}
let jobs = [];
for (let i = 1; i <= 100; i++) {
  jobs.push({
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
  });
}
const data = {
  post: {
    [api.shell]: {}
  },
  get: {
    [api.device]: devices,
    [api.material]: materials,
    [api.account]: users,
    [api.job]: jobs,
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
