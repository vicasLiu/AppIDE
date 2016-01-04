/**
 * Created by liusiwei on 11/24/14.
 */
var APPIDE = APPIDE ? APPIDE : {};
(function(){
    var currentPage = '', currentModule = '', currentWidget = '', currentWidgetId = '';
    /*
    * 接收插件传递的数据
    */
    var getPlugValue = function() {

    };
    /*
    * 数据存储
    */
    var saveData = function( arg ) {

    };
    var subEvent = function( inst ) {
        APPIDE.Publisher.subscribe("savePlugConfig", function( msg ){
            inst.setValue( msg );
        }, inst);
        APPIDE.Publisher.subscribe("getValue", function(){
            inst.getValue();
        }, inst);
        APPIDE.Publisher.subscribe("saveData", function(){
            inst.saveData();
        }, inst);
        APPIDE.Publisher.subscribe("setModuleKey", function( msg ){
            inst.setModule( msg );
        }, inst);
        APPIDE.Publisher.subscribe("installPlugWidgetFinished", function( msg ){
//            console.info(msg);
            inst.setPlugWidget( msg );
        }, inst);
    };
    var Mode = function( pointer ) {
        this.$pointer = pointer;
        subEvent(this);
    };
    Mode.prototype = {
        constructor : Mode,
        init : function() {
            this.modeData = {};
        },
        getSubId : function() {
            return this.$pointer;
        },
        getActive : function() {
            return "true";
        },
        setValue : function( arg ) {
            currentWidgetId = arg.cid;
            currentWidget = arg.type;
            var value = arg.value;
            SETMODEDATA(currentPage,currentModule,currentWidget,value);
            var inst = this;
            inst.modeData = $.extend( true, {}, inst.modeData, value );
        },
        getValue : function() {

        },
        saveData : function() {
            APPIDE.Publisher.publish( "pushToResolve", this );
        },
        setModule : function( msg ) {
            currentPage = msg.page;
            currentModule = msg.module;
        },
        setPlugWidget : function( msg ) {
            currentWidget = msg.key;
            currentWidgetId = msg.id;
        }
    };
    APPIDE.Mode = Mode;
}());