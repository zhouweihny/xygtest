var conf = 0; //控制服务，0表示本地假数据，1表示远程服务器数据
var srvMap = (function(){
    //var srcPref = ["ui/json/", "http://localhost:8080/wgw/"];//本机
    // var srcPref = ["ui/json/", "http://192.168.96.68:8080/"];//
    var srcPref = ["json/", ""];//  远程服务器配置为空即可
    var dataArray = [
         {

         },
         {

         }
    ];
    
    return {
        add: function(uid, mockSrc, srvSrc) {
            dataArray[0][uid] = srcPref[conf] + mockSrc;
            dataArray[1][uid] = srcPref[conf] + srvSrc;
        },
        get: function(uid) {
            return dataArray[conf][uid];
        },
        getAppPath:function(){
            return srcPref[conf];
        },
        dataArrays:function(){
            return dataArray[conf];
        }
    };
})(jQuery);
window.dataArray = srvMap.dataArrays();

/*
* 扩展jQuery的Ajax方法，用于异步获取数据
* get方式，post方式，json返回
* 2个比较重要：GetJson  , PostJson
*/
(function($){
    $.extend({
        /*
        * post方式提交数据，适用于大数据提交。返回的JSON要符合规范。
        * 引号不能去掉。完整写法：{"key" , "value"}
        */
        PostJson: function(url, datas , callback, tokenFlag) {
            $.ajax({
                url: url,
                type: "POST",
                // data : datas +"&_=" + (new Date()).getTime()+"&code=test",
                data : datas +"&_=" + (new Date()).getTime(),
                cache: false,
                dataType: "json",
                timeout: 20000,
                beforeSend: function (xhr) {
                    xhr.overrideMimeType("text/plain; charset=utf-8");
                },
                success: function(json) {
                    if(window.conf == 0){
                        setTimeout(function(){
                            callback("success", json);
                        }, 1000)
                    }else{
                        callback("success", json);
                    }
                },
                error: function(e) {
                    if(e.statusText == 'timeout'){
                        callback("error", {"rtnCode": "-100", "rtnMsg": "连接超时！"});
                    }else if(e.status == '404'){
                        zuiAlert("网络错误，请检查您的网络");
                        callback("error", {"rtnCode": "404", "rtnMsg": "网络错误，请检查您的网络"});
                    }else{
                        callback("error", null);
                    }
                }
            });
        },
        AjaxHtml: function(url, datas , callback) {
            $.ajax({
                url: url,
                type: "GET",
                data : datas +"&_=" + (new Date()).getTime(),
                cache: false,
                dataType: "html",
                timeout: 60000,
                beforeSend: function (xhr) {
                    xhr.overrideMimeType("text/plain; charset=utf-8");
                },
                success: function(html) {
                    if(window.conf == 0){
                        setTimeout(function(){
                            callback("success", html);
                        }, 1000)
                    }else{
                        callback("success", html);
                    }
                },
                error: function(e) {
                    if(e.statusText == 'timeout'){
                        callback("error", {"rtnCode": "-100", "rtnMsg": "连接超时！"});
                    }else{
                        callback("error", null);
                    }
                },
                complete:function(XMLHttpRequest,status){ 
                    
                }
            });
        }
    });
})(jQuery);

/*
 * 获取url参数，多个参数
 * //Get object of URL parameters
 * var allVars = $.getUrlVars();
 * //Getting URL var by its nam
 * var getName = $.getUrlVar('name');
 */
(function($){
    $.extend({
        getUrlVars: function(){
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for(var i = 0; i < hashes.length; i++)
            {
              hash = hashes[i].split('=');
              vars.push(hash[0]);
              vars[hash[0]] = hash[1];
            }
            return vars;
        },
        getUrlVar: function(name){
            return $.getUrlVars()[name];
        }
    });
})(jQuery)

/**
 * 获取微信url参数
 * var code =  getQueryString("code") ? getQueryString("code") : "";
**/
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var url = decodeURI(window.location);
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}

//阻止事件冒泡
function stopEvent(e){
    if(e && e.stopPropagation ){
        e.stopPropagation();
    }else{
        window.event.cancelBubble = true;
    }
}
var NiceTools = {
    /*
     * 功能:删除数组元素.
     * 参数:dx删除元素的下标.
     * 返回:在原数组上删除后的数组
     */
    removeByIndex : function(arrays , dx){
        if(isNaN(dx)||dx>arrays.length){return false;}
        for(var i=0,n=0;i<arrays.length;i++)
        {
            if(arrays[i]!=arrays[dx])
            {
                arrays[n++]=arrays[i]
            }
        }
        arrays.length-=1
        return arrays;
    },
    //删除指定的item,根据数组中的值
    removeByValue : function(arrays, item ){
        for( var i = 0 ; i < arrays.length ; i++ ){
            if( item == arrays[i] )
            {
                break;
            }
        }
        if( i == arrays.length ){
            return;
        }
        for( var j = i ; j < arrays.length - 1 ; j++ ){
            arrays[ j ] = arrays[ j + 1 ];
        }
        arrays.length--;
        return arrays;
    }
}
/*
    handlebars扩展
    eg:
    $('#content').temp( $('#template'),  { name: "Alan" } );
    $('#content').temp( 'string' ,  { name: "Alan" } );
*/
;(function($){
    var compiled = {};
    $.fn.temp = function(template, data) {
        if(template instanceof jQuery){
            template = template.val();
        }
        compiled[template] = Handlebars.compile(template);
        this.html(compiled[template](data));
        return this;
    };

    $.fn.tempAppend = function(template, data) {
        if(template instanceof jQuery){
            template = template.val();
        }
        compiled[template] = Handlebars.compile(template);
        this.append(compiled[template](data));
        return this;
    };

    $.fn.tempPrepend = function(template, data) {
        if(template instanceof jQuery){
            template = template.val();
        }
        compiled[template] = Handlebars.compile(template);
        this.prepend(compiled[template](data));
        return this;
    };
})(jQuery);

/**
 * 设置当前时间为默认时间
 * type为true表示带时分秒
**/
function setCurDate(obj, type){
    var cDate = new Date();
    cDate = getCurDate(cDate, type);
    obj.val(cDate);
    obj.blur(function(){
        if(!obj.val()){
            setCurDate(obj, type);
        }
    })
}
/**
 * 设置当前时间为默认时间往前
 * type为true表示带时分秒
 * day 表示天数
**/
function setCurDateBefore(obj, day, type){
    var cDate = new Date().getTime();
    cDate = cDate - (parseInt(day, 10) * 24 * 60 * 60 * 1000);
    cDate = getCurDate(new Date(cDate), type);
    obj.val(cDate);
    obj.blur(function(){
        if(!obj.val()){
            setCurDateBefore(obj, day, type);
        }
    })
}
/**
 * 设置某个时间前后区间
 * type为true表示带时分秒
 * day 表示天数
**/
function getDateArea(cDate, day, type){
    var cDate = new Date().getTime();
    if(type){
        //往前
        cDate = cDate - (parseInt(day, 10) * 24 * 60 * 60 * 1000);
    }else{
        //往后
        cDate = cDate + (parseInt(day, 10) * 24 * 60 * 60 * 1000);
    }
    cDate = getCurDate(new Date(cDate));
    return cDate;
}
/**
 * 获取当前时间
 * type为true表示带时分秒
**/
function getCurDate(cDate, type){
    if(type && type == '2'){
        cDate = cDate.formatDD( "yyyy-MM-DD hh:mm:ss");
    }else if(type){
        cDate = cDate.formatDD( "yyyy-MM-DD hh:mm");
    }else{
        cDate = cDate.formatDD( "yyyy-MM-DD");
    }
    return cDate;
}
Date.prototype.formatDD = function( formatStr){ 
    var date = this;
    var str = formatStr; 
    str=str.replace(/yyyy|YYYY/,date.getFullYear()); 
    str=str.replace(/yy|YY/,(date.getYear() % 100)>9?(date.getYear() % 100).toString():"0" + (date.getYear() % 100)); 
    str=str.replace(/MM/,date.getMonth()>8?(date.getMonth()+1).toString():"0" + (date.getMonth()+1)); 
    str=str.replace(/M/g,date.getMonth()+1); 
    str=str.replace(/dd|DD/,date.getDate()>9?date.getDate().toString():"0" + date.getDate()); 
    str=str.replace(/d|D/g,date.getDate()); 
    str=str.replace(/hh|HH/,date.getHours()>9?date.getHours().toString():"0" + date.getHours()); 
    str=str.replace(/h|H/g,date.getHours()); 
    str=str.replace(/mm/,date.getMinutes()>9?date.getMinutes().toString():"0" + date.getMinutes()); 
    str=str.replace(/m/g,date.getMinutes()); 
    str=str.replace(/ss|SS/,date.getSeconds()>9?date.getSeconds().toString():"0" + date.getSeconds()); 
    str=str.replace(/s|S/g,date.getSeconds()); 
    return str; 
}
/**
 * 毫秒转日期
 *format(new Date().getTime(), 'yyyy-MM-dd HH:mm:ss')
**/
var format = function(time, format){
    var t = new Date(time);
    var tf = function(i){return (i < 10 ? '0' : '') + i};
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
        switch(a){
            case 'yyyy':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'dd':
                return tf(t.getDate());
                break;
            case 'HH':
                return tf(t.getHours());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    })
}
//加法
function accAdd(arg1,arg2){
    var r1,r2,m;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2))
    return (arg1*m+arg2*m)/m;
}
//减法
function Subtr(arg1,arg2){
    var r1,r2,m,n;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2));
    n=(r1>=r2)?r1:r2;
    return ((arg1*m-arg2*m)/m).toFixed(n);
}
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。  
function zuiaccMul(arg1,arg2) {  
    var m=0,s1=arg1.toString(),s2=arg2.toString();  
    try{m+=s1.split(".")[1].length}catch(e){}  
    try{m+=s2.split(".")[1].length}catch(e){}  
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);  
}  

//除法函数，用来得到精确的除法结果  
//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。  
//调用：accDiv(arg1,arg2)  
//返回值：arg1除以arg2的精确结果  
function zuiaccDiv(arg1,arg2){  
    var t1=0,t2=0,r1,r2;  
    try{t1=arg1.toString().split(".")[1].length}catch(e){}  
    try{t2=arg2.toString().split(".")[1].length}catch(e){}  
    with(Math){  
        r1=Number(arg1.toString().replace(".",""));  
        r2=Number(arg2.toString().replace(".",""));  
        return (r1/r2)*pow(10,t2-t1);  
    }  
}

function createLoading(txt){
    if(!txt)
        txt = '数据加载中';
    $.showLoading(txt);
}

function unblockLoading(callback){
    $(".weui-mask_transparent").remove();
    $(".weui-toast.weui_loading_toast").removeClass("weui-toast--visible").transitionEnd(function() {
        var $this = $(this);
        $this.remove();
        callback && callback($this);
    });
}

function zuiTotast(txt, type, callback){
    var type = type || "1",
        ztype = "";
    if(type == '2'){
        //纯文本
        ztype = "text";
    }else if(type == '3'){
        //取消
        ztype = "cancel";
    }else if(type == '4'){
        //警告
        ztype = "forbidden";
    }
    $.toast.prototype.defaults.duration = 1000;
    $.toast(txt, ztype, function() {
        if(typeof callback == 'function')
            callback();
    });
}

function zuiToptip(txt, type, callback){
    var type = type || "1",
        ztype = "success";
    if(type == '2'){
        //成功
        ztype = "zuidefault";
    }else if(type == '3'){
        //失败
        ztype = "error";
    }else if(type == '4'){
        //警告
        ztype = "warning";
    }
    $.toptip(txt, ztype, function() {
        if(typeof callback == 'function')
            callback();
    });
}

function zuiAlert(txt, callback){
    $.alert(txt, function() {
        if(typeof callback == 'function')
            callback();
    });
}

function zuiConfirm(txt, succ, erro){
    $.confirm(txt, "提示", function() {
        if(typeof succ == 'function')
            succ();
    }, function() {
        //取消操作
        if(typeof erro == 'function')
            erro();
    });
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var url = decodeURI(window.location);
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}

window.Util = {};
Util.lStorage = {
    /*
    localStorage只支持字符串，如果要放json，请先使用JSON.stringify()转换
    读取使用JSON.parse()读取
    */
    setParam: function(name, value) {
        localStorage.setItem(name, value);
    },
    getParam: function(name) {
        return localStorage.getItem(name);
    },
    removeParam:function(name){
        localStorage.removeItem(name);
    },
    clearParam:function(){
        //清除所有的存储，谨慎使用
        localStorage.clear();
    },
    paramSize:function(){
        return localStorage.length;
    },
    /*
        离线缓存管理器
    */
    cacheManager:new CacheManager(window.cacheCfg)
}

Util.sStorage = {
    /*
    sessionStorage只支持字符串，如果要放json，请先使用JSON.stringify()转换
    读取使用JSON.parse()读取
    */
    setParam: function(name, value) {
        sessionStorage.setItem(name, value);
    },
    getParam: function(name) {
        return sessionStorage.getItem(name);
    },
    removeParam:function(name){
        sessionStorage.removeItem(name);
    },
    clearParam:function(){
        //清除所有的存储，谨慎使用
        sessionStorage.clear();
    },
    paramSize:function(){
        return sessionStorage.length;
    }
}
/*
    离线缓存管理器
*/
function CacheManager(config){
    this.config=config;
}
/*
    从离线缓存中获取数据,当前方法有两个功能：
    1、从后台获取数据，第二个参数是一个回调函数，
    当离线缓存中没有要获取的数据时 或 当请求后台的入参值改变时，
    调用update方法从后台获取新数据，并覆盖旧数据
    2、获取本地插入的数据，第二个参数是一个字符串，
    当离线缓存中没有数据时直接返回空
*/
CacheManager.prototype.get=function(name,callback,param){
    var target=this.config[name];
    var cacheKey=target.key;
    var json=Util.lStorage.getParam(cacheKey);
    //当callback是方法时，表示从后台获取数据，需要使用回调处理数据
    if(typeof callback == 'function'&&target['url']){
        //realTime是在config对象中配置，
        //如果realTime配置true,表示每次都从后台取数据
        if(json&&!target.realTime){
            json=JSON.parse(json);
            if(json.param==param){
                callback('success',json);
                return;
            }
        }
        this.update(name,callback,param);
        return;
    }else{
        //callback不是方法的时候，即时返回数据
        return json;
    }
}
CacheManager.prototype.update=function(name,callback,param){
    var target=this.config[name];
    var cacheKey=target.key;
    //当callback是方法时，表示从后台刷新数据
    if(typeof callback == 'function'&&target.url){
        var _self = this;
        $.PostJson(target.url,param,function(state,json){
            if(state=='success'&&json.returnCode=='0'){
                json.param=param;
                Util.lStorage.setParam(cacheKey,JSON.stringify(json));
            }else{
                _self.del(name);
            }
            callback(state,json);
        },true);
    }else{
        //此时callback是字符串
        Util.lStorage.setParam(cacheKey,callback);
    }
}
CacheManager.prototype.del=function(name){
    var target=this.config[name];
    var cacheKey=target.key;
    Util.lStorage.removeParam(cacheKey);
}
CacheManager.prototype.clearAll=function(){
    for(var attr in this.config){
        var target=this.config[attr];
        var cacheKey=target.key;
        Util.lStorage.removeParam(cacheKey);
    }
}

//获取token
Util.getlSToken = function(){
    var token = Util.sStorage.getParam("userToken") || "";
    if(token)
        return token;
    else
        return null;
}

Util.getlSUserid = function(){
    var loginuser = Util.sStorage.getParam("loginuser") || "";
    loginuser = JSON.parse(loginuser);
    if(loginuser)
        return loginuser.id;
    else
        return null;
}

;(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
        recalc = function(){
            var clientWidth = docEl.clientWidth;
            if(clientWidth<=640 && clientWidth>=320){ //判断最小320 屏幕，最大640，当然也可以不加 
                if(!clientWidth) return;
                docEl.style.fontSize = 20 * (clientWidth / 320) + "px";
            }else{
                docEl.style.fontSize = "40px";
            }
        };
    if(!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener("DOMContentLoaded", recalc, false);
})(document, window);

;$(function(){

    /*var new_script = document.createElement("script");
    new_script.src = './../js/plugins/jquery-weui/lib/vconsole.min.js';
    document.getElementsByTagName("head")[0].appendChild(new_script);*/

    $(".zui .J_header .J_header_back").not(".customized").on("click", function(){
        window.history.back();
    })

    var _zCurl = window.location.href;
    if(_zCurl.indexOf("redirect") !== -1){
        //表示未绑定用户，不做处理，直接后台跳转至绑定页面

    }else{
        //已绑定用户，需在进入页面后，清除clearsession字段，不在清空后台缓存
        if(_zCurl.indexOf("clearsession") !== -1){
            //替换url中的clearsession
            var newZUrl = delUrlParam(_zCurl, 'clearsession');
            window.history.pushState("", "", newZUrl);
        }
    }
})

function setTitle(title){
    var $body = $('body');
    document.title = title;
    // hack在微信等webview中无法修改document.title的情况
    var $iframe = $('<iframe src="ui/img/arrow.png" style="display:none;"></iframe>').on('load', function() {
    setTimeout(function() {
        $iframe.off('load').remove()
    }, 0)
    }).appendTo($body)
}

;(function($){
    /**
     * $("#J_wxcontent").showOnLoading();
     * 显示正在加载...
    **/
    $.fn.showOnLoading = function() {
        if(this.find(".showOnLoading").length){
            this.find(".showOnLoading").show();
            return;
        }
        var str = '<div class="weui-loadmore showOnLoading"> <i class="weui-loading"></i> <span class="weui-loadmore__tips">正在加载</span> </div>';
        this.html(str);
        return this;
    };
})(jQuery);

;(function($){
    /**
     * $("#J_wxcontent").showNullData();
     * 显示正在暂无数据
    **/
    $.fn.showNullData = function(txt) {
        if(this.find(".showNullData").length){
            this.find(".showNullData").show();
            return;
        }
        var txt = txt || "暂无数据";
        var str = '<div class="weui-loadmore weui-loadmore_line showNullData"> <span class="weui-loadmore__tips">'+txt+'</span> </div>';
        this.html(str);
        return this;
    };
})(jQuery);

;(function($){
    /**
     * $("#J_wxcontent").showNoMoreData();
     * 显示没有更多数据
    **/
    $.fn.showNoMoreData = function() {
        if(this.find(".showNoMoreData").length){
            this.find(".showNoMoreData").show();
            return;
        }
        var str = '<div class="weui-loadmore weui-loadmore_line showNoMoreData"> <span class="weui-loadmore__tips" style="background-color: #fbf9fe;">没有更多数据了</span> </div>';
        this.append(str);
        return this;
    };
})(jQuery);

function checkJsApi(){
    $.PostJson(srvMap.get("zjsapi"), "url="+encodeURIComponent(location.href.split('#')[0])+"&jsapistr=[getLocation,openLocation]", function(state, json){
        console.log(JSON.stringify(json))
        if(state == 'success'){
            if(json){
                // wx.config(json);
                wx.config({
                    debug: false,
                    appId: json.appId,
                    timestamp: json.timestamp,
                    nonceStr: json.nonceStr,
                    signature: json.signature,
                    jsApiList: ['getLocation', 'openLocation']
                });
                wx.ready(function(){
                    wx.getLocation({
                        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                        success: function (res) {
                            var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                            var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90

                            gps2Bmap(longitude, latitude);
                        },
                        fail: function(res){
                            zuiAlert(JSON.stringify(res))
                        }
                    });
                })
            }else{
                zuiAlert( json.message || "获取微信位置权限失败");
            }
        }else{
            zuiAlert("获取微信位置权限失败");
        }
    });
}

function gps2Bmap(x, y){
    // 百度地图API功能
    //GPS坐标
    var ggPoint = new BMap.Point(x,y);

    //坐标转换完之后的回调函数
    translateCallback = function (data){
        if(data.status === 0) {
            if(typeof checkJsApiOver === 'function')
                checkJsApiOver(data.points[0].lng, data.points[0].lat);
        }
    }

    var convertor = new BMap.Convertor();
    var pointArr = [];
    pointArr.push(ggPoint);
    convertor.translate(pointArr, 1, 5, translateCallback);
}

/**
 * https://www.oschina.net/code/snippet_260395_39205
 * WGS-84：是国际标准，GPS坐标（Google Earth使用、或者GPS模块）
*  GCJ-02：中国坐标偏移标准，Google Map、高德、腾讯使用
*  BD-09：百度坐标偏移标准，Baidu Map使用
**/
window.zuiGPS = {
    PI : 3.14159265358979324,
    x_pi : 3.14159265358979324 * 3000.0 / 180.0,
    delta : function (lat, lon) {
        var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
        var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
        var dLat = this.transformLat(lon - 105.0, lat - 35.0);
        var dLon = this.transformLon(lon - 105.0, lat - 35.0);
        var radLat = lat / 180.0 * this.PI;
        var magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * this.PI);
        dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * this.PI);
        return {'lat': dLat, 'lon': dLon};
    },
     
    //WGS-84 to GCJ-02 -- gps转google
    gcj_encrypt : function (wgsLat, wgsLon) {
        if (this.outOfChina(wgsLat, wgsLon))
            return {'lat': wgsLat, 'lon': wgsLon};
 
        var d = this.delta(wgsLat, wgsLon);
        return {'lat' : wgsLat + d.lat,'lon' : wgsLon + d.lon};
    },
    //GCJ-02 to WGS-84 -- google转gps
    gcj_decrypt : function (gcjLat, gcjLon) {
        if (this.outOfChina(gcjLat, gcjLon))
            return {'lat': gcjLat, 'lon': gcjLon};
         
        var d = this.delta(gcjLat, gcjLon);
        return {'lat': gcjLat - d.lat, 'lon': gcjLon - d.lon};
    },
    //GCJ-02 to WGS-84 exactly -- google转gps
    gcj_decrypt_exact : function (gcjLat, gcjLon) {
        var initDelta = 0.01;
        var threshold = 0.000000001;
        var dLat = initDelta, dLon = initDelta;
        var mLat = gcjLat - dLat, mLon = gcjLon - dLon;
        var pLat = gcjLat + dLat, pLon = gcjLon + dLon;
        var wgsLat, wgsLon, i = 0;
        while (1) {
            wgsLat = (mLat + pLat) / 2;
            wgsLon = (mLon + pLon) / 2;
            var tmp = this.gcj_encrypt(wgsLat, wgsLon)
            dLat = tmp.lat - gcjLat;
            dLon = tmp.lon - gcjLon;
            if ((Math.abs(dLat) < threshold) && (Math.abs(dLon) < threshold))
                break;
 
            if (dLat > 0) pLat = wgsLat; else mLat = wgsLat;
            if (dLon > 0) pLon = wgsLon; else mLon = wgsLon;
 
            if (++i > 10000) break;
        }
        return {'lat': wgsLat, 'lon': wgsLon};
    },
    //GCJ-02 to BD-09 -- google转百度
    bd_encrypt : function (gcjLat, gcjLon) {
        var x = gcjLon, y = gcjLat;  
        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);  
        var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);  
        bdLon = z * Math.cos(theta) + 0.0065;  
        bdLat = z * Math.sin(theta) + 0.006; 
        return {'lat' : bdLat,'lon' : bdLon};
    },
    //BD-09 to GCJ-02 -- 百度转google
    bd_decrypt : function (bdLat, bdLon) {
        var x = bdLon - 0.0065, y = bdLat - 0.006;  
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);  
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);  
        var gcjLon = z * Math.cos(theta);  
        var gcjLat = z * Math.sin(theta);
        return {'lat' : gcjLat, 'lon' : gcjLon};
    },
    //WGS-84 to Web mercator
    //mercatorLat -> y mercatorLon -> x
    mercator_encrypt : function(wgsLat, wgsLon) {
        var x = wgsLon * 20037508.34 / 180.;
        var y = Math.log(Math.tan((90. + wgsLat) * this.PI / 360.)) / (this.PI / 180.);
        y = y * 20037508.34 / 180.;
        return {'lat' : y, 'lon' : x};
    },
    // Web mercator to WGS-84
    // mercatorLat -> y mercatorLon -> x
    mercator_decrypt : function(mercatorLat, mercatorLon) {
        var x = mercatorLon / 20037508.34 * 180.;
        var y = mercatorLat / 20037508.34 * 180.;
        y = 180 / this.PI * (2 * Math.atan(Math.exp(y * this.PI / 180.)) - this.PI / 2);
        return {'lat' : y, 'lon' : x};
    },
    // two point's distance
    distance : function (latA, lonA, latB, lonB) {
        var earthR = 6371000.;
        var x = Math.cos(latA * this.PI / 180.) * Math.cos(latB * this.PI / 180.) * Math.cos((lonA - lonB) * this.PI / 180);
        var y = Math.sin(latA * this.PI / 180.) * Math.sin(latB * this.PI / 180.);
        var s = x + y;
        if (s > 1) s = 1;
        if (s < -1) s = -1;
        var alpha = Math.acos(s);
        var distance = alpha * earthR;
        return distance;
    },
    outOfChina : function (lat, lon) {
        if (lon < 72.004 || lon > 137.8347)
            return true;
        if (lat < 0.8293 || lat > 55.8271)
            return true;
        return false;
    },
    transformLat : function (x, y) {
        var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
        return ret;
    },
    transformLon : function (x, y) {
        var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
        return ret;
    }
};

/**
 * 删除url某个参数
 * redirect = delUrlParam(redirect, 'clearsession');
**/
function delUrlParam(url, ref){
    // 如果不包括此参数
    if (url.indexOf(ref) == -1)
        return url;
    var arr_url = url.split('?');
    var base = arr_url[0];
    var arr_param = arr_url[1].split('&');
    var index = -1;

    for (i = 0; i < arr_param.length; i++) {
        var paired = arr_param[i].split('=');
        if (paired[0] == ref) {
            index = i;
            break;
        }
    }
    if (index == -1) {
        return url;
    } else {
        arr_param.splice(index, 1);
        return base + "?" + arr_param.join('&');
    }
}

function initZrouter(routes, callback){
    var opt = {
        '/J_router_main': {
            before: function(id){
                
            },
            on: function(){

            },
            after: function(id){
                
            },
            once: function(){
                
            }
        },
        '/J_router_add': {
            on: function(){

            }
        },
        '/J_router_detail': {
            on: function(){

            }
        }
    };

    var router = Router($.extend({}, opt, routes));
    router.configure({
        on: function() {
            var route = window.location.hash.slice(2);
            if(route.indexOf("?") !== -1)
                route = route.split("?")[0];
            $('section').hide(250);
            $("."+route).show(250);
        }
    });
    router.init();
    if(typeof callback == 'function')
        callback(router);
}

// 显示暂无数据
function showResDes(height, obj, type){
    var _obj = obj || $("#J_cards");
    if(!type){
        _obj.html('<div class="noContent"><div class="noContentBlock"><span>暂无数据</span></div></div>');
        $(".noContent").css({"height": height});
        $("body.zui").addClass('nodata');
    }
}
function removeResDes(){
    if($(".noContent").length){
        $(".noContent").remove();
        $("body.zui").removeClass('nodata');
    }
}

function getAjaxDataIscrollCommon(param){
    var opt = {
        url: '',
        data: '',
        callback: function(){
            console.log("ajax回调");
        }
    }
    var _opt = $.extend({}, opt, param);
    createLoading();
    removeResDes();
    $.PostJson(_opt.url, _opt.data, function(state, json){
        if(state == 'success'){
            if(json && json.code == '0000'){
                if(refreshFlag){
                    $("#J_cards").html("");
                    wrapper.refresh();
                    $("#J_cards").temp($("#T_cards").val(), json.data.rows);
                }else{
                    $("#J_cards").tempAppend($("#T_cards").val(), json.data.rows);
                }

                if(typeof _opt.callback == 'function')
                    _opt.callback();

                refreshFlag = 0;
                if(json.data.rows.length){
                    if($("#J_cards .zcell").length >= json.data.total){
                        endFlag = 1;
                        setTimeout(function(){
                            if($("#wrapper .scroller").height() > pageHeight)
                                $(".pullUp .pullUpLabel").html("没有更多数据了...").show();
                            else
                                $(".pullUp .pullUpLabel").html("没有更多数据了...").hide();
                        }, 100);
                    }else{
                        $(".pullUp .pullUpLabel").html("上拉加载更多...").show();
                    }
                }else{
                    endFlag = 1;
                    if($("#J_cards .zcell").length){
                        $(".pullUp .pullUpLabel").html("没有更多数据了...").show();
                        wrapper.refresh();
                    }else{
                        $(".pullUp .pullUpLabel").html("没有更多数据了...").hide();
                        showResDes(pageHeight);
                    }
                }

            }else{
                zuiAlert(json.message||"暂无药店药品列表");
                $(".pullUp .pullUpLabel").hide();
                showResDes(pageHeight);
            }
        }
        wrapper.refresh();
        unblockLoading();
    })
}