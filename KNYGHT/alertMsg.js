define(["jquery","backbone","BaseView"],function(e,t,n){"use strict";var r=n.extend({className:"alertMsg",template:"widgets/alertMsg",initialize:function(n){this.model=new t.Model({message:n}),this.listenTo(this.model,"change:message",this.render),this.render()},setMessage:function(t){return this.model.set("message",t),this}});return r});