define(["underscore","jquery","jqueryUI"],function(e,t){"use strict";t.widget("pp.checkbox",{options:{radio:!1},_create:function(){this.$el=this.element,this.options.radio&&this.$el.addClass("radio"),this.$input=this.$el.find("input"),this.$label=this.$el.find("label"),this.$input.off("click"),this.$input.on("click",t.proxy(this.onClick,this))},destroy:function(){t.Widget.prototype.destroy.call(this),this.$input.off("click")},onClick:function(r){var i=this;e.defer(function(){var e=t(r.currentTarget),n=i.$label.not(".disabled");i.options.radio&&(e.parent().parent().find(".checked").removeClass("checked"),e.parent().siblings().find("span").removeClass("icon-checkmark-small")),e.attr("checked")?e.removeAttr("checked"):e.attr("checked",!0),n.find("span").toggleClass("icon-checkmark-small"),n.parent().addClass("checked")})}})});