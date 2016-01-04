/**
 * Created by liusiwei on 11/24/14.
 */
var APPIDE = APPIDE ? APPIDE : {};
window.APPIDEMODEDATA = {};
window.SETMODEDATA = function( page, module, type, data, id ) {
    var __judgeId = function( arr, id ) {
        var __index = -1;
        for( var i = 0; i < arr.length; i++ ) {
            var temp = arr[i];
            if( temp && (temp.id == id) ) {
                __index = i;
                break;
            }
        }
        return __index;
    };
    var pg = APPIDEMODEDATA[page];
    var md = pg[module];
    if( md[type] == undefined ) {
        md[type] = [];
    }
    if( id == undefined && data != undefined ) {
        id = data.id;
    }
    var index = __judgeId( md[type], id );
    if( index == -1 ){
        md[type].push(data);
    }else{
        md[type][index] = data;
    }
};
window.REMOVEMODEDATA = function( page, module, id, newRender, css ) {
    var pg = APPIDEMODEDATA[page];
    var md = pg[module];
    var layout = md.Layout;
    for( var i = 0; i < layout.length; i++ ) {
        var temp = layout[i];
        if( temp.id == id ) {
            temp.render = newRender;
            temp.css = css;
            break;
        }
    }
};
(function(){
    var view = null;
    var control = null;
    var mode = null;
    var plug = null;
    var logic = null;
    var resolve = null;
    /*
    * 事件绑定
    */
    var bindEvents = function() {
        $('body').off('click', '#appIde-nav-btn-save').on('click', '#appIde-nav-btn-save', function(){
            control.saveData();
        });
    };
    var AppIDE = function() {
        this.$pointer = APPIDE.Util.createId();
        view = new APPIDE.View(this.$pointer);
        control = new APPIDE.Control(this.$pointer);
        mode = new APPIDE.Mode(this.$pointer);
        plug = new APPIDE.Plugs(this.$pointer);
        logic = new APPIDE.Logic(this.$pointer);
        resolve = new APPIDE.Resolve(this.$pointer);
    };
    AppIDE.prototype = {
        constructor : AppIDE,
        getSubId : function() {
            return this.$pointer;
        },
        getActive : function() {
            return "true";
        },
        init : function() {
            bindEvents();
        },
        addPage : function( key ) {
            APPIDE.Publisher.publish("addPage", key, this);
            this.addModule("ModuleA");
        },
        addModule : function( key ) {
//            renderModule(modeTemp);
            APPIDE.Publisher.publish("addModule", key, this);
        },
        import : function( url ) {
            APPIDE.Publisher.publish("importModule", url, this);
        }
    };
    APPIDE.AppIDE = AppIDE;
}());