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
    'auto_train': Math.round(Math.random()), // 生成0或1的随机整数
    'auto_publish': Math.round(Math.random()), // 生成0或1的随机整数
    'publish_type': Math.round(Math.random()), // 生成0或1的随机整数
    'product_link': 'https://vm.tiktok.com/ZGe2xRC8t/',
  });
}
let musics = [];
for (let i = 1; i <= 20; i++) {
  musics.push({
    'id': i,
    'release_name': 'release_name' + i,
    'artist_name': 'artist_name' + i,
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
    "device": "device" + i,
    "tags": "tag1 tag2 tag3",
    'publish_type': 1,
    'product_link': 'https://vm.tiktok.com/ZGe2xRC8t/',
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
    [api.shell]: {},
    [api.add_license]: {
    }
  },
  get: {
    [api.device]: devices,
    [api.material]: materials,
    [api.account]: accounts,
    [api.publish_job]: publish_jobs,
    [api.train_job]: train_jobs,
    [api.group]: groups,
    [api.music]: musics,
    [api.material_count]: Math.floor(Math.random() * 100),
    [api.watcher]: watchers,
    [api.get_license]: {
      "uid": "12ab-34cd-56ef-78gh",
      "key": "abcd-efgh-ijkl-mnop",
      "left_days": 50,
      "name": "Niostack",
      "status": "pass",
    },
    [api.settings]: {
      "proxy_url": "192.168.0.1:7890",
      "server_url": "http://example.com",
      "timezone": "GMT+00:00",
      "wifi_name": "ExampleWiFi",
      "wifi_password": "ExamplePassword",
      "version": "1.0.0",
      "adb_mode": "tcp",
    },
    [api.task_status]: "running"
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
