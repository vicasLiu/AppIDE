/**
 * Created by liusiwei on 11/24/14.
 */
var APPIDE = APPIDE ? APPIDE : {};
(function(){
    APPIDE.Publisher = {
        subscribe: function(eventName, callback, inst) {
            var ev, suber, subscribeId, pointer = inst;
            subscribeId = pointer.getSubId();
            if (!subscribeId) {
                return
            }
            if (!APPIDE.Publisher.subers) {
                APPIDE.Publisher.subers = {}
            }
            if (!APPIDE.Publisher.subers[subscribeId]) {
                APPIDE.Publisher.subers[subscribeId] = {};
                APPIDE.Publisher.subers[subscribeId].callbacks = {}
            }
            suber = APPIDE.Publisher.subers[subscribeId];
            (suber.callbacks[eventName] || (suber.callbacks[eventName] = [])).push({
                'scope': inst,
                'fun': callback
            })
        },
        publish: function() {
            var eventName, args, pointer, list, i, suber, subscribeId, inst, temp, cid, aPointer;
            var argArr = Array.prototype.slice.call(arguments, 0);
            if (arguments.length > 1) {
                eventName = argArr.shift();
                args = argArr;
                inst = argArr.pop();
                pointer = inst
            } else {
                return
            }
            subscribeId = pointer.getSubId();
            suber = APPIDE.Publisher.subers && APPIDE.Publisher.subers[subscribeId];
            cid = pointer.componentId;
            if (!suber || !suber.callbacks) {
                return
            }
            if (suber.callbacks[eventName]) {
                list = suber.callbacks[eventName];
                for (i = 0; i < list.length; i++) {
                    temp = list[i].scope;
                    var subId = temp.subId;
                    if ((typeof subId == "undefined" || typeof cid == "undefined") && temp.getActive() != "false") {
                        list[i].fun.apply(temp, args)
                    } else if ($.isArray(subId) && $.inArray(cid, subId) != -1) {
                        list[i].fun.apply(temp, args)
                    }
//                    else if (subId == cid) {
//                        list[i].fun.apply(temp, args)
//                    }
                }
            }
        },
        unsubscribe: function() {
            var eventName, fun, subscribeId, pointer, i;
            if (arguments.length == 3) {
                eventName = arguments[0];
                fun = arguments[1];
                pointer = arguments[2]
            } else if (arguments.length == 2) {
                eventName = arguments[0];
                pointer = arguments[1]
            } else {
                return
            }
            subscribeId = pointer.getSubId();
            var suber = APPIDE.Publisher.subers && APPIDE.Publisher.subers[subscribeId];
            if (!suber || !suber.callbacks) {
                return
            }
            var callbacks = suber && suber.callbacks;
            for (name in callbacks) {
                if (name === eventName) {
                    for (i = 0; i < callbacks[eventName].length; i++) {
                        if (pointer.componentId === callbacks[eventName][i].scope.componentId) {
                            callbacks[eventName].splice(i, 1);
                            i--
                        }
                    }
                }
            }
        }
    };
    var subEvent = function( inst ) {
        APPIDE.Publisher.subscribe("setAttrValue", function( msg ){
            inst.setValue( msg );
        }, inst);
        APPIDE.Publisher.subscribe("setStyleValue", function( msg ){
            inst.setStyleValue( msg );
        }, inst);
    };
    var Control = function( pointer ) {
        this.$pointer = pointer;
        subEvent(this);
    };
    Control.prototype = {
        constructor : Control,
        init : function() {

        },
        getSubId : function() {
            return this.$pointer;
        },
        getActive : function() {
            return "true";
        },
        getValue : function() {
            APPIDE.Publisher.publish( "getValue", this );
        },
        setValue : function( arg ) {
            APPIDE.Publisher.publish( "setInputValue", arg, this );
        },
        setClickWidget : function( id ) {
            APPIDE.Publisher.publish( "setClickWidget", id, this );
        },
        saveData : function() {
            APPIDE.Publisher.publish( "saveData", this );
        },
        setModuleKey : function( msg ) {
            APPIDE.Publisher.publish( "setModuleKey", msg, this );
        },
        setStyleValue : function( msg ) {
            APPIDE.Publisher.publish( "setInputStyle", msg, this );
        }
    };
    APPIDE.Control = Control;
}());