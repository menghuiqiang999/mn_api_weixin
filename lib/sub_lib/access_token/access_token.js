/**
 * Created by Administrator on 2018/7/4.
 */

'use strict';
var pageName = 'access_token';

const access_token = new Object();
module.exports = access_token;

access_token.getAccessToken = function(corpInfo,callback){
    // input.weixin.options.corpInfo  里corpId, corpSecrect
    //1,去Redis里取，如果没有，去微信里取，然后存在Redis里，期限90分钟。
    const appId =  corpInfo.appId;
    const appSecret = corpInfo.appSecret;

    getAccessToken(appId,appSecret,(err,result) => {

        if (err) {
            getAccessToken(appId,appSecret,(er,res) => {
                if (er) {
                    getAccessToken(appId,appSecret, callback);
                }
                return callback(null,res);
            } )
        }

        callback(null,result);
    });
};


/**
 * @module getAccessToken
 * @param corpId
 * @param coprSecret
 * @param accessTokeCallbck
 */

function getAccessToken  (appId,appSecret,callback ){
    fromRedis(appId,appSecret,function(err,result){
        if (err) {
            refresh(appId,appSecret,callback);
            return;
        }
        //console.log(pageName, ':result fromRedis: ', result);

        if (result) {
            callback(null,result);
        }
        else {
            refresh(appId,appSecret,callback);
        }
    });
}




const com = require('mn_fun_comm_v2');
const httpx = com.httpx;

const md5=com.crypto.md5;
const redis = com.redis;

//----------------------------------------------------------------------------------------------------------------------


function fromWeixin  (appId,appSecret,callback) {

    var host = 'api.weixin.qq.com';
    var url = '/cgi-bin/token?grant_type=client_credential&appid=' + appId + '&secret=' + appSecret;

    httpx.get(host, url,function (err,dataCallback){
        if (err) {
            return callback(err)
        };
        try {
            var dataCallbackJson =  JSON.parse(dataCallback);

        }catch(err){
            callback(err);
        }

        if (dataCallbackJson.access_token){
            var accessToken = dataCallbackJson.access_token;
            //console.log(pageName + ":access_token:" + accessToken);
            callback(null,accessToken);
        }
        else{
            //console.log(pageName + ":the result:get_access_token_failure!");
            callback(dataCallback);

        }
    });


}

//----------------------------------------------------------------------------------------------------------------------


function fromRedis (appId,appSecret,accessTokenCallback) {
    var keyAccessToken = appId + appSecret + "accessToken" ;
    md5(keyAccessToken,function(err,key){
        if (err){
            accessTokenCallback(err);
            return;
        }

        redis.getkey (key,function (e,result) {
            if (e){
                accessTokenCallback(e);
                return;
            }
            accessTokenCallback (null,result);
        });
    });
};


//----------------------------------------------------------------------------------------------------------------------
/**
 *
 * @param corpId
 * @param corpSecret
 * @param accessToken
 */

function toRedis (appId,appSecret,accessToken) {
    var keyAccessToken = appId + appSecret + "accessToken" ;
    md5(keyAccessToken,function(err,key){
        if(err){
            accessToken(err);
            return;
        }
        redis.setex_key(key,4800,accessToken);     // 4800seconds
    });
};

//----------------------------------------------------------------------------------------------------------------------
/**
 *
 * @param accessToken
 */


//----------------------------------------------------------------------------------------------------------------------
/**
 *
 * @param corpId
 * @param corpSecret
 * @param accessTokenCallback
 */

function refresh(appId,appSecret,callback) {
    fromWeixin(appId,appSecret,function(err,accessToken){
        if (err){
            //console.log(pageName+"get access_token from cropweixin failure!");
            return callback(err);
        }
        else{
            callback(null,accessToken);
            toRedis(appId,appSecret,accessToken);
        };
    });
};

