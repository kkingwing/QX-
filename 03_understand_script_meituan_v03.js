/*
执行逻辑

拿出存储到空间，在本脚本中调用同名变量token等内容，发送相同的请求，取得返回的数据并输出提示。
 
v03 简化
v02 理解
v01 原件 
*/


// 变量定义和持久化变量提取
const cookieName = '美团执行-测试'
const tokenKeys = {
    tokenurl: 'qingyi_tokenurl_meituan',
    tokenheader: 'qingyi_tokenheader_meituan',
    signurl: 'qingyi_signurl_meituan',
    signheader: 'qingyi_signheader_meituan',
    signbody: 'qingyi_signbody_meituan'
}

//注解：
// const tokenValues = Object.fromEntries(
//     Object.entries(tokenKeys).map(([key, value]) => [key, qxApi.getdata(value)])
// )
// 其中：
//Object.fromEntries 将字典转为对象，其中每个第一元素为键，每个第二元素为值。
// Object.entries 将对象的键值对转换为数组
// 每个数组元素是一个包含键和值的子数组，实际上，它会转化为：
//  [
//     ["tokenurl", "qingyi_tokenurl_meituan"],
//     ["tokenheader", "qingyi_tokenheader_meituan"],
//     ["signurl", "qingyi_signurl_meituan"],
//     ["signheader", "qingyi_signheader_meituan"],
//     ["signbody", "qingyi_signbody_meituan"]
//   ]
// .map(([key, value]) => [key, qxApi.getdata(value)]) 这个映射函数用于
// 对每个键值对进行处理，取出存储空间的数据
// 它将每个键值对的值替换为通过 qxApi.getdata 获取的存储数据

const tokenValues = Object.fromEntries(
    Object.entries(tokenKeys).map(([key, value]) => [key, qxApi.getdata(value)])
)
const qxApi = init() // 初始化QX-api方法（通用封装模块）


// 执行签到
sign()

function sign() {
    //从存储中提取 url，headers,body
    const url = {
        url: tokenValues.signurl,
        headers: JSON.parse(tokenValues.signheader),
        body: tokenValues.signbody
    }
    //使用封装方法post原url,对拿到的数据输出
    qxApi.post(url, (error, response, data) => {
        const result = JSON.parse(data)
        let subTitle = ''
        let detail = ''

        if (result.code === 0) {
            subTitle = '签到结果: 成功'
            detail = `本周连签: ${result.data[0].circleSignTimes}天`
            result.data[0].signInAwardRecords.forEach(record => {
                const rinfo = JSON.parse(record.info)
                if (rinfo.type === 'cash') {
                    detail += `, 奖励金: ${rinfo.amount / 100}元`
                } else if (rinfo.type === 'coupon') {
                    detail += `\n优惠券: ${rinfo.name}: ${rinfo.amount}元 (${rinfo.condition})`
                } else {
                    detail += `\n未知奖励!`
                }
            })
        } else if (result.code === 2002) {
            subTitle = '签到结果: 成功 (重复签到)'
            detail = `说明: ${result.msg}`
        } else {
            subTitle = '签到结果: 失败'
            detail = `编码: ${result.code}, 说明: ${result.msg}`
        }

        qxApi.msg(cookieName, subTitle, detail)
        qxApi.done()
    })
}

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
// 初始化QX-api方法（通用封装模块）
function init() {
    getdata = (key) => $prefs.valueForKey(key)
    setdata = (key, val) => $prefs.setValueForKey(key, val)
    msg = (title, subtitle, body) => $notify(title, subtitle, body)
    log = (message) => console.log(message)
    get = (url, cb) => {
        url.method = 'GET'
        $task.fetch(url).then(res => cb(null, {}, res.body))
    }
    post = (url, cb) => {
        url.method = 'POST'
        $task.fetch(url).then(res => cb(null, {}, res.body))
    }
    done = (value = {}) => $done(value)
    return {getdata, setdata, msg, log, get, post, done}
}