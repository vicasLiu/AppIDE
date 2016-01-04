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
            id: 'table',
            render: 'table-page',
            tableOp : {
                tHead : [{key : "count", value : "金额总计"}],
                tBody : [{key : "id", value : "ID"}, {key : "name", value : "名称"},{key : "date", value : "日期"}],
                tFooter : [{key : "note", value : "备注"}]
            },
            data : {
                header : [{"count" : "1000000万"}],
                body : [
                    {"id" : "1", "name" : "名称", "date" : "日期"},
                    {"id" : "1", "name" : "名称", "date" : "日期"},
                    {"id" : "1", "name" : "名称", "date" : "日期"},
                    {"id" : "1", "name" : "名称", "date" : "日期"},
                    {"id" : "1", "name" : "名称", "date" : "日期"}
                ],
                footer : [{"note" : "备注"}]
            }
        };
        return op;
    };
    var resolveTableData = function( arg ) {
        var msg = getDefaultOp();
        var type = arg["type"];
        return msg;
    };
    var View = function( inst ) {
        this.init = function() {
            var data = inst.data;
            var name = data ? data["name"] : "Name";
            var id = "Table-"+inst.cid;
            var css = data ? data.css : {};
            css = css ? css : {};
            var htm = '<div id="'+inst.componentId+'" data-cid="'+inst.componentId+'" class="body-widget appIde-table">'+
                        '<table>' + 
                            '<tr><th>Id</th><th>Date</th><th>Sex</th><th>Age</th></tr>' +
                            '<tr><td>1</td><td>2014-02-13</td><td>female</td><td>21</td></tr>' +
                            '<tr><td>1</td><td>2014-02-13</td><td>female</td><td>21</td></tr>' +
                            '<tr><td>1</td><td>2014-02-13</td><td>female</td><td>21</td></tr>' +
                            '<tr><td>1</td><td>2014-02-13</td><td>female</td><td>21</td></tr>' +
                            '<tr><td>1</td><td>2014-02-13</td><td>female</td><td>21</td></tr>' +
                            '<tr><td>1</td><td>2014-02-13</td><td>female</td><td>21</td></tr>' +
                            '<tr><td>1</td><td>2014-02-13</td><td>female</td><td>21</td></tr>' +
                        '</table>' +
                     ' </div>';
            $(htm).appendTo("#"+id).css(css);
        };
        this.loadConfig = function() {
            var self = this;
            $.ajax({
                url : "widget/table/table.json",
                dataType : "json",
                success : function( msg ) {
                    inst.tableConfig = msg;
                    self.init();
                    if(inst.data ==undefined) {
                        APPIDE.Publisher.publish( "loadPlugConfigFinished", msg, inst );
                        APPIDE.Publisher.publish( "setDefaultValue", {
                            id : inst.cid,
                            type : "Table",
                            width : "100%",
                            height : "auto",
                            top : 0,
                            left : 0
                        }, inst );
                        var defaultData = getDefaultOp();
                        defaultData["id"] = inst.cid;
                        APPIDE.Publisher.publish( "setValue", defaultData, inst );
                        APPIDE.Publisher.publish( "savePlugConfig", {
                            cid : inst.cid,
                            type : "Table",
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
                $("#"+cid).find(".table-"+id+"-value").html(arg[id]);
            }
        };
        this.refreshStyle = function( arg ) {
            var cid = inst.componentId;
            $("#"+cid).css(arg);
        };
    };
    var Control = function( inst ) {
        this.setValue = function( arg ) {
            var msg = resolveTableData(arg);
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
        var tableData = null;
        var tableModeData = {};
        var cid = inst.componentId;
        this.setValue = function( arg ) {
            tableData = $.extend(true, {}, tableData, arg);
            tableModeData[cid] = tableData;
            tableModeData[cid].id = inst.cid;
            tableModeData[cid].type = "Table";
            APPIDE.Publisher.publish( "savePlugConfig", {
                cid : cid,
                type : "Table",
                value : tableModeData[cid]
            }, inst );
            inst.view.refreshValue(arg);
        };
        this.setStyle = function( arg ) {
            if( tableModeData[cid].css == undefined ) {
                tableModeData[cid].css = {};
            }
            tableModeData[cid].css = $.extend(true, {}, tableModeData[cid].css, arg);
            APPIDE.Publisher.publish( "savePlugConfig", {
                cid : cid,
                type : "Table",
                value : tableModeData[cid]
            }, inst );
            inst.view.refreshStyle(arg);
        };
        this.getValue = function() {
            if( tableModeData[cid] == undefined ) {
                tableModeData[cid] = {};
            }
            var defaultData = getDefaultOp();
            tableModeData[cid] = $.extend(true,{},defaultData,tableModeData[cid]);
            APPIDE.Publisher.publish( "setValue", tableModeData[cid], inst );
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
    var Table = function( pointer ) {
        this.$pointer = pointer;
        subEvent(this);
    };
    Table.prototype = {
        constructor : Table,
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
            var inst = this, msg = inst.tableConfig;
            APPIDE.Publisher.publish( "loadPlugConfigFinished", msg, inst );
            this.control.getValue();
        },
        setStyle : function( msg ) {
            this.control.setStyle(msg);
        }
    };
    APPIDE.Widget.Table = Table;
}());