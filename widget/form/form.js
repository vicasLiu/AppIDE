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
            var id = "Form-"+inst.cid;
            var htm = '<div id="'+inst.componentId+'" data-cid="'+inst.componentId+'" class="body-widget" style="background-color: #ccc;">' +
                '   <label class="form-key-value">key:</label><div id="form-value-value">Value</div>'+
                '</div>';
            $("#"+id).css({
                top : "100px"
            });
            $(htm).appendTo("#"+id);
        };
        this.loadConfig = function() {
            var self = this;
            $.ajax({
                url : "widget/form/form.json",
                dataType : "json",
                success : function( msg ) {
                    inst.formConfig = msg;
                    self.init(msg.layout);
                    if(inst.data ==undefined) {
                        APPIDE.Publisher.publish( "loadPlugConfigFinished", msg, inst );
                    }
                },
                error : function() {}
            });
        };
        this.refresh = function( arg ) {
            var cid = inst.componentId;
            for( var id in arg ) {
                $("#"+cid).find(".form-"+id+"-value").html(arg[id]);
            }
        };
    };
    var Control = function( inst ) {
        this.setValue = function( arg ) {
            inst.mode.setValue(arg);
        };
        this.getValue = function() {
            inst.mode.getValue();
        };
    };
    var Mode = function( inst ) {
        var formData = null;
        var formModeData = {};
        var cid = inst.componentId;
        this.setValue = function( arg ) {
            formData = $.extend(true, {}, formData, arg);
            formModeData[cid] = formData;
            formModeData[cid].id = inst.cid;
            formModeData[cid].type = "Form";
            APPIDE.Publisher.publish( "savePlugConfig", formModeData, inst );
            inst.view.refresh(arg);
        };
        this.getValue = function() {
            APPIDE.Publisher.publish( "setValue", formData, inst );
        };
    };
    var subEvent = function( inst ) {
        APPIDE.Publisher.subscribe("setInputValue", function( msg ){
            inst.setValue( msg );
        }, inst);
        APPIDE.Publisher.subscribe("activePlug", function(){
            inst.reloadCon();
        }, inst);
    };
    var Form = function( pointer ) {
        this.$pointer = pointer;
        subEvent(this);
    };
    Form.prototype = {
        constructor : Form,
        getSubId : function() {
            return this.$pointer;
        },
        getActive : function() {
            return this.$active;
        },
        setActive : function( flg ) {
            this.$active = flg + "";
        },
        init : function() {
            this.view = new View( this );
            this.control = new Control( this );
            this.mode = new Mode( this );
            this.view.loadConfig();
        },
        setData : function( data ) {
            if( data != undefined ){
                this.data = data;
                this.control.setValue(data);
            }
        },
        setValue : function( arg ) {
            this.control.setValue(arg);
        },
        getValue : function() {
            this.control.getValue();
        },
        reloadCon : function() {
            var inst = this, msg = inst.formConfig;
            APPIDE.Publisher.publish( "loadPlugConfigFinished", msg, inst );
            this.control.getValue();
        }
    };
    APPIDE.Widget.Form = Form;
}());