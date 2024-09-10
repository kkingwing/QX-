/**
 * @fileoverview 歪麦签到示例.
 * 于 2024-4-10 完成，基本语法已获析，逻辑与python一致，使用过程略有不同。
 * 
 * [task_local] # 测试
 * 10 0 0 * * * waimai.js, tag=歪麦签到, enabled=true
 */

const url = `https://fz-gateway.waimaimingtang.com/api/api/v2/user/api_user_sign_in`;
const method = `POST`;
const headers = {
'content-type' : `application/json;charset=UTF-8`,
'timestamp' : `1712543869542`,
'nonce' : `336357`,
'appversion' : `1.1.92`,
'application' : `app`,
'accept-encoding' : `gzip`,
'code' : `440306`,
'host' : `fz-gateway.waimaimingtang.com`,
'token' : `e5391edfed864ca3b1dcfaeac6b2e498`,
'user-agent' : `Dart/2.19 (dart:io)`,
'appchannel' : `App Store`,
'sign' : `Xdd8w8so0kRaM3hbhUvWbG11hZ97n4GPti8ID+QUm2s=`
};
const body = `{"json":"8tziRDMOjBN9looVtLKNXRI2LS2+dCAaeFmBI31WOWGOUrl3j9V8CnVYGJoAGnZMzIvGAbkjaWVi9KI+M6t1sQEhqLmX1TodrXYLADCR19a1BIjLMc7QBdKTrof26hLenW1qP5RbCCSSDq5x6eKwag=="}`;

const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body
};

$task.fetch(myRequest).then(response => {
    // response.statusCode, response.headers, response.body，获取各个返回
    
    /* 语法备注：
    定义变量常量：
    let a     定义「变量」a， 可以被再次赋值
    const a   定义「常量」a ， 不可被再次赋值

    解析：
    typeof a  类型查看a  : typeof response.bod
    JSON.parse(……)  将文本解析为json : JSON.parse(response.body).message

    输出：
    console.log(……)  日志记录
    $notify(……)     消息推送， $符号表示内置用法

    console.log(typeof response.body);    // 查看类型 string
    console.log(typeof JSON.parse(response.body)); // 解析为 object 对象
    console.log("Message:", JSON.parse(response.body).message); //测试返回内容
    */


    // 定义消息变量，以便引用
    let msg_obj = JSON.parse(response.body).message;

    // 日志记录
    console.log(response.statusCode + "\n\n" + response.body);
    //console.log(msg_obj);  // 使用上一行更全信息，一般不用改。

    //推送通知
    //示例：$notify("Title", "Subtitle", response.body); // Success!
    // 一般第二个参数是总结。如果res有其它信息，可以把「获得的总数」写到这里。
    $notify("歪麦", "签到成功", msg_obj);

    // 结束
    $done();


}, reason => {
    console.log(reason.error);
    // reason.error
    $notify("歪麦", "签到错误", reason.error + "\n\n" + response.body); // Error!  错误的通知    
    $done();
});

