/**
 * Created by liusiwei on 12/10/14.
 */
var APPIDE = APPIDE ? APPIDE : {};
(function(){
    var componentsList = {}
        , widgetIndex = {}
        , currentPage = ''
        , currentModule = ''
        , widgetTypes = []
        , currentCid = ''
        ;
    var getScript = function( url, type, callback ) {
        if($.inArray(type,widgetTypes)!=-1) {
            if(callback) {
                callback.call();
            }
            return;
        }
        var arr = url.split("/");
        var id = arr[arr.length-1].split(".")[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.language = 'javascript';
        script.id = "script-"+id;
        script.src = url;
        script.onload = script.onreadystatechange = function(){
            if ((!script.readyState || script.readyState == 'loaded' || script.readyState == 'complete')){
                script.onload = script.onreadystatechange = null;
                if (callback){
                    callback.call();
                    widgetTypes.push(type);
                }

            }
        };
        document.getElementsByTagName("head")[0].appendChild(script);
    };
    /*
    * 获取插件样式
    */
    var getCss = function( url, type ) {
        if( $("."+type+"css").length > 0 ) {
            return;
        }
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.media = 'screen';
        link.href = url;
        link.id = type+'css';
        document.getElementsByTagName('head')[0].appendChild(link);
    };
    /*
     * 注册插件
     */
    var registerPlug = function( type, data, inst ) {
        var __createPlug = function( index__, _data ) {
            var plug = null, plugId = index__;
            plugId = currentPage+"-"+plugId;
            if( componentsList[plugId] == undefined ) {
                plug = new APPIDE.Widget[type](inst.$pointer);
            }else{
                plug = componentsList[plugId];
            }
            plug.componentId = plugId;
            plug.cid = index__;
            //plug.subId = inst.componentId;
            componentsList[plugId] = plug;
            APPIDE.Publisher.publish( "addWidgetLayout", {
                type : type,
                id : index__
            }, inst );
            plug.init();
            var pg = APPIDEMODEDATA[currentPage];
            var md = pg[currentModule];
            if( md[plugId] ) {
                _data = md[plugId];
            }
            plug.setData(_data);
            return plugId;
        };
        var __createCID = function( cid ) {
            var ids = cid.split("-");
            var _index = Number(ids[1]);
            var _type = ids[0];
            var id = cid;
            var _cid = currentPage+"-"+cid;
            while( componentsList[_cid] != undefined ) {
                _index++;
                id = _type+"-"+_index;
                _cid = currentPage+"-"+id;
            }
            return id;
        };
        var index = null;
        var plugId = "";
        if( data == undefined ) {
            if( widgetIndex[type] == undefined ) {
                widgetIndex[type] = 1;
            }else{
                widgetIndex[type]++;
            }
            index = type.toLowerCase()+"-"+widgetIndex[type];
            index = __createCID(index);
            plugId = __createPlug(index);
            SETMODEDATA(currentPage,currentModule,type,{id:index},index);
        }else{
            for( var i = 0; i < data.length; i++ ) {
                var temp = data[i];
                index = temp.id;
                plugId = __createPlug(index, temp);
                SETMODEDATA(currentPage,currentModule,type,temp,index);
            }
        }
        return plugId;
    };
    /*
     * 加载插件
     */
    var loadPlug = function( type, data, inst ) {
        var _type = type.toLowerCase();
        var url = "widget/"+_type+"/"+_type+".js";
        getCss("widget/"+_type+"/"+_type+".css");
        getScript(url, type, function(){
            var plugId = registerPlug(type, data, inst);
            setPlugActive( plugId );
            APPIDE.Publisher.publish("installPlugWidgetFinished", {key:type,id:plugId}, inst);
        });
    };
    /*
     * 设置插件的激活状态值
     */
    var setPlugActive = function( cid ) {
        for( var key in componentsList ) {
            var com = componentsList[key];
            if( key != cid ) {
                com.setActive(false);
            }else{
                com.setActive(true);
            }
        }
    };
    /*
     * 解析模板
     */
    var resolveTpl = function( msg, inst ) {
        for( var key in msg ) {
            if( key != "Layout" ) {
                inst.installPlug({key:key,data:msg[key]});
            }
        }
    };
    /*
     * 生成页面
     */
    var renderPage = function( msg ) {
        if( msg == undefined ) {
            return;
        }
        var div = '';
        for( var i = 0; i < msg.length; i++ ) {
            var temp = msg[i];
            var cssStr = APPIDE.Util.resolveCss(temp.css);
            div += '<div id="'+temp.id+'" style="'+cssStr+'"></div>';
        }
        $(div).appendTo("#ide-body-content");
    };
    /*
    * 移除组件
    */
    var removePlug = function( id, inst ) {
        var __removeDom = function() {
            $("#"+id).parent().remove();
        };
        var __removeData = function() {
            var pg = APPIDEMODEDATA[currentPage];
            var md = pg[currentModule];
            var pid = $("#"+id).parent().attr("id");
            var type = pid.split("-")[0];
            var widgets = md[type];
            var wId = id.split("-")[1] + "-" + id.split("-")[2];
            for( var i = 0; i < widgets.length; i++ ) {
                var temp = widgets[i];
                if( temp.id == wId ) {
                    widgets.splice(i,1);
                }
            }
        };
        var __removeId = function() {
            delete componentsList[id];
        };
        var __remove = function() {
            __removeData();
            __removeId();
            __removeDom();
        };
        __remove();
        APPIDE.Publisher.publish( "deletePlug", id, inst );
    };
    /*
    * 绑定事件
    */
    var bindEvent = function( inst ) {
        $('body').off('click', '.body-widget').on('click', '.body-widget', function(){
            var cid = $(this).attr("data-cid");
            if( currentCid == cid ) {
                return;
            }
            currentCid = cid;
            setPlugActive(cid);
            inst.reloadPlug();
        });
        $('body').off('click', '.div-widget-remove').on('click', '.div-widget-remove', function(){
            var cid = $(this).parent().attr("data-cid");
            removePlug(cid, inst);
        });
        $('body').off('mousemove', '.body-widget').on('mousemove', '.body-widget', function(){
            if( $(".div-widget-remove").length > 0 ) {
                return;
            }
            var htm = '<div style="position: absolute;" class="div-widget-remove">X</div>';
            $(htm).css({
                left : 0,
                top : 0,
                "z-index" : 100
            }).appendTo($(this));
        });
        $('body').off('mouseout', '.body-widget').on('mouseout', '.body-widget', function(e){
            if($(e.toElement).hasClass("div-widget-remove")) {
                return;
            }
            $(".div-widget-remove").remove();
        });
    };
    var subEvent = function( inst ) {
        APPIDE.Publisher.subscribe("installPlugWidget", function( msg ){
            inst.installPlug(msg);
        }, inst);
        APPIDE.Publisher.subscribe("setClickWidget", function( id ){
            setPlugActive(id);
            inst.reloadPlug();
        }, inst);
        APPIDE.Publisher.subscribe("setClickWidget", function( id ){
            setPlugActive(id);
            inst.reloadPlug();
        }, inst);
        APPIDE.Publisher.subscribe("setModuleKey", function( msg ){
            inst.setModule(msg);
        }, inst);
    };
    var BodyPlug = function( pointer ) {
        this.$pointer = pointer;
        subEvent(this);
        this.init();
    };
    BodyPlug.prototype = {
        constructor : BodyPlug,
        init : function() {
            bindEvent(this);
        },
        getSubId : function() {
            return this.$pointer;
        },
        getActive : function() {
            return this.$active;
        },
        setActive : function( flg ) {
            this.$active = flg +"";
        },
        installPlug : function(msg) {
            loadPlug( msg.key, msg.data, this );
        },
        reloadPlug : function() {
            APPIDE.Publisher.publish( "activePlug", this );
        },
        setModule : function( msg ) {
            currentPage = msg.page;
            currentModule = msg.module;
            if( APPIDEMODEDATA[msg.page] == undefined ) {
                APPIDEMODEDATA[msg.page] = {};
            }
            if( APPIDEMODEDATA[msg.page][msg.module] == undefined ) {
                APPIDEMODEDATA[msg.page][msg.module] = {};
            }
            renderPage(APPIDEMODEDATA[msg.page][msg.module]);
            resolveTpl(APPIDEMODEDATA[msg.page][msg.module], this);
        }
    };
    APPIDE.BodyPlug = BodyPlug;
}());