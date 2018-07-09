/**
 * Created by Administrator on 2018/5/22.
 */
'use strict' ;
var pageName = 'material' ;
const request = require('request');
const fs = require('fs');
const formstream = require ('formstream');
const path = require('path');

const subLib = require('../sub_lib');
const access_token = subLib.access_token;
const getAccessToken = access_token.getAccessToken;




const material = new Object();

module.exports = material;

material.setCorpInfo = function(corpInfo){
    this.corpInfo = corpInfo
};

material.upload = function(type,fileUrl,callback){
    const corpInfo = this.corpInfo;
    getAccessToken (corpInfo,function(err,accessToken){

        const url= 'https://api.weixin.qq.com/cgi-bin/media/upload?access_token=' + accessToken  + '&type=' + type ;
        const fileName= path.basename(fileUrl);
        fs.stat(fileUrl,function(err,stats){
            const form = formstream();
            const nameType = 'media';
            form.file(nameType , fileUrl , fileName , stats.size);
            const uploadFile = request.post(url,{headers:form.headers()},function(err,req,res){
                if (err) {
                    return callback(err);
                }
                callback(null,res);
            });
            form.pipe(uploadFile);
        });

    });
};

material.uploadMaterial= function(type,fileUrl,callback){

    const corpInfo = this.corpInfo;
    getAccessToken (corpInfo,function(err,accessToken){

        const url= 'https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=' + accessToken + '&type=' + type  ;
        console.log('---url--',url);
        const fileName= path.basename(fileUrl);
        console.log('------fileName  fileUrl---' ,fileName, fileUrl);
        fs.stat(fileUrl,function(err,stats){
            const form = formstream();
            const nameType = 'media';
            form.file(nameType , fileUrl , fileName , stats.size);
            const uploadFile = request.post(url,{headers:form.headers()},function(err,req,res){
                if (err) {
                    return callback(err);
                }
                callback(null,res);
            });
            form.pipe(uploadFile);
        });

    });


}
