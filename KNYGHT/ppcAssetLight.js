define(["backbone","BaseView","widgets/modal","widgets/theoverpanel","widgets/analytics"],function(e,t,n,r,i){"use strict";var s=t.extend({template:"settings/ppcAssetLight/ppc_modal",events:{"click #ppc-closeOverlay":"closeOverlay","click #ppc-redirect":"redirect"},initialize:function(t){this.options=t},afterRender:function(){this.options.overlay==="mobile-confirmation"&&(this.$(".ppc-confirmation").css("display","block"),this.$(".ppc-confirmation-icon").css("display","inline"))},closeOverlay:function(i){i.preventDefault();var s=this.$(".close");this.options.overlay==="email"?(s.attr("href","/businessprofile/settings/email"),r.hideOverpanel()):this.options.overlay==="phone"||this.options.overlay==="mobile-confirmation"?(s.attr("href","/businessprofile/settings/phone"),n.hideModal()):(s.attr("href","/businessprofile/settings/address"),n.hideModal()),e.trigger("trackLink","","notnow","main:businessweb:profile:settings:"+this.options.overlay+":addppc","main:businessweb:profile:settings:","link")},redirect:function(n){n.preventDefault(),this.options.creditData&&window.location.assign(this.options.creditData.profile),e.trigger("trackLink","","continuetoppc","main:businessweb:profile:settings:"+this.options.overlay+":addppc","main:businessweb:profile:settings:","link")}});return s});