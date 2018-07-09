/**
 * Created by Administrator on 2018/7/8.
 */
'use strict';
const pageName = 'message';
const assert = require('assert');
const message = new Object();

module.exports = message;

message.setCorpInfo = function(corpInfo){
    this.corpInfo = corpInfo;
};
message.setReqQuery = function(reqQuery){
  this.reqQuery = reqQuery;
};
message.setPostData = function(postData) {
    this.postData = postData;
};
//----------------------------------------------------------------------------------------------------------------------
// 从res返回的postData是xml格式，将期转换成json格式，字段第一个字母小写。

message.receive = function(callback){
    const parseString = require('xml2js').parseString;
    const postData = this.postData;
    //postData 是xml格式
    parseString(postData,function(err,xmlJson){
        if (err) {
            return callback(err);
        }
        const  data = xmlJson.xml;
        const [e,msg] = transFormat(data);
        if (e) {return callback(e)}
        callback(null,msg);

    })
};
//---------------------------------------------------------------------------------------------------------------------
//配置校验
message.verify = function(callback){

    const corpInfo = this.corpInfo;
    const reqQuery = this.reqQuery;

    verifyUrl(corpInfo,reqQuery,callback);
};


function transFormat (data){
    let outData={};
    let fieldName;
    for (let field in data) {
        let fld =  data[field][0];
        //data[field] = fld;

        outData[firstLowerCase(field)] = fld;


    }

    return [null,outData];
}
//把第一个字母小写
function firstLowerCase (str){
    const first = str[0].toLowerCase();
    const other = str.slice(1,str.length);
    const result = first.concat(other);

    return result;
}



function verifyUrl(corpInfo,reqQuery,callback){

    var msgSignature =reqQuery.signature;
    var timestamp =reqQuery.timestamp;
    var nonce= reqQuery.nonce;
    const echostr = reqQuery.echostr;
    var token = corpInfo.token;

    const [err,signature]  = shaSignature(token,timestamp,nonce);
    if (msgSignature == signature ) {
        callback (null,echostr);
    }
    else {
        const errMsg =pageName + ':不是来自微信的请求！' ;
        callback(errMsg);
    }
}

function shaSignature (token,timestamp,nonce) {
    var arrayStr=[token,timestamp,nonce];
    var content=arrayStr.sort().join('');
    return sha1(content);
}

function sha1 (content) {
    var crypto = require('crypto');
    var sha = crypto.createHash('sha1');
    sha.update(content);
    var d = sha.digest('hex');
    return [null,d];
}

