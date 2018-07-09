/**
 * Created by Administrator on 2018/7/9.
 */
'use strict';
const pageName = 'httpx';

const httpx = new Object();
module.exports = httpx;
httpx.setProtocol = function(protocol){
    if (protocol === 'http' || protocol==='https'){
        this.protocol = protocol;
    }
    else{
        console.log(' check the protocol you have set !');
    }
};
httpx.setPort = function(port){
    this.port= port;
};

httpx.post = function(host,path,content,callback){
    let httpx;
    if (this.protocol ==='http'){
        httpx = require('http');
    }
    else {
        httpx = require('https')
    }

    /*
    const protocol = this.protocol || 'https';
    let httpx ;
    if (protocol ==='https') {
        httpx = require('https')
    }
    else if (protocol === 'http') {
        httpx = require('http')
    }
    */
    const port = this.port || 443 ;
    const defaultContentType = 'application/json;charset=UTF-8';
    const contentType = this.contentType || defaultContentType;
    const defaultHeaders= { 'Content-Type': contentType , 'Content-Length': content.length};
    const headers = this.headers || defaultHeaders;
    let options = {
        host: host ,
        port: port ,
        path: path ,
        method: 'POST'
    };
    if (headers) {
        options.headers = headers
    }
    let data = "" ;
    const req = httpx.request(options, function (res) {
        res.on ('data', function (chunk) {
            data += chunk ;
        });
        res.on('end',function(){
            callback (null,data) ;
        });
        res.on('error',(e) => {
            callback(e);
        })
    });
    req.write(content) ;
    req.end() ;
};





