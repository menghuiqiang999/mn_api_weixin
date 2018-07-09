/**
 * Created by Administrator on 2018/7/4.
 */
'use strict';
const  pageName = 'custom_service' ;



const weixin = new Object();

weixin.setCorpInfo = function(corpInfo){
    this.corpInfo = corpInfo;
};
weixin.setReqQuery = function(reqQuery){
    this.reqQuery = reqQuery;
};
weixin.setPostData = function(postData) {
    this.postData = postData;
};

const custom_service = Object.create(weixin);

module.exports = custom_service;


custom_service.sendMsg = function(msgData,callback){
    const corpInfo = this.corpInfo;
    if (Array.isArray(msgData)){
        for (var i = 0; i < msgData.length; i++) {
            sendMsg(corpInfo,msgData[i],callback);
        }
    }
    else {
        sendMsg(corpInfo,msgData,callback);
    }
};
const com = require('mn_fun_comm_v2');
const httpx =com.httpx;

const subLib = require('../sub_lib');
const access_token = subLib.access_token;
const getAccessToken = access_token.getAccessToken;

function sendMsg (corpInfo,msg,callback){
    const content = JSON.stringify(msg);
    getAccessToken (corpInfo,function(err,accessToken){
        const host = 'api.weixin.qq.com';
        const path = '/cgi-bin/message/custom/send?access_token=' + accessToken ;
        httpx.post(host,path,content,callback);
    })
}



