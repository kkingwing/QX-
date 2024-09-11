// v0.6 各问题调试
// v0.5 仿官档
// v0.4 去注释
// v0.3 多注释理解
// v0.2 改写
// v0.1 原文理解
// v0.5 仿官档
// git的执行逻辑脚本，用法见token获取文档

// v0.5 仿官档
// git的执行逻辑脚本，用法见token获取文档

//与token一致的变量（复制过来即可）
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

// 检查：Token和签到数据是否存在
if (!sign_url || !sign_header || !sign_body) {
    QX.msg(cookie_name, "Token 或 签到数据缺失", "请先获取 Token 或签到数据");
    return QX.done();
}

// 调用
sign()  

// 执行逻辑
function sign() {
  // 日志记录，调试用
  QX.log(`\n准备执行签到，签到URL: \n${sign_url} \n\n`)
  QX.log(`\n请求头: \n${sign_header}\n\n`)
  QX.log(`\n请求体: \n${sign_body}\n\n`)


  const myRequest = {
    url: sign_url,
    headers: JSON.parse(sign_header), //token与这里都应该是js对象，不应该是字符串的来回转换
    body: sign_body // 保持请求体为原始值
  }

  // 发起POST请求
  QX.post(myRequest, (error, response, data) => {
    if (error) {
      QX.msg(cookie_name, "签到结果: 失败", `请求错误: ${error}`)
      return QX.done();
    }

    QX.log(`${cookie_name}, 响应数据: ${data}`) // 调试日志

    // 检查响应数据是否存在
    if (!data) {
      QX.msg(cookie_name, "签到结果: 失败", "响应数据为空")
      return QX.done();
    }

    // 解析JSON数据，并捕获错误
    let result;
    try {
      result = JSON.parse(data);
    } catch (e) {
      QX.msg(cookie_name, "签到结果: 失败", "无法解析服务器响应数据")
      return QX.done();
    }

    // 输出调试日志，确认是否正确解析
    QX.log(`${cookie_name}, 编码: ${result.code}, 说明: ${result.msg}`);

    let subTitle = ''
    let detail = ''

    // 处理不同的结果码
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
    $task.fetch(myRequest).then( //当请求完成时，进行下面代码的处理
      response => call_func(null, response, response.body), //第一个处理responnse，即成功的处理，
      reason => call_func(reason.error, null, null) // 第二个reason，即错误的处理
    )
  }
  done = (value = {}) => $done(value)

  return { getdata, setdata, msg, log, get, post, done }
}
