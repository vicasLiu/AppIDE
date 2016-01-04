/**
 * Created by liusiwei on 11/24/14.
 */
var APPIDE = APPIDE ? APPIDE : {};
(function(){
    var layoutObj = [], currentPage = '', currentModule = '', currentWidgetData = null;
    /*
    * 获取当前的Layout
    */
    var getCurrentLayout = function( id ) {
        var pg = APPIDEMODEDATA[currentPage];
        var md = pg[currentModule];
        var ly = md.Layout;
        if(ly == undefined) {
            return;
        }
        var obj = null;
        for( var i = 0; i < ly.length; i++ ) {
            if( ly[i].render == id ) {
                obj = ly[i];
                break;
            }
        }
        return obj;
    };
    /*
    * 获取当前改变的值
    */
    var resolvePlugConfig = function( msg, inst ) {
        currentWidgetData = msg.data;
        var __createHtm = function( type, id, parent ) { 
            if( !parent ) {
                parent = null;
            }
            var htm = '';
            switch( type ) {
                case 'select':
                    htm += '<span class="appIde-select"><input config-attr="'+ id +'" config-type="string" parent-type="'+ parent +'" /><span class="appIde-select-panel"></span><a class="appIde-select-btn" href="javascript:void(0);"><span class="imgItem"><span></a></span>';
                    break;
                case "string":
                    htm += '<input type="text" config-attr="'+ id +'" config-type="string" parent-type="'+ parent +'" />';
                    break;
                case "int":
                    htm += '<input type="text" config-attr="'+ id +'" config-type="int" parent-type="'+ parent +'" />';
                    break;
                case "boolean":
                    htm += '<input type="radio" style="margin-top: 6px;" config-attr="'+ id +'" config-type="boolean" parent-type="'+ parent +'" />';
                    break;
                case "textarea":
                    htm += '<textarea config-attr="'+ id +'" config-type="textarea" parent-type="'+ parent +'"></textarea>';
                    break;
                case "function":
                    htm += '<textarea config-attr="'+ id +'" config-type="function" parent-type="'+ parent +'"></textarea>';
                    break;
            }
            return htm;
        };
        var __resolveAttr = function() {
            var attr = msg.attr;
            var htm = '';
            for( var key in attr ) {
                var type = attr[key];
                if(APPIDE.Util.isObject(type)) {
	                htm += '<li class="hasGroup" parent="'+key+'"><p><label class="group-title">'+key+'</label>';
                    for( var _key in  type ) {
                        var _type = type[_key];
						var groupHtml = '<p>' + __createHtm(_type, _key, key) + '<label>' + _key + '</label></p>';
                        htm += groupHtml;
                    }
                }else{
					htm += '<li parent="'+key+'"><p><label>'+key+'</label>';
                    htm += __createHtm(type, key);
                }
            }
            htm += '</p></li>';
			htm = '<ul>' + htm + '</ul>';
            $('#appIde-sidebar-r-attrAreaList-attr form').html(htm);
        };
        var __resolveCss = function() {
            var cssObj = msg.css;
            var htm = '';
            for( var key in cssObj ) {
                var type = cssObj[key];
                htm += '<p><label>'+key+'</label>';
                if( APPIDE.Util.isObject(type) ) {
                    for( var _key in  type ) {
                        var _type = type[_key];
                        htm += __createHtm(_type, _key, key);
                    }
                }else{
                    htm += __createHtm(type, key);
                }
                htm += '</p>';
            }
            $("#appIde-sidebar-r-attrAreaList-style form").html(htm);
        };
        var __resolveEvent = function() {};
        var __init = function() {
            $('#ide-right').empty();
            __resolveAttr();
            __resolveCss();
            __resolveEvent();
            bindEvent(inst);
        };
        __init();
    };
    /*
    * 绑定事件
    */
    var bindEvent = function(inst) {
        $('.body-widget').jqdrag({
            type:'y',
            minY:0,
            onbeforedrag:function(){
            },
            ondragend:function( dis ){
                var id = $(this).parent().attr("id");
                changeLayout(id, {
                    x : $(this).position().left,
                    y : $(this).position().top
                });
            },
            ondrag:function(dis,loc){

            }
        });
        $(".widget-attr-config").on("keyup", "input", function() {
            var key = $(this).attr("config-attr");
            var type = $(this).attr("config-type");
            var p = $(this).attr("parent-type");
            var value = $(this).val();
            if( type == "int" || type == "boolean" ) {
                value = "$$" + value + "$$";
            }
            var obj = {
                attr : key,
                type : type,
                parent : p,
                value : value
            };
            APPIDE.Publisher.publish("setAttrValue", obj, inst);
        });
        $(".widget-style-config").on("keyup", "input", function() {
            var key = $(this).attr("config-attr");
            var type = $(this).attr("config-type");
            var p = $(this).attr("parent-type");
            var value = $(this).val();
            var obj = {
                attr : key,
                type : type,
                parent : p,
                value : value
            };
            APPIDE.Publisher.publish("setStyleValue", obj, inst);
        });
        $(".widget-attr-config").off("click", ".appIde-select").on("click", ".appIde-select", function() {
            var dom = $(this).find("input");
            var key = dom.attr("config-attr");
            var p = dom.attr("parent-type");
            var data = [];
            if( p == "null" ) {
                data = currentWidgetData[key];
            }else{
                data = currentWidgetData[p][key];
            }
            createSelectPanel(data);
        });
    };
    /*
    * 创建下拉选择框
    */
    var createSelectPanel = function( data ) {

    };
    /*
    * 改变layout
    */
    var changeLayout = function( id, dis ) {
        var obj = getCurrentLayout(id);
        if( obj != null ) {
            obj.css = $.extend(true,{},obj.css,{
                left : dis.x +"px",
                top : dis.y + "px"
            });
            setCssValue(obj.css);
        }
    };
    /*
    * 设置当前View属性的值
    */
    var setAttrValue = function( msg ) {
        var pEls = $(".widget-attr-config").find("li");
        for( var i = 0; i < pEls.length; i++ ) {
            var parent = $(pEls[i]).attr("parent");
            if( msg[parent] ) {
                var temp = msg[parent];
                var inputEls = $(pEls[i]).find("input");
                for( var j = 0; j < inputEls.length; j++ ) {
                    var attr = $(inputEls[j]).attr("config-attr");
                    if( APPIDE.Util.isObject(temp) && (temp[attr] || temp[attr] == '') ) {
                        $(inputEls[j]).val(temp[attr]);
                    }else{
                        $(inputEls[j]).val(temp);
                    }
                }
            }
        }
    };
    /*
    * 设置当前View样式的值
    */
    var setCssValue = function( msg ) {
        if( msg == undefined ) {
            return;
        }
        var inputEls = $(".widget-style-config").find("input");
        for( var cssKey in msg ) {
            for( var i = 0; i < inputEls.length; i++ ) {
                var tempEl = $(inputEls[i]);
                if( tempEl.attr("config-attr") == cssKey ) {
                    tempEl.val(msg[cssKey]);
                }
            }
        }
    };
    /*
    * 订阅方法
    */
    var subEvent = function( inst ) {
        APPIDE.Publisher.subscribe("loadPlugConfigFinished", function( msg ){
            resolvePlugConfig( msg, inst );
        }, inst);
        APPIDE.Publisher.subscribe("setValue", function( msg ){
            inst.setValue( msg );
        }, inst);
        APPIDE.Publisher.subscribe("addWidgetLayout", function( msg ){
            inst.addLayout( msg );
        }, inst);
        APPIDE.Publisher.subscribe("saveData", function(){
            inst.saveData();
        }, inst);
        APPIDE.Publisher.subscribe("deletePlug", function( msg ){
            inst.deLayout( msg );
        }, inst);
        APPIDE.Publisher.subscribe("setModuleKey", function( msg ){
            inst.setModuleKey( msg );
        }, inst);
        APPIDE.Publisher.subscribe("setDefaultValue", function( msg ){
            inst.setDefaultValue( msg );
        }, inst);
        APPIDE.Publisher.subscribe("changeLayoutCss", function( msg ){
            inst.setStyle( msg );
        }, inst);
    };
    var View = function( pointer ) {
        this.$pointer = pointer;
        subEvent(this);
    };
    View.prototype = {
        constructor :View,
        init : function( msg ) {

        },
        getSubId : function() {
            return this.$pointer;
        },
        getActive : function() {
            return "true";
        },
        setValue : function( arg ) {
            if( arg == undefined ) {
                return;
            }
            setAttrValue(arg);
            setCssValue(arg.css)
        },
        setStyle : function( msg ) {
            var id = msg.type + "-" + msg.id;
            var obj = getCurrentLayout(id);
            obj.css = $.extend(true,{},obj.css,msg.css);
        },
        addLayout : function( msg ) {
            if( msg.type == "DataComponent" ) {
                return;
            }
            var CM = this.currentModule;
            var id = msg.type+"-"+msg.id;
            var obj = getCurrentLayout(id);
            var lobj = {
                page : CM.page,
                module : CM.module,
                id : "Layout"+msg.id,
                widgetId : msg.id,
                render : id,
                css : obj ? obj.css : {}
            };
            layoutObj.push(lobj);
            SETMODEDATA(CM.page,CM.module,"Layout",lobj, "Layout"+msg.id);
            if($("#"+id).length > 0) {
                return;
            }
            var htm = '<div style="position:absolute;left:0px;top:0px; width: 100%;" id="'+(id)+'"></div>';
            $(htm).appendTo("#ide-body-content").css(lobj.css);
        },
        deLayout : function( cid ) {
            var page = cid.split("-")[0];
            var wId = cid.split("-")[1] + "-" + cid.split("-")[2];
            for( var i = 0; i < layoutObj.length; i++ ) {
                var temp = layoutObj[i];
                if( temp.page == page && temp.widgetId == wId ) {
                    layoutObj.splice(i,1);
                }
            }
            var pg = APPIDEMODEDATA[currentPage];
            var md = pg[currentModule];
            var layout = md["Layout"];
            if( layout == undefined ) {
                return;
            }
            for( var i = 0; i < layout.length; i++ ) {
                var temp = layout[i];
                if(temp.widgetId == wId) {
                    layout.splice(i,1);
                }
            }
        },
        saveData : function() {
            APPIDE.Publisher.publish( "pushLayout", layoutObj, this );
        },
        setModuleKey : function( msg ) {
            this.currentModule = msg;
            currentPage = msg.page;
            currentModule = msg.module;
        },
        setDefaultValue : function( msg ) {
            var id = msg.type + "-" + msg.id;
            var obj = getCurrentLayout(id);
            obj.css = {
                width : msg.width,
                height : msg.height,
                top : msg.top,
                left : msg.left
            };
            setCssValue({
                width : msg.width,
                height : msg.height,
                top : msg.top,
                left : msg.left
            });
        }
    };
    APPIDE.View = View;
}());