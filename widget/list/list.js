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
            var id = "List-"+inst.cid;
            var css = data ? data.css : {};
            css = css ? css : {};
            var htm = '<div id="'+inst.componentId+'" data-cid="'+inst.componentId+'" class="body-widget">'+
                        '<ul>' + 
                            '<li class="list-name-value">'+name+'</li>'+
                            '<li class="list-title-value">'+value+'</li>'+
                            '<li class="list-name-value">'+name+'</li>'+
                        '</ul>' +
                     ' </div>';
            $(htm).appendTo("#"+id).css(css);
        };
        this.loadConfig = function() {
            var self = this;
            $.ajax({
                url : "widget/list/list.json",
                dataType : "json",
                success : function( msg ) {
                    inst.listConfig = msg;
                    self.init(msg.layout);
                    if(inst.data ==undefined) {
                        APPIDE.Publisher.publish( "loadPlugConfigFinished", msg, inst );
                    }
                },
                error : function() {}
            });
        };
        this.refreshValue = function( arg ) {
            var cid = inst.componentId;
            for( var id in arg ) {
                $("#"+cid).find(".list-"+id+"-value").html(arg[id]);
            }
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
        var listData = null;
        var listModeData = {};
        var cid = inst.componentId;
        this.setValue = function( arg ) {
            listData = $.extend(true, {}, listData, arg);
            listModeData[cid] = listData;
            listModeData[cid].id = inst.cid;
            listModeData[cid].type = "List";
            APPIDE.Publisher.publish( "savePlugConfig", {
                cid : cid,
                type : "List",
                value : listModeData[cid]
            }, inst );
            inst.view.refreshValue(arg);
        };
        this.setStyle = function( arg ) {
            if( listModeData[cid].css == undefined ) {
                listModeData[cid].css = {};
            }
            listModeData[cid].css = $.extend(true, {}, listModeData[cid].css, arg);
            APPIDE.Publisher.publish( "savePlugConfig", {
                cid : cid,
                type : "List",
                value : listModeData[cid]
            }, inst );
            inst.view.refreshStyle(arg);
        };
        this.getValue = function() {
            APPIDE.Publisher.publish( "setValue", listModeData[cid], inst );
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
    var List = function( pointer ) {
        this.$pointer = pointer;
        subEvent(this);
    };
    List.prototype = {
        constructor : List,
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
            var inst = this, msg = inst.listConfig;
            APPIDE.Publisher.publish( "loadPlugConfigFinished", msg, inst );
            this.control.getValue();
        },
        setStyle : function( msg ) {
            this.control.setStyle(msg);
        }
    };
    APPIDE.Widget.List = List;
}());