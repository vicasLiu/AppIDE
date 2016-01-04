/**
 * Created by liusiwei on 12/10/14.
 */
var APPIDE = APPIDE ? APPIDE : {};
(function(){

    var subEvent = function( inst ) {
        APPIDE.Publisher.subscribe("getInterFaceList", function( url , callback ){
            inst.control.getInterFaceList(url);
        }, inst);

        APPIDE.Publisher.subscribe("interFaceRender", function( json ){
            inst.interFaceRender(json);
        }, inst);

        APPIDE.Publisher.subscribe("setCurrentInterFace", function( data ){
            inst.setCurrentInterFace(data);
        }, inst);

        APPIDE.Publisher.subscribe("getData", function( url, db , callback){
            inst.control.getData(url, db , callback);
        }, inst);
    };

    var Control = function( inst ) {

        var getFilterData = function(data,db){
            data = data[db] || [];
            return data;
        };

        this.getData = function(url, callback){
            $.ajax({
                url : url,
                dataType : "json",
                success : function( msg ) {
                    if(typeof(msg)=="string"){
                        msg = $.parseJSON(json);
                    }
                    //msg = getFilterData(data,db);
                    if(typeof(callback)=="function"){
                        callback(msg);
                    }
                }
            });
        };
        this.getInterFaceList = function(url,callback){
            $.ajax({
                url : url,
                dataType : "json",
                success : function( msg ) {
                    // inst.Model.init(msg);
                    if(typeof(msg)=="string"){
                        msg = $.parseJSON(json);
                    }
                    if(typeof(callback)=="function"){
                        callback(msg["interFaceList"]);
                    }
                }
            });

        }/*,
         this.setInterFaceField = function(json){

         }*/
    };

    /*	var View = function( inst ) {
     this.interFaceRender : function(interfaceList){

     }
     };

     var Model = function( inst ) {
     var getVal = function(msg){
     var interfaceNameList = [];
     if(typeof(msg)=="string"){
     msg = $.parseJSON(json);
     }
     var interFaceList = msg["interFaceList"]||[];
     for(var i=0; i<interFaceList.length; i++){
     inst.interfaceList.push(interFaceList[i]);
     var interFaceName = interFaceList[i]["interFaseName"];
     interfaceNameList.push(interFaceName);
     }
     inst.view.interFaceRender(interfaceNameList);
     };
     this.init = function(msg){
     getVal(msg);
     }

     };
     */
    var InterFacePlug = function( pointer ) {
        this.$pointer = pointer;
        //subEvent(this);
        this.init();
    };

    InterFacePlug.prototype = {
        constructor : InterFacePlug,
        init : function() {
            var self = this;
            self.interfaceList = [];
            //self.view = new View( self );
            self.control = new Control( self );
            //self.mode = new Mode( self );
        },
        getSubId : function() {
            return this.$pointer;
        },
        getActive : function() {
            return "true";
        },
        setActive : function( flg ) {
            this.$active = flg +"";
        }
    }

    APPIDE.InterFacePlug = InterFacePlug;
}());