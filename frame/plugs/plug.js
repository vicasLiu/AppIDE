/**
 * Created by liusiwei on 11/24/14.
 */
var APPIDE = APPIDE ? APPIDE : {};
(function(){
    var componentsList = {}
        , lPlug = null  //左边插件
        , rPlug = null  //右边插件
        , bPlug = null  //中间插件
        ;
    /*
    * 设置插件的激活状态
    */
    var setActive = function( key ) {
        for( var ky in componentsList ) {
            var temp = componentsList[ky];
            if( ky == key ) {
                temp.setActive(true);
            }else{
                temp.setActive(false);
            }
        }
    };
    /*
     * 加载模板
     */
    var loadTpl = function( url, cb ) {
        $.ajax({
            url : url,
            dataType : "json",
            success : function( msg ) {
                if($.isFunction(cb)) {
                    cb(msg);
                }
            }
        });
    };
    /*
    * 移除插件
    */
    var removePlug = function() {

    };
    var subEvent = function( inst ) {
        APPIDE.Publisher.subscribe("addPage", function( msg ){
            inst.initBodyPlug(msg);
        }, inst);
        APPIDE.Publisher.subscribe("importModule", function( url ){
            inst.importModule(url);
        }, inst);
    };
    var Plugs = function( pointer ) {
        this.$pointer = pointer;
        subEvent(this);
        this.init();
    };
    Plugs.prototype = {
        constructor : Plugs,
        init : function() {
            lPlug = new APPIDE.LeftPlug(this.$pointer);
        },
        getSubId : function() {
            return this.$pointer;
        },
        getActive : function() {
            return "true";
        },
        initBodyPlug : function( key ) {
            bPlug = new APPIDE.BodyPlug(this.$pointer);
            bPlug.componentId = key;
            componentsList[key] = bPlug;
            setActive(key);
        },
        importModule : function( url ) {
            var inst = this;
            loadTpl(url, function(msg){
                APPIDEMODEDATA = msg;
                for( var key in msg ) {
                    inst.initBodyPlug(key);
                }
                APPIDE.Publisher.publish("installModule", msg, inst);
            });
        }
    };
    APPIDE.Plugs = Plugs;
}());