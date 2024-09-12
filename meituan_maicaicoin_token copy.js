/**
 * @author: @JoJoJotarou
 * @description: 方式1：美团APP -> 美团买菜 -> 我的 -> 买菜币 -> 去使用 -> 在退回上一级，QX提示成功即可
 * @description: 方式2：美团APP -> 美团买菜 -> 我的 -> 买菜币 -> 左滑一半做推出手势再松手（不要真的左滑退出） -> QX提示成功即可
 *
 */
// meituan_maicaicoin_token.js - Refactored to align with v07_meituan_token.js style

const cookie_name = '美团买菜Token';
const token_key = 'jojo_mall_meituan';
const QX = init();

// Regular expression to extract necessary query parameters
const url_re_pattern = /queryTaskListInfoV\?.*/;
const generalQueryParams = ['tenantId', 'poiId', 'poi', 'bizId', 'utm_medium', 'utm_term', 'uuid', 'app_tag', 'userid'];

// Main logic for capturing token
if ($request && $request.method !== 'OPTIONS' && $request.url.match(url_re_pattern)) {
    try {
        const cookie = $request.headers['Cookie'] || $request.headers['cookie'];
        const queryStr = extractQueryStr($request.url);
        const xuuid = extractXuuid($request.url);

        if (cookie.toLowerCase().includes('token=')) {
            const tokenData = JSON.stringify({
                queryStr: queryStr,
                xuuid: xuuid,
                headers: {
                    'X-Titans-User': $request.headers['X-Titans-User'] || $request.headers['x-titans-user'],
                    'T': $request.headers['T'] || $request.headers['t'],
                    'Cookie': cookie,
                    'User-Agent': $request.headers['User-Agent'] || $request.headers['user-agent'],
                }
            });
            QX.setdata(tokenData, token_key);
            QX.msg(cookie_name, '🟢 获取会话成功');
        } else {
            throw '无法获取token信息';
        }
    } catch (error) {
        QX.msg(cookie_name, '🔴 获取会话失败', error);
        QX.log(`🔴 获取会话失败: ${error}`);
    }
}

// Extract query parameters from URL
function extractQueryStr(url) {
    return url.match(/queryTaskListInfoV\?.*/)[0]
        .split('&')
        .filter(param => generalQueryParams.includes(param.split('=')[0]))
        .join('&');
}

// Extract xuuid from URL
function extractXuuid(url) {
    return url.match(/queryTaskListInfoV\?.*/)[0]
        .split('&')
        .filter(param => 'xuuid' === param.split('=')[0])[0] || '';
}

// Initialization function to handle environment interactions
function init() {
    getdata = (key) => $prefs.valueForKey(key);
    setdata = (key, val) => $prefs.setValueForKey(key, val);
    msg = (title, subtitle, body) => $notify(title, subtitle, body);
    log = (message) => console.log(message);
    done = (value = {}) => $done(value);
    return { getdata, setdata, msg, log, done };
}

// End the script
QX.done();
