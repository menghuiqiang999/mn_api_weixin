/**
 * Created by Administrator on 2018/4/25.
 *
 * accessToken
 *
 * @exaample
 * accessToken=function(corpid,corpsecret,access_token_callback){
 *      ......
 * };
 */
'use strict';
var pageName='weixin bus';

const subLib = require('./lib/sub_lib');

//----------------------------------------------------------------------------------------------------------------------
//custom service
exports.custom_service = require('./lib/custom_service/custom_service');

//----------------------------------------------------------------------------------------------------------------------
//material
exports.material =  require('./lib/material/material') ;

//----------------------------------------------------------------------------------------------------------------------
//message

exports.message = require('./lib/message/message');



//----------------------------------------------------------------------------------------------------------------------
// getAccess_token
exports.access_token=subLib.access_token;

