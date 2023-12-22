// i18n.js
import { createI18n } from 'vue-i18n'

export const i18n = createI18n({
    locale: navigator.language || 'en', // 设置默认语言
    messages: {
        en: {
            siteName: 'TikTok Matrix',
            devices: 'Devices',
            accounts: 'Accounts',
            materials: 'Materials',
            autoPublishing: 'Auto Publishing',
            autoTrain: 'Auto Train', // Corrected the key name
            dialogWatcher: 'Dialog Watcher',
            version: 'Version',
            email: 'Email',
            password: 'Password',
            device: 'Device',
            disable: 'Disable',
            enable: 'Enable',
            add: 'Add',
            unbinded: 'Unbinded',
            update: 'Update',
            actions: 'Actions',
            delete: 'Delete',
            edit: 'Edit',
            execing: 'Execing',
            refresh: 'Refresh',
            installApk: 'Install APK',
            uninstallApk: 'Uninstall APK',
            menu: 'Menu',
            back: 'Back',
            home: 'Home',
            wakeup: 'Wakeup',
            sleep: 'Sleep',
            openTiktok: 'Open Tiktok',
            stopTiktok: 'Stop Tiktok',
            enableProxy: 'Enable Proxy',
            disableProxy: 'Disable Proxy',
            batchAction: 'Batch Action',
            total: 'Total',
            previous: 'Previous',
            next: 'Next',
            enterTips: 'Enter keywords',
            clearTiktok: 'Clear Tiktok',
            connecting: 'Connecting',
            autoScripts: 'Auto Scripts',
            register: 'Register',
            login: 'Login',
            uploadAvatar: 'Upload Avatar',
            keyboard: 'Keyboard',
            inputText: 'Input text to device',
            startTime: 'Start Time',
            material: 'Material',
            account: 'Account',
            tags: 'Tags',
            waiting: 'Waiting',
            execing: 'Execing',
            success: 'Success',
            failed: 'Failed',
            status: 'Status',
            unused: 'Unused',
            used: 'Used',
            id: 'ID',
            demoTip: 'This is a demo site, the data is not real. If you want to experience the real data, please contact us: {email}',
            repair: 'Repair',

        },
        'zh-CN': {
            siteName: 'TikTok 矩阵',
            devices: '设备', // Corrected the key name
            accounts: '帐号', // Corrected the key name
            materials: '素材', // Corrected the key name
            autoPublishing: '自动发布',
            autoTrain: '自动养号',
            dialogWatcher: '弹窗监控',
            version: '版本',
            email: '邮箱',
            password: '密码',
            device: '设备',
            disable: '禁用',
            enable: '启用',
            add: '添加',
            unbinded: '未绑定',
            update: '更新',
            actions: '操作',
            delete: '删除',
            edit: '编辑',
            execing: '执行中',
            refresh: '刷新',
            installApk: '安装 APK',
            uninstallApk: '卸载 APK',
            menu: '菜单',
            back: '返回',
            home: '主页',
            wakeup: '唤醒',
            sleep: '休眠',
            openTiktok: '打开 Tiktok',
            stopTiktok: '停止 Tiktok',
            enableProxy: '启用代理',
            disableProxy: '禁用代理',
            batchAction: '批量操作',
            total: '总数',
            previous: '上一页',
            next: '下一页',
            enterTips: '输入关键字',
            clearTiktok: '清除 Tiktok',
            connecting: '连接中',
            autoScripts: '自动脚本',
            register: '注册',
            login: '登录',
            uploadAvatar: '上传头像',
            keyboard: '键盘',
            inputText: '输入文本到设备',
            startTime: '开始时间',
            material: '素材',
            account: '帐号',
            tags: '标签',
            waiting: '等待中',
            execing: '执行中',
            success: '成功',
            failed: '失败',
            status: '状态',
            unused: '未使用',
            used: '已使用',
            id: 'ID',
            demoTip: '这是一个演示站点，数据并不真实。如果您想体验真实数据，请联系我们：{email}',
            repair: '修复',

        }
    }
})