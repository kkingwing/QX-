/*
v04 去注释
v03 简化
v02 理解
v01 原件 
*/

const cookieName = '美团执行-测试'
const tokenurlKey = 'qingyi_tokenurl_meituan'
const tokenheaderKey = 'qingyi_tokenheader_meituan'
const signurlKey = 'qingyi_signurl_meituan'
const signheaderKey = 'qingyi_signheader_meituan'
const signbodyKey = 'qingyi_signbody_meituan'
const qxApi = init()
const tokenurlVal = qxApi.getdata(tokenurlKey)
const tokenheaderVal = qxApi.getdata(tokenheaderKey)
const signurlVal = qxApi.getdata(signurlKey)
const signheaderVal = qxApi.getdata(signheaderKey)
const signBodyVal = qxApi.getdata(signbodyKey)


// 执行签到
sign()

function sign() {
    const url = {url: signurlVal, headers: JSON.parse(signheaderVal), body: signBodyVal}
    qxApi.post(url, (error, response, data) => {
        qxApi.log(`${cookieName}, data: ${data}`)
        const result = JSON.parse(data)
        let subTitle = ``
        let detail = ``

        if (result.code == 0) {
            subTitle = '签到结果: 成功'
            detail = `本周连签: ${result.data[0].circleSignTimes}天`
            for (r of result.data[0].signInAwardRecords) {
                const rinfo = JSON.parse(r.info)
                if (rinfo.type == `cash`) detail += `, 奖励金: ${rinfo.amount / 100}元`
                else if (rinfo.type == `coupon`) detail += `\n优惠券: ${rinfo.name}: ${rinfo.amount}元 (${rinfo.condition})`
                else detail += `\n未知奖励!`
            }
        } else if (result.code == 2002) {
            subTitle = `签到结果: 成功 (重复签到)`
            detail = `说明: ${result.msg}`
        } else {
            subTitle = `签到结果: 失败`
            detail = `编码: ${result.code}, 说明: ${result.msg}`
        }
        qxApi.msg(cookieName, subTitle, detail)
        qxApi.done()
    })
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
    get = (url, cb) => {
        if (isQuanX()) {
            url.method = 'GET'
            $task.fetch(url).then((resp) => cb(null, resp, resp.body))
        }
    }
    post = (url, cb) => {
        if (isQuanX()) {
            url.method = 'POST'
            $task.fetch(url).then((resp) => cb(null, resp, resp.body))
        }
    }
    done = (value = {}) => {
        $done(value)
    }
    return {isSurge, isQuanX, msg, log, getdata, setdata, get, post, done}
}