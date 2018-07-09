/**
 * Created by Administrator on 2018/7/8.
 */
'use strict';
const pageName = 'test';

var express = require('express');
var router = express.Router();

const weixin= require('../weixin');
const message = weixin.message;

const moonlight_club = {

    appId : 'wx81fffa724da242ae'  , //club moonlight club 微信订阅号
    appSecret : 'a4e3b9e999994526620e0e09cdf10beb' ,
    token : 'moonlight',
    encodingAesKey : 'CaXJdEiXWsLMpTBaLOVwuUeT9MS8bpx8XZD8vt1XyIn'
};
const corpInfo = moonlight_club;
const custom_service = weixin.custom_service;
custom_service.setCorpInfo(corpInfo);

const acces_token = weixin.access_token;

/* GET home page. */
router.get('/', function(req, res, next) {

    message.setCorpInfo(corpInfo);
    message.setReqQuery(req.query);
    message.verify((e,sReply) => {
        if (e) {return console.log(e)}

        res.send(sReply);
    });

});
router.post('/',function(req,res ){
    res.send('');
    receivePostData(req,function(err,postData) {
        if (err) {
            return console.log(err);
        }

        message.setPostData(postData);

        message.receive((err,msg) => {
            if (err) {return console.log(err)}

            const msgBack = {
                touser: msg.fromUserName ,
                msgtype :msg.msgType ,
                text : {
                    content : msg.content
                }
            };
            custom_service.sendMsg(msgBack,(er,result) => {
                if (er) {return console.log(er)}
                console.log(result);
            });

        });


    })
});

module.exports = router;



function receivePostData (req,callback) {
    var data = '';
    req.on('data', function (chunk) {
        data += chunk;
    });
    req.on('end', function () {
        callback(null,data);
    });
};