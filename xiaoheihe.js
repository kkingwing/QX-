

/** 可能有用url ，按时间顺序 （大致，因有异步，其请求与返回时间不太一样）
 * api-d ：验证用户设备系统等身份，200 ，无其它信息
 * 
 * http://api-c.dutils.com/privacy/policy/ms/version? 返回 加密「content，timestamp」  可以直接运行
 * http://api-c.dutils.com/v6/gcf?   返回加密信息「sc,sr,timestamp」  可以直接运行
 * 
 * http://cdn-api-verify.mob.com/api/initSecCdn  「加密长文本」
 * https://data.xiaoheihe.cn/account/data_report/? 「请求账户数据，请求头的cookie，有点怪）

 * 返回data包含：「content、timestamp」
 * api.xiaoheihe.cn/account  返回「cid」
 * 
 * 
 * https://license.vod2.myqcloud.com/license/v2/1251007209_1/v_cube.license 返回加密的「signature,signatureWeb,encryptedLicenseWeb,encryptedLicense,」
 */




/** 详情数据：
api-c：响应体，返回data包含：「content、timestamp」

  {
    "message" : "success",
    "data" : {
        "content" : "NQleO+UBjJ3ftrumk89VGqH+/uCy9Ju4V37TrvyE+Z4=",
        "timestamp" : 1726045060188
    },
    "code" : 200
    }

*/


/**
 * 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
ZXJQk4x6
 * 
 * 
 */