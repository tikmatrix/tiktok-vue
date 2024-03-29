// 获取cookie
export function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
  if (arr = document.cookie.match(reg)) {
    return decodeURIComponent(arr[2])
  } else {
    return ''
  }
}
// get agent url
export function getAgentUrl() {
  //if current url contains a port
  if (window.location.port) {
    return window.location.protocol + '//' + window.location.hostname + ':' + import.meta.env.VITE_AGENT_PORT
  } else {
    return window.location.protocol + '//agent-' + window.location.hostname
  }
}
//get ws url
export function getWsUrl() {
  //if current url contains a port
  if (window.location.port) {
    return 'ws://' + window.location.hostname + ':' + import.meta.env.VITE_WS_PORT
  } else {
    return 'wss://ws-' + window.location.hostname
  }
}

// 设置cookie,增加到vue实例方便全局调用
export function setCookie(c_name, value, expiredays = 7) {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ';path=/'
}

// 删除cookie
export function delCookie(name) {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = getCookie(name)
  if (cval)
    document.cookie = name + "=;expires=" + exp.toGMTString() + ';path=/'
}

// 获取 url 后参数
export function getRequest() {
  let url = location.search
  let theRequest = {}
  if (url.indexOf("?") !== -1) {
    let str = url.substr(1)
    let strs = str.split("&")
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1])
    }
  }
  return theRequest
}


// 动态加载js，默认异步，callback=false为同步
export function loadJs(url, callback) {
  let async = true
  if (callback === false) {
    async = false
  }
  const xhr = new XMLHttpRequest()
  xhr.open('get', url, async)
  xhr.send(null)
  if (xhr.readyState === 4) {
    if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.text = xhr.responseText
      document.head.appendChild(script)
      if (callback) {
        callback()
      }
    }
  }
}

// 动态加载css文件
export function loadCss(url) {
  let css = document.createElement('link')
  css.rel = 'stylesheet'
  css.type = 'text/css'
  css.href = url
  document.head.appendChild(css);
}

// 判断是否微信环境
export function isWechat() {
  const agent = navigator.userAgent.toLowerCase();
  if (/wxwork/.test(agent)) {
    return false;
  }
  if (/micromessenger/.test(agent)) {
    return 'wechat';
  }
  return false;
};

// 判断是否手机环境
export function isMobile() {
  // # iPad safari 无法通过 navigator标识查找到 'iPad'
  const iPadOS13Up = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
  return (/Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent)) || iPadOS13Up
}

// 解决触摸穿透问题
export function ModalHelper(bodyCls) {
  var scrollTop;
  return {
    afterOpen: function () {
      scrollTop = document.scrollingElement.scrollTop;
      document.body.classList.add(bodyCls);
      document.body.style.top = -scrollTop + 'px';
    },
    beforeClose: function () {
      document.body.classList.remove(bodyCls);
      // scrollTop lost after set position:fixed, restore it back.
      document.scrollingElement.scrollTop = scrollTop;
    }
  }
}

// 刷新页面（为解决微信刷新不生效问题）
export function reload() {
  const query = window.$route.query
  const path = window.$route.path
  let search = window.location.search
  const time = new Date().getTime()
  if (query.time) {
    const param = search.replace(`&time=${query.time}`, `&time=${time}`)
    window.location.href = path + param
  } else {
    window.location.href = path + search + `&time=${time}`
  }
}


// 删除url中某个值，并返回新的url
export function urlDel(name) {
  var loca = window.location;
  var baseUrl = loca.origin + loca.pathname + "?";
  var query = loca.search.substr(1);
  if (query.indexOf(name) > -1) {
    var obj = {}
    var arr = query.split("&");
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].split("=");
      obj[arr[i][0]] = arr[i][1];
    };
    delete obj[name];
    var url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g, "").replace(/\:/g, "=").replace(/\,/g, "&");
    return url
  } else {
    return '';
  }
}