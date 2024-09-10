const cookieName = '美团'
const tokenurlKey = 'qingyi_tokenurl_meituan'
const tokenheaderKey = 'qingyi_tokenheader_meituan'
const signurlKey = 'qingyi_signurl_meituan'
const signheaderKey = 'qingyi_signheader_meituan'
const signbodyKey = 'qingyi_signbody_meituan'
const qingyi = init()

const requrl = $request.url
if ($request && $request.method != 'OPTIONS' && requrl.match(/\/evolve\/signin\/signpost\//)) {
    const signurlVal = requrl
    const signheaderVal = JSON.stringify($request.headers)
    const signbodyVal = $request.body
    if (signurlVal) qingyi.setdata(signurlVal, signurlKey)
    if (signheaderVal) qingyi.setdata(signheaderVal, signheaderKey)
    if (signbodyVal) qingyi.setdata(signbodyVal, signbodyKey)
    qingyi.msg(cookieName, `获取Cookie: 成功`, ``)
}

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
            $task.fetch(url).then((resp) => cb(null, {}, resp.body))
        }
    }
    post = (url, cb) => {
        if (isSurge()) {
            $httpClient.post(url, cb)
        }
        if (isQuanX()) {
            url.method = 'POST'
            $task.fetch(url).then((resp) => cb(null, {}, resp.body))
        }
    }
    done = (value = {}) => {
        $done(value)
    }
    return {isSurge, isQuanX, msg, log, getdata, setdata, get, post, done}
}

qingyi.done()