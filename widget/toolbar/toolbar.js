/**
 * Created by liusiwei on 11/24/14.
 */
var APPIDE = APPIDE ? APPIDE : {};
if( !APPIDE.Widget ) {
    APPIDE.Widget = {};
}
(function(){
    var getDefaultOp= function() {
        var op = {
            show: true,
            render: "knd-header",
            id : "toolbar",
            ele:[
                {type:'title',text: 'TestLoading',show: true},
                {type: 'back', text: '返回',show: true},
                {type: 'confirm', text: '操作',show: true}
            ]
        };
        return op;
    };
    var View = function( inst ) {
        this.init = function( str ) {
            var data = inst.data;
            var name = data ? data["name"] : "Name";
            var value = data ? data["title"] : "Title";
            var id = "Toolbar-"+inst.cid;
            var css = data ? data.css : {};
            css = css ? css : {};
            var htm = '<div id="'+inst.componentId+'" data-cid="'+inst.componentId+'" class="body-widget appIde-toolbar">'+
                        '<div><span class="appIde-toolbar-span-l">返回</span><span class="appIde-toolbar-span-title">toolbar</span><span class="appIde-toolbar-span-r">操作</span></div>' +
                     ' </div>';
            $(htm).appendTo("#"+id).css(css);
        };
        this.loadConfig = function() {
            var self = this;
            $.ajax({
                url : "widget/toolbar/toolbar.json",
                dataType : "json",
                success : function( msg ) {
                    inst.toolbarConfig = msg;
                    self.init(msg.layout);
                    if(inst.data ==undefined) {
                        APPIDE.Publisher.publish( "loadPlugConfigFinished", msg, inst );
                        APPIDE.Publisher.publish( "setDefaultValue", {
                            id : inst.cid,
                            type : "Toolbar",
                            width : "100%",
                            height : 50,
                            top : 0,
                            left : 0
                        }, inst );
                        var defaultData = getDefaultOp();
                        defaultData["id"] = inst.cid;
                        APPIDE.Publisher.publish( "setValue", defaultData, inst );
                        APPIDE.Publisher.publish( "savePlugConfig", {
                            cid : inst.cid,
                            type : "Toolbar",
                            value : defaultData
                        }, inst );
                    }
                },
                error : function() {}
            });
        };
        this.refreshValue = function( arg ) {
            var cid = inst.componentId;
            for( var id in arg ) {
                $("#"+cid).find(".toolbar-"+id+"-value").html(arg[id]);
            }
        };
        this.refreshStyle = function( arg ) {
            var cid = inst.componentId;
            $("#"+cid).css(arg);
        };
    };
    var Control = function( inst ) {
        this.setValue = function( arg ) {
            var msg = getDefaultOp(arg);
            inst.mode.setValue(msg);
        };
        this.setStyle = function( arg ) {
            inst.mode.setStyle(arg);
        };
        this.getValue = function() {
            inst.mode.getValue();
        };
    };
    var Mode = function( inst ) {
        var toolbarData = null;
        var toolbarModeData = {};
        var cid = inst.componentId;
        this.setValue = function( arg ) {
            toolbarData = $.extend(true, {}, toolbarData, arg);
            toolbarModeData[cid] = toolbarData;
            toolbarModeData[cid].id = inst.cid;
            toolbarModeData[cid].type = "Toolbar";
            APPIDE.Publisher.publish( "savePlugConfig", {
                cid : cid,
                type : "Toolbar",
                value : toolbarModeData[cid]
            }, inst );
            inst.view.refreshValue(arg);
        };
        this.setStyle = function( arg ) {
            if( toolbarModeData[cid].css == undefined ) {
                toolbarModeData[cid].css = {};
            }
            toolbarModeData[cid].css = $.extend(true, {}, toolbarModeData[cid].css, arg);
            APPIDE.Publisher.publish( "savePlugConfig", {
                cid : cid,
                type : "Toolbar",
                value : toolbarModeData[cid]
            }, inst );
            inst.view.refreshStyle(arg);
        };
        this.getValue = function() {
            if( toolbarModeData[cid] == undefined ) {
                toolbarModeData[cid] = {};
            }
            var defaultData = getDefaultOp();
            toolbarModeData[cid] = $.extend(true,{},defaultData,toolbarModeData[cid]);
            APPIDE.Publisher.publish( "setValue", toolbarModeData[cid], inst );
        };
    };
    var subEvent = function( inst ) {
        APPIDE.Publisher.unsubscribe("setInputValue",inst);
        APPIDE.Publisher.unsubscribe("activePlug",inst);
        APPIDE.Publisher.subscribe("setInputValue", function( msg ){
            inst.setValue( msg );
        }, inst);
        APPIDE.Publisher.subscribe("setInputStyle", function( msg ){
            inst.setStyle( msg );
        }, inst);
        APPIDE.Publisher.subscribe("activePlug", function(){
            inst.reloadCon();
        }, inst);
    };
    var Toolbar = function( pointer ) {
        this.$pointer = pointer;
        subEvent(this);
    };
    Toolbar.prototype = {
        constructor : Toolbar,
        getSubId : function() {
            return this.$pointer;
        },
        getActive : function() {
            return this.$active;
        },
        setActive : function( flg ) {
            this.$active = flg + "";
        },
        setData : function( data ) {
            if( data != undefined ){
                this.data = data;
                this.control.setValue(data);
                if( data.css != undefined ) {
                    this.control.setStyle(data.css);
                }
            }
        },
        init : function() {
            this.view = new View( this );
            this.control = new Control( this );
            this.mode = new Mode( this );
            this.view.loadConfig();
        },
        setValue : function( arg ) {
            this.control.setValue(arg);
        },
        getValue : function() {
            this.control.getValue();
        },
        reloadCon : function() {
            var inst = this, msg = inst.toolbarConfig;
            APPIDE.Publisher.publish( "loadPlugConfigFinished", msg, inst );
            this.control.getValue();
        },
        setStyle : function( msg ) {
            this.control.setStyle(msg);
        }
    };
    APPIDE.Widget.Toolbar = Toolbar;
}());