//  v0.2 简化模板
//  v0.1 理解模板

/*
拦截美团请求的cookie，持久化保存

# 用法
# 美团签到领红包
# 使用方法1：美团APP -> 我的 -> 福利中心 -> 领红包 -> 手动签到一次
# 使用方法2：美团APP -> 首页 -> 红包签到 -> 手动签到一次
[rewrite_local]
^https:\/\/i.meituan.com\/evolve\/signin\/signpost\/ url script-request-body https://raw.githubusercontent.com/kkingwing/QX-/main/02_test_meituan_v02.js

hostname = i.meituan.com

*/

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
*/


//1. 变量定义
const cookieName = '美团-测试'
const tokenurlKey = 'qinyi_tokenurl_meituan' //以人名开头，区分他人变量
const tokenheaderKey = 'qinyi_tokenheader_meituan'
const signurlKey = 'qinyi_signurl_meituan'
const signheaderKey = 'qinyi_signheader_meituan'
const signbodyKey = 'qinyi_signbody_meituan'
const qxApi = init()

//2. 取出cookie逻辑(拦截这个url正则的url、header、body)
const resUrl = $request.url
const urlPattern = /\/evolve\/signin\/signpost\//
if ($request && $request.method != 'OPTIONS' && resUrl.match(urlPattern)) {
    const signurlVal = resUrl
    const signheaderVal = JSON.stringify($request.headers)
    const signbodyVal = $request.body
    //如果获取值则存储到变量中
    if (signurlVal) qxApi.setdata(signurlVal, signurlKey)
    if (signheaderVal) qxApi.setdata(signheaderVal, signheaderKey)
    if (signbodyVal) qxApi.setdata(signbodyVal, signbodyKey)
    //调试
    qxApi.msg(cookieName, `获取Cookie: 成功`, `请求URL: ${signurlVal}`)
    qxApi.log((cookieName, signurlVal, signheaderVal, signbodyVal))
    // qxApi.msg(cookieName, `获取Cookie: 成功`, ``)
}

function init() {
    // 方法名变量 = (参数) =>指向 $内置qxApiapi方法
    // 简写的箭头函数声明形式: get = (key,) => { ... }
    const getdata = (key) => $prefs.valueForKey(key) //$prefs qxApi存储和获取数据的持久化存储模块。
    const setdata = (key, val) => $prefs.setValueForKey(key, val)
    const msg = (title, subtitle, body) => $notify(title, subtitle, body) //$notify: 是用来发送通知的模块，用于调试和向用户显示信息。
    const log = (message) => console.log(message) //console.log 日志输出
    const get = (url, cb) => {
        url.method = 'GET'
        $task.fetch(url).then((res) => cb(null, {}, res.body)) //$task.fetch: 用于发起 HTTP 请求
    }
    const post = (url, cb) => {
        url.method = 'POST'
        $task.fetch(url).then((res) => cb(null, {}, res.body))
    }
    const done = (value = {}) => $done(value)

    return { getdata, setdata, msg, log, get, post, done }
}

qxApi.done()