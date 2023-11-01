define(["jquery","underscore","backbone","view/settings/index","widgets/modal","widgets/validateForm","model/settings/address","core/fpti","view/settings/ppcAssetLight","collection/settings/address","textField","lap","nativeDropdown","widgets/checkbox","backboneSyphon"],function(e,t,n,r,i,s,o,u,a,f){"use strict";var l=r.extend({el:"#overpanel",pageGrp:"settings:address",template:"settings/address/add",events:{"submit form[name=addAddress]":"submitAddAddress"},initialize:function(){u.init()},initWidgets:function(){this.$(".textInput").lap().textField(),this.$(".ppCheckbox").checkbox(),this.$(".selectDropdown").nativeDropdown(),this.formView=new s({el:"form[name=addAddress]"})},afterRoute:function(){this.creditData=e("#ppc_credit").data("credit");var n=e("#addressMainWrapper").data("address"),r=n&&n.address&&n.address.countryCode,s=n&&n.address&&n.address.entryMetadata;this.model=new o,this.model.set("entryMetadata",s),this.model.set("country_code",r),i.setContent(this)},afterRender:function(){this.initWidgets()},initModels:function(){this.model=new o,this.model.clear(),this.stopListening(this.model),this.listenToOnce(this.model,"error",this.submitError),this.listenToOnce(this.model,"sync",this.onAddressUpdate)},submitAddAddress:function(t){t.preventDefault(),this.initModels(),u.startModuleLoadTimer();var n={line1:this.$el.find("input[name=line1]").val(),line2:this.$el.find("input[name=line2]").val(),city:this.$el.find("input[name=city]").val()||this.$el.find("select[name=city]").val(),country_code:this.$el.find("input[name=country]").val(),postal_code:this.$el.find("input[name=postalCode]").val(),state:this.$el.find("input[name=state]").val()||this.$el.find("select[name=state]").val()};n.state=n.state==="-1"?"":n.state,this.model.set(n),this.model.save(),this.toggleLoading(!0)},submitError:function(t,n,r){this.toggleLoading(!1),this.formView.showError(r)},onAddressUpdate:function(t){var n=this;t.get("primary")&&(t.set("billing",!0),f.invoke("set",{primary:!1,billing:!1})),u.recordModuleLoadTime(n.pageGrp+":add",n.pageGrp,n.template+".dust"),f.add(t),this.toggleLoading(!1);if(this.creditData&&this.creditData.type==="ppc"){var r=new a({overlay:"address",creditData:this.creditData});i.setContent(r)}else i.hideModal()},updateAddressModel:function(t){return{id:t.id,addressLine1:{id:"line1",value:t.line1},addressLine2:{id:"line2",value:t.line2},city:{id:"city",value:t.city},state:{id:"state",value:t.state},zipcode:{id:"postalCode",value:t.postal_code},countryCode:t.country_code,primary:t.primary,billing:t.billing,confirmed:t.confirmed,cardList:t.cardList,paypalCredit:t.paypalCredit,entryMetadata:t.entryMetadata,displayMetadata:t.displayMetadata}},serialize:function(){var t=this.updateAddressModel(this.model.toJSON());return t}});return l});