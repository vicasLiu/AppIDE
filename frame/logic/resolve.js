/**
 * Created by liusiwei on 12/4/14.
 */
var APPIDE = APPIDE ? APPIDE : {};
(function(){
    var subEvent = function( inst ) {
        APPIDE.Publisher.subscribe("pushToResolve", function( msg ){
            inst.setResolve( msg );
        }, inst);
    };
    var handleLayout = function() {
        var obj = {};
        for( var key in APPIDEMODEDATA ) {
            var temp = APPIDEMODEDATA[key];
            for(var _key in temp ) {
                var module = temp[_key];
                var layout = module.Layout;
                var ele = [];
                obj.Layout = {};
                obj.Layout.show = true;
                obj.Layout.render = "body";
                obj.Layout.id = "layout1";
                for( var i = 0; i < layout.length; i++ ) {
                    var _temp = layout[i];
                    var _obj = null;
                    _obj = {};
                    _obj.render = _temp.render;
                    _obj.css = _temp.css;
                    ele.push(_obj);
                }
                obj.Layout.ele = ele;
            }
        }
        return obj;
    };
    var handleMsg = function() {
        var obj = handleLayout();
        for( var key in APPIDEMODEDATA ) {
            var temp = APPIDEMODEDATA[key];
            for(var _key in temp ) {
                var module = temp[_key];
                for( var wkey in module ) {
                    if( wkey != "Layout" ) {
                        if( obj[wkey] == undefined ) {
                            obj[wkey] = [];
                        }
                        var wMsg = module[wkey];
                        for( var i = 0; i < wMsg.length; i++ ) {
                            var _wmsg = wMsg[i];
                            _wmsg.render = wkey + "-" + _wmsg.id;
                            obj[wkey].push(_wmsg);
                        }
                    }
                }
            }
        }
        var str = '$(function(){'+
            'var page = new KND.Page();'+
            'page.config({'+
            '    jsbase: "../../public/",'+
            '    cssbase: "../../public/"'+
            '});'+
            'page.Ready(function(loginInfo){'+
            'var op = ';
        str += JSON.stringify(obj)+";";
        str +='        page.setOptions(op,"BIDemo", "BIDemo", "BIDemo");'+
            '    });'+
            '});';
        console.info(str);
//        $.ajax({
//            url : "http://192.168.14.117:8080//platform/api/js/test1",
//            type : "POST",
//            data : {
//                content : str
//            },
//            success : function( jsMsg ) {
//                console.info(jsMsg);
//            }
//        });
    };
    var Resolve = function( pointer ) {
        this.$pointer = pointer;
        subEvent(this);
    };
    Resolve.prototype = {
        constructor : Resolve,
        init : function() {

        },
        getSubId : function() {
            return this.$pointer;
        },
        getActive : function() {
            return "true";
        },
        setResolve : function() {
            handleMsg();
        }
    };
    APPIDE.Resolve = Resolve;
}());