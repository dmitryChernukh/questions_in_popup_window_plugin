/**
 * Created by dmitry on 28.01.16.
 */
$( document ).ready(function() {
    var baseUrl = 'http://legendcorp.z.valant.com.ua'; //http://legendcorp.z.valant.com.ua // http://symfony.loc
    document.mainObject = {
        ApiAddress : baseUrl+'/core/activate', //install server processing (API)
        testMode : true,
        initialization : function(){
            this.connectAction();
            this.setKey();
            this.firstAction();
            this.clickAction();
            this.goToAction();
            this.closeAction();
            this.setRating();
        },
        baseUrl : function(){
            if(this.testMode == true){
                var protocol = $('.input-group-addon-protocol').val();
                var url = $('#basic-url').val();
                return protocol+url;
            } else if (this.testMode == false){
                return window.location.origin;
            }
        },
        connectAction : function (){
            var head = $('head');
            head.append('<script type="text/javascript" src="'+baseUrl+'/app/js/device.js">');
        },
        closeAction : function(){
            $(document).on('click', '#close-popup-window', function(){
                var that = this;
                $(this).parent().parent().animate({ opacity: "0" }, 1000);
                setTimeout(function(){
                    $('#main-pop-up-container').remove();
                }, 1000);
            });
        },
        setRating : function (){
            var text;
            var pop_up_id;
            var that = this;
            var identifier;
            $(document).on('click', '.answer-rating-set-one', function(){
                identifier = 'R1';
                var container = $('#main-pop-up-container');
                text = container.find('.main-question').text();
                pop_up_id = container.attr('itemscope');
                sendRating(identifier, $(this).val(), text, pop_up_id);
            });
            $(document).on('click', '.answer-rating-set-two', function(){
                identifier = 'R2';
                var container = $('#main-pop-up-container');
                text = container.find('.main-question').text();
                pop_up_id = container.attr('itemscope');
                sendRating(identifier, $(this).val(), text, pop_up_id);
            });

            var sendRating = function(identifier, number, text, pop_up_id){
                var localUrl = that.baseUrl();
                var info = { siteUrl : localUrl, index : identifier, number : number, question_text : text, pop_up_id : pop_up_id};
                $.ajax({
                    type: "POST",
                    url: baseUrl+'/core/rating',
                    data: JSON.stringify({ Data: info }),
                    contentType: "application/json",
                    dataType: "json"
                });
            }
        },
        UnLoader : function(){
            var o = this;
            this.unload = function(evt){
                var message = 'You try to close, reload  or redirect this page ... I detected this!';
                if (typeof evt == "undefined") {
                    evt = window.event;
                }
                if (evt) {
                    evt.returnValue = message;
                }
                $('#main-pop-up-container').show();
                return message;
            };

            this.resetUnload = function()
            {
                $(window).off('beforeunload', o.unload);

                setTimeout(function(){
                    $(window).on('beforeunload', o.unload);
                }, 1000);
            };

            this.init = function()
            {
                $(window).on('beforeunload', o.unload);
                $('a').on('click', o.resetUnload);
                $(document).on('click','.button-answer', o.resetUnload);
                $(document).on('click','#go-to', o.resetUnload);
                $(document).on('submit', 'form', o.resetUnload);
                $(document).on('keydown', function(event){
                    if((event.ctrlKey && event.keyCode == 116) || event.keyCode == 116 || event.keyCode == 13 || (event.ctrlKey && event.keyCode == 82)){
                        o.resetUnload();
                    }
                });
            };
            this.init();
        },
        counter : function(){
            var number = sessionStorage.getItem('counter');
            if(number == null){
                sessionStorage.setItem('counter', 0);
                return sessionStorage.getItem('counter');
            } else {
                sessionStorage.setItem('counter', parseInt(number)+1);
                return sessionStorage.getItem('counter');
            }
        },
        setKey : function() {
            var key = localStorage.getItem('localIdentifier');
            if(key == null){
                localStorage.setItem('localIdentifier', this.generateHash(40, 'aA#!'));
                return localStorage.getItem('localIdentifier');
            } else {
                return key;
            }
        },
        generateHash : function(length, chars){
            var mask = '';
            if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
            if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            if (chars.indexOf('#') > -1) mask += '0123456789';
            if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
            var result = '';
            for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
            return result;
        },
        getBrowserInfo : function(){
            var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if(/trident/i.test(M[1])){
                tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
                return {name:'IE',version:(tem[1]||'')};
            }
            if(M[1]==='Chrome'){
                tem=ua.match(/\bOPR\/(\d+)/);
                if(tem!=null)   {return {name:'Opera', version:tem[1]};}
            }
            M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
            if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
            return {
                name: M[0],
                version: M[1]
            };
        },
        determineDevice : function (unit, popUp){
            switch (unit) {
                case 'Mobile':
                    if(device.mobile()){
                        this.attachContainer(popUp);
                    }
                    break;
                case 'Tablet':
                    if(device.tablet()){
                        this.attachContainer(popUp);
                    }
                    break;
                case 'Desktop':
                    if(device.desktop()){
                        this.attachContainer(popUp);
                    }
                    break;
                case 'iOS':
                    if(device.ios()){
                        this.attachContainer(popUp);
                    }
                    break;
                case 'iPad':
                    if(device.ipad()){
                        this.attachContainer(popUp);
                    }
                    break;
                case 'Android Phone':
                    if(device.androidPhone()){
                        this.attachContainer(popUp);
                    }
                    break;
                case 'Android Tablet':
                    if(device.androidTablet()){
                        this.attachContainer(popUp);
                    }
                    break;
                case 'BlackBerry':
                    if(device.blackberry()){
                        this.attachContainer(popUp);
                    }
                    break;
                case 'Windows':
                    if(device.windows()){
                        this.attachContainer(popUp);
                    }
                    break;
                case 'Android':
                    if(device.android()){
                        this.attachContainer(popUp);
                    }
                    break;
                case 'iPhone':
                    if(device.iphone()){
                        this.attachContainer(popUp);
                    }
                    break;
                case 'Mobile & Tablet':
                    if(device.tablet() && device.mobile()){
                        this.attachContainer(popUp);
                    }
                    break;
                default:
                    console.log('No device detected')
            }
        },
        GetLocation : function(coordinates){
            if (!navigator.geolocation){
                console.log("Geo-location is not supported by your browser");
                return;
            }
            navigator.geolocation.getCurrentPosition(function (position) {
                var latitude  = position.coords.latitude;
                var longitude = position.coords.longitude;
                coordinates({latitude:latitude, longitude:longitude, accuracy:position.coords.accuracy})
            }, function () {
                console.log( "Unable to retrieve location");
            });
        },
        clickAction : function(){
            var that = this;
            $(document).on('click','.button-answer',function(){
                $('#main-pop-up-container').remove();
                var popupId = $('#id').val();
                var data = {'key':$(this).attr('key'), popupId: popupId, testMode:that.testMode,  'significance': $(this).attr('significance'), siteUrl: that.baseUrl(), localIdentifier: 'Preview'};
                    if(data.key == 'L')
                    {
                        if(data.significance.indexOf('http://') == -1 && data.significance.indexOf('https://') == -1){
                            window.open('http://'+data.significance, '_blank');
                        } else {
                            window.open(data.significance, '_blank');
                        }
                        console.log("Test");
                        return false;
                    }
                $.ajax({
                    type: "POST",
                    url: baseUrl+'/core/processing',
                    data: JSON.stringify({Data: data}),
                    contentType: "application/json",
                    dataType: "json",
                    success: function(data){
                        if(data.checker == 'ACCESS_CLOSE'){
                            console.log('ACCESS_CLOSE');
                        } else if(data.checker == 'L'){
                            window.onbeforeunload = null;
                            location.href = data.container;
                            return false;
                        } else {
                            that.attachContainer(data.container);
                        }
                    },
                    failure: function(errMsg) {
                        alert(errMsg);
                    }
                });
            })
        },
        goToAction : function (){
            $(document).on('click','#go-to', function(){
                location.href = $(this).attr('src');
            })
        },
        attachContainer : function(popUp){
            var body = $('body');
            body.append(popUp);
            var containerElement = $('#main-pop-up-container');
            containerElement.hide();
            containerElement.slideDown("slow");
        },
        emptyCheck : function(mixed_var){
            return ( mixed_var === "" || mixed_var === 0   || mixed_var === "0" || mixed_var === null  || mixed_var === false
            ||  mixed_var.length === 0 );
        },
        getSeparatePopUp: function(id, index){
            var that = this;
            console.log(id, index);
            $.ajax({
                type: 'POST',
                url: baseUrl+'/getPreviewPopUp',
                data: 'id='+id+'&index='+index,
                success: function(data){
                    var head = $('head');
                    data.CSSFiles.forEach(function(item, i, arr) {
                        head.append('<link href='+baseUrl+'/app/css/user-style/'+item+' rel="stylesheet">');
                    });
                    that.attachContainer(data.popUp);
                }
            });
        },
        firstAction : function(){
            $.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
                options.async = true;
            });
            var that = this;
            var popupId = $('#id').val();

            var markers =  {popupId: popupId, localIdentifier: true, testMode:that.testMode, browserName : navigator.appName, browserCodeName : navigator.appCodeName, browserInfo: this.getBrowserInfo(), siteUrl: this.baseUrl() };
            if(sessionStorage.getItem('isClose') != 1){
                var body = $('body');
                $.ajax({
                    type: "POST",
                    url: that.ApiAddress,
                    data: JSON.stringify({ Data: markers }),
                    contentType: "application/json",
                    async: true,
                    dataType: "json",
                    success: function(data){
                        if(data.checker == 'ACCESS_ALLOWED'){

                            var head = $('head');
                            data.CSSFiles.forEach(function(item, i, arr) {
                                head.append('<link href='+baseUrl+'/app/css/user-style/'+item+' rel="stylesheet">');
                            });

                            if(data.appearance){
                                switch (data.appearance) {
                                    case 'SI': //Show immediately on page entry
                                        that.attachContainer(data.popUp);
                                        break;
                                    case 'SA'://Show after a set number of seconds
                                        var time;
                                        if(that.emptyCheck(data.appValue) != true){
                                            time = parseInt(data.appValue);
                                        } else {
                                            time = 5;
                                        }
                                        setTimeout(function(){
                                            that.attachContainer(data.popUp);
                                        }, time*1000);
                                        break;
                                    case 'SV'://Show if the user visits a set number of pages
                                        var count;
                                        if(that.emptyCheck(data.appValue) != true){
                                            count = parseInt(data.appValue);
                                        } else {
                                            count = 2;
                                        }
                                        if(count <= parseInt(that.counter())){
                                            that.attachContainer(data.popUp);
                                        }
                                        break;
                                    case 'SC'://Show only on certain URLS
                                        if( window.location.href.indexOf(data.appValue) != -1){
                                            that.attachContainer(data.popUp);
                                        }
                                        break;
                                    case 'SE'://Show if the user is about to exit the site
                                        body.append(data.popUp);
                                        $('#main-pop-up-container').hide();
                                        that.UnLoader();
                                        break;
                                    case 'SD'://Show only if the user is on a certain device
                                        that.determineDevice(data.appValue, data.popUp);
                                        break;
                                    case 'SO'://Show only once on a single page (not showing on repeat visits)
                                        ///-------------------
                                        var index = sessionStorage.getItem('visitIndex');
                                        if(index >= 1){
                                            return false;
                                        } else {
                                            sessionStorage.setItem('visitIndex', 1);
                                            that.attachContainer(data.popUp);
                                        }
                                        break;
                                    default:
                                        console.log('PopUp method is not defined');
                                }
                            }
                        } else {
                            console.log('ACCESS_CLOSE');
                        }
                    },
                    failure: function(errMsg) {
                        alert(errMsg);
                    }
                });
            }
        }
    };

    mainObjectReady();
    mainObjectSecondReady();
});
