define(["jquery","jqueryUI"],function(e){"use strict";e.widget("pp.lap",{_create:function(){var t=this.element,n=this.$input=t.find("input"),r=this.$label=t.find("label");this._togglePlaceholder=e.proxy(this._togglePlaceholder,this),this._timer=null,n.on("focus",e.proxy(this.onFocus,this)).on("click",function(){n.focus()}).on("blur",e.proxy(this.onBlur,this)).on("change cut paste keydown textinput input",e.proxy(this.onInput,this)),r.on("click",function(e){r.hasClass("focus")||(n.focus(),e.stopPropagation())}),n.val()&&r.addClass("focus accessAid"),this.element.data("type","lap")},destroy:function(){e.Widget.prototype.destroy.call(this),this.$input.off("focus click blur change cut paste keydown textinput input"),this.$label.off("click")},onFocus:function(){var e=this.$label;e.parent().hasClass("error")||e.addClass("focus")},onBlur:function(){this.$label.removeClass("focus"),this.$input.attr("aria-invalid","false")},onInput:function(){var e=this._timer;e&&clearTimeout(e),this._timer=setTimeout(this._togglePlaceholder,3)},_togglePlaceholder:function(){this.$label.toggleClass("accessAid",!!this.$input.val())}})});