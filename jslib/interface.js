/**
 * Created by suchiva on 14/12/20.
 */
if (!AppIDE) {
    var AppIDE = {};
}
$(function () {
    /*
        方法
    */
    var setWH = function (id, args) {
        $(id).width(args.width);
        $(id).height(args.height);
    };

    $.fn.tabs = function(control){
        var element = $(this);
        control = $(control);
        element.delegate("li", "click", function(){
            var tabName = $(this).attr("data-tab");
            element.trigger("change.tabs", tabName);
        });

        element.bind("change.tabs", function(e, tabName){
            element.find("li").removeClass("selected");
            element.find(">[data-tab='" + tabName + "']").addClass("selected");
        });

        element.bind("change.tabs", function(e, tabName){
            control.find(">[data-tab]").removeClass("selected");
            control.find(">[data-tab='" + tabName + "']").addClass("selected");
        });

        var firstName = element.find("li:first").attr("data-tab");
        element.trigger("change.tabs", firstName);

        return this;
    };
    //dragWindow
    var dragWindow = function (o) {
        var _args = o;
        var x = 0,y = 0;
        var l, t;
        if ($( _args.render).size()) {
            $(_args.scope).delegate($(_args.render), 'mousedown', function (e) {
                if ($(e.target).attr('class') === 'appIdeWindow-title') {
                    var isMove = false;
                    x = e.clientX - $(_args.render).offset().left;
                    y = e.clientY - $(_args.render).offset().top;
                    $(_args.scope).mousemove(function(e){
                        isMove = true;
                        l = e.clientX - x;
                        t = e.clientY - y;
                        $(_args.render).css('left', l).css('top', t);
                    }).mouseup(function(){
                        $(_args.scope).unbind('mousemove').unbind('mouseup');
                    });
                }
            });
        }
    };
    var dragTB = function (o) {
        var _args = o;
        $(_args.scope).delegate($(_args.render), 'mousedown', function (e) {
                var isMove = false;
                $(_args.scope).mousemove(function(e){
                    if (e.clientY < $(window).height()-150 && e.clientY > 120) {
                        isMove = true;
                        t = e.clientY - 100; 
                        //上下位置和高度变化 
                        var tempHBottom = $(window).height()-e.clientY - 14
                          , tempHTop = e.clientY - 100;  
                        $('#appIde-sidebar-l-bottomPageModule').height(tempHBottom);
                        $('#appIde-sidebar-l-topPlugList').height(tempHTop) 
                        //当前的位置
                        $(_args.render).css('top', t);
                    }
                }).mouseup(function(){
                    $(_args.scope).unbind('mousemove').unbind('mouseup');
                });
            }); 
    };
    dragTB({render: '#appIde-sidebar-l-tap', scope: '#appIde-sidebar-l', type: 'tb'});

    /*
        设置宽高
    */
    $(window).resize(function () {
        var _width = $(window).width(), _height = $(window).height();
        setWH('#appIde-layout', {width: _width, height: _height});
    });

    /*
        导航按钮
    */
    var importFn = function () { //导入
    };
    var previewFn = function () {//预览
    };
    var saveFn = function () { //保存
    };
    $('.appIde-nav').delegate('li', 'click', function () {
        $('.appIde-nav li').removeClass('selected');
        $(this).addClass('selected');
    });


    /*
        右边属性切换
    */
    $("#appIde-sidebar-r-attrAreaTab").tabs("#appIde-sidebar-r-mainPanel");
    //添加事件
    $('#appIde-sidebar-r-attrAreaTab').delegate('span', 'click', function () {
        var _index = $(this).index();
        var _appendEventHtml = '<p style="border-bottom: 0;"><label>事件名称</label><input type="text"/></p><p><label>回调方法</label><input type="text" class="input-h"/></p>';
        $('#appIde-sidebar-r-attrAreaList-event').find('form').append(_appendEventHtml);
    });

    /*
        左边页面列表
    */


    //添加新页面
    var create_appIdeWindow = function (arg) {
        var _args = {
            id: arg.id,
            title: arg.title,
            width: arg.width,
            height: arg.height,
            content: arg.content,
            button: arg.button
        };
        var buttonHtml = '';
        _args.button.forEach(function (k, v) {
            buttonHtml += '<input type="button" class="' + k.cls + '" value="' + k.text + '"/>';
        });
        var windowMask = '<div class="appIde-windowMask"></div>'
        var _html = windowMask + '<div id="' + _args.id + '" class="appIdeWindow" style="width: ' + _args.width + 'px; height: ' + _args.height + 'px;">' +
                        '<h4 class="appIdeWindow-title">' + _args.title + '</h4>' +
                        '<div class="appIdeWindow-content">' + _args.content + '</div>' +
                        '<div class="appIdeWindow-button">' + buttonHtml + '</div>' +
                    '</div>';
        return _html;
    };
    var delete_appIdeWindow = function () {
        if ($('.appIde-windowMask').length > 0 && $('.appIdeWindow').length > 0) {
            $('.appIde-windowMask').remove();
            $('.appIdeWindow').remove();
        }
    };
    var addNewPage = function () {
        var _html = create_appIdeWindow({
            id: 'p1',
            title: '新建页面',
            width: 200,
            height: 120,
            content: '<p><label>Name:</label><input type="text" class="newPageCls"/></p>',
            button: [{text: '确定', cls: 'newPage-submit'}, {text: '取消', cls: 'newPage-cancel'}]
        });
        $('body').append(_html);
        dragWindow({render: '.appIdeWindow', scope: 'body', type: 'all'});
    };
    //确定
    $('body').delegate('.newPage-submit', 'click', function () {

        var _name = $('.newPageCls').val();
        var _li = '<li><span style="float: right" class="addModule">+</span>' + _name + '<ul class="sub-li"></ul></li>';
        $('.appIde-sidebar-l-bottomPageModule-pageList').append(_li);
        delete_appIdeWindow();
    });
    //取消
    $('body').delegate('.newPage-cancel', 'click', delete_appIdeWindow);
    $('.appIde-title span').bind('click', addNewPage);
    var slideFn = function (e) {
        $(this).siblings('li').removeClass('selected').find('ul').hide();
        $(this).addClass('selected').find('ul').show();
    };
    $('#appIde-sidebar-l-bottomPageModule').delegate('li', 'click', slideFn);


    /*
        添加模块
    */
    var addModule = function () {
        var _html = create_appIdeWindow({
            id: 'm1',
            title: '新建模块',
            width: 200,
            height: 120,
            content: '<p><label>Name:</label><input type="text" class="newModuleCls"/></p>',
            button: [{text: '确定', cls: 'newModule-submit'}, {text: '取消', cls: 'newModule-cancel'}]
        });
        $('body').append(_html);
        dragWindow({render: '.appIdeWindow', scope: 'body', type: 'all'});
    };
    $('body').delegate('.addModule', 'click', addModule);
    //确定
    $('body').delegate('.newModule-submit', 'click', function () {

        var _name = $('.newModuleCls').val();
        var _liId = $('.appIde-sidebar-l-bottomPageModule-pageList  li.selected').attr("id") + "|" + _name;
        var _li = '<li class="ide-module" id="'+_liId+'">' + _name + '</li>';
        $('.appIde-sidebar-l-bottomPageModule-pageList  li.selected').children('ul').append(_li);
        delete_appIdeWindow();
    });
    //取消
    $('body').delegate('.newModule-cancel', 'click', delete_appIdeWindow);


    //收缩sidebar
    var tempI = 0;
    $('body').delegate('.appIde-sidebar-collapse', 'click', function () {
        if (tempI % 2 === 0) {
            $('#appIde-sidebar-l').animate({
                left: $(window).width() * -0.2 + 10 +'px',
                top: '101px'

            }, 'fast');
            $('#appIde-main').animate({
                left: '10px',
                width: $(window).width()*0.8-12 + 'px',
                top: '101px'
                },
                'fast', function() {
                }
            );
        } else {
            $('#appIde-sidebar-l').animate({
                left: '0',
                top: '101px'

            }, 'fast');
            $('#appIde-main').animate({
                left: '20%',
                width: $(window).width()*0.6-2 + 'px',
                top: '101px'
                },
                'fast', function() {
                }
            );
        }
        tempI++;
    });







});