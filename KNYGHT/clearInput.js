define(["jquery","BaseView"],function(e,t){"use strict";return t.extend({events:{"keyup .textInput input":"showClearButton","change .textInput input":"showClearButton","focus .textInput input":"showClearButton","blur .textInput input":"hideClearButton","mousedown .clearInput":"clearInput","touchstart .clearInput":"clearInput"},initialize:function(){var n=document.createElement("input"),r=window.getComputedStyle&&window.getComputedStyle(n,":-ms-clear").content?!0:!1;if(!e("body").data("iswireless")||r)this.events={}},showClearButton:function(n){var r=e(n.currentTarget);r.val()&&this.$('.clearInput[data-clear="'+r.attr("id")+'"]').removeClass("hide"),r.parent().hasClass("hasError")&&this.$(".clearInput").addClass("hasError"),n.keyCode===8&&!r.val()&&this.hideClearButton(n)},hideClearButton:function(t){this.$('.clearInput[data-clear="'+t.currentTarget.id+'"]').addClass("hide").removeClass("hasError")},clearInput:function(n){var r=e("#"+e(n.currentTarget).data("clear"));r.val(""),this.hideClearButton(n),setTimeout(function(){r.focus()},10)}})});