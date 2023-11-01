// Backbone.Syphon, v0.4.1
// Copyright (c)2012 Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
// http://github.com/derickbailey/backbone.syphon

(function(e,t){typeof define=="function"&&define.amd&&define(["underscore","jquery","backbone"],t)})(this,function(e,t,n){return n.Syphon=function(e,t,n){var r={};r.ignoredTypes=["button","submit","reset","fieldset"],r.serialize=function(e,r){var o={},f=u(r),l=i(e,f);return n.each(l,function(e){var n=t(e),r=s(n),i=f.keyExtractors.get(r),u=i(n),l=f.inputReaders.get(r),c=l(n),h=f.keyAssignmentValidators.get(r);if(h(n,u,c)){var p=f.keySplitter(u);o=a(o,p,c)}}),o},r.deserialize=function(e,r,o){var a=u(o),l=i(e,a),p=f(a,r);n.each(l,function(e){var n=t(e),r=s(n),i=a.keyExtractors.get(r),o=i(n),u=a.inputWriters.get(r),f=p[o];u(n,f)})};var i=function(e,r){var i=o(e),u=i.elements;return u=n.reject(u,function(e){var i,o=s(e),u=r.keyExtractors.get(o),a=u(t(e)),f=n.include(r.ignoredTypes,o),l=n.include(r.include,a),h=n.include(r.exclude,a);return l?i=!1:r.include?i=!0:i=h||f,i}),u},s=function(e){var n,r=t(e),i=r[0].tagName,s=i;return i.toLowerCase()==="input"&&(n=r.attr("type"),n?s=n:s="text"),s.toLowerCase()},o=function(e){return n.isUndefined(e.$el)&&e.tagName.toLowerCase()==="form"?e:e.$el.is("form")?e.el:e.$("form")[0]},u=function(e){var t=n.clone(e)||{};return t.ignoredTypes=n.clone(r.ignoredTypes),t.inputReaders=t.inputReaders||r.InputReaders,t.inputWriters=t.inputWriters||r.InputWriters,t.keyExtractors=t.keyExtractors||r.KeyExtractors,t.keySplitter=t.keySplitter||r.KeySplitter,t.keyJoiner=t.keyJoiner||r.KeyJoiner,t.keyAssignmentValidators=t.keyAssignmentValidators||r.KeyAssignmentValidators,t},a=function(e,t,r){if(!t)return e;var i=t.shift();return e[i]||(e[i]=n.isArray(i)?[]:{}),t.length===0&&(n.isArray(e[i])?e[i].push(r):e[i]=r),t.length>0&&a(e[i],t,r),e},f=function(e,t,r){var i={};return n.each(t,function(t,s){var o={};r&&(s=e.keyJoiner(r,s)),n.isArray(t)?(s+="[]",o[s]=t):n.isObject(t)?o=f(e,t,s):o[s]=t,n.extend(i,o)}),i};return r}(n,t,e),n.Syphon.TypeRegistry=function(){this.registeredTypes={}},n.Syphon.TypeRegistry.extend=n.Model.extend,e.extend(n.Syphon.TypeRegistry.prototype,{get:function(e){var t=this.registeredTypes[e];return t||(t=this.registeredTypes["default"]),t},register:function(e,t){this.registeredTypes[e]=t},registerDefault:function(e){this.registeredTypes["default"]=e},unregister:function(e){this.registeredTypes[e]&&delete this.registeredTypes[e]}}),n.Syphon.KeyExtractorSet=n.Syphon.TypeRegistry.extend(),n.Syphon.KeyExtractors=new n.Syphon.KeyExtractorSet,n.Syphon.KeyExtractors.registerDefault(function(e){return e.prop("name")}),n.Syphon.InputReaderSet=n.Syphon.TypeRegistry.extend(),n.Syphon.InputReaders=new n.Syphon.InputReaderSet,n.Syphon.InputReaders.registerDefault(function(e){return e.val()}),n.Syphon.InputReaders.register("checkbox",function(e){var t=e.prop("checked");return t}),n.Syphon.InputWriterSet=n.Syphon.TypeRegistry.extend(),n.Syphon.InputWriters=new n.Syphon.InputWriterSet,n.Syphon.InputWriters.registerDefault(function(e,t){e.val(t)}),n.Syphon.InputWriters.register("checkbox",function(e,t){e.prop("checked",t)}),n.Syphon.InputWriters.register("radio",function(e,t){e.prop("checked",e.val()===t)}),n.Syphon.KeyAssignmentValidatorSet=n.Syphon.TypeRegistry.extend(),n.Syphon.KeyAssignmentValidators=new n.Syphon.KeyAssignmentValidatorSet,n.Syphon.KeyAssignmentValidators.registerDefault(function(){return!0}),n.Syphon.KeyAssignmentValidators.register("radio",function(e,t,n){return e.prop("checked")}),n.Syphon.KeySplitter=function(e){var t=e.match(/[^\[\]]+/g);return e.indexOf("[]")===e.length-2&&(lastKey=t.pop(),t.push([lastKey])),t},n.Syphon.KeyJoiner=function(e,t){return e+"["+t+"]"},n.Syphon});