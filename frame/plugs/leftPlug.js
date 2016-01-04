/**
 * Created by liusiwei on 12/10/14.
 */
var APPIDE = APPIDE ? APPIDE : {};
(function(){
    var modeTemp = {}, currentPage = '', currentModule = '', currentWidget = '';
    /*
     * 插件布局
     */
    var renderPlugs = function( msg ) {
        var htm = '';
        for( var key in msg ) {
            var className = "widget-"+key;
            htm += '<li id="'+key+'" class="widget-list '+className+'" widget-type="'+key+'">'+msg[key].text+'</li>';
        }
        $(htm).appendTo("#ide-left-widget");
    };
    /*
    * 加载插件列表
    */
    var loadPlug = function( cb ) {
        $.ajax({
            url : "frame/config/widget.json",
            dataType : "json",
            success : function( msg ) {
                renderPlugs(msg);
                if($.isFunction(cb)) {
                    cb();
                }
            }
        });
    };

    /*
     * 渲染模块
     */
    var renderModule = function( msg ) {
        var div = '';
        for( var key in msg ) {
            var temp = msg[key];
            div += '<li id="'+key+'"><span style="float: right;" class="addModule">+</span>'+key;
            div += '<ul class="sub-li">';
            for( var _key in temp ) {
                var id = key+"|"+_key;
                div += '<li class="ide-module" id="'+id+'">'+_key+'</li>';
            }
            div += '</ul></li>';
        };
        $("#ide-left-module").html(div);
    };
    /*
    * 绑定事件
    */
    var bindEvent = function( inst ) {
        $('body').off('click', '.widget-list').on('click', '.widget-list', function(){
            var type = $(this).attr("widget-type");
            currentWidget = type;
            APPIDE.Publisher.publish("installPlugWidget", {key:type}, inst); //插件安装方法
        });
        $('body').off('click','.ide-module').on('click','.ide-module', function(){
            var id = $(this).attr("id");
            var arr = id.split("|");
            if( currentPage == arr[0] && currentModule == arr[1] ) {
                return;
            }
            currentModule = arr[1];
            currentPage = arr[0];
            $("#ide-body-content").empty();
            $("#ide-right").empty();
            APPIDE.Publisher.publish("setModuleKey", {
                page : arr[0],
                module : arr[1]
            }, inst);
        });
    };
    var subEvent = function( inst ) {
        APPIDE.Publisher.subscribe("addPage", function( key ){
            inst.addPage(key);
        }, inst);
        APPIDE.Publisher.subscribe("addModule", function( key ){
            inst.addModule(key);
        }, inst);
        APPIDE.Publisher.subscribe("installModule", function( msg ){
            inst.renderModule(msg);
        }, inst);
    };
    var LeftPlug = function( pointer ) {
        this.$pointer = pointer;
        subEvent(this);
        this.init();
    };
    LeftPlug.prototype = {
        constructor : LeftPlug,
        init : function() {
            var inst = this;
            loadPlug(function(){
                bindEvent(inst);
            });
        },
        getSubId : function() {
            return this.$pointer;
        },
        getActive : function() {
            return "true";
        },
        renderModule : function( msg ) {
            modeTemp = msg;
            renderModule(msg, this);
        },
        addPage : function( key ) {
            modeTemp[key] = {};
            modeTemp[key] = {};
            currentPage = key;
        },
        addModule : function( key ) {
            currentModule = key;
            modeTemp[currentPage][key] = {};
            renderModule(modeTemp, this);
            APPIDE.Publisher.publish("setModuleKey", {
                page : currentPage,
                module : key
            }, this);
        }
    };
    APPIDE.LeftPlug = LeftPlug;
}());