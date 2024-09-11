// v0.5 仿官档
// v0.4 去注释
// v0.3 多注释理解
// v0.2 改写
// v0.1 原文理解
// v0.5 仿官档
// git的执行逻辑脚本，用法见token获取文档

const cookie_name = '美团执行-测试'
const token_url_store = 'qinyi_tokenurl_meituan'
const token_header_store = 'qinyi_tokenheader_meituan'
const sign_url_store = 'qinyi_signurl_meituan'
const sign_header_store = 'qinyi_signheader_meituan'
const sign_body_store = 'qinyi_signbody_meituan'
const QX = init()

// 获取已存储的Token和签到数据
const token_url = QX.getdata(token_url_store)
const token_header = QX.getdata(token_header_store)
const sign_url = QX.getdata(sign_url_store)
const sign_header = QX.getdata(sign_header_store)
const sign_body = QX.getdata(sign_body_store)

// 检查Token和签到数据是否存在
if (!sign_url || !sign_header || !sign_body) {
    QX.msg(cookie_name, "Token 或 签到数据缺失", "请先获取 Token 或签到数据");
    return QX.done();
}

sign()

// 签到请求函数
function sign() {
  // 日志记录，调试用
  QX.log(`准备执行签到，签到URL: ${sign_url}`)
  QX.log(`请求头: ${sign_header}`)
  QX.log(`请求体: ${sign_body}`)

  const myRequest = {
    url: sign_url,
    headers: JSON.parse(headers),
    body: sign_body // 保持请求体为原始值
  }

  // 发起POST请求
  QX.post(myRequest, (error, response, data) => {
    if (error) {
      QX.msg(cookie_name, "签到结果: 失败", `请求错误: ${error}`)
      return QX.done();
    }

    QX.log(`${cookie_name}, 编码: ${result.code}, 说明: ${result.msg}`) // 调试日志

    if (!data) {
      QX.msg(cookie_name, "签到结果: 失败", "响应数据为空")
      return QX.done();
    }

    const result = JSON.parse(data); // 直接解析服务器响应数据

    let subTitle = ''
    let detail = ''

    if (result.code === 0) {
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
    } else if (result.code === 2002) {
      subTitle = '签到结果: 成功 (重复签到)'
      detail = `说明: ${result.msg}`
    } else if (result.code === 100) {
      subTitle = '签到结果: 失败'
      detail = '登录失败，请重新登录'
      // 在这里可以添加重新获取Token的逻辑
    } else {
      subTitle = '签到结果: 失败'
      detail = `编码: ${result.code}, 说明: ${result.msg}`
    }

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
    $task.fetch(myRequest).then(
      resp => call_func(null, resp, resp.body),
      reason => call_func(reason.error, null, null) // 错误处理
    )
  }
  done = (value = {}) => $done(value)

  return { getdata, setdata, msg, log, get, post, done }
}
