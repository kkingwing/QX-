
const cookie_name = 'meituan_test' 
const token_url_key = 'qinyi_token_url_meituan'
const token_header_key = 'qinyi_token_header_meituan'
const sign_url_key = 'qinyi_sign_url_meituan'
const sign_header_key = 'qinyi_sign_header_meituan'
const sign_body_key = 'qinyi_sign_body_meituan'
const QX = init()


const url_re_pattern = /\/evolve\/signin\/signpost\//
if ($request && $request.method != 'OPTIONS' && $request.url.match(url_re_pattern)) {
    const sign_url_value = $request.url
    const sign_header_value = JSON.stringify($request.headers)
    const sign_body_value = $request.body
    if (sign_url_value) QX.setdata(sign_url_value, sign_url_key)
    if (sign_header_value) QX.setdata(sign_header_value, sign_header_key)
    if (sign_body_value) QX.setdata(sign_body_value, sign_body_key)

    QX.msg(cookie_name, `获取Cookie: 成功`)

}

function init() {
    isQuanX = () => {
      return undefined === this.$task ? false : true
    }
    getdata = (key) => {
      if (isQuanX()) return $prefs.valueForKey(key)
    }
    setdata = (key, val) => {
      if (isQuanX()) return $prefs.setValueForKey(key, val)
    }
    msg = (title, subtitle, body) => {
      if (isQuanX()) $notify(title, subtitle, body)
    }
    log = (message) => console.log(message)
    get = (url, callback) => {
      if (isQuanX()) {
        url.method = 'GET'
        $task.fetch(url).then((resp) => callback(null, resp, resp.body))
      }
    }
    post = (url, callback) => {
      if (isQuanX()) {
        url.method = 'POST'
        $task.fetch(url).then((resp) => callback(null, resp, resp.body))
      }
    }
    done = (value = {}) => {
      $done(value)
    }
    return { isQuanX, msg, log, getdata, setdata, get, post, done }
  }

  QX.done()