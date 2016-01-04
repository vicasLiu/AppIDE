/**
 * Created by liusiwei on 11/24/14.
 */
var APPIDE = APPIDE ? APPIDE : {};
if( !APPIDE.Widget ) {
    APPIDE.Widget = {};
}
(function(){
    var resolveData = function( msg ) {
        var dObj = {
            show: true,
            id: "listDataCp"
        };
        var obj = $.extend(true, {}, dObj, msg);
        return obj;
    };
    var View = function( inst ) {
        this.init = function() {
            var data = inst.data;
            var name = data ? data["name"] : "Name";
            var value = data ? data["title"] : "Title";
            var id = "DataComponent-"+inst.cid;
            var css = data ? data.css : {};
            css = css ? css : {};
            var htm = '<div id="'+id+'">' +
                '<div id="'+inst.componentId+'" data-cid="'+inst.componentId+'" class="body-widget appIde-dataComponent">'+
                '<img src="img/02.png" />'+
                ' </div></div>';
            $(htm).appendTo("#ide-main-dataArea").css(css);
        };
        this.loadConfig = function() {
            var self = this;
            $.ajax({
                url : "widget/datacomponent/datacomponent.json",
                dataType : "json",
                success : function( msg ) {
                    inst.datacomponentConfig = msg;
                    self.init(msg.layout);
                    if(inst.data ==undefined) {
                        APPIDE.Publisher.publish( "loadPlugConfigFinished", msg, inst );
                        var defaultData = resolveData({});
                        defaultData["id"] = inst.cid;
                        APPIDE.Publisher.publish( "setValue", defaultData, inst );
                        APPIDE.Publisher.publish( "savePlugConfig", {
                            cid : inst.cid,
                            type : "DataComponent",
                            value : defaultData
                        }, inst );
                    }
                },
                error : function() {}
            });
        };
    };
    var Control = function( inst ) {
        this.setValue = function( arg ) {
            var msg = resolveData(arg);
            inst.mode.setValue(msg);
        };
        this.getValue = function() {
            inst.mode.getValue();
        };
    };
    var Mode = function( inst ) {
        var datacomponentData = null;
        var datacomponentModeData = {};
        var cid = inst.componentId;
        this.setValue = function( arg ) {
            datacomponentData = $.extend(true, {}, datacomponentData, arg);
            datacomponentModeData[cid] = datacomponentData;
            datacomponentModeData[cid].id = inst.cid;
            datacomponentModeData[cid].type = "DataComponent";
            APPIDE.Publisher.publish( "savePlugConfig", {
                cid : cid,
                type : "DataComponent",
                value : datacomponentModeData[cid]
            }, inst );
        };
        this.getValue = function() {
            if( datacomponentModeData[cid] == undefined ) {
                datacomponentModeData[cid] = {};
            }
            var defaultData = resolveData({});
            datacomponentModeData[cid] = $.extend(true,{},defaultData,datacomponentModeData[cid]);
            APPIDE.Publisher.publish( "setValue", datacomponentModeData[cid], inst );
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
    var DataComponent = function( pointer ) {
        this.$pointer = pointer;
        subEvent(this);
    };
    DataComponent.prototype = {
        constructor : DataComponent,
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
            var inst = this, msg = inst.datacomponentConfig;
            APPIDE.Publisher.publish( "loadPlugConfigFinished", msg, inst );
            this.control.getValue();
        },
        setStyle : function( msg ) {
            this.control.setStyle(msg);
        }
    };
    APPIDE.Widget.DataComponent = DataComponent;
}());