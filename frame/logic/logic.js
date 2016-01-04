/**
 * Created by liusiwei on 12/4/14.
 */
var APPIDE = APPIDE ? APPIDE : {};
(function(){
    var subEvent = function( inst ) {

    };
    var Logic = function( pointer ) {
        this.$pointer = pointer;
        subEvent(this);
    };
    Logic.prototype = {
        constructor : Logic,
        init : function() {

        },
        getSubId : function() {
            return this.$pointer;
        },
        getActive : function() {
            return "true";
        }
    };
    APPIDE.Logic = Logic;
}());