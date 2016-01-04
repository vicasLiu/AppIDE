/**
 * Created by liusiwei on 11/24/14.
 */
var APPIDE = APPIDE ? APPIDE : {};
if( !APPIDE.Widget ) {
    APPIDE.Widget = {};
}
(function(){
    var View = function( inst ) {
        this.init = function( str ) {
            var data = inst.data;
            var name = data ? data["name"] : "Name";
            var value = data ? data["title"] : "Title";
            var id = "Menu-"+inst.cid;
            var css = data ? data.css : {};
            css = css ? css : {};
            var htm = '<div id="'+inst.componentId+'" data-cid="'+inst.componentId+'" class="body-widget">'+
                '<ul>' +
                '<li class="menu-name-value">'+name+'</li>'+
                '<li class="menu-title-value">'+value+'</li>'+
                '<li class="menu-name-value">'+name+'</li>'+
                '</ul>' +
                ' </div>';
            $(htm).appendTo("#"+id).css(css);
        };
        this.loadConfig = function() {
            var self = this;
            $.ajax({
                url : "widget/menu/menu.json",
                dataType : "json",
                success : function( msg ) {
                    inst.menuConfig = msg;
                    self.init(msg.layout);
                    if(inst.data ==undefined) {
                        APPIDE.Publisher.publish( "loadPlugConfigFinished", msg, inst );
                    }
                },
                error : function() {}
            });
        };
        this.refreshValue = function( arg ) {

        };
        this.refreshStyle = function( arg ) {
            var cid = inst.componentId;
            $("#"+cid).css(arg);
        };
    };
    var Control = function( inst ) {
        this.setValue = function( arg ) {
            inst.mode.setValue(arg);
        };
        this.setStyle = function( arg ) {
            inst.mode.setStyle(arg);
        };
        this.getValue = function() {
            inst.mode.getValue();
        };
    };
    var Mode = function( inst ) {
        var menuData = null;
        var menuModeData = {};
        var cid = inst.componentId;
        this.setValue = function( arg ) {
            menuData = $.extend(true, {}, menuData, arg);
            menuModeData[cid] = menuData;
            menuModeData[cid].id = inst.cid;
            menuModeData[cid].type = "Menu";
            APPIDE.Publisher.publish( "savePlugConfig", {
                cid : cid,
                type : "Menu",
                value : menuModeData[cid]
            }, inst );
            inst.view.refreshValue(arg);
        };
        this.setStyle = function( arg ) {
            if( menuModeData[cid].css == undefined ) {
                menuModeData[cid].css = {};
            }
            menuModeData[cid].css = $.extend(true, {}, menuModeData[cid].css, arg);
            APPIDE.Publisher.publish( "savePlugConfig", {
                cid : cid,
                type : "Menu",
                value : menuModeData[cid]
            }, inst );
            inst.view.refreshStyle(arg);
        };
        this.getValue = function() {
            APPIDE.Publisher.publish( "setValue", menuModeData[cid], inst );
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
    var Menu = function( pointer ) {
        this.$pointer = pointer;
        subEvent(this);
    };
    Menu.prototype = {
        constructor : Menu,
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
            var inst = this, msg = inst.menuConfig;
            APPIDE.Publisher.publish( "loadPlugConfigFinished", msg, inst );
            this.control.getValue();
        },
        setStyle : function( msg ) {
            this.control.setStyle(msg);
        }
    };
    APPIDE.Widget.Menu = Menu;
}());