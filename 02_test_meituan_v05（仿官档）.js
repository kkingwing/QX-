const cookie_name = 'meituan_test'
const token_url_key = 'qinyi_token_url_meituan'
const token_header_key = 'qinyi_token_header_meituan'
const sign_url_key = 'qinyi_sign_url_meituan'
const sign_header_key = 'qinyi_sign_header_meituan'
const sign_body_key = 'qinyi_sign_body_meituan'
const QX = init()

// 正则匹配URL，判断是否为签到请求
const url_re_pattern = /\/evolve\/signin\/signpost\//
if ($request && $request.method !== 'OPTIONS' && $request.url.match(url_re_pattern)) {
    const sign_url_value = $request.url
    const sign_header_value = JSON.stringify($request.headers) // 转换为JSON字符串
    const sign_body_value = $request.body

    // 保存url、headers和body
    if (sign_url_value) QX.setdata(sign_url_value, sign_url_key)
    if (sign_header_value) QX.setdata(sign_header_value, sign_header_key)
    if (sign_body_value) QX.setdata(sign_body_value, sign_body_key)

    QX.msg(cookie_name, '获取Cookie: 成功')
}

// 初始化函数
function init() {
    getdata = (key) => $prefs.valueForKey(key) // 读取存储的值
    setdata = (key, val) => $prefs.setValueForKey(key, val) // 设置存储的值
    msg = (title, subtitle, body) => $notify(title, subtitle, body) // 发送通知
    log = (message) => console.log(message) // 打印日志
    get = (myRequest, callback) => {
        myRequest.method = 'GET'
        $task.fetch(myRequest).then(
            resp => callback(null, resp, resp.body),
            reason => callback(reason.error, null, null) // 错误处理
        );
    }
    post = (myRequest, callback) => {
        myRequest.method = 'POST'
        $task.fetch(myRequest).then(
            resp => callback(null, resp, resp.body),
            reason => callback(reason.error, null, null) // 错误处理
        );
    }
    done = (value = {}) => $done(value) // 结束任务
    
    return { getdata, setdata, msg, log, get, post, done }
}

QX.done() // 结束请求
