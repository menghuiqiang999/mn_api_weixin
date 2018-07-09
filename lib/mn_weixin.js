/**
 * Created by Administrator on 2018/7/8.
 */
'use strict';
const pageName = 'mn_weixin';


const mn_weixin = new Object();

mn_weixin.setCorpInfo = function(corpInfo){
    this.corpInfo = corpInfo;
};
mn_weixin.setReqQuery = function(reqQuery){
    this.reqQuery = reqQuery;
};
mn_weixin.setPostData = function(postData) {
    this.postData = postData;
};
module.exports = mn_weixin;