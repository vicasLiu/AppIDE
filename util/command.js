/**
 * Created by liusiwei on 15/1/19.
 */
(function() {
    var ctor = function(){};
    var inherits = function(parent, protoProps) {
        var child;

        if (protoProps && protoProps.hasOwnProperty('constructor')) {
            child = protoProps.constructor;
        } else {
            child = function(){ return parent.apply(this, arguments); };
        }

        ctor.prototype = parent.prototype;
        child.prototype = new ctor();

        if (protoProps) extend(child.prototype, protoProps);

        child.prototype.constructor = child;
        child.__super__ = parent.prototype;
        return child;
    };

    function extend(target, ref) {
        var name, value;
        for ( name in ref ) {
            value = ref[name];
            if (value !== undefined) {
                target[ name ] = value;
            }
        }
        return target;
    };

    var Undo = {
        version: '0.1.15'
    };

    Undo.Stack = function() {
        this.commands = [];
        this.stackPosition = -1;
        this.savePosition = -1;
    };

    extend(Undo.Stack.prototype, {
        execute: function(command) {
            this._clearRedo();
            command.execute();
            this.commands.push(command);
            this.stackPosition++;
            this.changed();
        },
        undo: function() {
            this.commands[this.stackPosition].undo();
            this.stackPosition--;
            this.changed();
        },
        canUndo: function() {
            return this.stackPosition >= 0;
        },
        redo: function() {
            this.stackPosition++;
            this.commands[this.stackPosition].redo();
            this.changed();
        },
        canRedo: function() {
            return this.stackPosition < this.commands.length - 1;
        },
        save: function() {
            this.savePosition = this.stackPosition;
            this.changed();
        },
        dirty: function() {
            return this.stackPosition != this.savePosition;
        },
        _clearRedo: function() {
            this.commands = this.commands.slice(0, this.stackPosition + 1);
        },
        changed: function() {
            // do nothing, override
        }
    });

    Undo.Command = function(name) {
        this.name = name;
    }

    var up = new Error("override me!");

    extend(Undo.Command.prototype, {
        execute: function() {
            throw up;
        },
        undo: function() {
            throw up;
        },
        redo: function() {
            this.execute();
        }
    });

    Undo.Command.extend = function(protoProps) {
        var child = inherits(this, protoProps);
        child.extend = Undo.Command.extend;
        return child;
    };
    this.Undo = Undo;
}).call(this);
var Interface = function (name, methods) {
    if(arguments.length != 2) {
        throw new Error("接口构造函数含" + arguments.length + "个参数, 但需要2个参数.");
    }
    this.name = name;
    this.methods = [];
    if(methods.length < 1) {
        throw new Error("第二个参数为空数组.");
    }
    for(var i = 0, len = methods.length; i < len; i++) {
        if(typeof methods[i][0] !== 'string') {
            throw new Error("接口构造函数第一个参数必须为字符串类型.");
        }
        if(methods[i][1] && typeof methods[i][1] !== 'number') {
            throw new Error("接口构造函数第二个参数必须为整数类型.");
        }
        if(methods[i].length == 1) {
            methods[i][1] = 0;
        }

        this.methods.push(methods[i]);
    }
};

Interface.registerImplements = function(object) {
    if(arguments.length < 2) {
        throw new Error("接口的实现必须包含至少2个参数.");
    }
    for(var i = 1, len = arguments.length; i < len; i++) {
        var interface = arguments[i];
        if(interface.constructor !== Interface) {
            throw new Error("从第2个以上的参数必须为接口实例.");
        }
        for(var j = 0, methodsLen = interface.methods.length; j < methodsLen; j++) {
            var method = interface.methods[j][0];
            if(!object[method] || typeof object[method] !== 'function' || object[method].getParameters().length != interface.methods[j][1]) {
                throw new Error("接口的实现对象不能执行" + interface.name + "的接口方法" + method + "，因为它找不到或者不匹配.");
            }
        }
    }
};

Function.prototype.getParameters = function() {
    var str = this.toString();
    var paramString = str.slice(str.indexOf('(') + 1, str.indexOf(')')).replace(/\s*/g,'');     //取得参数字符串
    try{
        return (paramString.length == 0 ? [] : paramString.split(','));
    }
    catch(err){
        throw new Error("函数不合法!");
    }
};

function inheritClass(subClass, superClass) {
    var Func = function() {};
    for(p in superClass.prototype)
    {
        Func.prototype[p] = superClass.prototype[p];
    }
    subClass.prototype = new Func();
    subClass.prototype.constructor = subClass;
}
var ICommand = new Interface("ICommand", [["execute"]]);
