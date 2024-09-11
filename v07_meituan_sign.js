// v0.6 极简
// v0.6 各问题调试
// v0.5 仿官档
// v0.4 去注释
// v0.3 多注释理解
// v0.2 改写
// v0.1 原文理解
// v0.5 仿官档
// git的执行逻辑脚本，用法见token获取文档


//变量、方法调用
const cookie_name = 'meituan_test'
const token_url_key = 'qinyi_token_url_meituan'
const token_header_key = 'qinyi_token_header_meituan'
const sign_url_key = 'qinyi_sign_url_meituan'
const sign_header_key = 'qinyi_sign_header_meituan'
const sign_body_key = 'qinyi_sign_body_meituan'
const QX = init()
const token_url = QX.getdata(token_url_key)
const token_header = QX.getdata(token_header_key)
const sign_url = QX.getdata(sign_url_key)
const sign_header = QX.getdata(sign_header_key)
const sign_body = QX.getdata(sign_body_key)

sign()


function sign() {
  QX.log(`\n准备执行签到，签到URL: \n${sign_url} \n\n`)
  QX.log(`\n请求头: \n${sign_header}\n\n`)
  QX.log(`\n请求体: \n${sign_body}\n\n`)


  const myRequest = {
    url: sign_url,
    headers: JSON.parse(sign_header), //token与这里都应该是js对象，不应该是字符串的来回转换
    body: sign_body // 保持请求体为原始值
  }

  // 发起POST请求
  QX.post(myRequest, (error, response, res_body) => {

    QX.log(`${cookie_name}, 响应数据: ${res_body}`) // 调试日志

    // 检查
    if (!res_body) { //响应数据是否存在
      QX.msg(cookie_name, "签到结果: 失败", "响应数据为空")
      return QX.done();
    }

    let res_js_body;
    try { //JSON数据
      res_js_body = JSON.parse(res_body);
    } catch (e) {
      QX.msg(cookie_name, "签到结果: 失败", "无法解析服务器响应数据")
      return QX.done();
    }


    QX.log(`${cookie_name}, 编码: ${res_js_body.code}, 说明: ${res_js_body.msg}`);

    let subTitle = ''
    let detail = ''

    // 处理不同的结果码
    if (res_js_body.code === 0) {
      subTitle = '签到结果: 成功'
      detail = `本周连签: ${res_js_body.data[0].circleSignTimes}天`
      for (const r of res_js_body.data[0].signInAwardRecords) {
        const r_info = JSON.parse(r.info)
        if (r_info.type === 'cash') {
          detail += `, 奖励金: ${r_info.amount / 100}元`
        } else if (r_info.type === 'coupon') {
          detail += `\n优惠券: ${r_info.name}: ${r_info.amount}元 (${r_info.condition})`
        } else {
          detail += `\n未知奖励!`
        }
      }
    }
    else if (res_js_body.code === 2002) {
      subTitle = '签到结果: 成功 (重复签到)'
      detail = `说明: ${res_js_body.msg}`
    }
    else if (res_js_body.code === 100) {
      subTitle = '签到结果: 失败'
      detail = '登录失败，请重新登录'
      // 在这里可以添加重新获取Token的逻辑
    }
    else {
      subTitle = '签到结果: 失败'
      detail = `编码: ${res_js_body.code}, 说明: ${res_js_body.msg}`
    }

    // 显示结果消息
    QX.msg(cookie_name, subTitle, detail)
    QX.done();
  })
}

// 初始化函数
function init() {
  getdata = (key) => $prefs.valueForKey(key)
  setdata = (key, val) => $prefs.setValueForKey(key, val)
  msg = (title, subtitle, body) => $notify(title, subtitle, body)
  log = (message) => console.log(message)
  get = (myRequest, call_func) => {
    myRequest.method = 'GET'
    $task.fetch(myRequest).then(resp => call_func(null, resp, resp.body))
  }
  post = (myRequest, call_func) => {
    myRequest.method = 'POST'

    // $task.fetch() qx的http请求，异步函数，返回一个 Promise 对象，此处命名为myRequest，包含 url、headers、body。
    // Promise 的 .then() 方法接受两个参数：第一个是成功时的回调函数，第二个是失败时的回调函数，异步函数，哪个发生执行哪个。
    $task.fetch(myRequest).then(
      /*
      请求成功处理（promise的第 1 个参数，命名为response，定义其为一个回调函数并调用）：
        - null：表示没有错误，因为这是成功的回调。
        - response：整个 HTTP 响应对象。
        - response.body：响应体内容，即服务器返回的实际数据。

      call_func 是一个回调函数，用于处理请求的结果。它的参数通常是 (error, response, body)  
      */

      response => call_func(null, response, response.body),
      /* 
      请求失败处理（Promise 的第 2 个参数，回调函数 reason）：
        - reason.error：表示请求失败的错误描述。
        - null, null：由于请求失败，response 和 response.body 都为 null。
       */
      reason => call_func(reason.error, null, null)
    )
  }
  done = (value = {}) => $done(value)

  return { getdata, setdata, msg, log, get, post, done }
}
