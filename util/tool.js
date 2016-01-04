/**
 * Created by liusiwei on 11/24/14.
 */
var APPIDE = APPIDE ? APPIDE : {};
APPIDE.Util = {
    createId : function() {
        var jschars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F',
            'G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        var res = "";
        for(var i = 0; i < 10 ; i ++) {
            var id = Math.ceil(Math.random()*35);
            res += jschars[id];
        }
        return res;
    },
    resolveCss : function( css ) {
        var strCss = '';
        for( var i in css ) {
            strCss += i+':'+css[i]+";";
        }
        return strCss;
    },
    isEmptyObject : function( obj ) {
        for(var n in obj){
            return false;
        }
        return true;
    },
    isArray : function(o){
        var ots = Object.prototype.toString;
        return o && (o.constructor === Array || ots.call(o) === "[object Array]");
    },
    isObject : function(o) {
        var ots = Object.prototype.toString;
        return o && (o.constructor === Object || ots.call(o) === "[object Object]");
    },
    isBoolean : function(o) {
        return (o === false || o) && (o.constructor === Boolean);
    },
    isNumber : function(o) {
        return (o === 0 || o) && o.constructor === Number;
    },
    isUndefined : function(o) {
        return typeof(o) === "undefined";
    },
    isNull : function(o) {
        return o === null;
    },
    isFunction : function(o) {
        return o && (o.constructor === Function);
    },
    testFn : function() {
        alert("test");
    }
};