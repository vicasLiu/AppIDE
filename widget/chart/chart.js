/**
 * Created by liusiwei on 12/19/14.
 */
var APPIDE = APPIDE ? APPIDE : {};
if( !APPIDE.Widget ) {
    APPIDE.Widget = {};
}
(function(){
    var defaultData = {
        "type" : "line",
        "data" : [{
            "dataId":"data1",
            "xId" : "x1",
            "yId" : "y1",
            "data": [1,2,3,4,5,6,7,8,7,6,5,4,3,2,1,0]
        }],
        "chart" : {
            "type" : ["line"],
            "line" : ['data1']
        },
        "xaxis" : {
            "filed" : 'data1',
            "format" : ''
        },
        "yaxis" : {
            "left" : '',
            "right" : ''
        }
    };
    var resolveCss = function( arg ) {
        var obj = {};
        var attr = arg["attr"];
        obj[attr] = arg["value"];
        return obj;
    };
    var resolveXAxis = function( arg ) {
//        var xaxis = {
//            id : "x1",
//            width : 25,
//            labelCss : {
//                font: "normal 10px Arial, Helvetica, sans-serif"
//            },
//            labelAlign : "center"
//        };
        var obj = $.extend(true,{},{
            filed : '',
            format : ''
        },arg);
        return obj;
    };
    var resolveYAxis = function( arg ) {
//        var yaxis = {
//            id : "y1",
//            width : 25,
//            show : false,
//            labelCss : {
//                font: "normal 10px Arial, Helvetica, sans-serif"
//            },
//            labelAlign : "lineCenter"
//        };
        var obj = $.extend(true,{},{
            left : '',
            right : ''
        },arg);
        return obj;
    };
    var resolveChart = function( arg ) {
//        var ct = {
//            dataId : "data1",
//            type : "line",
//            name : "ChartLineDemo",
//            style : {
//                lineWidth: 2,
//                lineColor: "#1885ff",
//                fillColor: "#1885ff",
//                areaLine: true,
//                baseLine:0,
//                divisionColor:true,
//                areaColor: {
//                    startColor: "#80BF7371",
//                    stopColor: "#807294BC"
//                }
//            }
//        };
        var obj = $.extend(true,{},{
            "type" : ['line']
        },arg);
        return obj;
    };
    var resolveLegend = function( arg ) {

        var obj = $.extend(true,{},{
            show : true,
            id : "chartLegend"
        },arg);
        return obj;
    };
    var resolveTooltips = function( arg ) {
        var tooltip = {
            show : true,
            id : "tooltips"
        };
        var obj = $.extend(true,{},tooltip,arg);
        return obj;
    };
    var resolveCrosshair = function( arg ) {
        var cross = {
            show : true,
            id : "crosshair"
        };
        var obj = $.extend(true,{},cross,arg);
        return obj;
    };
    var resolveTrckingball = function( arg ) {
        var tball = {
            show : true,
            id : "trackingball"
        };
        var obj = $.extend(true,{},tball,arg);
        return obj;
    };
    var resolveFn = {
        xaxis : resolveXAxis,
        yaxis : resolveYAxis,
        Legend : resolveLegend,
        charts : resolveChart,
        ToolTips : resolveTooltips,
        CrossHair : resolveCrosshair,
        TrackingBall : resolveTrckingball
    };
    var resolveChartData = function( arg ) {
        var obj = {};
        obj[arg["attr"]] = arg["value"];
        var type = arg["parent"];
        if( type == "null" ) {
            type = "charts";
        }
        var objs = resolveFn[type](obj);
        var retObj = {};
        retObj[type] = objs;
        return retObj;
    };
    var View = function( inst ) {
        this.init = function() {
            var data = inst.data;
            var name = data ? data["name"] : "Name";
            var value = data ? data["title"] : "Title";
            var id = "Chart-"+inst.cid;
            var htm = '<div id="'+inst.componentId+'" data-cid="'+inst.componentId+'" class="body-widget" style="width: 100%;">'+
                        ' <div class="appIde-chart chart-name-value"><img src="./img/bi.png" alt=""/></div>'+
                     ' </div>';
            $(htm).appendTo("#"+id);
        };
        this.loadConfig = function() {
            var self = this;
            $.ajax({
                url : "widget/chart/chart.json",
                dataType : "json",
                success : function( msg ) {
                    inst.chartConfig = msg;
                    self.init();
                    if(inst.data ==undefined) {
                        APPIDE.Publisher.publish( "loadPlugConfigFinished", msg, inst );
                        APPIDE.Publisher.publish( "setDefaultValue", {
                            id : inst.cid,
                            type : "Chart",
                            width : "100%",
                            height : 235,
                            top : 0,
                            left : 0
                        }, inst );
                        defaultData["id"] = inst.cid;
                        APPIDE.Publisher.publish( "setValue", defaultData, inst );
                        APPIDE.Publisher.publish( "savePlugConfig", {
                            cid : inst.cid,
                            type : "Chart",
                            value : defaultData
                        }, inst );
                    }
                },
                error : function() {}
            });
        };
        this.refreshValue = function( arg ) {
//            var cid = inst.componentId;
//            for( var id in arg ) {
//                $("#"+cid).find(".chart-"+id+"-value").html(arg[id]);
//            }
        };
        this.refreshStyle = function( arg ) {
            var cid = inst.componentId;
            $("#"+cid).css(arg);
        };
    };
    var Control = function( inst ) {
        this.setValue = function( arg ) {
            var msg = resolveChartData(arg);
            inst.mode.setValue(msg);
        };
        this.setStyle = function( arg ) {
            var msg = resolveCss(arg);
            inst.mode.setStyle(msg);
        };
        this.getValue = function() {
            inst.mode.getValue();
        };
    };
    var Mode = function( inst ) {
        var chartData = null;
        var chartModeData = {};
        var cid = inst.componentId;
        this.setValue = function( arg ) {
            chartData = $.extend(true, {}, chartData, arg);
            chartModeData[cid] = chartData;
            chartModeData[cid].id = inst.cid;
            chartModeData[cid].type = "Chart";
            APPIDE.Publisher.publish( "savePlugConfig", {
                cid : cid,
                type : "Chart",
                value : chartModeData[cid]
            }, inst );
            inst.view.refreshValue(arg);
        };
        this.setStyle = function( arg ) {
            if( chartModeData[cid].css == undefined ) {
                chartModeData[cid].css = {};
            }
            chartModeData[cid].css = $.extend(true, {}, chartModeData[cid].css, arg);
            APPIDE.Publisher.publish( "savePlugConfig", {
                cid : cid,
                type : "Chart",
                value : chartModeData[cid]
            }, inst );
            APPIDE.Publisher.publish( "changeLayoutCss", {
                id : inst.cid,
                type : "Chart",
                css : arg
            }, inst );
            inst.view.refreshStyle(arg);
        };
        this.getValue = function() {
            if( chartModeData[cid] == undefined ) {
                chartModeData[cid] = {};
            }
            chartModeData[cid] = $.extend(true,{},defaultData,chartModeData[cid]);
            APPIDE.Publisher.publish( "setValue", chartModeData[cid], inst );
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
        APPIDE.Publisher.subscribe("getConfig", function( msg ){

        }, inst);
    };
    var Chart = function( pointer ) {
        this.$pointer = pointer;
        subEvent(this);
    };
    Chart.prototype = {
        constructor : Chart,
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
            var inst = this, msg = inst.chartConfig;
            APPIDE.Publisher.publish( "loadPlugConfigFinished", msg, inst );
            this.control.getValue();
        },
        setStyle : function( msg ) {
            this.control.setStyle(msg);
        }
    };
    APPIDE.Widget.Chart = Chart;
}());