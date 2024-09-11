/*
封装qxApi方法，简介：
    $prefs: 是 QuantumultX 用来存储和获取数据的持久化存储模块。
    $notify: 是用来发送通知的模块，用于调试和向用户显示信息。
    $task.fetch: 用于发起 HTTP 请求。GET 和 POST 请求的主要区别是 method 设置不同。
    $done: 标志脚本执行结束，通常会在脚本的最后调用它来结束执行。

2. init()核心功能说明：
    getdata(key)：直接使用 $prefs.valueForKey(key) 获取指定键名的值。
    setdata(key, val)：直接使用 $prefs.setValueForKey(key, val) 来设置值。
    msg(title, subtitle, body)：使用 $notify 发送通知。
    log(message)：简单的控制台输出日志，使用 console.log。
    get(url, cb) 和 post(url, cb)：封装了 GET 和 POST 请求，直接使用 $task.fetch 发起请求，然后回调处理响应体。
    done(value)：标记脚本执行完毕，调用 $done()。

3. 输出的表达
调试，输出变量需要用 '${xxx}'  来表达
QX.msg(cookie_name, '测试内容：', `获取的url:\n${sign_url_value}\n请求头:\n${sign_header_value}\n请求体:\n${sign_body_value}`)


4. js语法释义
JSON.parse：用于将 JSON 格式的字符串 转换为 JavaScript 对象。
JSON.stringify：用于将 JavaScript 对象 转换为 JSON 格式的字符串。
*/



/*
用法注释写法（待续调）：

功能：拦截美团请求的cookie，持久化保存

用法：


解析：
// 这个域名即请求api的域名，
// 请求URL为: https://i.meituan.com/evolve/signin/signpost/100219?yodaReady=h5&csecpla……

重写模板：
=================================
使用方法：
QuantumultX:
1.将获取Cookie脚本保存到本地
2. 使用方法1：美团APP -> 我的 -> 福利中心 -> 领红包 -> 手动签到一次; 使用方法2：美团APP -> 首页 -> 红包签到 -> 手动签到一次
3.关闭获取ck脚本，避免产生不必要的mitm。

[task_local]
10 0 0 * * * https://raw.githubusercontent.com/kkingwing/QX-/main/v05_meituan_sign.js,tag=美团签到-测试,enabled=true

[rewrite_local]
# 美团签到-测试
^https:\/\/i.meituan.com\/evolve\/signin\/signpost\/ url script-request-body https://raw.githubusercontent.com/kkingwing/QX-/main/v05_meituan_token.js

[mitm]
i.meituan.com 
=================================



*/
const qxApi = init()

function init() {
    isSurge = () => {
      return undefined === this.$httpClient ? false : true
    }
    isQuanX = () => {
      return undefined === this.$task ? false : true
    }
    getdata = (key) => {
      if (isSurge()) return $persistentStore.read(key)
      if (isQuanX()) return $prefs.valueForKey(key)
    }
    setdata = (key, val) => {
      if (isSurge()) return $persistentStore.write(key, val)
      if (isQuanX()) return $prefs.setValueForKey(key, val)
    }
    msg = (title, subtitle, body) => {
      if (isSurge()) $notification.post(title, subtitle, body)
      if (isQuanX()) $notify(title, subtitle, body)
    }
    log = (message) => console.log(message)
    get = (url, cb) => {
      if (isSurge()) {
        $httpClient.get(url, cb)
      }
      if (isQuanX()) {
        url.method = 'GET'
        $task.fetch(url).then((resp) => cb(null, resp, resp.body))
      }
    }
    post = (url, cb) => {
      if (isSurge()) {
        $httpClient.post(url, cb)
      }
      if (isQuanX()) {
        url.method = 'POST'
        $task.fetch(url).then((resp) => cb(null, resp, resp.body))
      }
    }
    done = (value = {}) => {
      $done(value)
    }
    return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
  }