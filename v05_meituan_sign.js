// v0.5 仿官档
// v0.4 去注释
// v0.3 多注释理解
// v0.2 改写
// v0.1 原文理解

const cookie_name = '美团执行-测试'
const token_url_key = 'qinyi_tokenurl_meituan'
const token_header_key = 'qinyi_tokenheader_meituan'
const sign_url_key = 'qinyi_signurl_meituan'
const sign_header_key = 'qinyi_signheader_meituan'
const sign_body_key = 'qinyi_signbody_meituan'
const QX = init()

// 获取已存储的Token和签到数据
const token_url_value = QX.getdata(token_url_key)
const token_header_value = QX.getdata(token_header_key)
const sign_url_value = QX.getdata(sign_url_key)
const sign_header_value = QX.getdata(sign_header_key)
const sign_body_value = QX.getdata(sign_body_key)

// 检查Token是否存在
if (!sign_url_value || !sign_header_value || !sign_body_value) {
    QX.msg(cookie_name, "Token 或 签到数据缺失", "请先获取 Token 或签到数据");
    return QX.done();
}

sign()

// 签到请求
function sign() {
  const myRequest = {
    url: sign_url_value,
    headers: JSON.parse(sign_header_value), // 如果存储的headers是JSON字符串，解析成对象
    body: JSON.stringify(sign_body_value) // 将请求体转换成JSON字符串发送
  }

  QX.post(myRequest, (error, response, data) => {
    if (error) {
      QX.msg(cookie_name, "签到结果: 失败", `错误信息: ${error}`)
      return QX.done()
    }
    
    QX.log(`${cookie_name}, data: ${data}`) //调试日志
    if (data) {  // 若有请求体，执行下面代码
      const result = JSON.parse(data)
      let subTitle = ``
      let detail = ``

      if (result.code == 0) {
        subTitle = '签到结果: 成功'
        detail = `本周连签: ${result.data[0].circleSignTimes}天`
        for (const r of result.data[0].signInAwardRecords) {
          const r_info = JSON.parse(r.info)
          if (r_info.type === 'cash') {
            detail += `, 奖励金: ${r_info.amount / 100}元`
          } else if (r_info.type === 'coupon') {
            detail += `\n优惠券: ${r_info.name}: ${r_info.amount}元 (${r_info.condition})`
          } else {
            detail += `\n未知奖励!`
          }
        }
      } else if (result.code == 2002) {
        subTitle = `签到结果: 成功 (重复签到)`
        detail = `说明: ${result.msg}`
      } else {
        subTitle = `签到结果: 失败`
        detail = `编码: ${result.code}, 说明: ${result.msg}`
      }
      QX.msg(cookie_name, subTitle, detail)
    } else {
      QX.msg(cookie_name, "签到结果: 失败", "响应数据为空或解析错误")
    }
    QX.done()
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
    $task.fetch(myRequest).then(
      resp => call_func(null, resp, resp.body),
      reason => call_func(reason.error, null, null) // 错误处理
    );
  }
  done = (value = {}) => $done(value)

  return { getdata, setdata, msg, log, get, post, done }
}
