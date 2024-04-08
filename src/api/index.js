const api = {
  auth: '/api/auth',
  install: '/api/install',
  device: '/api/device',
  account: '/api/account',
  material: '/api/material',
  upload_video: '/api/upload_video',
  material_count: '/api/material/count',
  publish_job: '/api/publish_job',
  train_job: '/api/train_job',
  init: '/api/device/init',
  group: '/api/group',
  music: '/api/music',
  watcher: '/api/dialog_watcher',
  settings: '/api/settings',
  task_status: '/api/device/task_status',
  get_license: '/api/get_license',
  add_license: '/api/add_license',
  avatar: '/api/avatar',
  count_train_job_by_status: '/api/train_job/count_by_status',
  count_publish_job_by_status: '/api/publish_job/count_by_status',
  count_online_device: '/api/device/count_online',
  count_all_account: '/api/account/count_all',
  count_account_by_group_id: '/api/account/count_account_by_group_id',
  retry_all_failed_train_job: '/api/train_job/retry_all',
  retry_all_failed_publish_job: '/api/publish_job/retry_all',
  post_comment: '/api/post_comment',
  post_comment_topic: '/api/post_comment_topic',
  gen_topic_comments: '/api/gen_topic_comments',
  read_clipboard: '/api/get_clipboard',
  count_comment_job_by_status: '/api/comment_job/count_by_status',
  delete_all_materials: '/api/material/delete_all',
  delete_all_train_jobs: '/api/train_job/delete_all',
  delete_all_publish_jobs: '/api/publish_job/delete_all',
  delete_all_post_comments: '/api/post_comment/delete_all',
  proxy: '/agent/api/proxy',
  proxy_rule: '/agent/api/proxy_rule',
  proxy_delay: '/agent/api/proxy/delay',
  get_ip: '/api/get_ip',
  analytics: '/api/data_analysis',
  virtualHosts: '/api/virtual_hosts',
  get_post_bot_status: '/api/virtual_hosts/get_post_bot_status',
  start_post_bot: '/api/virtual_hosts/start_post_bot',
  stop_post_bot: '/api/virtual_hosts/stop_post_bot',
  start_edit_bot: '/api/virtual_hosts/start_edit_bot',
  stop_edit_bot: '/api/virtual_hosts/stop_edit_bot',
  init_virtualHost: '/api/virtual_hosts/init',
  upload_to_virtualHost: '/api/virtual_hosts/upload_video',
  clear_edit_bot: '/api/virtual_hosts/clear_edit_bot',
  adb_command: '/agent/api/adb_command',
  script: '/agent/api/script'
}
export default api
