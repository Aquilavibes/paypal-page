define(["jquery"],function(e){e.fn.nativeDropdown=function(t){var n={replacedClass:"replaced",customSelectClass:"custom-select",activeClass:"active",wrapperElement:'<div class="custom-select-container" />'};t&&e.extend(n,t),this.each(function(){var t=e(this),r=t.find("select"),i=e('<div class="'+n.customSelectClass+'" aria-hidden="true">'+e("option:selected",this).text()+"</div>");t.append(i);var s=function(){var n=e("option:selected",this),r=n.attr("data-abbreviation")?n.attr("data-abbreviation"):n.text();i.text(r)};r.bind("change keyup",s),r.bind("mouseenter focus",function(){t.addClass("hovered")}),r.bind("mouseleave blur",function(){t.removeClass("hovered")})})}});