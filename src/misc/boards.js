var upload_handler = (new Date()).getTime() * 10000;
ParseUrl = function(url){
    "use strict";
    var m = (url || document.location.href).match( /https?:\/\/([^\/]+)\/([^\/]+)\/((\d+)|res\/(\d+)|\w+)(\.x?html)?(#i?(\d+))?/);
    return m?{host:m[1], board:m[2], page:m[4], thread:m[5], pointer:m[8]}:{};
};
var Hanabira={URL:ParseUrl()};

var sendBoardForm = function(file) {
    "use strict";
    
    var formData, fileInputName, formAction,
        fd = new FormData();

    if($('a#yukiForceUpdate').length !== 0 && $('form#yukipostform').length === 0){
        $('a.reply_.icon').last().click();
        $('form#yukipostform textarea').val('');
    }

    if($('#de-pform form').length !== 0){
        formData = $('#de-pform form').serializeArray();
        fileInputName = $("#de-pform form input[type=file]")[0].name;
        formAction = $("#de-pform form")[0].action; //+ "?X-Progress-ID=" + upload_handler,
    }else if(($('form#yukipostform').length !== 0)){
        formData = $('form#yukipostform').serializeArray();
        fileInputName = 'file_1';
        fd.append('file_1_rating', 'SFW'); 
        formAction = '/' + Hanabira.URL.board + '/post/new.xhtml' + "?X-Progress-ID=" + upload_handler;   
    }


    for (var i = 0; i < formData.length; i++) {
        if (formData[i].name != fileInputName) {
            fd.append(formData[i].name, formData[i].value);
        }
    }


    if (document.URL.match(/\/8chan.co\//)) {
        fd.append('post', $('#de-pform input[type=submit]').val());
    }

    var fnme = Math.floor((new Date()).getTime() / 10 - Math.random() * 100000000) + '.jpg';

    fd.append(fileInputName, uint8toBlob(file, 'image/jpeg'), fnme);

    replyForm.find("#do_encode").val('..Working...').attr("disabled", "disabled");

    $.ajax({
        url: formAction,
        type: 'POST',
        data: fd,
        processData: false,
        contentType: false,
        success: function(data, textStatus, jqXHR) {
            var doc = document.implementation.createHTMLDocument(''),
                p;
            doc.documentElement.innerHTML = data;

//            console.log(data, textStatus, jqXHR);

            if (jqXHR.status === 200 && jqXHR.readyState === 4) {
                p = $('form[action*="delete"]', doc).length +
                    $('form[action*="delete"]', doc).length +
                    $('#posts_form, #delform', doc).length +
                    $('form:not([enctype])', doc).length +
                    $('form[name="postcontrols"]', doc).length +
                    $('form[name="postcontrols"]', doc).length +
                    $('#delform, form[name="delform"]', doc).length;
                    if(isDobro && data.match(/parent\.location\.replace/)){
                        p = 1;
                    }
            } else {
                p = 1;
            }

            if (p !== 0) {
                $('#de-pform textarea').val('');
                $('form#yukipostform textarea').val('');
                $('#de-pform img[src*=captcha]').click();
                $('#hidbord_replyform #c_file').val('');
                $('#de-updater-btn').click();
                $('a#yukiForceUpdate').click();
                replyForm.remove();
                replyForm = null;
                container_image = null;
                container_data = null;

            } else {
//                replyForm.find("input[type=submit]").attr("disabled", null);
                alert('Can\'t post. Wrong capch? Fucked up imageboard software?.');
                replyForm.find("#do_encode").val('crypt and send').removeAttr("disabled");
//                console.log(data, textStatus, jqXHR, doc, doc.find('#delform, form[name="delform"]'));
            }

            upload_handler = (new Date()).getTime() * 10000;

        },
        error: function(jqXHR, textStatus, errorThrown) {
//            console.log(jqXHR, textStatus, errorThrown);
            alert('Error while posting. Something in network or so.');
            replyForm.find("#do_encode").val('crypt and send').removeAttr("disabled");
            upload_handler = (new Date()).getTime() * 10000;
        }
    });
};
