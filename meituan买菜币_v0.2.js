// v0.2 简化
// v0.1 理解


/**
 * @author: @JoJoJotarou
 * 美团买菜买菜币各项活动(签到、分享、浏览商品、3/7天礼包领取), 其中浏览商品, 第二次需与第一次间隔至少1小时
 */
// meituan_buy_veggies_coins_v0.2.js
const $ = Env('美团买菜-买菜币');
const QX = init();  // Use a similar init function for consistency

let _log = [];
let _coins = 0;
let _desc = [];
let userId = '';

// Functions refactored to use the initialized helper functions
async function checkIn(queryStr, headers) {
    let eventName = '【签到】';
    headers['Content-Type'] = 'application/json';
    let extQueryStr = `&t=${headers.T || headers.t}`;
    let option = {
        url: `https://mall.meituan.com/api/c/mallcoin/checkIn/userCheckInNew?${queryStr}${extQueryStr}`,
        headers: headers,
        body: JSON.stringify({ userId, riskMap: getRiskMap(queryStr) }),
    };
    try {
        let data = await QX.post(option);
        if (data && data.code === 0 && data.data.result) {
            _coin = data.data.rewardValue;
            _coins += Number(_coin) || 0;
            _log.push(`🟢${eventName}: 获取${_coin}个买菜币`);
        } else {
            _log.push(`🟡${eventName}: 今日签到已完成`);
        }
    } catch (error) {
        _log.push(`🔴${eventName}: ${error}`);
    }
}

// Get RiskMap
function getRiskMap(queryStr) {
    return {
        platform: 5,
        app: 95,
        utm_term: queryStr.match(/utm_term=([\w|\.]+)/)[1],
        uuid: queryStr.match(/uuid=(\w+)/)[1],
        utm_medium: queryStr.match(/utm_medium=(\w+)/)[1],
        fingerprint: '',
    };
}

// Initialization function similar to v07_meituan_token.js
function init() {
    const getdata = (key) => $.getdata(key);
    const setdata = (key, val) => $.setdata(key, val);
    const msg = (title, subtitle, body) => $.msg(title, subtitle, body);
    const log = (message) => console.log(message);

    const get = async (request) => {
        return new Promise((resolve, reject) => {
            $.get(request, (error, response, data) => {
                if (error) reject(error);
                else resolve(JSON.parse(data));
            });
        });
    };

    const post = async (request) => {
        return new Promise((resolve, reject) => {
            $.post(request, (error, response, data) => {
                if (error) reject(error);
                else resolve(JSON.parse(data));
            });
        });
    };

    return { getdata, setdata, msg, log, get, post };
}

!(async () => {
    let jojo_mall_meituan = QX.getdata('jojo_mall_meituan');
    if (jojo_mall_meituan) {
        let { headers, queryStr } = JSON.parse(jojo_mall_meituan);
        queryStr += '&ci=1&page_type=h5&uci=10&channel=7';
        userId = queryStr.match(/userid=(\d+)/)[1];

        let pre = await totalCoins(queryStr, headers);
        if (pre < 0) {
            QX.msg($.name, '任务失败，查看日志了解详细信息>>');
        } else {
            await checkIn(queryStr, headers);
            // Continue other tasks...
        }
    } else {
        QX.msg($.name, '🔴 请先获取会话');
    }
})()
.catch((e) => _log.push(e))
.finally(() => {
    QX.log(_log.join('\n'));
    QX.msg($.name, '', _desc.join('\n'));
});