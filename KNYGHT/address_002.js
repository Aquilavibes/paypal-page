define(["backbone","model/settings/address"],function(e,t){"use strict";var n=e.Collection.extend({url:function(){return e.history.options.root+"settings/address"},initialize:function(t){},model:t,parse:function(t){return t},setPrimaryFalse:function(t){this.each(function(e){e.get("type")===t&&e.set({primary:!1})})}});return new n});