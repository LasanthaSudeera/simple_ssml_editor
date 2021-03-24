var ssml = ssml || {};

ssml.actions = {
    markword: function(className) {
        document.execCommand("insertHTML", false, "<span class='" + className + "'>"+ document.getSelection()+"</span>");
    },

    insertDelay: function() {
        document.execCommand("insertHTML", false, "<i class='fa fa-clock-o' contenteditable='false' />");
    },

    emphasis: function() {
        ssml.actions.markword("emphasis");
    },

    pitchUp: function() {
        ssml.actions.markword("pitch-up");
    },

    pitchDown: function() {
        ssml.actions.markword("pitch-down");
    },

    undo: function() {
        document.execCommand("undo");
    },    

    convertToSsml: function() {

        var html = $(".editor").html();
        var $newContent = $("<p/>");

        /* Wrap text */
        $newContent.append(html);

        /* replace nbsp */
        $newContent.html(function (i, html) {
            return html.replace(/&nbsp;/g, ' ');
        });

        /* replace linebreaks */
        $newContent.find("p").each(function(){
            if ($.trim($(this).text()) == ""){
                $(this).remove();
            } 
          });

        /* replace pause */
        $newContent.find("br").replaceWith(function(){
            return '';
        })
        
        /* replace strong */
        $newContent.find(".emphasis").replaceWith(function(){
            return '<emphasis level="strong">' +  this.innerHTML + "</emphasis>";
        })

        /* replace pause */
        $newContent.find(".fa-clock-o").replaceWith(function(){
            return '<break time="300ms"></break>';
        })

        /* replace pitch up */
        $newContent.find(".pitch-up").replaceWith(function(){
            return '<prosody pitch="+3st">' + this.innerHTML + "</prosody>";
        })

        /* replace pitch up */
        $newContent.find(".pitch-down").replaceWith(function(){
            return '<prosody pitch="-3st">' + this.innerHTML + "</prosody>";
        })

        $(".output").text("<speak>" + $newContent.html() + "</speak>");
    }
}

ssml.listners = {
  actionbuttons: function() {
        $(".action-button").on("click", function (event) {
            event.preventDefault();
            var action = $(this).data("action");
            eval(action);
        });
    }
},

ssml.init = function () {   
    this.listners.actionbuttons();
    document.execCommand("defaultParagraphSeparator", false, "p");

    document.querySelector("div[contenteditable]").addEventListener("paste", function(e) {
        e.preventDefault();
        var text = e.clipboardData.getData("text/plain");
        document.execCommand("insertHTML", false, text);
    });
}

$(function () {
    "use strict";
    ssml.init();
});