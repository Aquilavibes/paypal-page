
requirejs.config({
    deps: ['app'],
    waitSeconds: 200,
    paths: {
        'jquery': 'lib/jquery-1.12.4',
        'jqueryUI': 'lib/jquery.ui.widget',
        'underscore': 'lib/lodash.underscore-2.3.0',
        'backbone': 'lib/backbone-1.1.0',
        'nougat': 'core/nougat',
        'BaseView': 'core/baseView',
        'dust': 'lib/dust-core-2.5.1',
        'dust-helpers': 'lib/dust-helpers-1.5.0',
        'dust-helpers-supplement': 'lib/dust-helpers-supplement',
        'backboneSubroute': 'lib/backbone-subroute-0.4.1',
        'bootstrap-modal': 'lib/bootstrap3/modal',
        'backboneSyphon': 'lib/backbone.syphon-0.4.1',
        'backboneValidation': 'lib/backbone-validation-amd',
        'textField': 'components/TextInput/textField',
        'nativeDropdown': 'components/Dropdown/nativeDropdown',
        'constants': 'constants',
        'lap': 'lib/lap',
        'businessInfo': 'lib/business-info/businessinfo',
        'bootstrap-tooltip': 'lib/bootstrap3/tooltip',
        'moment': 'lib/moment'
    },
    useStrict: true,
    shim: {
        'dust': {
            exports: 'dust'
        },
        'dust-helpers': {
            deps: ['dust']
        },
        'dust-helpers-supplement': {
            deps: ['dust', 'dust-helpers']
        },
        'jqueryUI': {
            deps: ['jquery']
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'backboneSubroute': {
            deps: ['backbone']
        },
        'bootstrap-modal': {
            deps: ['jquery']
        }
    }
});

define("config", function(){});


require(['config'], function (config) {
    require(['jquery', 'router', 'lib/fastclick.min', 'lib/neff', 'core/error', 'lib/shim/compat', 'lib/bb-errors', 'lib/auto-submit'], function ($, Router, FastClick, neff, error) {

        'use strict';

        var $body = $('body'),
            csrf = $body.data('token'),
            contextPath = $body.data('contextPath'),
            templatePath,
            rlogIds = [];

        // awesome speed improvements on mobile
        FastClick.attach(document.body);

        // Log rlogids in the DOM for AJAX requests so automation tests can pick up the values
        $(document).ajaxComplete(function (event, xhr) {
            var pageInfo = xhr.responseJSON && xhr.responseJSON.sys && xhr.responseJSON.sys.pageInfo,
                hostName = pageInfo && pageInfo.hostName,
                rlogId = pageInfo && pageInfo.rlogId;

            // Store the last 5 rlogIds
            if (rlogId) {
                rlogIds.unshift(rlogId);
                rlogIds = rlogIds.slice(0, 5);
            }

            // Add them to the body in a data-attr where automation can pick up the values for logging
            document.body.dataset.rlogid = JSON.stringify(rlogIds);
            document.body.dataset.hostname = hostName;
        });

        // Adding CSRF token for all AJAX calls
        $.ajaxPrefilter(function (opts, origOpts, jqXHR) {
            jqXHR.setRequestHeader('X-CSRF-Token', csrf);
        });

        // Fetch all templates (non-blocking) and prime them in dust.cache
        if (neff.isEnabled('bundle')) {
            templatePath = $body.data('templatePath').replace('%s', 'dust-templates');
            require([templatePath]);
        }

        // start capturing global errors first thing
        error.start('/businessprofile/error');

        // Analytics used for tracking links and errors
        if (neff.isEnabled('analytics')) {
            Analytics.initialize();
        }

        // setup the router
        var router = new Router();

        // setup PAYPAL.Beloved.Profile for landing page
        window.PAYPAL = window.PAYPAL || {};
        window.PAYPAL.Beloved = window.PAYPAL.Beloved || {};
        window.PAYPAL.Beloved.Profile = window.PAYPAL.Beloved.Profile || {};
    });
});

define("app", function(){});

/*
 FastClick: polyfill to remove click delays on browsers with touch UIs.

 @version 0.6.7
 @codingstandard ftlabs-jsv2
 @copyright The Financial Times Limited [All Rights Reserved]
 @license MIT License (see LICENSE.txt)
 */
function FastClick(a){var b,c=this;this.trackingClick=!1;this.trackingClickStart=0;this.targetElement=null;this.lastTouchIdentifier=this.touchStartY=this.touchStartX=0;this.layer=a;if(!a||!a.nodeType)throw new TypeError("Layer must be a document node");this.onClick=function(){return FastClick.prototype.onClick.apply(c,arguments)};this.onMouse=function(){return FastClick.prototype.onMouse.apply(c,arguments)};this.onTouchStart=function(){return FastClick.prototype.onTouchStart.apply(c,arguments)};this.onTouchEnd=
	function(){return FastClick.prototype.onTouchEnd.apply(c,arguments)};this.onTouchCancel=function(){return FastClick.prototype.onTouchCancel.apply(c,arguments)};FastClick.notNeeded(a)||(this.deviceIsAndroid&&(a.addEventListener("mouseover",this.onMouse,!0),a.addEventListener("mousedown",this.onMouse,!0),a.addEventListener("mouseup",this.onMouse,!0)),a.addEventListener("click",this.onClick,!0),a.addEventListener("touchstart",this.onTouchStart,!1),a.addEventListener("touchend",this.onTouchEnd,!1),a.addEventListener("touchcancel",
	this.onTouchCancel,!1),Event.prototype.stopImmediatePropagation||(a.removeEventListener=function(d,b,c){var e=Node.prototype.removeEventListener;"click"===d?e.call(a,d,b.hijacked||b,c):e.call(a,d,b,c)},a.addEventListener=function(b,c,f){var e=Node.prototype.addEventListener;"click"===b?e.call(a,b,c.hijacked||(c.hijacked=function(a){a.propagationStopped||c(a)}),f):e.call(a,b,c,f)}),"function"===typeof a.onclick&&(b=a.onclick,a.addEventListener("click",function(a){b(a)},!1),a.onclick=null))}
FastClick.prototype.deviceIsAndroid=0<navigator.userAgent.indexOf("Android");FastClick.prototype.deviceIsIOS=/iP(ad|hone|od)/.test(navigator.userAgent);FastClick.prototype.deviceIsIOS4=FastClick.prototype.deviceIsIOS&&/OS 4_\d(_\d)?/.test(navigator.userAgent);FastClick.prototype.deviceIsIOSWithBadTarget=FastClick.prototype.deviceIsIOS&&/OS ([6-9]|\d{2})_\d/.test(navigator.userAgent);
FastClick.prototype.needsClick=function(a){switch(a.nodeName.toLowerCase()){case "button":case "select":case "textarea":if(a.disabled)return!0;break;case "input":if(this.deviceIsIOS&&"file"===a.type||a.disabled)return!0;break;case "label":case "video":return!0}return/\bneedsclick\b/.test(a.className)};
FastClick.prototype.needsFocus=function(a){switch(a.nodeName.toLowerCase()){case "textarea":case "select":return!0;case "input":switch(a.type){case "button":case "checkbox":case "file":case "image":case "radio":case "submit":return!1}return!a.disabled&&!a.readOnly;default:return/\bneedsfocus\b/.test(a.className)}};
FastClick.prototype.sendClick=function(a,b){var c,d;document.activeElement&&document.activeElement!==a&&document.activeElement.blur();d=b.changedTouches[0];c=document.createEvent("MouseEvents");c.initMouseEvent("click",!0,!0,window,1,d.screenX,d.screenY,d.clientX,d.clientY,!1,!1,!1,!1,0,null);c.forwardedTouchEvent=!0;a.dispatchEvent(c)};FastClick.prototype.focus=function(a){var b;this.deviceIsIOS&&a.setSelectionRange?(b=a.value.length,a.setSelectionRange(b,b)):a.focus()};
FastClick.prototype.updateScrollParent=function(a){var b,c;b=a.fastClickScrollParent;if(!b||!b.contains(a)){c=a;do{if(c.scrollHeight>c.offsetHeight){b=c;a.fastClickScrollParent=c;break}c=c.parentElement}while(c)}b&&(b.fastClickLastScrollTop=b.scrollTop)};FastClick.prototype.getTargetElementFromEventTarget=function(a){return a.nodeType===Node.TEXT_NODE?a.parentNode:a};
FastClick.prototype.onTouchStart=function(a){var b,c,d;if(1<a.targetTouches.length)return!0;b=this.getTargetElementFromEventTarget(a.target);c=a.targetTouches[0];if(this.deviceIsIOS){d=window.getSelection();if(d.rangeCount&&!d.isCollapsed)return!0;if(!this.deviceIsIOS4){if(c.identifier===this.lastTouchIdentifier)return a.preventDefault(),!1;this.lastTouchIdentifier=c.identifier;this.updateScrollParent(b)}}this.trackingClick=!0;this.trackingClickStart=a.timeStamp;this.targetElement=b;this.touchStartX=
	c.pageX;this.touchStartY=c.pageY;200>a.timeStamp-this.lastClickTime&&a.preventDefault();return!0};FastClick.prototype.touchHasMoved=function(a){a=a.changedTouches[0];return 10<Math.abs(a.pageX-this.touchStartX)||10<Math.abs(a.pageY-this.touchStartY)?!0:!1};FastClick.prototype.findControl=function(a){return void 0!==a.control?a.control:a.htmlFor?document.getElementById(a.htmlFor):a.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")};
FastClick.prototype.onTouchEnd=function(a){var b,c,d;d=this.targetElement;this.touchHasMoved(a)&&(this.trackingClick=!1,this.targetElement=null);if(!this.trackingClick)return!0;if(200>a.timeStamp-this.lastClickTime)return this.cancelNextClick=!0;this.lastClickTime=a.timeStamp;b=this.trackingClickStart;this.trackingClick=!1;this.trackingClickStart=0;this.deviceIsIOSWithBadTarget&&(d=a.changedTouches[0],d=document.elementFromPoint(d.pageX-window.pageXOffset,d.pageY-window.pageYOffset));c=d.tagName.toLowerCase();
	if("label"===c){if(b=this.findControl(d)){this.focus(d);if(this.deviceIsAndroid)return!1;d=b}}else if(this.needsFocus(d)){if(100<a.timeStamp-b||this.deviceIsIOS&&window.top!==window&&"input"===c)return this.targetElement=null,!1;this.focus(d);if(!this.deviceIsIOS4||"select"!==c)this.targetElement=null,a.preventDefault();return!1}if(this.deviceIsIOS&&!this.deviceIsIOS4&&(b=d.fastClickScrollParent)&&b.fastClickLastScrollTop!==b.scrollTop)return!0;this.needsClick(d)||(a.preventDefault(),this.sendClick(d,
		a));return!1};FastClick.prototype.onTouchCancel=function(){this.trackingClick=!1;this.targetElement=null};FastClick.prototype.onMouse=function(a){return!this.targetElement||a.forwardedTouchEvent||!a.cancelable?!0:!this.needsClick(this.targetElement)||this.cancelNextClick?(a.stopImmediatePropagation?a.stopImmediatePropagation():a.propagationStopped=!0,a.stopPropagation(),a.preventDefault(),!1):!0};
FastClick.prototype.onClick=function(a){if(this.trackingClick)return this.targetElement=null,this.trackingClick=!1,!0;if("submit"===a.target.type&&0===a.detail)return!0;a=this.onMouse(a);a||(this.targetElement=null);return a};
FastClick.prototype.destroy=function(){var a=this.layer;this.deviceIsAndroid&&(a.removeEventListener("mouseover",this.onMouse,!0),a.removeEventListener("mousedown",this.onMouse,!0),a.removeEventListener("mouseup",this.onMouse,!0));a.removeEventListener("click",this.onClick,!0);a.removeEventListener("touchstart",this.onTouchStart,!1);a.removeEventListener("touchend",this.onTouchEnd,!1);a.removeEventListener("touchcancel",this.onTouchCancel,!1)};
FastClick.notNeeded=function(a){var b;if("undefined"===typeof window.ontouchstart)return!0;if(/Chrome\/[0-9]+/.test(navigator.userAgent))if(FastClick.prototype.deviceIsAndroid){if((b=document.querySelector("meta[name=viewport]"))&&-1!==b.content.indexOf("user-scalable=no"))return!0}else return!0;return"none"===a.style.msTouchAction?!0:!1};FastClick.attach=function(a){return new FastClick(a)};
"undefined"!==typeof define&&define.amd?define('lib/fastclick.min',[],function(){return FastClick}):"undefined"!==typeof module&&module.exports?(module.exports=FastClick.attach,module.exports.FastClick=FastClick):window.FastClick=FastClick;
// neff - feature flags
// https://github.com/xjamundx/neff
define('lib/neff',[], function() {

	"use strict";

	// grab the features off of the <body>
	var prefix = "feature-";
	var classes = document.body.className.split(/\s/);
	var features = {};
	for (var i = 0; i < classes.length; i++) {
		if (classes[i].indexOf(prefix) === 0) {
			features[classes[i].replace(prefix, "")] = true;
		}
	}

	// return a simple API that lets us determine if features are available
	// Ex: if (feature.isEnabled("your-feature")) { /* ... */ }
	return {
		isEnabled: function(feature) {
			return features[feature];
		}
	};
});
/*!
 * jQuery JavaScript Library v1.12.4
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-05-20T17:17Z
 */

(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//"use strict";
var deletedIds = [];

var document = window.document;

var slice = deletedIds.slice;

var concat = deletedIds.concat;

var push = deletedIds.push;

var indexOf = deletedIds.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	version = "1.12.4",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1, IE<9
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: deletedIds.sort,
	splice: deletedIds.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = jQuery.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type( obj ) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {

		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		// adding 1 corrects loss of precision from parseFloat (#15100)
		var realStringObj = obj && obj.toString();
		return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {

			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call( obj, "constructor" ) &&
				!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {

			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( !support.ownFirst ) {
			for ( key in obj ) {
				return hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {

			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data ); // jscs:ignore requireDotNotation
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1, IE<9
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( indexOf ) {
				return indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {

				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		while ( j < len ) {
			first[ i++ ] = second[ j++ ];
		}

		// Support: IE<9
		// Workaround casting of .length to NaN on otherwise arraylike objects (e.g., NodeLists)
		if ( len !== len ) {
			while ( second[ j ] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: function() {
		return +( new Date() );
	},

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

// JSHint would error on this code due to the Symbol not being defined in ES5.
// Defining this global in .jshintrc would create a danger of using the global
// unguarded in another place, it seems safer to just disable JSHint for these
// three lines.
/* jshint ignore: start */
if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = deletedIds[ Symbol.iterator ];
}
/* jshint ignore: end */

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: iOS 8.2 (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.2.1
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-10-17
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, nidselect, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
					while ( i-- ) {
						groups[i] = nidselect + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, parent,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( (parent = document.defaultView) && parent.top !== parent ) {
		// Support: IE 11
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( document.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var m = context.getElementById( id );
				return m ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibing-combinator selector` fails
			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( (oldCache = uniqueCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		} );

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) > -1 ) !== not;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// init accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt( 0 ) === "<" &&
				selector.charAt( selector.length - 1 ) === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {

						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[ 2 ] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[ 0 ] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof root.ready !== "undefined" ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter( function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

				// Always skip document fragments
				if ( cur.nodeType < 11 && ( pos ?
					pos.index( cur ) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector( cur, selectors ) ) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[ 0 ], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem, this );
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.uniqueSort( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
} );
var rnotwhite = ( /\S+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = true;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks( "once memory" ), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks( "memory" ) ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];

							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this === promise ? newDefer.promise() : this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add( function() {

					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 ||
				( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred.
			// If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );

					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.progress( updateFunc( i, progressContexts, progressValues ) )
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
} );


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {

	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
} );

/**
 * Clean-up method for dom ready events
 */
function detach() {
	if ( document.addEventListener ) {
		document.removeEventListener( "DOMContentLoaded", completed );
		window.removeEventListener( "load", completed );

	} else {
		document.detachEvent( "onreadystatechange", completed );
		window.detachEvent( "onload", completed );
	}
}

/**
 * The ready event handler and self cleanup method
 */
function completed() {

	// readyState === "complete" is good enough for us to call the dom ready in oldIE
	if ( document.addEventListener ||
		window.event.type === "load" ||
		document.readyState === "complete" ) {

		detach();
		jQuery.ready();
	}
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called
		// after the browser event has already occurred.
		// Support: IE6-10
		// Older IE sometimes signals "interactive" too soon
		if ( document.readyState === "complete" ||
			( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

			// Handle it asynchronously to allow scripts the opportunity to delay ready
			window.setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed );

		// If IE event model is used
		} else {

			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch ( e ) {}

			if ( top && top.doScroll ) {
				( function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {

							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll( "left" );
						} catch ( e ) {
							return window.setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				} )();
			}
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Support: IE<9
// Iteration over object's inherited properties before its own
var i;
for ( i in jQuery( support ) ) {
	break;
}
support.ownFirst = i === "0";

// Note: most support tests are defined in their respective modules.
// false until the test is run
support.inlineBlockNeedsLayout = false;

// Execute ASAP in case we need to set body.style.zoom
jQuery( function() {

	// Minified: var a,b,c,d
	var val, div, body, container;

	body = document.getElementsByTagName( "body" )[ 0 ];
	if ( !body || !body.style ) {

		// Return for frameset docs that don't have a body
		return;
	}

	// Setup
	div = document.createElement( "div" );
	container = document.createElement( "div" );
	container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
	body.appendChild( container ).appendChild( div );

	if ( typeof div.style.zoom !== "undefined" ) {

		// Support: IE<8
		// Check if natively block-level elements act like inline-block
		// elements when setting their display to 'inline' and giving
		// them layout
		div.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";

		support.inlineBlockNeedsLayout = val = div.offsetWidth === 3;
		if ( val ) {

			// Prevent IE 6 from affecting layout for positioned elements #11048
			// Prevent IE from shrinking the body in IE 7 mode #12869
			// Support: IE<8
			body.style.zoom = 1;
		}
	}

	body.removeChild( container );
} );


( function() {
	var div = document.createElement( "div" );

	// Support: IE<9
	support.deleteExpando = true;
	try {
		delete div.test;
	} catch ( e ) {
		support.deleteExpando = false;
	}

	// Null elements to avoid leaks in IE.
	div = null;
} )();
var acceptData = function( elem ) {
	var noData = jQuery.noData[ ( elem.nodeName + " " ).toLowerCase() ],
		nodeType = +elem.nodeType || 1;

	// Do not set data on non-element DOM nodes because it will not be cleared (#8335).
	return nodeType !== 1 && nodeType !== 9 ?
		false :

		// Nodes accept data unless otherwise specified; rejection can be conditional
		!noData || noData !== true && elem.getAttribute( "classid" ) === noData;
};




var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;

function dataAttr( elem, key, data ) {

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :

					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[ name ] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}

function internalData( elem, name, data, pvt /* Internal Use Only */ ) {
	if ( !acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( ( !id || !cache[ id ] || ( !pvt && !cache[ id ].data ) ) &&
		data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {

		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {

		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split( " " );
					}
				}
			} else {

				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[ i ] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject( thisCache ) : !jQuery.isEmptyObject( thisCache ) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, undefined
	} else {
		cache[ id ] = undefined;
	}
}

jQuery.extend( {
	cache: {},

	// The following elements (space-suffixed to avoid Object.prototype collisions)
	// throw uncatchable exceptions if you attempt to set expando properties
	noData: {
		"applet ": true,
		"embed ": true,

		// ...but Flash objects (which have this classid) *can* handle expandos
		"object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[ jQuery.expando ] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				jQuery.data( this, key );
			} );
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each( function() {
				jQuery.data( this, key, value );
			} ) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : undefined;
	},

	removeData: function( key ) {
		return this.each( function() {
			jQuery.removeData( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object,
	// or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );


( function() {
	var shrinkWrapBlocksVal;

	support.shrinkWrapBlocks = function() {
		if ( shrinkWrapBlocksVal != null ) {
			return shrinkWrapBlocksVal;
		}

		// Will be changed later if needed.
		shrinkWrapBlocksVal = false;

		// Minified: var b,c,d
		var div, body, container;

		body = document.getElementsByTagName( "body" )[ 0 ];
		if ( !body || !body.style ) {

			// Test fired too early or in an unsupported environment, exit.
			return;
		}

		// Setup
		div = document.createElement( "div" );
		container = document.createElement( "div" );
		container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
		body.appendChild( container ).appendChild( div );

		// Support: IE6
		// Check if elements with layout shrink-wrap their children
		if ( typeof div.style.zoom !== "undefined" ) {

			// Reset CSS: box-sizing; display; margin; border
			div.style.cssText =

				// Support: Firefox<29, Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;" +
				"padding:1px;width:1px;zoom:1";
			div.appendChild( document.createElement( "div" ) ).style.width = "5px";
			shrinkWrapBlocksVal = div.offsetWidth !== 3;
		}

		body.removeChild( container );

		return shrinkWrapBlocksVal;
	};

} )();
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {

		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" ||
			!jQuery.contains( elem.ownerDocument, elem );
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() { return tween.cur(); } :
			function() { return jQuery.css( elem, prop, "" ); },
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		length = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < length; i++ ) {
				fn(
					elems[ i ],
					key,
					raw ? value : value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			length ? fn( elems[ 0 ], key ) : emptyGet;
};
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([\w:-]+)/ );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );

var rleadingWhitespace = ( /^\s+/ );

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|" +
		"details|dialog|figcaption|figure|footer|header|hgroup|main|" +
		"mark|meter|nav|output|picture|progress|section|summary|template|time|video";



function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}


( function() {
	var div = document.createElement( "div" ),
		fragment = document.createDocumentFragment(),
		input = document.createElement( "input" );

	// Setup
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName( "tbody" ).length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName( "link" ).length;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone =
		document.createElement( "nav" ).cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	input.type = "checkbox";
	input.checked = true;
	fragment.appendChild( input );
	support.appendChecked = input.checked;

	// Make sure textarea (and checkbox) defaultValue is properly cloned
	// Support: IE6-IE11+
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// #11217 - WebKit loses check when the name is after the checked attribute
	fragment.appendChild( div );

	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input = document.createElement( "input" );
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Cloned elements keep attachEvent handlers, we use addEventListener on IE9+
	support.noCloneEvent = !!div.addEventListener;

	// Support: IE<9
	// Since attributes and properties are the same in IE,
	// cleanData must set properties to undefined rather than use removeAttribute
	div[ jQuery.expando ] = 1;
	support.attributes = !div.getAttribute( jQuery.expando );
} )();


// We have to close these tags to support XHTML (#13200)
var wrapMap = {
	option: [ 1, "<select multiple='multiple'>", "</select>" ],
	legend: [ 1, "<fieldset>", "</fieldset>" ],
	area: [ 1, "<map>", "</map>" ],

	// Support: IE8
	param: [ 1, "<object>", "</object>" ],
	thead: [ 1, "<table>", "</table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
	// unless wrapped in a div with non-breaking characters in front of it.
	_default: support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>" ]
};

// Support: IE8-IE9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== "undefined" ?
				context.querySelectorAll( tag || "*" ) :
				undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context;
			( elem = elems[ i ] ) != null;
			i++
		) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; ( elem = elems[ i ] ) != null; i++ ) {
		jQuery._data(
			elem,
			"globalEval",
			!refElements || jQuery._data( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/,
	rtbody = /<tbody/i;

function fixDefaultChecked( elem ) {
	if ( rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

function buildFragment( elems, context, scripts, selection, ignored ) {
	var j, elem, contains,
		tmp, tag, tbody, wrap,
		l = elems.length,

		// Ensure a safe fragment
		safe = createSafeFragment( context ),

		nodes = [],
		i = 0;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || safe.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;

				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Manually add leading whitespace removed by IE
				if ( !support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
					nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[ 0 ] ) );
				}

				// Remove IE's autoinserted <tbody> from table fragments
				if ( !support.tbody ) {

					// String was a <table>, *may* have spurious <tbody>
					elem = tag === "table" && !rtbody.test( elem ) ?
						tmp.firstChild :

						// String was a bare <thead> or <tfoot>
						wrap[ 1 ] === "<table>" && !rtbody.test( elem ) ?
							tmp :
							0;

					j = elem && elem.childNodes.length;
					while ( j-- ) {
						if ( jQuery.nodeName( ( tbody = elem.childNodes[ j ] ), "tbody" ) &&
							!tbody.childNodes.length ) {

							elem.removeChild( tbody );
						}
					}
				}

				jQuery.merge( nodes, tmp.childNodes );

				// Fix #12392 for WebKit and IE > 9
				tmp.textContent = "";

				// Fix #12392 for oldIE
				while ( tmp.firstChild ) {
					tmp.removeChild( tmp.firstChild );
				}

				// Remember the top-level container for proper cleanup
				tmp = safe.lastChild;
			}
		}
	}

	// Fix #11356: Clear elements from fragment
	if ( tmp ) {
		safe.removeChild( tmp );
	}

	// Reset defaultChecked for any radios and checkboxes
	// about to be appended to the DOM in IE 6/7 (#8060)
	if ( !support.appendChecked ) {
		jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
	}

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}

			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( safe.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	tmp = null;

	return safe;
}


( function() {
	var i, eventName,
		div = document.createElement( "div" );

	// Support: IE<9 (lack submit/change bubble), Firefox (lack focus(in | out) events)
	for ( i in { submit: true, change: true, focusin: true } ) {
		eventName = "on" + i;

		if ( !( support[ i ] = eventName in window ) ) {

			// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
			div.setAttribute( eventName, "t" );
			support[ i ] = div.attributes[ eventName ].expando === false;
		}
	}

	// Null elements to avoid leaks in IE.
	div = null;
} )();


var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE9
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" &&
					( !e || jQuery.event.triggered !== e.type ) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};

			// Add elem as a property of the handle fn to prevent a memory leak
			// with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] &&
				jQuery._data( cur, "handle" );

			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if (
				( !special._default ||
				 special._default.apply( eventPath.pop(), data ) === false
				) && acceptData( elem )
			) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {

						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Support (at least): Chrome, IE9
		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		//
		// Support: Firefox<=42+
		// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
		if ( delegateCount && cur.nodeType &&
			( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push( { elem: cur, handlers: matches } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Safari 6-8+
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
		"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split( " " ),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: ( "button buttons clientX clientY fromElement offsetX offsetY " +
			"pageX pageY screenX screenY toElement" ).split( " " ),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX +
					( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
					( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY +
					( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
					( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ?
					original.toElement :
					fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {

						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	// Piggyback on a donor event to simulate a different one
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true

				// Previously, `originalEvent: {}` was set here, so stopPropagation call
				// would not be triggered on donor event, since in our own
				// jQuery.event.stopPropagation function we had a check for existence of
				// originalEvent.stopPropagation method, so, consequently it would be a noop.
				//
				// Guard for simulated events was moved to jQuery.event.stopPropagation function
				// since `originalEvent` should point to the original event for the
				// constancy with other events and for more focused logic
			}
		);

		jQuery.event.trigger( e, null, elem );

		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {

		// This "if" is needed for plain objects
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event,
			// to properly expose it to GC
			if ( typeof elem[ name ] === "undefined" ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: IE < 9, Android < 4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( !e || this.isSimulated ) {
			return;
		}

		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && e.stopImmediatePropagation ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://code.google.com/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

// IE submit delegation
if ( !support.submit ) {

	jQuery.event.special.submit = {
		setup: function() {

			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {

				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ?

						// Support: IE <=8
						// We use jQuery.prop instead of elem.form
						// to allow fixing the IE8 delegated submit issue (gh-2332)
						// by 3rd party polyfills/workarounds.
						jQuery.prop( elem, "form" ) :
						undefined;

				if ( form && !jQuery._data( form, "submit" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submitBubble = true;
					} );
					jQuery._data( form, "submit", true );
				}
			} );

			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {

			// If form was submitted by the user, bubble the event up the tree
			if ( event._submitBubble ) {
				delete event._submitBubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event );
				}
			}
		},

		teardown: function() {

			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !support.change ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {

				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._justChanged = true;
						}
					} );
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._justChanged && !event.isTrigger ) {
							this._justChanged = false;
						}

						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event );
					} );
				}
				return false;
			}

			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "change" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event );
						}
					} );
					jQuery._data( elem, "change", true );
				}
			} );
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger ||
				( elem.type !== "radio" && elem.type !== "checkbox" ) ) {

				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Support: Firefox
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome, Safari
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				jQuery._data( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					jQuery._removeData( doc, fix );
				} else {
					jQuery._data( doc, fix, attaches );
				}
			}
		};
	} );
}

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	},

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


var rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp( "<(?:" + nodeNames + ")[\\s/>]", "i" ),
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,

	// Support: IE 10-11, Edge 10240+
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement( "div" ) );

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName( "tbody" )[ 0 ] ||
			elem.appendChild( elem.ownerDocument.createElement( "tbody" ) ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( jQuery.find.attr( elem, "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}
	return elem;
}

function cloneCopyEvent( src, dest ) {
	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( support.html5Clone && ( src.innerHTML && !jQuery.trim( dest.innerHTML ) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {

		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var first, node, hasScripts,
		scripts, doc, fragment,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android<4.1, PhantomJS<2
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!jQuery._data( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							jQuery.globalEval(
								( node.text || node.textContent || node.innerHTML || "" )
									.replace( rcleanScript, "" )
							);
						}
					}
				}
			}

			// Fix #11809: Avoid leaking memory
			fragment = first = null;
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		elems = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = elems[ i ] ) != null; i++ ) {

		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( support.html5Clone || jQuery.isXMLDoc( elem ) ||
			!rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {

			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( ( !support.noCloneEvent || !support.noCloneChecked ) &&
				( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; ( node = srcElements[ i ] ) != null; ++i ) {

				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[ i ] ) {
					fixCloneNodeIssues( node, destElements[ i ] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; ( node = srcElements[ i ] ) != null; i++ ) {
					cloneCopyEvent( node, destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems, /* internal */ forceAcceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			attributes = support.attributes,
			special = jQuery.event.special;

		for ( ; ( elem = elems[ i ] ) != null; i++ ) {
			if ( forceAcceptData || acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// Support: IE<9
						// IE does not allow us to delete expando properties from nodes
						// IE creates expando attributes along with the property
						// IE does not have a removeAttribute function on Document nodes
						if ( !attributes && typeof elem.removeAttribute !== "undefined" ) {
							elem.removeAttribute( internalKey );

						// Webkit & Blink performance suffers when deleting properties
						// from DOM nodes, so set to undefined instead
						// https://code.google.com/p/chromium/issues/detail?id=378607
						} else {
							elem[ internalKey ] = undefined;
						}

						deletedIds.push( id );
					}
				}
			}
		}
	}
} );

jQuery.fn.extend( {

	// Keep domManip exposed until 3.0 (gh-2225)
	domManip: domManip,

	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append(
					( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value )
				);
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {

			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {

						// Remove element nodes and prevent memory leaks
						elem = this[ i ] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );


var iframe,
	elemdisplay = {

		// Support: Firefox
		// We have to pre-define these values for FF (#10227)
		HTML: "block",
		BODY: "block"
	};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */

// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		display = jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
				.appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[ 0 ].contentWindow || iframe[ 0 ].contentDocument ).document;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var documentElement = document.documentElement;



( function() {
	var pixelPositionVal, pixelMarginRightVal, boxSizingReliableVal,
		reliableHiddenOffsetsVal, reliableMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	div.style.cssText = "float:left;opacity:.5";

	// Support: IE<9
	// Make sure that element opacity exists (as opposed to filter)
	support.opacity = div.style.opacity === "0.5";

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!div.style.cssFloat;

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container = document.createElement( "div" );
	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	div.innerHTML = "";
	container.appendChild( div );

	// Support: Firefox<29, Android 2.3
	// Vendor-prefix box-sizing
	support.boxSizing = div.style.boxSizing === "" || div.style.MozBoxSizing === "" ||
		div.style.WebkitBoxSizing === "";

	jQuery.extend( support, {
		reliableHiddenOffsets: function() {
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableHiddenOffsetsVal;
		},

		boxSizingReliable: function() {

			// We're checking for pixelPositionVal here instead of boxSizingReliableVal
			// since that compresses better and they're computed together anyway.
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return boxSizingReliableVal;
		},

		pixelMarginRight: function() {

			// Support: Android 4.0-4.3
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return pixelMarginRightVal;
		},

		pixelPosition: function() {
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return pixelPositionVal;
		},

		reliableMarginRight: function() {

			// Support: Android 2.3
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableMarginRightVal;
		},

		reliableMarginLeft: function() {

			// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableMarginLeftVal;
		}
	} );

	function computeStyleTests() {
		var contents, divStyle,
			documentElement = document.documentElement;

		// Setup
		documentElement.appendChild( container );

		div.style.cssText =

			// Support: Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";

		// Support: IE<9
		// Assume reasonable values in the absence of getComputedStyle
		pixelPositionVal = boxSizingReliableVal = reliableMarginLeftVal = false;
		pixelMarginRightVal = reliableMarginRightVal = true;

		// Check for getComputedStyle so that this code is not run in IE<9.
		if ( window.getComputedStyle ) {
			divStyle = window.getComputedStyle( div );
			pixelPositionVal = ( divStyle || {} ).top !== "1%";
			reliableMarginLeftVal = ( divStyle || {} ).marginLeft === "2px";
			boxSizingReliableVal = ( divStyle || { width: "4px" } ).width === "4px";

			// Support: Android 4.0 - 4.3 only
			// Some styles come back with percentage values, even though they shouldn't
			div.style.marginRight = "50%";
			pixelMarginRightVal = ( divStyle || { marginRight: "4px" } ).marginRight === "4px";

			// Support: Android 2.3 only
			// Div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			contents = div.appendChild( document.createElement( "div" ) );

			// Reset CSS: box-sizing; display; margin; border; padding
			contents.style.cssText = div.style.cssText =

				// Support: Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
			contents.style.marginRight = contents.style.width = "0";
			div.style.width = "1px";

			reliableMarginRightVal =
				!parseFloat( ( window.getComputedStyle( contents ) || {} ).marginRight );

			div.removeChild( contents );
		}

		// Support: IE6-8
		// First check that getClientRects works as expected
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.style.display = "none";
		reliableHiddenOffsetsVal = div.getClientRects().length === 0;
		if ( reliableHiddenOffsetsVal ) {
			div.style.display = "";
			div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
			div.childNodes[ 0 ].style.borderCollapse = "separate";
			contents = div.getElementsByTagName( "td" );
			contents[ 0 ].style.cssText = "margin:0;border:0;padding:0;display:none";
			reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
			if ( reliableHiddenOffsetsVal ) {
				contents[ 0 ].style.display = "";
				contents[ 1 ].style.display = "none";
				reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
			}
		}

		// Teardown
		documentElement.removeChild( container );
	}

} )();


var getStyles, curCSS,
	rposition = /^(top|right|bottom|left)$/;

if ( window.getComputedStyle ) {
	getStyles = function( elem ) {

		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

	curCSS = function( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;

		computed = computed || getStyles( elem );

		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

		// Support: Opera 12.1x only
		// Fall back to style even without computed
		// computed is undefined for elems on document fragments
		if ( ( ret === "" || ret === undefined ) && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		if ( computed ) {

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value"
			// instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values,
			// but width seems to be reliably pixels
			// this is against the CSSOM draft spec:
			// http://dev.w3.org/csswg/cssom/#resolved-values
			if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "";
	};
} else if ( documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, computed ) {
		var left, rs, rsLeft, ret,
			style = elem.style;

		computed = computed || getStyles( elem );
		ret = computed ? computed[ name ] : undefined;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are
		// proportional to the parent element instead
		// and we can't measure the parent instead because it
		// might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "" || "auto";
	};
}




function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

		ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/i,

	// swappable if display is none or starts with table except
	// "table", "table-cell", or "table-caption"
	// see here for display values:
	// https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;


// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt( 0 ).toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {

			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] =
					jQuery._data( elem, "olddisplay", defaultDisplay( elem.nodeName ) );
			}
		} else {
			hidden = isHidden( elem );

			if ( display && display !== "none" || !hidden ) {
				jQuery._data(
					elem,
					"olddisplay",
					hidden ? display : jQuery.css( elem, "display" )
				);
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?

		// If we already have the right measurement, avoid augmentation
		4 :

		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {

		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = support.boxSizing &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {

		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test( val ) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {

		// normalize float css property
		"float": support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set. See: #7116
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight
			// (for every problematic property) identical functions
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				// Support: IE
				// Swallow errors from 'invalid' CSS values (#5509)
				try {
					style[ name ] = value;
				} catch ( e ) {}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}
		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
					elem.offsetWidth === 0 ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					support.boxSizing &&
						jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
} );

if ( !support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {

			// IE uses filters for opacity
			return ropacity.test( ( computed && elem.currentStyle ?
				elem.currentStyle.filter :
				elem.style.filter ) || "" ) ?
					( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
					computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist -
			// attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule
				// or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			return swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return (
				parseFloat( curCSS( elem, "marginLeft" ) ) ||

				// Support: IE<=11+
				// Running getBoundingClientRect on a disconnected node in IE throws an error
				// Support: IE8 only
				// getClientRects() errors on disconnected elems
				( jQuery.contains( elem.ownerDocument, elem ) ?
					elem.getBoundingClientRect().left -
						swap( elem, { marginLeft: 0 }, function() {
							return elem.getBoundingClientRect().left;
						} ) :
					0
				)
			) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// we're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {

		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			jQuery._data( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !support.inlineBlockNeedsLayout || defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";
			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !support.shrinkWrapBlocks() ) {
			anim.always( function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			} );
		}
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show
				// and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done( function() {
				jQuery( elem ).hide();
			} );
		}
		anim.done( function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		} );
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( ( display === "none" ? defaultDisplay( elem.nodeName ) : display ) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnotwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ?
			jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	window.clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var a,
		input = document.createElement( "input" ),
		div = document.createElement( "div" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	// Setup
	div = document.createElement( "div" );
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Support: Windows Web Apps (WWA)
	// `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "checkbox" );
	div.appendChild( input );

	a = div.getElementsByTagName( "a" )[ 0 ];

	// First batch of tests.
	a.style.cssText = "top:1px";

	// Test setAttribute on camelCase class.
	// If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute( "style" ) );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute( "href" ) === "/a";

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement( "form" ).enctype;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE8 only
	// Check if we can trust getAttribute("value")
	input = document.createElement( "input" );
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";
} )();


var rreturn = /\r/g,
	rspaces = /[\x20\t\r\n\f]+/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if (
					hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?

					// handle most common string cases
					ret.replace( rreturn, "" ) :

					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					jQuery.trim( jQuery.text( elem ) ).replace( rspaces, " " );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ?
								!option.disabled :
								option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled ||
								!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					if ( jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1 ) {

						// Support: IE6
						// When new option element is added to select box we need to
						// force reflow of newly added node in order to workaround delay
						// of initialization properties
						try {
							option.selected = optionSet = true;

						} catch ( _ ) {

							// Will be executed only in IE6
							option.scrollHeight;
						}

					} else {
						option.selected = false;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}

				return options;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = support.getSetAttribute,
	getSetInput = support.input;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {

					// Setting the type on a radio button after the value resets the value in IE8-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {

					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;

					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {

			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		} else {

			// Support: IE<9
			// Use defaultChecked and defaultSelected for oldIE
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
		attrHandle[ name ] = function( elem, name, isXML ) {
			var ret, handle;
			if ( !isXML ) {

				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ name ];
				attrHandle[ name ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					name.toLowerCase() :
					null;
				attrHandle[ name ] = handle;
			}
			return ret;
		};
	} else {
		attrHandle[ name ] = function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
			}
		};
	}
} );

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {

				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {

				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {

			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					( ret = elem.ownerDocument.createAttribute( name ) )
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			if ( name === "value" || value === elem.getAttribute( name ) ) {
				return value;
			}
		}
	};

	// Some attributes are constructed with empty-string values when not defined
	attrHandle.id = attrHandle.name = attrHandle.coords =
		function( elem, name, isXML ) {
			var ret;
			if ( !isXML ) {
				return ( ret = elem.getAttributeNode( name ) ) && ret.value !== "" ?
					ret.value :
					null;
			}
		};

	// Fixing value retrieval on a button requires this module
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			if ( ret && ret.specified ) {
				return ret.value;
			}
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each( [ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	} );
}

if ( !support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {

			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case sensitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}




var rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each( function() {

			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch ( e ) {}
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) ||
						rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							-1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !support.hrefNormalized ) {

	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each( [ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	} );
}

// Support: Safari, IE9+
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		},
		set: function( elem ) {
			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );

// IE6/7 call enctype encoding
if ( !support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}




var rclass = /[\t\r\n\f]/g;

function getClass( elem ) {
	return jQuery.attr( elem, "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						jQuery.attr( elem, "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						jQuery.attr( elem, "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnotwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// store className if set
					jQuery._data( this, "__className__", className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				jQuery.attr( this, "class",
					className || value === false ?
					"" :
					jQuery._data( this, "__className__" ) || ""
				);
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + getClass( elem ) + " " ).replace( rclass, " " )
					.indexOf( className ) > -1
			) {
				return true;
			}
		}

		return false;
	}
} );




// Return jQuery for attributes-only inclusion


jQuery.each( ( "blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );


var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;

jQuery.parseJSON = function( data ) {

	// Attempt to parse using the native JSON parser first
	if ( window.JSON && window.JSON.parse ) {

		// Support: Android 2.3
		// Workaround failure to string-cast null input
		return window.JSON.parse( data + "" );
	}

	var requireNonComma,
		depth = null,
		str = jQuery.trim( data + "" );

	// Guard against invalid (and possibly dangerous) input by ensuring that nothing remains
	// after removing valid tokens
	return str && !jQuery.trim( str.replace( rvalidtokens, function( token, comma, open, close ) {

		// Force termination if we see a misplaced comma
		if ( requireNonComma && comma ) {
			depth = 0;
		}

		// Perform no more replacements after returning to outermost depth
		if ( depth === 0 ) {
			return token;
		}

		// Commas must not follow "[", "{", or ","
		requireNonComma = open || comma;

		// Determine new depth
		// array/object open ("[" or "{"): depth += true - false (increment)
		// array/object close ("]" or "}"): depth += false - true (decrement)
		// other cases ("," or primitive): depth += true - true (numeric cast)
		depth += !close - !open;

		// Remove this token
		return "";
	} ) ) ?
		( Function( "return " + str ) )() :
		jQuery.error( "Invalid JSON: " + data );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	try {
		if ( window.DOMParser ) { // Standard
			tmp = new window.DOMParser();
			xml = tmp.parseFromString( data, "text/xml" );
		} else { // IE
			xml = new window.ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		}
	} catch ( e ) {
		xml = undefined;
	}
	if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,

	// IE leaves an \r character at EOL
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Document location
	ajaxLocation = location.href,

	// Segment location into parts
	ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType.charAt( 0 ) === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) { // jscs:ignore requireDotNotation
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var

			// Cross-domain detection vars
			parts,

			// Loop variable
			i,

			// URL without anti-cache param
			cacheURL,

			// Response headers as string
			responseHeadersString,

			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,

			// Response headers
			responseHeaders,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// The jqXHR state
			state = 0,

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {

								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" )
			.replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( state === 2 ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );

				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapAll( html.call( this, i ) );
			} );
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			var wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function() {
		return this.parent().each( function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		} ).end();
	}
} );


function getDisplay( elem ) {
	return elem.style && elem.style.display || jQuery.css( elem, "display" );
}

function filterHidden( elem ) {

	// Disconnected elements are considered hidden
	if ( !jQuery.contains( elem.ownerDocument || document, elem ) ) {
		return true;
	}
	while ( elem && elem.nodeType === 1 ) {
		if ( getDisplay( elem ) === "none" || elem.type === "hidden" ) {
			return true;
		}
		elem = elem.parentNode;
	}
	return false;
}

jQuery.expr.filters.hidden = function( elem ) {

	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return support.reliableHiddenOffsets() ?
		( elem.offsetWidth <= 0 && elem.offsetHeight <= 0 &&
			!elem.getClientRects().length ) :
			filterHidden( elem );
};

jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {

			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					} ) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject !== undefined ?

	// Support: IE6-IE8
	function() {

		// XHR cannot access local files, always use ActiveX for that case
		if ( this.isLocal ) {
			return createActiveXHR();
		}

		// Support: IE 9-11
		// IE seems to error on cross-domain PATCH requests when ActiveX XHR
		// is used. In IE 9+ always use the native XHR.
		// Note: this condition won't catch Edge as it doesn't define
		// document.documentMode but it also doesn't support ActiveX so it won't
		// reach this code.
		if ( document.documentMode > 8 ) {
			return createStandardXHR();
		}

		// Support: IE<9
		// oldIE XHR does not support non-RFC2616 methods (#13240)
		// See http://msdn.microsoft.com/en-us/library/ie/ms536648(v=vs.85).aspx
		// and http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9
		// Although this check for six methods instead of eight
		// since IE also does not support "trace" and "connect"
		return /^(get|post|head|put|delete|options)$/i.test( this.type ) &&
			createStandardXHR() || createActiveXHR();
	} :

	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

var xhrId = 0,
	xhrCallbacks = {},
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE<10
// Open requests must be manually aborted on unload (#5280)
// See https://support.microsoft.com/kb/2856746 for more info
if ( window.attachEvent ) {
	window.attachEvent( "onunload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	} );
}

// Determine support properties
support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport( function( options ) {

		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !options.crossDomain || support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr(),
						id = ++xhrId;

					// Open the socket
					xhr.open(
						options.type,
						options.url,
						options.async,
						options.username,
						options.password
					);

					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Set headers
					for ( i in headers ) {

						// Support: IE<9
						// IE's ActiveXObject throws a 'Type Mismatch' exception when setting
						// request header to a null-value.
						//
						// To keep consistent with other XHR implementations, cast the value
						// to string and ignore `undefined`.
						if ( headers[ i ] !== undefined ) {
							xhr.setRequestHeader( i, headers[ i ] + "" );
						}
					}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( options.hasContent && options.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, statusText, responses;

						// Was never called and is aborted or complete
						if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

							// Clean up
							delete xhrCallbacks[ id ];
							callback = undefined;
							xhr.onreadystatechange = jQuery.noop;

							// Abort manually if needed
							if ( isAbort ) {
								if ( xhr.readyState !== 4 ) {
									xhr.abort();
								}
							} else {
								responses = {};
								status = xhr.status;

								// Support: IE<10
								// Accessing binary-data responseText throws an exception
								// (#11426)
								if ( typeof xhr.responseText === "string" ) {
									responses.text = xhr.responseText;
								}

								// Firefox throws an exception when accessing
								// statusText for faulty cross-domain requests
								try {
									statusText = xhr.statusText;
								} catch ( e ) {

									// We normalize with Webkit giving an empty statusText
									statusText = "";
								}

								// Filter status for non standard behaviors

								// If the request is local and we have data: assume a success
								// (success with no data won't get notified, that's the best we
								// can do given current implementations)
								if ( !status && options.isLocal && !options.crossDomain ) {
									status = responses.text ? 200 : 404;

								// IE - #1450: sometimes returns 1223 when it should be 204
								} else if ( status === 1223 ) {
									status = 204;
								}
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, xhr.getAllResponseHeaders() );
						}
					};

					// Do send the request
					// `xhr.send` may raise an exception, but it will be
					// handled in jQuery.ajax (so no try/catch here)
					if ( !options.async ) {

						// If we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {

						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						window.setTimeout( callback );
					} else {

						// Register the callback, but delay it in case `xhr.send` throws
						// Add to the list of active xhr callbacks
						xhr.onreadystatechange = xhrCallbacks[ id ] = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	} );
}

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch ( e ) {}
}




// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery( "head" )[ 0 ] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// data: string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = jQuery.trim( url.slice( off, url.length ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};





/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			jQuery.inArray( "auto", [ curCSSTop, curCSSLeft ] ) > -1;

		// need to be able to calculate position if either top or left
		// is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var docElem, win,
			box = { top: 0, left: 0 },
			elem = this[ 0 ],
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// If we don't have gBCR, just use 0,0 rather than error
		// BlackBerry 5, iOS 3 (original iPhone)
		if ( typeof elem.getBoundingClientRect !== "undefined" ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
			left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? ( prop in win ) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
} );

// Support: Safari<7-8+, Chrome<37-44+
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// getComputedStyle returns percent when specified for top/left/bottom/right
// rather than make the css module depend on the offset module, we just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// if curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
	function( defaultExtra, funcName ) {

		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only,
					// but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}



var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in
// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}

return jQuery;
}));

define("lib/jquery-1.12.4", function(){});

/**
 * @license
 * Lo-Dash 2.3.0 (Custom Build) <http://lodash.com/>
 * Build: `lodash underscore exports="amd,commonjs,global,node" -o ./dist/lodash.underscore.js`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
;(function() {

	/** Used as a safe reference for `undefined` in pre ES5 environments */
	var undefined;

	/** Used to generate unique IDs */
	var idCounter = 0;

	/** Used internally to indicate various things */
	var indicatorObject = {};

	/** Used to prefix keys to avoid issues with `__proto__` and properties on `Object.prototype` */
	var keyPrefix = +new Date + '';

	/** Used to match "interpolate" template delimiters */
	var reInterpolate = /<%=([\s\S]+?)%>/g;

	/** Used to ensure capturing order of template delimiters */
	var reNoMatch = /($^)/;

	/** Used to match unescaped characters in compiled string literals */
	var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;

	/** `Object#toString` result shortcuts */
	var argsClass = '[object Arguments]',
		arrayClass = '[object Array]',
		boolClass = '[object Boolean]',
		dateClass = '[object Date]',
		funcClass = '[object Function]',
		numberClass = '[object Number]',
		objectClass = '[object Object]',
		regexpClass = '[object RegExp]',
		stringClass = '[object String]';

	/** Used to determine if values are of the language type Object */
	var objectTypes = {
		'boolean': false,
		'function': true,
		'object': true,
		'number': false,
		'string': false,
		'undefined': false
	};

	/** Used to escape characters for inclusion in compiled string literals */
	var stringEscapes = {
		'\\': '\\',
		"'": "'",
		'\n': 'n',
		'\r': 'r',
		'\t': 't',
		'\u2028': 'u2028',
		'\u2029': 'u2029'
	};

	/** Used as a reference to the global object */
	var root = (objectTypes[typeof window] && window) || this;

	/** Detect free variable `exports` */
	var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

	/** Detect free variable `module` */
	var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports` */
	var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

	/** Detect free variable `global` from Node.js or Browserified code and use it as `root` */
	var freeGlobal = objectTypes[typeof global] && global;
	if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	/**
	 * The base implementation of `_.indexOf` without support for binary searches
	 * or `fromIndex` constraints.
	 *
	 * @private
	 * @param {Array} array The array to search.
	 * @param {*} value The value to search for.
	 * @param {number} [fromIndex=0] The index to search from.
	 * @returns {number} Returns the index of the matched value or `-1`.
	 */
	function baseIndexOf(array, value, fromIndex) {
		var index = (fromIndex || 0) - 1,
			length = array ? array.length : 0;

		while (++index < length) {
			if (array[index] === value) {
				return index;
			}
		}
		return -1;
	}

	/**
	 * Used by `sortBy` to compare transformed `collection` elements, stable sorting
	 * them in ascending order.
	 *
	 * @private
	 * @param {Object} a The object to compare to `b`.
	 * @param {Object} b The object to compare to `a`.
	 * @returns {number} Returns the sort order indicator of `1` or `-1`.
	 */
	function compareAscending(a, b) {
		var ac = a.criteria,
			bc = b.criteria;

		// ensure a stable sort in V8 and other engines
		// http://code.google.com/p/v8/issues/detail?id=90
		if (ac !== bc) {
			if (ac > bc || typeof ac == 'undefined') {
				return 1;
			}
			if (ac < bc || typeof bc == 'undefined') {
				return -1;
			}
		}
		// The JS engine embedded in Adobe applications like InDesign has a buggy
		// `Array#sort` implementation that causes it, under certain circumstances,
		// to return the same value for `a` and `b`.
		// See https://github.com/jashkenas/underscore/pull/1247
		return a.index - b.index;
	}

	/**
	 * Used by `template` to escape characters for inclusion in compiled
	 * string literals.
	 *
	 * @private
	 * @param {string} match The matched character to escape.
	 * @returns {string} Returns the escaped character.
	 */
	function escapeStringChar(match) {
		return '\\' + stringEscapes[match];
	}

	/**
	 * Slices the `collection` from the `start` index up to, but not including,
	 * the `end` index.
	 *
	 * Note: This function is used instead of `Array#slice` to support node lists
	 * in IE < 9 and to ensure dense arrays are returned.
	 *
	 * @private
	 * @param {Array|Object|string} collection The collection to slice.
	 * @param {number} start The start index.
	 * @param {number} end The end index.
	 * @returns {Array} Returns the new array.
	 */
	function slice(array, start, end) {
		start || (start = 0);
		if (typeof end == 'undefined') {
			end = array ? array.length : 0;
		}
		var index = -1,
			length = end - start || 0,
			result = Array(length < 0 ? 0 : length);

		while (++index < length) {
			result[index] = array[start + index];
		}
		return result;
	}

	/*--------------------------------------------------------------------------*/

	/**
	 * Used for `Array` method references.
	 *
	 * Normally `Array.prototype` would suffice, however, using an array literal
	 * avoids issues in Narwhal.
	 */
	var arrayRef = [];

	/** Used for native method references */
	var objectProto = Object.prototype;

	/** Used to restore the original `_` reference in `noConflict` */
	var oldDash = root._;

	/** Used to resolve the internal [[Class]] of values */
	var toString = objectProto.toString;

	/** Used to detect if a method is native */
	var reNative = RegExp('^' +
		String(toString)
			.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
			.replace(/toString| for [^\]]+/g, '.*?') + '$'
	);

	/** Native method shortcuts */
	var ceil = Math.ceil,
		floor = Math.floor,
		hasOwnProperty = objectProto.hasOwnProperty,
		now = reNative.test(now = Date.now) && now || function() { return +new Date; },
		push = arrayRef.push,
		propertyIsEnumerable = objectProto.propertyIsEnumerable;

	/* Native method shortcuts for methods with the same name as other `lodash` methods */
	var nativeCreate = reNative.test(nativeCreate = Object.create) && nativeCreate,
		nativeIsArray = reNative.test(nativeIsArray = Array.isArray) && nativeIsArray,
		nativeIsFinite = root.isFinite,
		nativeIsNaN = root.isNaN,
		nativeKeys = reNative.test(nativeKeys = Object.keys) && nativeKeys,
		nativeMax = Math.max,
		nativeMin = Math.min,
		nativeRandom = Math.random;

	/*--------------------------------------------------------------------------*/

	/**
	 * Creates a `lodash` object which wraps the given value to enable intuitive
	 * method chaining.
	 *
	 * In addition to Lo-Dash methods, wrappers also have the following `Array` methods:
	 * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`, `splice`,
	 * and `unshift`
	 *
	 * Chaining is supported in custom builds as long as the `value` method is
	 * implicitly or explicitly included in the build.
	 *
	 * The chainable wrapper functions are:
	 * `after`, `assign`, `bind`, `bindAll`, `bindKey`, `chain`, `compact`,
	 * `compose`, `concat`, `countBy`, `create`, `createCallback`, `curry`,
	 * `debounce`, `defaults`, `defer`, `delay`, `difference`, `filter`, `flatten`,
	 * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
	 * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
	 * `invoke`, `keys`, `map`, `max`, `memoize`, `merge`, `min`, `object`, `omit`,
	 * `once`, `pairs`, `partial`, `partialRight`, `pick`, `pluck`, `pull`, `push`,
	 * `range`, `reject`, `remove`, `rest`, `reverse`, `shuffle`, `slice`, `sort`,
	 * `sortBy`, `splice`, `tap`, `throttle`, `times`, `toArray`, `transform`,
	 * `union`, `uniq`, `unshift`, `unzip`, `values`, `where`, `without`, `wrap`,
	 * and `zip`
	 *
	 * The non-chainable wrapper functions are:
	 * `clone`, `cloneDeep`, `contains`, `escape`, `every`, `find`, `findIndex`,
	 * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `has`, `identity`,
	 * `indexOf`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
	 * `isEmpty`, `isEqual`, `isFinite`, `isFunction`, `isNaN`, `isNull`, `isNumber`,
	 * `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined`, `join`,
	 * `lastIndexOf`, `mixin`, `noConflict`, `parseInt`, `pop`, `random`, `reduce`,
	 * `reduceRight`, `result`, `shift`, `size`, `some`, `sortedIndex`, `runInContext`,
	 * `template`, `unescape`, `uniqueId`, and `value`
	 *
	 * The wrapper functions `first` and `last` return wrapped values when `n` is
	 * provided, otherwise they return unwrapped values.
	 *
	 * Explicit chaining can be enabled by using the `_.chain` method.
	 *
	 * @name _
	 * @constructor
	 * @category Chaining
	 * @param {*} value The value to wrap in a `lodash` instance.
	 * @returns {Object} Returns a `lodash` instance.
	 * @example
	 *
	 * var wrapped = _([1, 2, 3]);
	 *
	 * // returns an unwrapped value
	 * wrapped.reduce(function(sum, num) {
   *   return sum + num;
   * });
	 * // => 6
	 *
	 * // returns a wrapped value
	 * var squares = wrapped.map(function(num) {
   *   return num * num;
   * });
	 *
	 * _.isArray(squares);
	 * // => false
	 *
	 * _.isArray(squares.value());
	 * // => true
	 */
	function lodash(value) {
		return (value instanceof lodash)
			? value
			: new lodashWrapper(value);
	}

	/**
	 * A fast path for creating `lodash` wrapper objects.
	 *
	 * @private
	 * @param {*} value The value to wrap in a `lodash` instance.
	 * @param {boolean} chainAll A flag to enable chaining for all methods
	 * @returns {Object} Returns a `lodash` instance.
	 */
	function lodashWrapper(value, chainAll) {
		this.__chain__ = !!chainAll;
		this.__wrapped__ = value;
	}
	// ensure `new lodashWrapper` is an instance of `lodash`
	lodashWrapper.prototype = lodash.prototype;

	/**
	 * An object used to flag environments features.
	 *
	 * @static
	 * @memberOf _
	 * @type Object
	 */
	var support = {};

	(function() {
		var object = { '0': 1, 'length': 1 };

		/**
		 * Detect if `Array#shift` and `Array#splice` augment array-like objects correctly.
		 *
		 * Firefox < 10, IE compatibility mode, and IE < 9 have buggy Array `shift()`
		 * and `splice()` functions that fail to remove the last element, `value[0]`,
		 * of array-like objects even though the `length` property is set to `0`.
		 * The `shift()` method is buggy in IE 8 compatibility mode, while `splice()`
		 * is buggy regardless of mode in IE < 9 and buggy in compatibility mode in IE 9.
		 *
		 * @memberOf _.support
		 * @type boolean
		 */
		support.spliceObjects = (arrayRef.splice.call(object, 0, 1), !object[0]);
	}(1));

	/**
	 * By default, the template delimiters used by Lo-Dash are similar to those in
	 * embedded Ruby (ERB). Change the following template settings to use alternative
	 * delimiters.
	 *
	 * @static
	 * @memberOf _
	 * @type Object
	 */
	lodash.templateSettings = {

		/**
		 * Used to detect `data` property values to be HTML-escaped.
		 *
		 * @memberOf _.templateSettings
		 * @type RegExp
		 */
		'escape': /<%-([\s\S]+?)%>/g,

		/**
		 * Used to detect code to be evaluated.
		 *
		 * @memberOf _.templateSettings
		 * @type RegExp
		 */
		'evaluate': /<%([\s\S]+?)%>/g,

		/**
		 * Used to detect `data` property values to inject.
		 *
		 * @memberOf _.templateSettings
		 * @type RegExp
		 */
		'interpolate': reInterpolate,

		/**
		 * Used to reference the data object in the template text.
		 *
		 * @memberOf _.templateSettings
		 * @type string
		 */
		'variable': ''
	};

	/*--------------------------------------------------------------------------*/

	/**
	 * The base implementation of `_.bind` that creates the bound function and
	 * sets its meta data.
	 *
	 * @private
	 * @param {Array} bindData The bind data array.
	 * @returns {Function} Returns the new bound function.
	 */
	function baseBind(bindData) {
		var func = bindData[0],
			partialArgs = bindData[2],
			thisArg = bindData[4];

		function bound() {
			// `Function#bind` spec
			// http://es5.github.io/#x15.3.4.5
			if (partialArgs) {
				var args = partialArgs.slice();
				push.apply(args, arguments);
			}
			// mimic the constructor's `return` behavior
			// http://es5.github.io/#x13.2.2
			if (this instanceof bound) {
				// ensure `new bound` is an instance of `func`
				var thisBinding = baseCreate(func.prototype),
					result = func.apply(thisBinding, args || arguments);
				return isObject(result) ? result : thisBinding;
			}
			return func.apply(thisArg, args || arguments);
		}
		return bound;
	}

	/**
	 * The base implementation of `_.create` without support for assigning
	 * properties to the created object.
	 *
	 * @private
	 * @param {Object} prototype The object to inherit from.
	 * @returns {Object} Returns the new object.
	 */
	function baseCreate(prototype, properties) {
		return isObject(prototype) ? nativeCreate(prototype) : {};
	}
	// fallback for browsers without `Object.create`
	if (!nativeCreate) {
		baseCreate = (function() {
			function Object() {}
			return function(prototype) {
				if (isObject(prototype)) {
					Object.prototype = prototype;
					var result = new Object;
					Object.prototype = null;
				}
				return result || root.Object();
			};
		}());
	}

	/**
	 * The base implementation of `_.createCallback` without support for creating
	 * "_.pluck" or "_.where" style callbacks.
	 *
	 * @private
	 * @param {*} [func=identity] The value to convert to a callback.
	 * @param {*} [thisArg] The `this` binding of the created callback.
	 * @param {number} [argCount] The number of arguments the callback accepts.
	 * @returns {Function} Returns a callback function.
	 */
	function baseCreateCallback(func, thisArg, argCount) {
		if (typeof func != 'function') {
			return identity;
		}
		// exit early for no `thisArg` or already bound by `Function#bind`
		if (typeof thisArg == 'undefined' || !('prototype' in func)) {
			return func;
		}
		switch (argCount) {
			case 1: return function(value) {
				return func.call(thisArg, value);
			};
			case 2: return function(a, b) {
				return func.call(thisArg, a, b);
			};
			case 3: return function(value, index, collection) {
				return func.call(thisArg, value, index, collection);
			};
			case 4: return function(accumulator, value, index, collection) {
				return func.call(thisArg, accumulator, value, index, collection);
			};
		}
		return bind(func, thisArg);
	}

	/**
	 * The base implementation of `createWrapper` that creates the wrapper and
	 * sets its meta data.
	 *
	 * @private
	 * @param {Array} bindData The bind data array.
	 * @returns {Function} Returns the new function.
	 */
	function baseCreateWrapper(bindData) {
		var func = bindData[0],
			bitmask = bindData[1],
			partialArgs = bindData[2],
			partialRightArgs = bindData[3],
			thisArg = bindData[4],
			arity = bindData[5];

		var isBind = bitmask & 1,
			isBindKey = bitmask & 2,
			isCurry = bitmask & 4,
			isCurryBound = bitmask & 8,
			key = func;

		function bound() {
			var thisBinding = isBind ? thisArg : this;
			if (partialArgs) {
				var args = partialArgs.slice();
				push.apply(args, arguments);
			}
			if (partialRightArgs || isCurry) {
				args || (args = slice(arguments));
				if (partialRightArgs) {
					push.apply(args, partialRightArgs);
				}
				if (isCurry && args.length < arity) {
					bitmask |= 16 & ~32;
					return baseCreateWrapper([func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity]);
				}
			}
			args || (args = arguments);
			if (isBindKey) {
				func = thisBinding[key];
			}
			if (this instanceof bound) {
				thisBinding = baseCreate(func.prototype);
				var result = func.apply(thisBinding, args);
				return isObject(result) ? result : thisBinding;
			}
			return func.apply(thisBinding, args);
		}
		return bound;
	}

	/**
	 * The base implementation of `_.difference` that accepts a single array
	 * of values to exclude.
	 *
	 * @private
	 * @param {Array} array The array to process.
	 * @param {Array} [values] The array of values to exclude.
	 * @returns {Array} Returns a new array of filtered values.
	 */
	function baseDifference(array, values) {
		var index = -1,
			indexOf = getIndexOf(),
			length = array ? array.length : 0,
			result = [];

		while (++index < length) {
			var value = array[index];
			if (indexOf(values, value) < 0) {
				result.push(value);
			}
		}
		return result;
	}

	/**
	 * The base implementation of `_.flatten` without support for callback
	 * shorthands or `thisArg` binding.
	 *
	 * @private
	 * @param {Array} array The array to flatten.
	 * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
	 * @param {boolean} [isStrict=false] A flag to restrict flattening to arrays and `arguments` objects.
	 * @param {number} [fromIndex=0] The index to start from.
	 * @returns {Array} Returns a new flattened array.
	 */
	function baseFlatten(array, isShallow, isStrict, fromIndex) {
		var index = (fromIndex || 0) - 1,
			length = array ? array.length : 0,
			result = [];

		while (++index < length) {
			var value = array[index];

			if (value && typeof value == 'object' && typeof value.length == 'number'
				&& (isArray(value) || isArguments(value))) {
				// recursively flatten arrays (susceptible to call stack limits)
				if (!isShallow) {
					value = baseFlatten(value, isShallow, isStrict);
				}
				var valIndex = -1,
					valLength = value.length,
					resIndex = result.length;

				result.length += valLength;
				while (++valIndex < valLength) {
					result[resIndex++] = value[valIndex];
				}
			} else if (!isStrict) {
				result.push(value);
			}
		}
		return result;
	}

	/**
	 * The base implementation of `_.isEqual`, without support for `thisArg` binding,
	 * that allows partial "_.where" style comparisons.
	 *
	 * @private
	 * @param {*} a The value to compare.
	 * @param {*} b The other value to compare.
	 * @param {Function} [callback] The function to customize comparing values.
	 * @param {Function} [isWhere=false] A flag to indicate performing partial comparisons.
	 * @param {Array} [stackA=[]] Tracks traversed `a` objects.
	 * @param {Array} [stackB=[]] Tracks traversed `b` objects.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 */
	function baseIsEqual(a, b, stackA, stackB) {
		if (a === b) {
			return a !== 0 || (1 / a == 1 / b);
		}
		var type = typeof a,
			otherType = typeof b;

		if (a === a &&
			!(a && objectTypes[type]) &&
			!(b && objectTypes[otherType])) {
			return false;
		}
		if (a == null || b == null) {
			return a === b;
		}
		var className = toString.call(a),
			otherClass = toString.call(b);

		if (className != otherClass) {
			return false;
		}
		switch (className) {
			case boolClass:
			case dateClass:
				return +a == +b;

			case numberClass:
				return a != +a
					? b != +b
					: (a == 0 ? (1 / a == 1 / b) : a == +b);

			case regexpClass:
			case stringClass:
				return a == String(b);
		}
		var isArr = className == arrayClass;
		if (!isArr) {
			var aWrapped = a instanceof lodash,
				bWrapped = b instanceof lodash;

			if (aWrapped || bWrapped) {
				return baseIsEqual(aWrapped ? a.__wrapped__ : a, bWrapped ? b.__wrapped__ : b, stackA, stackB);
			}
			if (className != objectClass) {
				return false;
			}
			var ctorA = a.constructor,
				ctorB = b.constructor;

			if (ctorA != ctorB &&
				!(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) &&
				('constructor' in a && 'constructor' in b)
				) {
				return false;
			}
		}
		stackA || (stackA = []);
		stackB || (stackB = []);

		var length = stackA.length;
		while (length--) {
			if (stackA[length] == a) {
				return stackB[length] == b;
			}
		}
		var result = true,
			size = 0;

		stackA.push(a);
		stackB.push(b);

		if (isArr) {
			size = b.length;
			result = size == a.length;

			if (result) {
				while (size--) {
					if (!(result = baseIsEqual(a[size], b[size], stackA, stackB))) {
						break;
					}
				}
			}
			return result;
		}
		forIn(b, function(value, key, b) {
			if (hasOwnProperty.call(b, key)) {
				size++;
				return !(result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, stackA, stackB)) && indicatorObject;
			}
		});

		if (result) {
			forIn(a, function(value, key, a) {
				if (hasOwnProperty.call(a, key)) {
					return !(result = --size > -1) && indicatorObject;
				}
			});
		}
		return result;
	}

	/**
	 * The base implementation of `_.random` without argument juggling or support
	 * for returning floating-point numbers.
	 *
	 * @private
	 * @param {number} min The minimum possible value.
	 * @param {number} max The maximum possible value.
	 * @returns {number} Returns a random number.
	 */
	function baseRandom(min, max) {
		return min + floor(nativeRandom() * (max - min + 1));
	}

	/**
	 * The base implementation of `_.uniq` without support for callback shorthands
	 * or `thisArg` binding.
	 *
	 * @private
	 * @param {Array} array The array to process.
	 * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
	 * @param {Function} [callback] The function called per iteration.
	 * @returns {Array} Returns a duplicate-value-free array.
	 */
	function baseUniq(array, isSorted, callback) {
		var index = -1,
			indexOf = getIndexOf(),
			length = array ? array.length : 0,
			result = [],
			seen = callback ? [] : result;

		while (++index < length) {
			var value = array[index],
				computed = callback ? callback(value, index, array) : value;

			if (isSorted
				? !index || seen[seen.length - 1] !== computed
				: indexOf(seen, computed) < 0
				) {
				if (callback) {
					seen.push(computed);
				}
				result.push(value);
			}
		}
		return result;
	}

	/**
	 * Creates a function that aggregates a collection, creating an object composed
	 * of keys generated from the results of running each element of the collection
	 * through a callback. The given `setter` function sets the keys and values
	 * of the composed object.
	 *
	 * @private
	 * @param {Function} setter The setter function.
	 * @returns {Function} Returns the new aggregator function.
	 */
	function createAggregator(setter) {
		return function(collection, callback, thisArg) {
			var result = {};
			callback = createCallback(callback, thisArg, 3);

			var index = -1,
				length = collection ? collection.length : 0;

			if (typeof length == 'number') {
				while (++index < length) {
					var value = collection[index];
					setter(result, value, callback(value, index, collection), collection);
				}
			} else {
				forOwn(collection, function(value, key, collection) {
					setter(result, value, callback(value, key, collection), collection);
				});
			}
			return result;
		};
	}

	/**
	 * Creates a function that, when called, either curries or invokes `func`
	 * with an optional `this` binding and partially applied arguments.
	 *
	 * @private
	 * @param {Function|string} func The function or method name to reference.
	 * @param {number} bitmask The bitmask of method flags to compose.
	 *  The bitmask may be composed of the following flags:
	 *  1 - `_.bind`
	 *  2 - `_.bindKey`
	 *  4 - `_.curry`
	 *  8 - `_.curry` (bound)
	 *  16 - `_.partial`
	 *  32 - `_.partialRight`
	 * @param {Array} [partialArgs] An array of arguments to prepend to those
	 *  provided to the new function.
	 * @param {Array} [partialRightArgs] An array of arguments to append to those
	 *  provided to the new function.
	 * @param {*} [thisArg] The `this` binding of `func`.
	 * @param {number} [arity] The arity of `func`.
	 * @returns {Function} Returns the new function.
	 */
	function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
		var isBind = bitmask & 1,
			isBindKey = bitmask & 2,
			isCurry = bitmask & 4,
			isCurryBound = bitmask & 8,
			isPartial = bitmask & 16,
			isPartialRight = bitmask & 32;

		if (!isBindKey && !isFunction(func)) {
			throw new TypeError;
		}
		if (isPartial && !partialArgs.length) {
			bitmask &= ~16;
			isPartial = partialArgs = false;
		}
		if (isPartialRight && !partialRightArgs.length) {
			bitmask &= ~32;
			isPartialRight = partialRightArgs = false;
		}
		// fast path for `_.bind`
		var creater = (bitmask == 1 || bitmask === 17) ? baseBind : baseCreateWrapper;
		return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);
	}

	/**
	 * Used by `escape` to convert characters to HTML entities.
	 *
	 * @private
	 * @param {string} match The matched character to escape.
	 * @returns {string} Returns the escaped character.
	 */
	function escapeHtmlChar(match) {
		return htmlEscapes[match];
	}

	/**
	 * Gets the appropriate "indexOf" function. If the `_.indexOf` method is
	 * customized, this method returns the custom method, otherwise it returns
	 * the `baseIndexOf` function.
	 *
	 * @private
	 * @returns {Function} Returns the "indexOf" function.
	 */
	function getIndexOf() {
		var result = (result = lodash.indexOf) === indexOf ? baseIndexOf : result;
		return result;
	}

	/**
	 * Used by `unescape` to convert HTML entities to characters.
	 *
	 * @private
	 * @param {string} match The matched character to unescape.
	 * @returns {string} Returns the unescaped character.
	 */
	function unescapeHtmlChar(match) {
		return htmlUnescapes[match];
	}

	/*--------------------------------------------------------------------------*/

	/**
	 * Checks if `value` is an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Objects
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if the `value` is an `arguments` object, else `false`.
	 * @example
	 *
	 * (function() { return _.isArguments(arguments); })(1, 2, 3);
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
		return value && typeof value == 'object' && typeof value.length == 'number' &&
			toString.call(value) == argsClass || false;
	}
	// fallback for browsers that can't detect `arguments` objects by [[Class]]
	if (!isArguments(arguments)) {
		isArguments = function(value) {
			return value && typeof value == 'object' && typeof value.length == 'number' &&
				hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee') || false;
		};
	}

	/**
	 * Checks if `value` is an array.
	 *
	 * @static
	 * @memberOf _
	 * @type Function
	 * @category Objects
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if the `value` is an array, else `false`.
	 * @example
	 *
	 * (function() { return _.isArray(arguments); })();
	 * // => false
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 */
	var isArray = nativeIsArray || function(value) {
		return value && typeof value == 'object' && typeof value.length == 'number' &&
			toString.call(value) == arrayClass || false;
	};

	/**
	 * A fallback implementation of `Object.keys` which produces an array of the
	 * given object's own enumerable property names.
	 *
	 * @private
	 * @type Function
	 * @param {Object} object The object to inspect.
	 * @returns {Array} Returns an array of property names.
	 */
	var shimKeys = function(object) {
		var index, iterable = object, result = [];
		if (!iterable) return result;
		if (!(objectTypes[typeof object])) return result;
		for (index in iterable) {
			if (hasOwnProperty.call(iterable, index)) {
				result.push(index);
			}
		}
		return result
	};

	/**
	 * Creates an array composed of the own enumerable property names of an object.
	 *
	 * @static
	 * @memberOf _
	 * @category Objects
	 * @param {Object} object The object to inspect.
	 * @returns {Array} Returns an array of property names.
	 * @example
	 *
	 * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
	 * // => ['one', 'two', 'three'] (property order is not guaranteed across environments)
	 */
	var keys = !nativeKeys ? shimKeys : function(object) {
		if (!isObject(object)) {
			return [];
		}
		return nativeKeys(object);
	};

	/**
	 * Used to convert characters to HTML entities:
	 *
	 * Though the `>` character is escaped for symmetry, characters like `>` and `/`
	 * don't require escaping in HTML and have no special meaning unless they're part
	 * of a tag or an unquoted attribute value.
	 * http://mathiasbynens.be/notes/ambiguous-ampersands (under "semi-related fun fact")
	 */
	var htmlEscapes = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#x27;'
	};

	/** Used to convert HTML entities to characters */
	var htmlUnescapes = invert(htmlEscapes);

	/** Used to match HTML entities and HTML characters */
	var reEscapedHtml = RegExp('(' + keys(htmlUnescapes).join('|') + ')', 'g'),
		reUnescapedHtml = RegExp('[' + keys(htmlEscapes).join('') + ']', 'g');

	/*--------------------------------------------------------------------------*/

	/**
	 * Assigns own enumerable properties of source object(s) to the destination
	 * object. Subsequent sources will overwrite property assignments of previous
	 * sources. If a callback is provided it will be executed to produce the
	 * assigned values. The callback is bound to `thisArg` and invoked with two
	 * arguments; (objectValue, sourceValue).
	 *
	 * @static
	 * @memberOf _
	 * @type Function
	 * @alias extend
	 * @category Objects
	 * @param {Object} object The destination object.
	 * @param {...Object} [source] The source objects.
	 * @param {Function} [callback] The function to customize assigning values.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {Object} Returns the destination object.
	 * @example
	 *
	 * _.assign({ 'name': 'fred' }, { 'employer': 'slate' });
	 * // => { 'name': 'fred', 'employer': 'slate' }
	 *
	 * var defaults = _.partialRight(_.assign, function(a, b) {
   *   return typeof a == 'undefined' ? b : a;
   * });
	 *
	 * var object = { 'name': 'barney' };
	 * defaults(object, { 'name': 'fred', 'employer': 'slate' });
	 * // => { 'name': 'barney', 'employer': 'slate' }
	 */
	function assign(object) {
		if (!object) {
			return object;
		}
		for (var argsIndex = 1, argsLength = arguments.length; argsIndex < argsLength; argsIndex++) {
			var iterable = arguments[argsIndex];
			if (iterable) {
				for (var key in iterable) {
					object[key] = iterable[key];
				}
			}
		}
		return object;
	}

	/**
	 * Creates a clone of `value`. If `isDeep` is `true` nested objects will also
	 * be cloned, otherwise they will be assigned by reference. If a callback
	 * is provided it will be executed to produce the cloned values. If the
	 * callback returns `undefined` cloning will be handled by the method instead.
	 * The callback is bound to `thisArg` and invoked with one argument; (value).
	 *
	 * @static
	 * @memberOf _
	 * @category Objects
	 * @param {*} value The value to clone.
	 * @param {boolean} [isDeep=false] Specify a deep clone.
	 * @param {Function} [callback] The function to customize cloning values.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {*} Returns the cloned value.
	 * @example
	 *
	 * var characters = [
	 *   { 'name': 'barney', 'age': 36 },
	 *   { 'name': 'fred',   'age': 40 }
	 * ];
	 *
	 * var shallow = _.clone(characters);
	 * shallow[0] === characters[0];
	 * // => true
	 *
	 * var deep = _.clone(characters, true);
	 * deep[0] === characters[0];
	 * // => false
	 *
	 * _.mixin({
   *   'clone': _.partialRight(_.clone, function(value) {
   *     return _.isElement(value) ? value.cloneNode(false) : undefined;
   *   })
   * });
	 *
	 * var clone = _.clone(document.body);
	 * clone.childNodes.length;
	 * // => 0
	 */
	function clone(value) {
		return isObject(value)
			? (isArray(value) ? slice(value) : assign({}, value))
			: value;
	}

	/**
	 * Assigns own enumerable properties of source object(s) to the destination
	 * object for all destination properties that resolve to `undefined`. Once a
	 * property is set, additional defaults of the same property will be ignored.
	 *
	 * @static
	 * @memberOf _
	 * @type Function
	 * @category Objects
	 * @param {Object} object The destination object.
	 * @param {...Object} [source] The source objects.
	 * @param- {Object} [guard] Allows working with `_.reduce` without using its
	 *  `key` and `object` arguments as sources.
	 * @returns {Object} Returns the destination object.
	 * @example
	 *
	 * var object = { 'name': 'barney' };
	 * _.defaults(object, { 'name': 'fred', 'employer': 'slate' });
	 * // => { 'name': 'barney', 'employer': 'slate' }
	 */
	function defaults(object) {
		if (!object) {
			return object;
		}
		for (var argsIndex = 1, argsLength = arguments.length; argsIndex < argsLength; argsIndex++) {
			var iterable = arguments[argsIndex];
			if (iterable) {
				for (var key in iterable) {
					if (typeof object[key] == 'undefined') {
						object[key] = iterable[key];
					}
				}
			}
		}
		return object;
	}

	/**
	 * Iterates over own and inherited enumerable properties of an object,
	 * executing the callback for each property. The callback is bound to `thisArg`
	 * and invoked with three arguments; (value, key, object). Callbacks may exit
	 * iteration early by explicitly returning `false`.
	 *
	 * @static
	 * @memberOf _
	 * @type Function
	 * @category Objects
	 * @param {Object} object The object to iterate over.
	 * @param {Function} [callback=identity] The function called per iteration.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {Object} Returns `object`.
	 * @example
	 *
	 * function Shape() {
   *   this.x = 0;
   *   this.y = 0;
   * }
	 *
	 * Shape.prototype.move = function(x, y) {
   *   this.x += x;
   *   this.y += y;
   * };
	 *
	 * _.forIn(new Shape, function(value, key) {
   *   console.log(key);
   * });
	 * // => logs 'x', 'y', and 'move' (property order is not guaranteed across environments)
	 */
	var forIn = function(collection, callback) {
		var index, iterable = collection, result = iterable;
		if (!iterable) return result;
		if (!objectTypes[typeof iterable]) return result;
		for (index in iterable) {
			if (callback(iterable[index], index, collection) === indicatorObject) return result;
		}
		return result
	};

	/**
	 * Iterates over own enumerable properties of an object, executing the callback
	 * for each property. The callback is bound to `thisArg` and invoked with three
	 * arguments; (value, key, object). Callbacks may exit iteration early by
	 * explicitly returning `false`.
	 *
	 * @static
	 * @memberOf _
	 * @type Function
	 * @category Objects
	 * @param {Object} object The object to iterate over.
	 * @param {Function} [callback=identity] The function called per iteration.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {Object} Returns `object`.
	 * @example
	 *
	 * _.forOwn({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
   *   console.log(key);
   * });
	 * // => logs '0', '1', and 'length' (property order is not guaranteed across environments)
	 */
	var forOwn = function(collection, callback) {
		var index, iterable = collection, result = iterable;
		if (!iterable) return result;
		if (!objectTypes[typeof iterable]) return result;
		for (index in iterable) {
			if (hasOwnProperty.call(iterable, index)) {
				if (callback(iterable[index], index, collection) === indicatorObject) return result;
			}
		}
		return result
	};

	/**
	 * Creates a sorted array of property names of all enumerable properties,
	 * own and inherited, of `object` that have function values.
	 *
	 * @static
	 * @memberOf _
	 * @alias methods
	 * @category Objects
	 * @param {Object} object The object to inspect.
	 * @returns {Array} Returns an array of property names that have function values.
	 * @example
	 *
	 * _.functions(_);
	 * // => ['all', 'any', 'bind', 'bindAll', 'clone', 'compact', 'compose', ...]
	 */
	function functions(object) {
		var result = [];
		forIn(object, function(value, key) {
			if (isFunction(value)) {
				result.push(key);
			}
		});
		return result.sort();
	}

	/**
	 * Checks if the specified object `property` exists and is a direct property,
	 * instead of an inherited property.
	 *
	 * @static
	 * @memberOf _
	 * @category Objects
	 * @param {Object} object The object to check.
	 * @param {string} property The property to check for.
	 * @returns {boolean} Returns `true` if key is a direct property, else `false`.
	 * @example
	 *
	 * _.has({ 'a': 1, 'b': 2, 'c': 3 }, 'b');
	 * // => true
	 */
	function has(object, property) {
		return object ? hasOwnProperty.call(object, property) : false;
	}

	/**
	 * Creates an object composed of the inverted keys and values of the given object.
	 *
	 * @static
	 * @memberOf _
	 * @category Objects
	 * @param {Object} object The object to invert.
	 * @returns {Object} Returns the created inverted object.
	 * @example
	 *
	 *  _.invert({ 'first': 'fred', 'second': 'barney' });
	 * // => { 'fred': 'first', 'barney': 'second' }
	 */
	function invert(object) {
		var index = -1,
			props = keys(object),
			length = props.length,
			result = {};

		while (++index < length) {
			var key = props[index];
			result[object[key]] = key;
		}
		return result;
	}

	/**
	 * Checks if `value` is a boolean value.
	 *
	 * @static
	 * @memberOf _
	 * @category Objects
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if the `value` is a boolean value, else `false`.
	 * @example
	 *
	 * _.isBoolean(null);
	 * // => false
	 */
	function isBoolean(value) {
		return value === true || value === false ||
			value && typeof value == 'object' && toString.call(value) == boolClass || false;
	}

	/**
	 * Checks if `value` is a date.
	 *
	 * @static
	 * @memberOf _
	 * @category Objects
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if the `value` is a date, else `false`.
	 * @example
	 *
	 * _.isDate(new Date);
	 * // => true
	 */
	function isDate(value) {
		return value && typeof value == 'object' && toString.call(value) == dateClass || false;
	}

	/**
	 * Checks if `value` is a DOM element.
	 *
	 * @static
	 * @memberOf _
	 * @category Objects
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if the `value` is a DOM element, else `false`.
	 * @example
	 *
	 * _.isElement(document.body);
	 * // => true
	 */
	function isElement(value) {
		return value && value.nodeType === 1 || false;
	}

	/**
	 * Checks if `value` is empty. Arrays, strings, or `arguments` objects with a
	 * length of `0` and objects with no own enumerable properties are considered
	 * "empty".
	 *
	 * @static
	 * @memberOf _
	 * @category Objects
	 * @param {Array|Object|string} value The value to inspect.
	 * @returns {boolean} Returns `true` if the `value` is empty, else `false`.
	 * @example
	 *
	 * _.isEmpty([1, 2, 3]);
	 * // => false
	 *
	 * _.isEmpty({});
	 * // => true
	 *
	 * _.isEmpty('');
	 * // => true
	 */
	function isEmpty(value) {
		if (!value) {
			return true;
		}
		if (isArray(value) || isString(value)) {
			return !value.length;
		}
		for (var key in value) {
			if (hasOwnProperty.call(value, key)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Performs a deep comparison between two values to determine if they are
	 * equivalent to each other. If a callback is provided it will be executed
	 * to compare values. If the callback returns `undefined` comparisons will
	 * be handled by the method instead. The callback is bound to `thisArg` and
	 * invoked with two arguments; (a, b).
	 *
	 * @static
	 * @memberOf _
	 * @category Objects
	 * @param {*} a The value to compare.
	 * @param {*} b The other value to compare.
	 * @param {Function} [callback] The function to customize comparing values.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'name': 'fred' };
	 * var copy = { 'name': 'fred' };
	 *
	 * object == copy;
	 * // => false
	 *
	 * _.isEqual(object, copy);
	 * // => true
	 *
	 * var words = ['hello', 'goodbye'];
	 * var otherWords = ['hi', 'goodbye'];
	 *
	 * _.isEqual(words, otherWords, function(a, b) {
   *   var reGreet = /^(?:hello|hi)$/i,
   *       aGreet = _.isString(a) && reGreet.test(a),
   *       bGreet = _.isString(b) && reGreet.test(b);
   *
   *   return (aGreet || bGreet) ? (aGreet == bGreet) : undefined;
   * });
	 * // => true
	 */
	function isEqual(a, b) {
		return baseIsEqual(a, b);
	}

	/**
	 * Checks if `value` is, or can be coerced to, a finite number.
	 *
	 * Note: This is not the same as native `isFinite` which will return true for
	 * booleans and empty strings. See http://es5.github.io/#x15.1.2.5.
	 *
	 * @static
	 * @memberOf _
	 * @category Objects
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if the `value` is finite, else `false`.
	 * @example
	 *
	 * _.isFinite(-101);
	 * // => true
	 *
	 * _.isFinite('10');
	 * // => true
	 *
	 * _.isFinite(true);
	 * // => false
	 *
	 * _.isFinite('');
	 * // => false
	 *
	 * _.isFinite(Infinity);
	 * // => false
	 */
	function isFinite(value) {
		return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));
	}

	/**
	 * Checks if `value` is a function.
	 *
	 * @static
	 * @memberOf _
	 * @category Objects
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 */
	function isFunction(value) {
		return typeof value == 'function';
	}
	// fallback for older versions of Chrome and Safari
	if (isFunction(/x/)) {
		isFunction = function(value) {
			return typeof value == 'function' && toString.call(value) == funcClass;
		};
	}

	/**
	 * Checks if `value` is the language type of Object.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Objects
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
		// check if the value is the ECMAScript language type of Object
		// http://es5.github.io/#x8
		// and avoid a V8 bug
		// http://code.google.com/p/v8/issues/detail?id=2291
		return !!(value && objectTypes[typeof value]);
	}

	/**
	 * Checks if `value` is `NaN`.
	 *
	 * Note: This is not the same as native `isNaN` which will return `true` for
	 * `undefined` and other non-numeric values. See http://es5.github.io/#x15.1.2.4.
	 *
	 * @static
	 * @memberOf _
	 * @category Objects
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if the `value` is `NaN`, else `false`.
	 * @example
	 *
	 * _.isNaN(NaN);
	 * // => true
	 *
	 * _.isNaN(new Number(NaN));
	 * // => true
	 *
	 * isNaN(undefined);
	 * // => true
	 *
	 * _.isNaN(undefined);
	 * // => false
	 */
	function isNaN(value) {
		// `NaN` as a primitive is the only value that is not equal to itself
		// (perform the [[Class]] check first to avoid errors with some host objects in IE)
		return isNumber(value) && value != +value;
	}

	/**
	 * Checks if `value` is `null`.
	 *
	 * @static
	 * @memberOf _
	 * @category Objects
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if the `value` is `null`, else `false`.
	 * @example
	 *
	 * _.isNull(null);
	 * // => true
	 *
	 * _.isNull(undefined);
	 * // => false
	 */
	function isNull(value) {
		return value === null;
	}

	/**
	 * Checks if `value` is a number.
	 *
	 * Note: `NaN` is considered a number. See http://es5.github.io/#x8.5.
	 *
	 * @static
	 * @memberOf _
	 * @category Objects
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if the `value` is a number, else `false`.
	 * @example
	 *
	 * _.isNumber(8.4 * 5);
	 * // => true
	 */
	function isNumber(value) {
		return typeof value == 'number' ||
			value && typeof value == 'object' && toString.call(value) == numberClass || false;
	}

	/**
	 * Checks if `value` is a regular expression.
	 *
	 * @static
	 * @memberOf _
	 * @category Objects
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if the `value` is a regular expression, else `false`.
	 * @example
	 *
	 * _.isRegExp(/fred/);
	 * // => true
	 */
	function isRegExp(value) {
		return value && objectTypes[typeof value] && toString.call(value) == regexpClass || false;
	}

	/**
	 * Checks if `value` is a string.
	 *
	 * @static
	 * @memberOf _
	 * @category Objects
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if the `value` is a string, else `false`.
	 * @example
	 *
	 * _.isString('fred');
	 * // => true
	 */
	function isString(value) {
		return typeof value == 'string' ||
			value && typeof value == 'object' && toString.call(value) == stringClass || false;
	}

	/**
	 * Checks if `value` is `undefined`.
	 *
	 * @static
	 * @memberOf _
	 * @category Objects
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if the `value` is `undefined`, else `false`.
	 * @example
	 *
	 * _.isUndefined(void 0);
	 * // => true
	 */
	function isUndefined(value) {
		return typeof value == 'undefined';
	}

	/**
	 * Creates a shallow clone of `object` excluding the specified properties.
	 * Property names may be specified as individual arguments or as arrays of
	 * property names. If a callback is provided it will be executed for each
	 * property of `object` omitting the properties the callback returns truey
	 * for. The callback is bound to `thisArg` and invoked with three arguments;
	 * (value, key, object).
	 *
	 * @static
	 * @memberOf _
	 * @category Objects
	 * @param {Object} object The source object.
	 * @param {Function|...string|string[]} [callback] The properties to omit or the
	 *  function called per iteration.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {Object} Returns an object without the omitted properties.
	 * @example
	 *
	 * _.omit({ 'name': 'fred', 'age': 40 }, 'age');
	 * // => { 'name': 'fred' }
	 *
	 * _.omit({ 'name': 'fred', 'age': 40 }, function(value) {
   *   return typeof value == 'number';
   * });
	 * // => { 'name': 'fred' }
	 */
	function omit(object) {
		var props = [];
		forIn(object, function(value, key) {
			props.push(key);
		});
		props = baseDifference(props, baseFlatten(arguments, true, false, 1));

		var index = -1,
			length = props.length,
			result = {};

		while (++index < length) {
			var key = props[index];
			result[key] = object[key];
		}
		return result;
	}

	/**
	 * Creates a two dimensional array of an object's key-value pairs,
	 * i.e. `[[key1, value1], [key2, value2]]`.
	 *
	 * @static
	 * @memberOf _
	 * @category Objects
	 * @param {Object} object The object to inspect.
	 * @returns {Array} Returns new array of key-value pairs.
	 * @example
	 *
	 * _.pairs({ 'barney': 36, 'fred': 40 });
	 * // => [['barney', 36], ['fred', 40]] (property order is not guaranteed across environments)
	 */
	function pairs(object) {
		var index = -1,
			props = keys(object),
			length = props.length,
			result = Array(length);

		while (++index < length) {
			var key = props[index];
			result[index] = [key, object[key]];
		}
		return result;
	}

	/**
	 * Creates a shallow clone of `object` composed of the specified properties.
	 * Property names may be specified as individual arguments or as arrays of
	 * property names. If a callback is provided it will be executed for each
	 * property of `object` picking the properties the callback returns truey
	 * for. The callback is bound to `thisArg` and invoked with three arguments;
	 * (value, key, object).
	 *
	 * @static
	 * @memberOf _
	 * @category Objects
	 * @param {Object} object The source object.
	 * @param {Function|...string|string[]} [callback] The function called per
	 *  iteration or property names to pick, specified as individual property
	 *  names or arrays of property names.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {Object} Returns an object composed of the picked properties.
	 * @example
	 *
	 * _.pick({ 'name': 'fred', '_userid': 'fred1' }, 'name');
	 * // => { 'name': 'fred' }
	 *
	 * _.pick({ 'name': 'fred', '_userid': 'fred1' }, function(value, key) {
   *   return key.charAt(0) != '_';
   * });
	 * // => { 'name': 'fred' }
	 */
	function pick(object) {
		var index = -1,
			props = baseFlatten(arguments, true, false, 1),
			length = props.length,
			result = {};

		while (++index < length) {
			var key = props[index];
			if (key in object) {
				result[key] = object[key];
			}
		}
		return result;
	}

	/**
	 * Creates an array composed of the own enumerable property values of `object`.
	 *
	 * @static
	 * @memberOf _
	 * @category Objects
	 * @param {Object} object The object to inspect.
	 * @returns {Array} Returns an array of property values.
	 * @example
	 *
	 * _.values({ 'one': 1, 'two': 2, 'three': 3 });
	 * // => [1, 2, 3] (property order is not guaranteed across environments)
	 */
	function values(object) {
		var index = -1,
			props = keys(object),
			length = props.length,
			result = Array(length);

		while (++index < length) {
			result[index] = object[props[index]];
		}
		return result;
	}

	/*--------------------------------------------------------------------------*/

	/**
	 * Checks if a given value is present in a collection using strict equality
	 * for comparisons, i.e. `===`. If `fromIndex` is negative, it is used as the
	 * offset from the end of the collection.
	 *
	 * @static
	 * @memberOf _
	 * @alias include
	 * @category Collections
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {*} target The value to check for.
	 * @param {number} [fromIndex=0] The index to search from.
	 * @returns {boolean} Returns `true` if the `target` element is found, else `false`.
	 * @example
	 *
	 * _.contains([1, 2, 3], 1);
	 * // => true
	 *
	 * _.contains([1, 2, 3], 1, 2);
	 * // => false
	 *
	 * _.contains({ 'name': 'fred', 'age': 40 }, 'fred');
	 * // => true
	 *
	 * _.contains('pebbles', 'eb');
	 * // => true
	 */
	function contains(collection, target) {
		var indexOf = getIndexOf(),
			length = collection ? collection.length : 0,
			result = false;
		if (length && typeof length == 'number') {
			result = indexOf(collection, target) > -1;
		} else {
			forOwn(collection, function(value) {
				return (result = value === target) && indicatorObject;
			});
		}
		return result;
	}

	/**
	 * Creates an object composed of keys generated from the results of running
	 * each element of `collection` through the callback. The corresponding value
	 * of each key is the number of times the key was returned by the callback.
	 * The callback is bound to `thisArg` and invoked with three arguments;
	 * (value, index|key, collection).
	 *
	 * If a property name is provided for `callback` the created "_.pluck" style
	 * callback will return the property value of the given element.
	 *
	 * If an object is provided for `callback` the created "_.where" style callback
	 * will return `true` for elements that have the properties of the given object,
	 * else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @category Collections
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function|Object|string} [callback=identity] The function called
	 *  per iteration. If a property name or object is provided it will be used
	 *  to create a "_.pluck" or "_.where" style callback, respectively.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {Object} Returns the composed aggregate object.
	 * @example
	 *
	 * _.countBy([4.3, 6.1, 6.4], function(num) { return Math.floor(num); });
	 * // => { '4': 1, '6': 2 }
	 *
	 * _.countBy([4.3, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
	 * // => { '4': 1, '6': 2 }
	 *
	 * _.countBy(['one', 'two', 'three'], 'length');
	 * // => { '3': 2, '5': 1 }
	 */
	var countBy = createAggregator(function(result, value, key) {
		(hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1);
	});

	/**
	 * Checks if the given callback returns truey value for **all** elements of
	 * a collection. The callback is bound to `thisArg` and invoked with three
	 * arguments; (value, index|key, collection).
	 *
	 * If a property name is provided for `callback` the created "_.pluck" style
	 * callback will return the property value of the given element.
	 *
	 * If an object is provided for `callback` the created "_.where" style callback
	 * will return `true` for elements that have the properties of the given object,
	 * else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @alias all
	 * @category Collections
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function|Object|string} [callback=identity] The function called
	 *  per iteration. If a property name or object is provided it will be used
	 *  to create a "_.pluck" or "_.where" style callback, respectively.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {boolean} Returns `true` if all elements passed the callback check,
	 *  else `false`.
	 * @example
	 *
	 * _.every([true, 1, null, 'yes']);
	 * // => false
	 *
	 * var characters = [
	 *   { 'name': 'barney', 'age': 36 },
	 *   { 'name': 'fred',   'age': 40 }
	 * ];
	 *
	 * // using "_.pluck" callback shorthand
	 * _.every(characters, 'age');
	 * // => true
	 *
	 * // using "_.where" callback shorthand
	 * _.every(characters, { 'age': 36 });
	 * // => false
	 */
	function every(collection, callback, thisArg) {
		var result = true;
		callback = createCallback(callback, thisArg, 3);

		var index = -1,
			length = collection ? collection.length : 0;

		if (typeof length == 'number') {
			while (++index < length) {
				if (!(result = !!callback(collection[index], index, collection))) {
					break;
				}
			}
		} else {
			forOwn(collection, function(value, index, collection) {
				return !(result = !!callback(value, index, collection)) && indicatorObject;
			});
		}
		return result;
	}

	/**
	 * Iterates over elements of a collection, returning an array of all elements
	 * the callback returns truey for. The callback is bound to `thisArg` and
	 * invoked with three arguments; (value, index|key, collection).
	 *
	 * If a property name is provided for `callback` the created "_.pluck" style
	 * callback will return the property value of the given element.
	 *
	 * If an object is provided for `callback` the created "_.where" style callback
	 * will return `true` for elements that have the properties of the given object,
	 * else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @alias select
	 * @category Collections
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function|Object|string} [callback=identity] The function called
	 *  per iteration. If a property name or object is provided it will be used
	 *  to create a "_.pluck" or "_.where" style callback, respectively.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {Array} Returns a new array of elements that passed the callback check.
	 * @example
	 *
	 * var evens = _.filter([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
	 * // => [2, 4, 6]
	 *
	 * var characters = [
	 *   { 'name': 'barney', 'age': 36, 'blocked': false },
	 *   { 'name': 'fred',   'age': 40, 'blocked': true }
	 * ];
	 *
	 * // using "_.pluck" callback shorthand
	 * _.filter(characters, 'blocked');
	 * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
	 *
	 * // using "_.where" callback shorthand
	 * _.filter(characters, { 'age': 36 });
	 * // => [{ 'name': 'barney', 'age': 36, 'blocked': false }]
	 */
	function filter(collection, callback, thisArg) {
		var result = [];
		callback = createCallback(callback, thisArg, 3);

		var index = -1,
			length = collection ? collection.length : 0;

		if (typeof length == 'number') {
			while (++index < length) {
				var value = collection[index];
				if (callback(value, index, collection)) {
					result.push(value);
				}
			}
		} else {
			forOwn(collection, function(value, index, collection) {
				if (callback(value, index, collection)) {
					result.push(value);
				}
			});
		}
		return result;
	}

	/**
	 * Iterates over elements of a collection, returning the first element that
	 * the callback returns truey for. The callback is bound to `thisArg` and
	 * invoked with three arguments; (value, index|key, collection).
	 *
	 * If a property name is provided for `callback` the created "_.pluck" style
	 * callback will return the property value of the given element.
	 *
	 * If an object is provided for `callback` the created "_.where" style callback
	 * will return `true` for elements that have the properties of the given object,
	 * else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @alias detect, findWhere
	 * @category Collections
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function|Object|string} [callback=identity] The function called
	 *  per iteration. If a property name or object is provided it will be used
	 *  to create a "_.pluck" or "_.where" style callback, respectively.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {*} Returns the found element, else `undefined`.
	 * @example
	 *
	 * var characters = [
	 *   { 'name': 'barney',  'age': 36, 'blocked': false },
	 *   { 'name': 'fred',    'age': 40, 'blocked': true },
	 *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
	 * ];
	 *
	 * _.find(characters, function(chr) {
   *   return chr.age < 40;
   * });
	 * // => { 'name': 'barney', 'age': 36, 'blocked': false }
	 *
	 * // using "_.where" callback shorthand
	 * _.find(characters, { 'age': 1 });
	 * // =>  { 'name': 'pebbles', 'age': 1, 'blocked': false }
	 *
	 * // using "_.pluck" callback shorthand
	 * _.find(characters, 'blocked');
	 * // => { 'name': 'fred', 'age': 40, 'blocked': true }
	 */
	function find(collection, callback, thisArg) {
		callback = createCallback(callback, thisArg, 3);

		var index = -1,
			length = collection ? collection.length : 0;

		if (typeof length == 'number') {
			while (++index < length) {
				var value = collection[index];
				if (callback(value, index, collection)) {
					return value;
				}
			}
		} else {
			var result;
			forOwn(collection, function(value, index, collection) {
				if (callback(value, index, collection)) {
					result = value;
					return indicatorObject;
				}
			});
			return result;
		}
	}

	/**
	 * Examines each element in a `collection`, returning the first that
	 * has the given properties. When checking `properties`, this method
	 * performs a deep comparison between values to determine if they are
	 * equivalent to each other.
	 *
	 * @static
	 * @memberOf _
	 * @category Collections
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Object} properties The object of property values to filter by.
	 * @returns {*} Returns the found element, else `undefined`.
	 * @example
	 *
	 * var food = [
	 *   { 'name': 'apple',  'organic': false, 'type': 'fruit' },
	 *   { 'name': 'banana', 'organic': true,  'type': 'fruit' },
	 *   { 'name': 'beet',   'organic': false, 'type': 'vegetable' }
	 * ];
	 *
	 * _.findWhere(food, { 'type': 'vegetable' });
	 * // => { 'name': 'beet', 'organic': false, 'type': 'vegetable' }
	 */
	function findWhere(object, properties) {
		return where(object, properties, true);
	}

	/**
	 * Iterates over elements of a collection, executing the callback for each
	 * element. The callback is bound to `thisArg` and invoked with three arguments;
	 * (value, index|key, collection). Callbacks may exit iteration early by
	 * explicitly returning `false`.
	 *
	 * Note: As with other "Collections" methods, objects with a `length` property
	 * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
	 * may be used for object iteration.
	 *
	 * @static
	 * @memberOf _
	 * @alias each
	 * @category Collections
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function} [callback=identity] The function called per iteration.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {Array|Object|string} Returns `collection`.
	 * @example
	 *
	 * _([1, 2, 3]).forEach(function(num) { console.log(num); }).join(',');
	 * // => logs each number and returns '1,2,3'
	 *
	 * _.forEach({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { console.log(num); });
	 * // => logs each number and returns the object (property order is not guaranteed across environments)
	 */
	function forEach(collection, callback, thisArg) {
		var index = -1,
			length = collection ? collection.length : 0;

		callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
		if (typeof length == 'number') {
			while (++index < length) {
				if (callback(collection[index], index, collection) === indicatorObject) {
					break;
				}
			}
		} else {
			forOwn(collection, callback);
		}
	}

	/**
	 * This method is like `_.forEach` except that it iterates over elements
	 * of a `collection` from right to left.
	 *
	 * @static
	 * @memberOf _
	 * @alias eachRight
	 * @category Collections
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function} [callback=identity] The function called per iteration.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {Array|Object|string} Returns `collection`.
	 * @example
	 *
	 * _([1, 2, 3]).forEachRight(function(num) { console.log(num); }).join(',');
	 * // => logs each number from right to left and returns '3,2,1'
	 */
	function forEachRight(collection, callback) {
		var length = collection ? collection.length : 0;
		if (typeof length == 'number') {
			while (length--) {
				if (callback(collection[length], length, collection) === false) {
					break;
				}
			}
		} else {
			var props = keys(collection);
			length = props.length;
			forOwn(collection, function(value, key, collection) {
				key = props ? props[--length] : --length;
				return callback(collection[key], key, collection) === false && indicatorObject;
			});
		}
	}

	/**
	 * Creates an object composed of keys generated from the results of running
	 * each element of a collection through the callback. The corresponding value
	 * of each key is an array of the elements responsible for generating the key.
	 * The callback is bound to `thisArg` and invoked with three arguments;
	 * (value, index|key, collection).
	 *
	 * If a property name is provided for `callback` the created "_.pluck" style
	 * callback will return the property value of the given element.
	 *
	 * If an object is provided for `callback` the created "_.where" style callback
	 * will return `true` for elements that have the properties of the given object,
	 * else `false`
	 *
	 * @static
	 * @memberOf _
	 * @category Collections
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function|Object|string} [callback=identity] The function called
	 *  per iteration. If a property name or object is provided it will be used
	 *  to create a "_.pluck" or "_.where" style callback, respectively.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {Object} Returns the composed aggregate object.
	 * @example
	 *
	 * _.groupBy([4.2, 6.1, 6.4], function(num) { return Math.floor(num); });
	 * // => { '4': [4.2], '6': [6.1, 6.4] }
	 *
	 * _.groupBy([4.2, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
	 * // => { '4': [4.2], '6': [6.1, 6.4] }
	 *
	 * // using "_.pluck" callback shorthand
	 * _.groupBy(['one', 'two', 'three'], 'length');
	 * // => { '3': ['one', 'two'], '5': ['three'] }
	 */
	var groupBy = createAggregator(function(result, value, key) {
		(hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value);
	});

	/**
	 * Creates an object composed of keys generated from the results of running
	 * each element of the collection through the given callback. The corresponding
	 * value of each key is the last element responsible for generating the key.
	 * The callback is bound to `thisArg` and invoked with three arguments;
	 * (value, index|key, collection).
	 *
	 * If a property name is provided for `callback` the created "_.pluck" style
	 * callback will return the property value of the given element.
	 *
	 * If an object is provided for `callback` the created "_.where" style callback
	 * will return `true` for elements that have the properties of the given object,
	 * else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @category Collections
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function|Object|string} [callback=identity] The function called
	 *  per iteration. If a property name or object is provided it will be used
	 *  to create a "_.pluck" or "_.where" style callback, respectively.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {Object} Returns the composed aggregate object.
	 * @example
	 *
	 * var keys = [
	 *   { 'dir': 'left', 'code': 97 },
	 *   { 'dir': 'right', 'code': 100 }
	 * ];
	 *
	 * _.indexBy(keys, 'dir');
	 * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
	 *
	 * _.indexBy(keys, function(key) { return String.fromCharCode(key.code); });
	 * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
	 *
	 * _.indexBy(characters, function(key) { this.fromCharCode(key.code); }, String);
	 * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
	 */
	var indexBy = createAggregator(function(result, value, key) {
		result[key] = value;
	});

	/**
	 * Invokes the method named by `methodName` on each element in the `collection`
	 * returning an array of the results of each invoked method. Additional arguments
	 * will be provided to each invoked method. If `methodName` is a function it
	 * will be invoked for, and `this` bound to, each element in the `collection`.
	 *
	 * @static
	 * @memberOf _
	 * @category Collections
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function|string} methodName The name of the method to invoke or
	 *  the function invoked per iteration.
	 * @param {...*} [arg] Arguments to invoke the method with.
	 * @returns {Array} Returns a new array of the results of each invoked method.
	 * @example
	 *
	 * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
	 * // => [[1, 5, 7], [1, 2, 3]]
	 *
	 * _.invoke([123, 456], String.prototype.split, '');
	 * // => [['1', '2', '3'], ['4', '5', '6']]
	 */
	function invoke(collection, methodName) {
		var args = slice(arguments, 2),
			index = -1,
			isFunc = typeof methodName == 'function',
			length = collection ? collection.length : 0,
			result = Array(typeof length == 'number' ? length : 0);

		forEach(collection, function(value) {
			result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args);
		});
		return result;
	}

	/**
	 * Creates an array of values by running each element in the collection
	 * through the callback. The callback is bound to `thisArg` and invoked with
	 * three arguments; (value, index|key, collection).
	 *
	 * If a property name is provided for `callback` the created "_.pluck" style
	 * callback will return the property value of the given element.
	 *
	 * If an object is provided for `callback` the created "_.where" style callback
	 * will return `true` for elements that have the properties of the given object,
	 * else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @alias collect
	 * @category Collections
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function|Object|string} [callback=identity] The function called
	 *  per iteration. If a property name or object is provided it will be used
	 *  to create a "_.pluck" or "_.where" style callback, respectively.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {Array} Returns a new array of the results of each `callback` execution.
	 * @example
	 *
	 * _.map([1, 2, 3], function(num) { return num * 3; });
	 * // => [3, 6, 9]
	 *
	 * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { return num * 3; });
	 * // => [3, 6, 9] (property order is not guaranteed across environments)
	 *
	 * var characters = [
	 *   { 'name': 'barney', 'age': 36 },
	 *   { 'name': 'fred',   'age': 40 }
	 * ];
	 *
	 * // using "_.pluck" callback shorthand
	 * _.map(characters, 'name');
	 * // => ['barney', 'fred']
	 */
	function map(collection, callback, thisArg) {
		var index = -1,
			length = collection ? collection.length : 0;

		callback = createCallback(callback, thisArg, 3);
		if (typeof length == 'number') {
			var result = Array(length);
			while (++index < length) {
				result[index] = callback(collection[index], index, collection);
			}
		} else {
			result = [];
			forOwn(collection, function(value, key, collection) {
				result[++index] = callback(value, key, collection);
			});
		}
		return result;
	}

	/**
	 * Retrieves the maximum value of a collection. If the collection is empty or
	 * falsey `-Infinity` is returned. If a callback is provided it will be executed
	 * for each value in the collection to generate the criterion by which the value
	 * is ranked. The callback is bound to `thisArg` and invoked with three
	 * arguments; (value, index, collection).
	 *
	 * If a property name is provided for `callback` the created "_.pluck" style
	 * callback will return the property value of the given element.
	 *
	 * If an object is provided for `callback` the created "_.where" style callback
	 * will return `true` for elements that have the properties of the given object,
	 * else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @category Collections
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function|Object|string} [callback=identity] The function called
	 *  per iteration. If a property name or object is provided it will be used
	 *  to create a "_.pluck" or "_.where" style callback, respectively.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {*} Returns the maximum value.
	 * @example
	 *
	 * _.max([4, 2, 8, 6]);
	 * // => 8
	 *
	 * var characters = [
	 *   { 'name': 'barney', 'age': 36 },
	 *   { 'name': 'fred',   'age': 40 }
	 * ];
	 *
	 * _.max(characters, function(chr) { return chr.age; });
	 * // => { 'name': 'fred', 'age': 40 };
	 *
	 * // using "_.pluck" callback shorthand
	 * _.max(characters, 'age');
	 * // => { 'name': 'fred', 'age': 40 };
	 */
	function max(collection, callback, thisArg) {
		var computed = -Infinity,
			result = computed;

		// allows working with functions like `_.map` without using
		// their `index` argument as a callback
		if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
			callback = null;
		}
		var index = -1,
			length = collection ? collection.length : 0;

		if (callback == null && typeof length == 'number') {
			while (++index < length) {
				var value = collection[index];
				if (value > result) {
					result = value;
				}
			}
		} else {
			callback = createCallback(callback, thisArg, 3);

			forEach(collection, function(value, index, collection) {
				var current = callback(value, index, collection);
				if (current > computed) {
					computed = current;
					result = value;
				}
			});
		}
		return result;
	}

	/**
	 * Retrieves the minimum value of a collection. If the collection is empty or
	 * falsey `Infinity` is returned. If a callback is provided it will be executed
	 * for each value in the collection to generate the criterion by which the value
	 * is ranked. The callback is bound to `thisArg` and invoked with three
	 * arguments; (value, index, collection).
	 *
	 * If a property name is provided for `callback` the created "_.pluck" style
	 * callback will return the property value of the given element.
	 *
	 * If an object is provided for `callback` the created "_.where" style callback
	 * will return `true` for elements that have the properties of the given object,
	 * else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @category Collections
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function|Object|string} [callback=identity] The function called
	 *  per iteration. If a property name or object is provided it will be used
	 *  to create a "_.pluck" or "_.where" style callback, respectively.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {*} Returns the minimum value.
	 * @example
	 *
	 * _.min([4, 2, 8, 6]);
	 * // => 2
	 *
	 * var characters = [
	 *   { 'name': 'barney', 'age': 36 },
	 *   { 'name': 'fred',   'age': 40 }
	 * ];
	 *
	 * _.min(characters, function(chr) { return chr.age; });
	 * // => { 'name': 'barney', 'age': 36 };
	 *
	 * // using "_.pluck" callback shorthand
	 * _.min(characters, 'age');
	 * // => { 'name': 'barney', 'age': 36 };
	 */
	function min(collection, callback, thisArg) {
		var computed = Infinity,
			result = computed;

		// allows working with functions like `_.map` without using
		// their `index` argument as a callback
		if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
			callback = null;
		}
		var index = -1,
			length = collection ? collection.length : 0;

		if (callback == null && typeof length == 'number') {
			while (++index < length) {
				var value = collection[index];
				if (value < result) {
					result = value;
				}
			}
		} else {
			callback = createCallback(callback, thisArg, 3);

			forEach(collection, function(value, index, collection) {
				var current = callback(value, index, collection);
				if (current < computed) {
					computed = current;
					result = value;
				}
			});
		}
		return result;
	}

	/**
	 * Retrieves the value of a specified property from all elements in the collection.
	 *
	 * @static
	 * @memberOf _
	 * @type Function
	 * @category Collections
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {string} property The property to pluck.
	 * @returns {Array} Returns a new array of property values.
	 * @example
	 *
	 * var characters = [
	 *   { 'name': 'barney', 'age': 36 },
	 *   { 'name': 'fred',   'age': 40 }
	 * ];
	 *
	 * _.pluck(characters, 'name');
	 * // => ['barney', 'fred']
	 */
	function pluck(collection, property) {
		var index = -1,
			length = collection ? collection.length : 0;

		if (typeof length == 'number') {
			var result = Array(length);
			while (++index < length) {
				result[index] = collection[index][property];
			}
		}
		return result || map(collection, property);
	}

	/**
	 * Reduces a collection to a value which is the accumulated result of running
	 * each element in the collection through the callback, where each successive
	 * callback execution consumes the return value of the previous execution. If
	 * `accumulator` is not provided the first element of the collection will be
	 * used as the initial `accumulator` value. The callback is bound to `thisArg`
	 * and invoked with four arguments; (accumulator, value, index|key, collection).
	 *
	 * @static
	 * @memberOf _
	 * @alias foldl, inject
	 * @category Collections
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function} [callback=identity] The function called per iteration.
	 * @param {*} [accumulator] Initial value of the accumulator.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {*} Returns the accumulated value.
	 * @example
	 *
	 * var sum = _.reduce([1, 2, 3], function(sum, num) {
   *   return sum + num;
   * });
	 * // => 6
	 *
	 * var mapped = _.reduce({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
   *   result[key] = num * 3;
   *   return result;
   * }, {});
	 * // => { 'a': 3, 'b': 6, 'c': 9 }
	 */
	function reduce(collection, callback, accumulator, thisArg) {
		if (!collection) return accumulator;
		var noaccum = arguments.length < 3;
		callback = createCallback(callback, thisArg, 4);

		var index = -1,
			length = collection.length;

		if (typeof length == 'number') {
			if (noaccum) {
				accumulator = collection[++index];
			}
			while (++index < length) {
				accumulator = callback(accumulator, collection[index], index, collection);
			}
		} else {
			forOwn(collection, function(value, index, collection) {
				accumulator = noaccum
					? (noaccum = false, value)
					: callback(accumulator, value, index, collection)
			});
		}
		return accumulator;
	}

	/**
	 * This method is like `_.reduce` except that it iterates over elements
	 * of a `collection` from right to left.
	 *
	 * @static
	 * @memberOf _
	 * @alias foldr
	 * @category Collections
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function} [callback=identity] The function called per iteration.
	 * @param {*} [accumulator] Initial value of the accumulator.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {*} Returns the accumulated value.
	 * @example
	 *
	 * var list = [[0, 1], [2, 3], [4, 5]];
	 * var flat = _.reduceRight(list, function(a, b) { return a.concat(b); }, []);
	 * // => [4, 5, 2, 3, 0, 1]
	 */
	function reduceRight(collection, callback, accumulator, thisArg) {
		var noaccum = arguments.length < 3;
		callback = createCallback(callback, thisArg, 4);
		forEachRight(collection, function(value, index, collection) {
			accumulator = noaccum
				? (noaccum = false, value)
				: callback(accumulator, value, index, collection);
		});
		return accumulator;
	}

	/**
	 * The opposite of `_.filter` this method returns the elements of a
	 * collection that the callback does **not** return truey for.
	 *
	 * If a property name is provided for `callback` the created "_.pluck" style
	 * callback will return the property value of the given element.
	 *
	 * If an object is provided for `callback` the created "_.where" style callback
	 * will return `true` for elements that have the properties of the given object,
	 * else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @category Collections
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function|Object|string} [callback=identity] The function called
	 *  per iteration. If a property name or object is provided it will be used
	 *  to create a "_.pluck" or "_.where" style callback, respectively.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {Array} Returns a new array of elements that failed the callback check.
	 * @example
	 *
	 * var odds = _.reject([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
	 * // => [1, 3, 5]
	 *
	 * var characters = [
	 *   { 'name': 'barney', 'age': 36, 'blocked': false },
	 *   { 'name': 'fred',   'age': 40, 'blocked': true }
	 * ];
	 *
	 * // using "_.pluck" callback shorthand
	 * _.reject(characters, 'blocked');
	 * // => [{ 'name': 'barney', 'age': 36, 'blocked': false }]
	 *
	 * // using "_.where" callback shorthand
	 * _.reject(characters, { 'age': 36 });
	 * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
	 */
	function reject(collection, callback, thisArg) {
		callback = createCallback(callback, thisArg, 3);
		return filter(collection, function(value, index, collection) {
			return !callback(value, index, collection);
		});
	}

	/**
	 * Retrieves a random element or `n` random elements from a collection.
	 *
	 * @static
	 * @memberOf _
	 * @category Collections
	 * @param {Array|Object|string} collection The collection to sample.
	 * @param {number} [n] The number of elements to sample.
	 * @param- {Object} [guard] Allows working with functions like `_.map`
	 *  without using their `index` arguments as `n`.
	 * @returns {Array} Returns the random sample(s) of `collection`.
	 * @example
	 *
	 * _.sample([1, 2, 3, 4]);
	 * // => 2
	 *
	 * _.sample([1, 2, 3, 4], 2);
	 * // => [3, 1]
	 */
	function sample(collection, n, guard) {
		if (collection && typeof collection.length != 'number') {
			collection = values(collection);
		}
		if (n == null || guard) {
			return collection ? collection[baseRandom(0, collection.length - 1)] : undefined;
		}
		var result = shuffle(collection);
		result.length = nativeMin(nativeMax(0, n), result.length);
		return result;
	}

	/**
	 * Creates an array of shuffled values, using a version of the Fisher-Yates
	 * shuffle. See http://en.wikipedia.org/wiki/Fisher-Yates_shuffle.
	 *
	 * @static
	 * @memberOf _
	 * @category Collections
	 * @param {Array|Object|string} collection The collection to shuffle.
	 * @returns {Array} Returns a new shuffled collection.
	 * @example
	 *
	 * _.shuffle([1, 2, 3, 4, 5, 6]);
	 * // => [4, 1, 6, 3, 5, 2]
	 */
	function shuffle(collection) {
		var index = -1,
			length = collection ? collection.length : 0,
			result = Array(typeof length == 'number' ? length : 0);

		forEach(collection, function(value) {
			var rand = baseRandom(0, ++index);
			result[index] = result[rand];
			result[rand] = value;
		});
		return result;
	}

	/**
	 * Gets the size of the `collection` by returning `collection.length` for arrays
	 * and array-like objects or the number of own enumerable properties for objects.
	 *
	 * @static
	 * @memberOf _
	 * @category Collections
	 * @param {Array|Object|string} collection The collection to inspect.
	 * @returns {number} Returns `collection.length` or number of own enumerable properties.
	 * @example
	 *
	 * _.size([1, 2]);
	 * // => 2
	 *
	 * _.size({ 'one': 1, 'two': 2, 'three': 3 });
	 * // => 3
	 *
	 * _.size('pebbles');
	 * // => 5
	 */
	function size(collection) {
		var length = collection ? collection.length : 0;
		return typeof length == 'number' ? length : keys(collection).length;
	}

	/**
	 * Checks if the callback returns a truey value for **any** element of a
	 * collection. The function returns as soon as it finds a passing value and
	 * does not iterate over the entire collection. The callback is bound to
	 * `thisArg` and invoked with three arguments; (value, index|key, collection).
	 *
	 * If a property name is provided for `callback` the created "_.pluck" style
	 * callback will return the property value of the given element.
	 *
	 * If an object is provided for `callback` the created "_.where" style callback
	 * will return `true` for elements that have the properties of the given object,
	 * else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @alias any
	 * @category Collections
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function|Object|string} [callback=identity] The function called
	 *  per iteration. If a property name or object is provided it will be used
	 *  to create a "_.pluck" or "_.where" style callback, respectively.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {boolean} Returns `true` if any element passed the callback check,
	 *  else `false`.
	 * @example
	 *
	 * _.some([null, 0, 'yes', false], Boolean);
	 * // => true
	 *
	 * var characters = [
	 *   { 'name': 'barney', 'age': 36, 'blocked': false },
	 *   { 'name': 'fred',   'age': 40, 'blocked': true }
	 * ];
	 *
	 * // using "_.pluck" callback shorthand
	 * _.some(characters, 'blocked');
	 * // => true
	 *
	 * // using "_.where" callback shorthand
	 * _.some(characters, { 'age': 1 });
	 * // => false
	 */
	function some(collection, callback, thisArg) {
		var result;
		callback = createCallback(callback, thisArg, 3);

		var index = -1,
			length = collection ? collection.length : 0;

		if (typeof length == 'number') {
			while (++index < length) {
				if ((result = callback(collection[index], index, collection))) {
					break;
				}
			}
		} else {
			forOwn(collection, function(value, index, collection) {
				return (result = callback(value, index, collection)) && indicatorObject;
			});
		}
		return !!result;
	}

	/**
	 * Creates an array of elements, sorted in ascending order by the results of
	 * running each element in a collection through the callback. This method
	 * performs a stable sort, that is, it will preserve the original sort order
	 * of equal elements. The callback is bound to `thisArg` and invoked with
	 * three arguments; (value, index|key, collection).
	 *
	 * If a property name is provided for `callback` the created "_.pluck" style
	 * callback will return the property value of the given element.
	 *
	 * If an object is provided for `callback` the created "_.where" style callback
	 * will return `true` for elements that have the properties of the given object,
	 * else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @category Collections
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function|Object|string} [callback=identity] The function called
	 *  per iteration. If a property name or object is provided it will be used
	 *  to create a "_.pluck" or "_.where" style callback, respectively.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {Array} Returns a new array of sorted elements.
	 * @example
	 *
	 * _.sortBy([1, 2, 3], function(num) { return Math.sin(num); });
	 * // => [3, 1, 2]
	 *
	 * _.sortBy([1, 2, 3], function(num) { return this.sin(num); }, Math);
	 * // => [3, 1, 2]
	 *
	 * // using "_.pluck" callback shorthand
	 * _.sortBy(['banana', 'strawberry', 'apple'], 'length');
	 * // => ['apple', 'banana', 'strawberry']
	 */
	function sortBy(collection, callback, thisArg) {
		var index = -1,
			length = collection ? collection.length : 0,
			result = Array(typeof length == 'number' ? length : 0);

		callback = createCallback(callback, thisArg, 3);
		forEach(collection, function(value, key, collection) {
			result[++index] = {
				'criteria': callback(value, key, collection),
				'index': index,
				'value': value
			};
		});

		length = result.length;
		result.sort(compareAscending);
		while (length--) {
			result[length] = result[length].value;
		}
		return result;
	}

	/**
	 * Converts the `collection` to an array.
	 *
	 * @static
	 * @memberOf _
	 * @category Collections
	 * @param {Array|Object|string} collection The collection to convert.
	 * @returns {Array} Returns the new converted array.
	 * @example
	 *
	 * (function() { return _.toArray(arguments).slice(1); })(1, 2, 3, 4);
	 * // => [2, 3, 4]
	 */
	function toArray(collection) {
		if (isArray(collection)) {
			return slice(collection);
		}
		if (collection && typeof collection.length == 'number') {
			return map(collection);
		}
		return values(collection);
	}

	/**
	 * Performs a deep comparison of each element in a `collection` to the given
	 * `properties` object, returning an array of all elements that have equivalent
	 * property values.
	 *
	 * @static
	 * @memberOf _
	 * @type Function
	 * @category Collections
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Object} properties The object of property values to filter by.
	 * @returns {Array} Returns a new array of elements that have the given properties.
	 * @example
	 *
	 * var characters = [
	 *   { 'name': 'barney', 'age': 36, 'pets': ['hoppy'] },
	 *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
	 * ];
	 *
	 * _.where(characters, { 'age': 36 });
	 * // => [{ 'name': 'barney', 'age': 36, 'pets': ['hoppy'] }]
	 *
	 * _.where(characters, { 'pets': ['dino'] });
	 * // => [{ 'name': 'fred', 'age': 40, 'pets': ['baby puss', 'dino'] }]
	 */
	function where(collection, properties, first) {
		return (first && isEmpty(properties))
			? undefined
			: (first ? find : filter)(collection, properties);
	}

	/*--------------------------------------------------------------------------*/

	/**
	 * Creates an array with all falsey values removed. The values `false`, `null`,
	 * `0`, `""`, `undefined`, and `NaN` are all falsey.
	 *
	 * @static
	 * @memberOf _
	 * @category Arrays
	 * @param {Array} array The array to compact.
	 * @returns {Array} Returns a new array of filtered values.
	 * @example
	 *
	 * _.compact([0, 1, false, 2, '', 3]);
	 * // => [1, 2, 3]
	 */
	function compact(array) {
		var index = -1,
			length = array ? array.length : 0,
			result = [];

		while (++index < length) {
			var value = array[index];
			if (value) {
				result.push(value);
			}
		}
		return result;
	}

	/**
	 * Creates an array excluding all values of the provided arrays using strict
	 * equality for comparisons, i.e. `===`.
	 *
	 * @static
	 * @memberOf _
	 * @category Arrays
	 * @param {Array} array The array to process.
	 * @param {...Array} [values] The arrays of values to exclude.
	 * @returns {Array} Returns a new array of filtered values.
	 * @example
	 *
	 * _.difference([1, 2, 3, 4, 5], [5, 2, 10]);
	 * // => [1, 3, 4]
	 */
	function difference(array) {
		return baseDifference(array, baseFlatten(arguments, true, true, 1));
	}

	/**
	 * Gets the first element or first `n` elements of an array. If a callback
	 * is provided elements at the beginning of the array are returned as long
	 * as the callback returns truey. The callback is bound to `thisArg` and
	 * invoked with three arguments; (value, index, array).
	 *
	 * If a property name is provided for `callback` the created "_.pluck" style
	 * callback will return the property value of the given element.
	 *
	 * If an object is provided for `callback` the created "_.where" style callback
	 * will return `true` for elements that have the properties of the given object,
	 * else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @alias head, take
	 * @category Arrays
	 * @param {Array} array The array to query.
	 * @param {Function|Object|number|string} [callback] The function called
	 *  per element or the number of elements to return. If a property name or
	 *  object is provided it will be used to create a "_.pluck" or "_.where"
	 *  style callback, respectively.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {*} Returns the first element(s) of `array`.
	 * @example
	 *
	 * _.first([1, 2, 3]);
	 * // => 1
	 *
	 * _.first([1, 2, 3], 2);
	 * // => [1, 2]
	 *
	 * _.first([1, 2, 3], function(num) {
   *   return num < 3;
   * });
	 * // => [1, 2]
	 *
	 * var characters = [
	 *   { 'name': 'barney',  'blocked': true,  'employer': 'slate' },
	 *   { 'name': 'fred',    'blocked': false, 'employer': 'slate' },
	 *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
	 * ];
	 *
	 * // using "_.pluck" callback shorthand
	 * _.first(characters, 'blocked');
	 * // => [{ 'name': 'barney', 'blocked': true, 'employer': 'slate' }]
	 *
	 * // using "_.where" callback shorthand
	 * _.pluck(_.first(characters, { 'employer': 'slate' }), 'name');
	 * // => ['barney', 'fred']
	 */
	function first(array, callback, thisArg) {
		var n = 0,
			length = array ? array.length : 0;

		if (typeof callback != 'number' && callback != null) {
			var index = -1;
			callback = createCallback(callback, thisArg, 3);
			while (++index < length && callback(array[index], index, array)) {
				n++;
			}
		} else {
			n = callback;
			if (n == null || thisArg) {
				return array ? array[0] : undefined;
			}
		}
		return slice(array, 0, nativeMin(nativeMax(0, n), length));
	}

	/**
	 * Flattens a nested array (the nesting can be to any depth). If `isShallow`
	 * is truey, the array will only be flattened a single level. If a callback
	 * is provided each element of the array is passed through the callback before
	 * flattening. The callback is bound to `thisArg` and invoked with three
	 * arguments; (value, index, array).
	 *
	 * If a property name is provided for `callback` the created "_.pluck" style
	 * callback will return the property value of the given element.
	 *
	 * If an object is provided for `callback` the created "_.where" style callback
	 * will return `true` for elements that have the properties of the given object,
	 * else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @category Arrays
	 * @param {Array} array The array to flatten.
	 * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
	 * @param {Function|Object|string} [callback=identity] The function called
	 *  per iteration. If a property name or object is provided it will be used
	 *  to create a "_.pluck" or "_.where" style callback, respectively.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {Array} Returns a new flattened array.
	 * @example
	 *
	 * _.flatten([1, [2], [3, [[4]]]]);
	 * // => [1, 2, 3, 4];
	 *
	 * _.flatten([1, [2], [3, [[4]]]], true);
	 * // => [1, 2, 3, [[4]]];
	 *
	 * var characters = [
	 *   { 'name': 'barney', 'age': 30, 'pets': ['hoppy'] },
	 *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
	 * ];
	 *
	 * // using "_.pluck" callback shorthand
	 * _.flatten(characters, 'pets');
	 * // => ['hoppy', 'baby puss', 'dino']
	 */
	function flatten(array, isShallow) {
		return baseFlatten(array, isShallow);
	}

	/**
	 * Gets the index at which the first occurrence of `value` is found using
	 * strict equality for comparisons, i.e. `===`. If the array is already sorted
	 * providing `true` for `fromIndex` will run a faster binary search.
	 *
	 * @static
	 * @memberOf _
	 * @category Arrays
	 * @param {Array} array The array to search.
	 * @param {*} value The value to search for.
	 * @param {boolean|number} [fromIndex=0] The index to search from or `true`
	 *  to perform a binary search on a sorted array.
	 * @returns {number} Returns the index of the matched value or `-1`.
	 * @example
	 *
	 * _.indexOf([1, 2, 3, 1, 2, 3], 2);
	 * // => 1
	 *
	 * _.indexOf([1, 2, 3, 1, 2, 3], 2, 3);
	 * // => 4
	 *
	 * _.indexOf([1, 1, 2, 2, 3, 3], 2, true);
	 * // => 2
	 */
	function indexOf(array, value, fromIndex) {
		if (typeof fromIndex == 'number') {
			var length = array ? array.length : 0;
			fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex || 0);
		} else if (fromIndex) {
			var index = sortedIndex(array, value);
			return array[index] === value ? index : -1;
		}
		return baseIndexOf(array, value, fromIndex);
	}

	/**
	 * Gets all but the last element or last `n` elements of an array. If a
	 * callback is provided elements at the end of the array are excluded from
	 * the result as long as the callback returns truey. The callback is bound
	 * to `thisArg` and invoked with three arguments; (value, index, array).
	 *
	 * If a property name is provided for `callback` the created "_.pluck" style
	 * callback will return the property value of the given element.
	 *
	 * If an object is provided for `callback` the created "_.where" style callback
	 * will return `true` for elements that have the properties of the given object,
	 * else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @category Arrays
	 * @param {Array} array The array to query.
	 * @param {Function|Object|number|string} [callback=1] The function called
	 *  per element or the number of elements to exclude. If a property name or
	 *  object is provided it will be used to create a "_.pluck" or "_.where"
	 *  style callback, respectively.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {Array} Returns a slice of `array`.
	 * @example
	 *
	 * _.initial([1, 2, 3]);
	 * // => [1, 2]
	 *
	 * _.initial([1, 2, 3], 2);
	 * // => [1]
	 *
	 * _.initial([1, 2, 3], function(num) {
   *   return num > 1;
   * });
	 * // => [1]
	 *
	 * var characters = [
	 *   { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
	 *   { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
	 *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
	 * ];
	 *
	 * // using "_.pluck" callback shorthand
	 * _.initial(characters, 'blocked');
	 * // => [{ 'name': 'barney',  'blocked': false, 'employer': 'slate' }]
	 *
	 * // using "_.where" callback shorthand
	 * _.pluck(_.initial(characters, { 'employer': 'na' }), 'name');
	 * // => ['barney', 'fred']
	 */
	function initial(array, callback, thisArg) {
		var n = 0,
			length = array ? array.length : 0;

		if (typeof callback != 'number' && callback != null) {
			var index = length;
			callback = createCallback(callback, thisArg, 3);
			while (index-- && callback(array[index], index, array)) {
				n++;
			}
		} else {
			n = (callback == null || thisArg) ? 1 : callback || n;
		}
		return slice(array, 0, nativeMin(nativeMax(0, length - n), length));
	}

	/**
	 * Creates an array of unique values present in all provided arrays using
	 * strict equality for comparisons, i.e. `===`.
	 *
	 * @static
	 * @memberOf _
	 * @category Arrays
	 * @param {...Array} [array] The arrays to inspect.
	 * @returns {Array} Returns an array of composite values.
	 * @example
	 *
	 * _.intersection([1, 2, 3], [101, 2, 1, 10], [2, 1]);
	 * // => [1, 2]
	 */
	function intersection(array) {
		var args = arguments,
			argsLength = args.length,
			index = -1,
			indexOf = getIndexOf(),
			length = array ? array.length : 0,
			result = [];

		outer:
			while (++index < length) {
				var value = array[index];
				if (indexOf(result, value) < 0) {
					var argsIndex = argsLength;
					while (--argsIndex) {
						if (indexOf(args[argsIndex], value) < 0) {
							continue outer;
						}
					}
					result.push(value);
				}
			}
		return result;
	}

	/**
	 * Gets the last element or last `n` elements of an array. If a callback is
	 * provided elements at the end of the array are returned as long as the
	 * callback returns truey. The callback is bound to `thisArg` and invoked
	 * with three arguments; (value, index, array).
	 *
	 * If a property name is provided for `callback` the created "_.pluck" style
	 * callback will return the property value of the given element.
	 *
	 * If an object is provided for `callback` the created "_.where" style callback
	 * will return `true` for elements that have the properties of the given object,
	 * else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @category Arrays
	 * @param {Array} array The array to query.
	 * @param {Function|Object|number|string} [callback] The function called
	 *  per element or the number of elements to return. If a property name or
	 *  object is provided it will be used to create a "_.pluck" or "_.where"
	 *  style callback, respectively.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {*} Returns the last element(s) of `array`.
	 * @example
	 *
	 * _.last([1, 2, 3]);
	 * // => 3
	 *
	 * _.last([1, 2, 3], 2);
	 * // => [2, 3]
	 *
	 * _.last([1, 2, 3], function(num) {
   *   return num > 1;
   * });
	 * // => [2, 3]
	 *
	 * var characters = [
	 *   { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
	 *   { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
	 *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
	 * ];
	 *
	 * // using "_.pluck" callback shorthand
	 * _.pluck(_.last(characters, 'blocked'), 'name');
	 * // => ['fred', 'pebbles']
	 *
	 * // using "_.where" callback shorthand
	 * _.last(characters, { 'employer': 'na' });
	 * // => [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
	 */
	function last(array, callback, thisArg) {
		var n = 0,
			length = array ? array.length : 0;

		if (typeof callback != 'number' && callback != null) {
			var index = length;
			callback = createCallback(callback, thisArg, 3);
			while (index-- && callback(array[index], index, array)) {
				n++;
			}
		} else {
			n = callback;
			if (n == null || thisArg) {
				return array ? array[length - 1] : undefined;
			}
		}
		return slice(array, nativeMax(0, length - n));
	}

	/**
	 * Gets the index at which the last occurrence of `value` is found using strict
	 * equality for comparisons, i.e. `===`. If `fromIndex` is negative, it is used
	 * as the offset from the end of the collection.
	 *
	 * If a property name is provided for `callback` the created "_.pluck" style
	 * callback will return the property value of the given element.
	 *
	 * If an object is provided for `callback` the created "_.where" style callback
	 * will return `true` for elements that have the properties of the given object,
	 * else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @category Arrays
	 * @param {Array} array The array to search.
	 * @param {*} value The value to search for.
	 * @param {number} [fromIndex=array.length-1] The index to search from.
	 * @returns {number} Returns the index of the matched value or `-1`.
	 * @example
	 *
	 * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2);
	 * // => 4
	 *
	 * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2, 3);
	 * // => 1
	 */
	function lastIndexOf(array, value, fromIndex) {
		var index = array ? array.length : 0;
		if (typeof fromIndex == 'number') {
			index = (fromIndex < 0 ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1;
		}
		while (index--) {
			if (array[index] === value) {
				return index;
			}
		}
		return -1;
	}

	/**
	 * Creates an array of numbers (positive and/or negative) progressing from
	 * `start` up to but not including `end`. If `start` is less than `stop` a
	 * zero-length range is created unless a negative `step` is specified.
	 *
	 * @static
	 * @memberOf _
	 * @category Arrays
	 * @param {number} [start=0] The start of the range.
	 * @param {number} end The end of the range.
	 * @param {number} [step=1] The value to increment or decrement by.
	 * @returns {Array} Returns a new range array.
	 * @example
	 *
	 * _.range(4);
	 * // => [0, 1, 2, 3]
	 *
	 * _.range(1, 5);
	 * // => [1, 2, 3, 4]
	 *
	 * _.range(0, 20, 5);
	 * // => [0, 5, 10, 15]
	 *
	 * _.range(0, -4, -1);
	 * // => [0, -1, -2, -3]
	 *
	 * _.range(1, 4, 0);
	 * // => [1, 1, 1]
	 *
	 * _.range(0);
	 * // => []
	 */
	function range(start, end, step) {
		start = +start || 0;
		step =  (+step || 1);

		if (end == null) {
			end = start;
			start = 0;
		}
		// use `Array(length)` so engines like Chakra and V8 avoid slower modes
		// http://youtu.be/XAqIpGU8ZZk#t=17m25s
		var index = -1,
			length = nativeMax(0, ceil((end - start) / step)),
			result = Array(length);

		while (++index < length) {
			result[index] = start;
			start += step;
		}
		return result;
	}

	/**
	 * The opposite of `_.initial` this method gets all but the first element or
	 * first `n` elements of an array. If a callback function is provided elements
	 * at the beginning of the array are excluded from the result as long as the
	 * callback returns truey. The callback is bound to `thisArg` and invoked
	 * with three arguments; (value, index, array).
	 *
	 * If a property name is provided for `callback` the created "_.pluck" style
	 * callback will return the property value of the given element.
	 *
	 * If an object is provided for `callback` the created "_.where" style callback
	 * will return `true` for elements that have the properties of the given object,
	 * else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @alias drop, tail
	 * @category Arrays
	 * @param {Array} array The array to query.
	 * @param {Function|Object|number|string} [callback=1] The function called
	 *  per element or the number of elements to exclude. If a property name or
	 *  object is provided it will be used to create a "_.pluck" or "_.where"
	 *  style callback, respectively.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {Array} Returns a slice of `array`.
	 * @example
	 *
	 * _.rest([1, 2, 3]);
	 * // => [2, 3]
	 *
	 * _.rest([1, 2, 3], 2);
	 * // => [3]
	 *
	 * _.rest([1, 2, 3], function(num) {
   *   return num < 3;
   * });
	 * // => [3]
	 *
	 * var characters = [
	 *   { 'name': 'barney',  'blocked': true,  'employer': 'slate' },
	 *   { 'name': 'fred',    'blocked': false,  'employer': 'slate' },
	 *   { 'name': 'pebbles', 'blocked': true, 'employer': 'na' }
	 * ];
	 *
	 * // using "_.pluck" callback shorthand
	 * _.pluck(_.rest(characters, 'blocked'), 'name');
	 * // => ['fred', 'pebbles']
	 *
	 * // using "_.where" callback shorthand
	 * _.rest(characters, { 'employer': 'slate' });
	 * // => [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
	 */
	function rest(array, callback, thisArg) {
		if (typeof callback != 'number' && callback != null) {
			var n = 0,
				index = -1,
				length = array ? array.length : 0;

			callback = createCallback(callback, thisArg, 3);
			while (++index < length && callback(array[index], index, array)) {
				n++;
			}
		} else {
			n = (callback == null || thisArg) ? 1 : nativeMax(0, callback);
		}
		return slice(array, n);
	}

	/**
	 * Uses a binary search to determine the smallest index at which a value
	 * should be inserted into a given sorted array in order to maintain the sort
	 * order of the array. If a callback is provided it will be executed for
	 * `value` and each element of `array` to compute their sort ranking. The
	 * callback is bound to `thisArg` and invoked with one argument; (value).
	 *
	 * If a property name is provided for `callback` the created "_.pluck" style
	 * callback will return the property value of the given element.
	 *
	 * If an object is provided for `callback` the created "_.where" style callback
	 * will return `true` for elements that have the properties of the given object,
	 * else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @category Arrays
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to evaluate.
	 * @param {Function|Object|string} [callback=identity] The function called
	 *  per iteration. If a property name or object is provided it will be used
	 *  to create a "_.pluck" or "_.where" style callback, respectively.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {number} Returns the index at which `value` should be inserted
	 *  into `array`.
	 * @example
	 *
	 * _.sortedIndex([20, 30, 50], 40);
	 * // => 2
	 *
	 * // using "_.pluck" callback shorthand
	 * _.sortedIndex([{ 'x': 20 }, { 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
	 * // => 2
	 *
	 * var dict = {
   *   'wordToNumber': { 'twenty': 20, 'thirty': 30, 'fourty': 40, 'fifty': 50 }
   * };
	 *
	 * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
   *   return dict.wordToNumber[word];
   * });
	 * // => 2
	 *
	 * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
   *   return this.wordToNumber[word];
   * }, dict);
	 * // => 2
	 */
	function sortedIndex(array, value, callback, thisArg) {
		var low = 0,
			high = array ? array.length : low;

		// explicitly reference `identity` for better inlining in Firefox
		callback = callback ? createCallback(callback, thisArg, 1) : identity;
		value = callback(value);

		while (low < high) {
			var mid = (low + high) >>> 1;
			(callback(array[mid]) < value)
				? low = mid + 1
				: high = mid;
		}
		return low;
	}

	/**
	 * Creates an array of unique values, in order, of the provided arrays using
	 * strict equality for comparisons, i.e. `===`.
	 *
	 * @static
	 * @memberOf _
	 * @category Arrays
	 * @param {...Array} [array] The arrays to inspect.
	 * @returns {Array} Returns an array of composite values.
	 * @example
	 *
	 * _.union([1, 2, 3], [101, 2, 1, 10], [2, 1]);
	 * // => [1, 2, 3, 101, 10]
	 */
	function union(array) {
		return baseUniq(baseFlatten(arguments, true, true));
	}

	/**
	 * Creates a duplicate-value-free version of an array using strict equality
	 * for comparisons, i.e. `===`. If the array is sorted, providing
	 * `true` for `isSorted` will use a faster algorithm. If a callback is provided
	 * each element of `array` is passed through the callback before uniqueness
	 * is computed. The callback is bound to `thisArg` and invoked with three
	 * arguments; (value, index, array).
	 *
	 * If a property name is provided for `callback` the created "_.pluck" style
	 * callback will return the property value of the given element.
	 *
	 * If an object is provided for `callback` the created "_.where" style callback
	 * will return `true` for elements that have the properties of the given object,
	 * else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @alias unique
	 * @category Arrays
	 * @param {Array} array The array to process.
	 * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
	 * @param {Function|Object|string} [callback=identity] The function called
	 *  per iteration. If a property name or object is provided it will be used
	 *  to create a "_.pluck" or "_.where" style callback, respectively.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {Array} Returns a duplicate-value-free array.
	 * @example
	 *
	 * _.uniq([1, 2, 1, 3, 1]);
	 * // => [1, 2, 3]
	 *
	 * _.uniq([1, 1, 2, 2, 3], true);
	 * // => [1, 2, 3]
	 *
	 * _.uniq(['A', 'b', 'C', 'a', 'B', 'c'], function(letter) { return letter.toLowerCase(); });
	 * // => ['A', 'b', 'C']
	 *
	 * _.uniq([1, 2.5, 3, 1.5, 2, 3.5], function(num) { return this.floor(num); }, Math);
	 * // => [1, 2.5, 3]
	 *
	 * // using "_.pluck" callback shorthand
	 * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
	 * // => [{ 'x': 1 }, { 'x': 2 }]
	 */
	function uniq(array, isSorted, callback, thisArg) {
		// juggle arguments
		if (typeof isSorted != 'boolean' && isSorted != null) {
			thisArg = callback;
			callback = (typeof isSorted != 'function' && thisArg && thisArg[isSorted] === array) ? null : isSorted;
			isSorted = false;
		}
		if (callback != null) {
			callback = createCallback(callback, thisArg, 3);
		}
		return baseUniq(array, isSorted, callback);
	}

	/**
	 * Creates an array excluding all provided values using strict equality for
	 * comparisons, i.e. `===`.
	 *
	 * @static
	 * @memberOf _
	 * @category Arrays
	 * @param {Array} array The array to filter.
	 * @param {...*} [value] The values to exclude.
	 * @returns {Array} Returns a new array of filtered values.
	 * @example
	 *
	 * _.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
	 * // => [2, 3, 4]
	 */
	function without(array) {
		return baseDifference(array, slice(arguments, 1));
	}

	/**
	 * Creates an array of grouped elements, the first of which contains the first
	 * elements of the given arrays, the second of which contains the second
	 * elements of the given arrays, and so on.
	 *
	 * @static
	 * @memberOf _
	 * @alias unzip
	 * @category Arrays
	 * @param {...Array} [array] Arrays to process.
	 * @returns {Array} Returns a new array of grouped elements.
	 * @example
	 *
	 * _.zip(['fred', 'barney'], [30, 40], [true, false]);
	 * // => [['fred', 30, true], ['barney', 40, false]]
	 */
	function zip() {
		var index = -1,
			length = max(pluck(arguments, 'length')),
			result = Array(length < 0 ? 0 : length);

		while (++index < length) {
			result[index] = pluck(arguments, index);
		}
		return result;
	}

	/**
	 * Creates an object composed from arrays of `keys` and `values`. Provide
	 * either a single two dimensional array, i.e. `[[key1, value1], [key2, value2]]`
	 * or two arrays, one of `keys` and one of corresponding `values`.
	 *
	 * @static
	 * @memberOf _
	 * @alias object
	 * @category Arrays
	 * @param {Array} keys The array of keys.
	 * @param {Array} [values=[]] The array of values.
	 * @returns {Object} Returns an object composed of the given keys and
	 *  corresponding values.
	 * @example
	 *
	 * _.zipObject(['fred', 'barney'], [30, 40]);
	 * // => { 'fred': 30, 'barney': 40 }
	 */
	function zipObject(keys, values) {
		var index = -1,
			length = keys ? keys.length : 0,
			result = {};

		while (++index < length) {
			var key = keys[index];
			if (values) {
				result[key] = values[index];
			} else if (key) {
				result[key[0]] = key[1];
			}
		}
		return result;
	}

	/*--------------------------------------------------------------------------*/

	/**
	 * Creates a function that executes `func`, with  the `this` binding and
	 * arguments of the created function, only after being called `n` times.
	 *
	 * @static
	 * @memberOf _
	 * @category Functions
	 * @param {number} n The number of times the function must be called before
	 *  `func` is executed.
	 * @param {Function} func The function to restrict.
	 * @returns {Function} Returns the new restricted function.
	 * @example
	 *
	 * var saves = ['profile', 'settings'];
	 *
	 * var done = _.after(saves.length, function() {
   *   console.log('Done saving!');
   * });
	 *
	 * _.forEach(saves, function(type) {
   *   asyncSave({ 'type': type, 'complete': done });
   * });
	 * // => logs 'Done saving!', after all saves have completed
	 */
	function after(n, func) {
		if (!isFunction(func)) {
			throw new TypeError;
		}
		return function() {
			if (--n < 1) {
				return func.apply(this, arguments);
			}
		};
	}

	/**
	 * Creates a function that, when called, invokes `func` with the `this`
	 * binding of `thisArg` and prepends any additional `bind` arguments to those
	 * provided to the bound function.
	 *
	 * @static
	 * @memberOf _
	 * @category Functions
	 * @param {Function} func The function to bind.
	 * @param {*} [thisArg] The `this` binding of `func`.
	 * @param {...*} [arg] Arguments to be partially applied.
	 * @returns {Function} Returns the new bound function.
	 * @example
	 *
	 * var func = function(greeting) {
   *   return greeting + ' ' + this.name;
   * };
	 *
	 * func = _.bind(func, { 'name': 'fred' }, 'hi');
	 * func();
	 * // => 'hi fred'
	 */
	function bind(func, thisArg) {
		return arguments.length > 2
			? createWrapper(func, 17, slice(arguments, 2), null, thisArg)
			: createWrapper(func, 1, null, null, thisArg);
	}

	/**
	 * Binds methods of an object to the object itself, overwriting the existing
	 * method. Method names may be specified as individual arguments or as arrays
	 * of method names. If no method names are provided all the function properties
	 * of `object` will be bound.
	 *
	 * @static
	 * @memberOf _
	 * @category Functions
	 * @param {Object} object The object to bind and assign the bound methods to.
	 * @param {...string} [methodName] The object method names to
	 *  bind, specified as individual method names or arrays of method names.
	 * @returns {Object} Returns `object`.
	 * @example
	 *
	 * var view = {
   *  'label': 'docs',
   *  'onClick': function() { console.log('clicked ' + this.label); }
   * };
	 *
	 * _.bindAll(view);
	 * jQuery('#docs').on('click', view.onClick);
	 * // => logs 'clicked docs', when the button is clicked
	 */
	function bindAll(object) {
		var funcs = arguments.length > 1 ? baseFlatten(arguments, true, false, 1) : functions(object),
			index = -1,
			length = funcs.length;

		while (++index < length) {
			var key = funcs[index];
			object[key] = createWrapper(object[key], 1, null, null, object);
		}
		return object;
	}

	/**
	 * Creates a function that is the composition of the provided functions,
	 * where each function consumes the return value of the function that follows.
	 * For example, composing the functions `f()`, `g()`, and `h()` produces `f(g(h()))`.
	 * Each function is executed with the `this` binding of the composed function.
	 *
	 * @static
	 * @memberOf _
	 * @category Functions
	 * @param {...Function} [func] Functions to compose.
	 * @returns {Function} Returns the new composed function.
	 * @example
	 *
	 * var realNameMap = {
   *   'pebbles': 'penelope'
   * };
	 *
	 * var format = function(name) {
   *   name = realNameMap[name.toLowerCase()] || name;
   *   return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
   * };
	 *
	 * var greet = function(formatted) {
   *   return 'Hiya ' + formatted + '!';
   * };
	 *
	 * var welcome = _.compose(greet, format);
	 * welcome('pebbles');
	 * // => 'Hiya Penelope!'
	 */
	function compose() {
		var funcs = arguments,
			length = funcs.length;

		while (length--) {
			if (!isFunction(funcs[length])) {
				throw new TypeError;
			}
		}
		return function() {
			var args = arguments,
				length = funcs.length;

			while (length--) {
				args = [funcs[length].apply(this, args)];
			}
			return args[0];
		};
	}

	/**
	 * Produces a callback bound to an optional `thisArg`. If `func` is a property
	 * name the created callback will return the property value for a given element.
	 * If `func` is an object the created callback will return `true` for elements
	 * that contain the equivalent object properties, otherwise it will return `false`.
	 *
	 * @static
	 * @memberOf _
	 * @category Functions
	 * @param {*} [func=identity] The value to convert to a callback.
	 * @param {*} [thisArg] The `this` binding of the created callback.
	 * @param {number} [argCount] The number of arguments the callback accepts.
	 * @returns {Function} Returns a callback function.
	 * @example
	 *
	 * var characters = [
	 *   { 'name': 'barney', 'age': 36 },
	 *   { 'name': 'fred',   'age': 40 }
	 * ];
	 *
	 * // wrap to create custom callback shorthands
	 * _.createCallback = _.wrap(_.createCallback, function(func, callback, thisArg) {
   *   var match = /^(.+?)__([gl]t)(.+)$/.exec(callback);
   *   return !match ? func(callback, thisArg) : function(object) {
   *     return match[2] == 'gt' ? object[match[1]] > match[3] : object[match[1]] < match[3];
   *   };
   * });
	 *
	 * _.filter(characters, 'age__gt38');
	 * // => [{ 'name': 'fred', 'age': 40 }]
	 */
	function createCallback(func, thisArg, argCount) {
		var type = typeof func;
		if (func == null || type == 'function') {
			return baseCreateCallback(func, thisArg, argCount);
		}
		// handle "_.pluck" style callback shorthands
		if (type != 'object') {
			return function(object) {
				return object[func];
			};
		}
		var props = keys(func);
		return function(object) {
			var length = props.length,
				result = false;

			while (length--) {
				if (!(result = object[props[length]] === func[props[length]])) {
					break;
				}
			}
			return result;
		};
	}

	/**
	 * Creates a function that will delay the execution of `func` until after
	 * `wait` milliseconds have elapsed since the last time it was invoked.
	 * Provide an options object to indicate that `func` should be invoked on
	 * the leading and/or trailing edge of the `wait` timeout. Subsequent calls
	 * to the debounced function will return the result of the last `func` call.
	 *
	 * Note: If `leading` and `trailing` options are `true` `func` will be called
	 * on the trailing edge of the timeout only if the the debounced function is
	 * invoked more than once during the `wait` timeout.
	 *
	 * @static
	 * @memberOf _
	 * @category Functions
	 * @param {Function} func The function to debounce.
	 * @param {number} wait The number of milliseconds to delay.
	 * @param {Object} [options] The options object.
	 * @param {boolean} [options.leading=false] Specify execution on the leading edge of the timeout.
	 * @param {number} [options.maxWait] The maximum time `func` is allowed to be delayed before it's called.
	 * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
	 * @returns {Function} Returns the new debounced function.
	 * @example
	 *
	 * // avoid costly calculations while the window size is in flux
	 * var lazyLayout = _.debounce(calculateLayout, 150);
	 * jQuery(window).on('resize', lazyLayout);
	 *
	 * // execute `sendMail` when the click event is fired, debouncing subsequent calls
	 * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
   *   'leading': true,
   *   'trailing': false
   * });
	 *
	 * // ensure `batchLog` is executed once after 1 second of debounced calls
	 * var source = new EventSource('/stream');
	 * source.addEventListener('message', _.debounce(batchLog, 250, {
   *   'maxWait': 1000
   * }, false);
	 */
	function debounce(func, wait, options) {
		var args,
			maxTimeoutId,
			result,
			stamp,
			thisArg,
			timeoutId,
			trailingCall,
			lastCalled = 0,
			maxWait = false,
			trailing = true;

		if (!isFunction(func)) {
			throw new TypeError;
		}
		wait = nativeMax(0, wait) || 0;
		if (options === true) {
			var leading = true;
			trailing = false;
		} else if (isObject(options)) {
			leading = options.leading;
			maxWait = 'maxWait' in options && (nativeMax(wait, options.maxWait) || 0);
			trailing = 'trailing' in options ? options.trailing : trailing;
		}
		var delayed = function() {
			var remaining = wait - (now() - stamp);
			if (remaining <= 0) {
				if (maxTimeoutId) {
					clearTimeout(maxTimeoutId);
				}
				var isCalled = trailingCall;
				maxTimeoutId = timeoutId = trailingCall = undefined;
				if (isCalled) {
					lastCalled = now();
					result = func.apply(thisArg, args);
					if (!timeoutId && !maxTimeoutId) {
						args = thisArg = null;
					}
				}
			} else {
				timeoutId = setTimeout(delayed, remaining);
			}
		};

		var maxDelayed = function() {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			maxTimeoutId = timeoutId = trailingCall = undefined;
			if (trailing || (maxWait !== wait)) {
				lastCalled = now();
				result = func.apply(thisArg, args);
				if (!timeoutId && !maxTimeoutId) {
					args = thisArg = null;
				}
			}
		};

		return function() {
			args = arguments;
			stamp = now();
			thisArg = this;
			trailingCall = trailing && (timeoutId || !leading);

			if (maxWait === false) {
				var leadingCall = leading && !timeoutId;
			} else {
				if (!maxTimeoutId && !leading) {
					lastCalled = stamp;
				}
				var remaining = maxWait - (stamp - lastCalled),
					isCalled = remaining <= 0;

				if (isCalled) {
					if (maxTimeoutId) {
						maxTimeoutId = clearTimeout(maxTimeoutId);
					}
					lastCalled = stamp;
					result = func.apply(thisArg, args);
				}
				else if (!maxTimeoutId) {
					maxTimeoutId = setTimeout(maxDelayed, remaining);
				}
			}
			if (isCalled && timeoutId) {
				timeoutId = clearTimeout(timeoutId);
			}
			else if (!timeoutId && wait !== maxWait) {
				timeoutId = setTimeout(delayed, wait);
			}
			if (leadingCall) {
				isCalled = true;
				result = func.apply(thisArg, args);
			}
			if (isCalled && !timeoutId && !maxTimeoutId) {
				args = thisArg = null;
			}
			return result;
		};
	}

	/**
	 * Defers executing the `func` function until the current call stack has cleared.
	 * Additional arguments will be provided to `func` when it is invoked.
	 *
	 * @static
	 * @memberOf _
	 * @category Functions
	 * @param {Function} func The function to defer.
	 * @param {...*} [arg] Arguments to invoke the function with.
	 * @returns {number} Returns the timer id.
	 * @example
	 *
	 * _.defer(function() { console.log('deferred'); });
	 * // returns from the function before 'deferred' is logged
	 */
	function defer(func) {
		if (!isFunction(func)) {
			throw new TypeError;
		}
		var args = slice(arguments, 1);
		return setTimeout(function() { func.apply(undefined, args); }, 1);
	}

	/**
	 * Executes the `func` function after `wait` milliseconds. Additional arguments
	 * will be provided to `func` when it is invoked.
	 *
	 * @static
	 * @memberOf _
	 * @category Functions
	 * @param {Function} func The function to delay.
	 * @param {number} wait The number of milliseconds to delay execution.
	 * @param {...*} [arg] Arguments to invoke the function with.
	 * @returns {number} Returns the timer id.
	 * @example
	 *
	 * var log = _.bind(console.log, console);
	 * _.delay(log, 1000, 'logged later');
	 * // => 'logged later' (Appears after one second.)
	 */
	function delay(func, wait) {
		if (!isFunction(func)) {
			throw new TypeError;
		}
		var args = slice(arguments, 2);
		return setTimeout(function() { func.apply(undefined, args); }, wait);
	}

	/**
	 * Creates a function that memoizes the result of `func`. If `resolver` is
	 * provided it will be used to determine the cache key for storing the result
	 * based on the arguments provided to the memoized function. By default, the
	 * first argument provided to the memoized function is used as the cache key.
	 * The `func` is executed with the `this` binding of the memoized function.
	 * The result cache is exposed as the `cache` property on the memoized function.
	 *
	 * @static
	 * @memberOf _
	 * @category Functions
	 * @param {Function} func The function to have its output memoized.
	 * @param {Function} [resolver] A function used to resolve the cache key.
	 * @returns {Function} Returns the new memoizing function.
	 * @example
	 *
	 * var fibonacci = _.memoize(function(n) {
   *   return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
   * });
	 *
	 * fibonacci(9)
	 * // => 34
	 *
	 * var data = {
   *   'fred': { 'name': 'fred', 'age': 40 },
   *   'pebbles': { 'name': 'pebbles', 'age': 1 }
   * };
	 *
	 * // modifying the result cache
	 * var get = _.memoize(function(name) { return data[name]; }, _.identity);
	 * get('pebbles');
	 * // => { 'name': 'pebbles', 'age': 1 }
	 *
	 * get.cache.pebbles.name = 'penelope';
	 * get('pebbles');
	 * // => { 'name': 'penelope', 'age': 1 }
	 */
	function memoize(func, resolver) {
		var cache = {};
		return function() {
			var key = resolver ? resolver.apply(this, arguments) : keyPrefix + arguments[0];
			return hasOwnProperty.call(cache, key)
				? cache[key]
				: (cache[key] = func.apply(this, arguments));
		};
	}

	/**
	 * Creates a function that is restricted to execute `func` once. Repeat calls to
	 * the function will return the value of the first call. The `func` is executed
	 * with the `this` binding of the created function.
	 *
	 * @static
	 * @memberOf _
	 * @category Functions
	 * @param {Function} func The function to restrict.
	 * @returns {Function} Returns the new restricted function.
	 * @example
	 *
	 * var initialize = _.once(createApplication);
	 * initialize();
	 * initialize();
	 * // `initialize` executes `createApplication` once
	 */
	function once(func) {
		var ran,
			result;

		if (!isFunction(func)) {
			throw new TypeError;
		}
		return function() {
			if (ran) {
				return result;
			}
			ran = true;
			result = func.apply(this, arguments);

			// clear the `func` variable so the function may be garbage collected
			func = null;
			return result;
		};
	}

	/**
	 * Creates a function that, when called, invokes `func` with any additional
	 * `partial` arguments prepended to those provided to the new function. This
	 * method is similar to `_.bind` except it does **not** alter the `this` binding.
	 *
	 * @static
	 * @memberOf _
	 * @category Functions
	 * @param {Function} func The function to partially apply arguments to.
	 * @param {...*} [arg] Arguments to be partially applied.
	 * @returns {Function} Returns the new partially applied function.
	 * @example
	 *
	 * var greet = function(greeting, name) { return greeting + ' ' + name; };
	 * var hi = _.partial(greet, 'hi');
	 * hi('fred');
	 * // => 'hi fred'
	 */
	function partial(func) {
		return createWrapper(func, 16, slice(arguments, 1));
	}

	/**
	 * Creates a function that, when executed, will only call the `func` function
	 * at most once per every `wait` milliseconds. Provide an options object to
	 * indicate that `func` should be invoked on the leading and/or trailing edge
	 * of the `wait` timeout. Subsequent calls to the throttled function will
	 * return the result of the last `func` call.
	 *
	 * Note: If `leading` and `trailing` options are `true` `func` will be called
	 * on the trailing edge of the timeout only if the the throttled function is
	 * invoked more than once during the `wait` timeout.
	 *
	 * @static
	 * @memberOf _
	 * @category Functions
	 * @param {Function} func The function to throttle.
	 * @param {number} wait The number of milliseconds to throttle executions to.
	 * @param {Object} [options] The options object.
	 * @param {boolean} [options.leading=true] Specify execution on the leading edge of the timeout.
	 * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
	 * @returns {Function} Returns the new throttled function.
	 * @example
	 *
	 * // avoid excessively updating the position while scrolling
	 * var throttled = _.throttle(updatePosition, 100);
	 * jQuery(window).on('scroll', throttled);
	 *
	 * // execute `renewToken` when the click event is fired, but not more than once every 5 minutes
	 * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
   *   'trailing': false
   * }));
	 */
	function throttle(func, wait, options) {
		var leading = true,
			trailing = true;

		if (!isFunction(func)) {
			throw new TypeError;
		}
		if (options === false) {
			leading = false;
		} else if (isObject(options)) {
			leading = 'leading' in options ? options.leading : leading;
			trailing = 'trailing' in options ? options.trailing : trailing;
		}
		options = {};
		options.leading = leading;
		options.maxWait = wait;
		options.trailing = trailing;

		return debounce(func, wait, options);
	}

	/**
	 * Creates a function that provides `value` to the wrapper function as its
	 * first argument. Additional arguments provided to the function are appended
	 * to those provided to the wrapper function. The wrapper is executed with
	 * the `this` binding of the created function.
	 *
	 * @static
	 * @memberOf _
	 * @category Functions
	 * @param {*} value The value to wrap.
	 * @param {Function} wrapper The wrapper function.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var p = _.wrap(_.escape, function(func, text) {
   *   return '<p>' + func(text) + '</p>';
   * });
	 *
	 * p('Fred, Wilma, & Pebbles');
	 * // => '<p>Fred, Wilma, &amp; Pebbles</p>'
	 */
	function wrap(value, wrapper) {
		return createWrapper(wrapper, 16, [value]);
	}

	/*--------------------------------------------------------------------------*/

	/**
	 * Converts the characters `&`, `<`, `>`, `"`, and `'` in `string` to their
	 * corresponding HTML entities.
	 *
	 * @static
	 * @memberOf _
	 * @category Utilities
	 * @param {string} string The string to escape.
	 * @returns {string} Returns the escaped string.
	 * @example
	 *
	 * _.escape('Fred, Wilma, & Pebbles');
	 * // => 'Fred, Wilma, &amp; Pebbles'
	 */
	function escape(string) {
		return string == null ? '' : String(string).replace(reUnescapedHtml, escapeHtmlChar);
	}

	/**
	 * This method returns the first argument provided to it.
	 *
	 * @static
	 * @memberOf _
	 * @category Utilities
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'name': 'fred' };
	 * _.identity(object) === object;
	 * // => true
	 */
	function identity(value) {
		return value;
	}

	/**
	 * Adds function properties of a source object to the `lodash` function and
	 * chainable wrapper.
	 *
	 * @static
	 * @memberOf _
	 * @category Utilities
	 * @param {Object} object The object of function properties to add to `lodash`.
	 * @param {Object} object The object of function properties to add to `lodash`.
	 * @example
	 *
	 * _.mixin({
   *   'capitalize': function(string) {
   *     return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
   *   }
   * });
	 *
	 * _.capitalize('fred');
	 * // => 'Fred'
	 *
	 * _('fred').capitalize();
	 * // => 'Fred'
	 */
	function mixin(object) {
		forEach(functions(object), function(methodName) {
			var func = lodash[methodName] = object[methodName];

			lodash.prototype[methodName] = function() {
				var args = [this.__wrapped__];
				push.apply(args, arguments);

				var result = func.apply(lodash, args);
				return this.__chain__
					? new lodashWrapper(result, true)
					: result;
			};
		});
	}

	/**
	 * Reverts the '_' variable to its previous value and returns a reference to
	 * the `lodash` function.
	 *
	 * @static
	 * @memberOf _
	 * @category Utilities
	 * @returns {Function} Returns the `lodash` function.
	 * @example
	 *
	 * var lodash = _.noConflict();
	 */
	function noConflict() {
		root._ = oldDash;
		return this;
	}

	/**
	 * A no-operation function.
	 *
	 * @static
	 * @memberOf _
	 * @category Utilities
	 * @example
	 *
	 * var object = { 'name': 'fred' };
	 * _.noop(object) === undefined;
	 * // => true
	 */
	function noop() {
		// no operation performed
	}

	/**
	 * Produces a random number between `min` and `max` (inclusive). If only one
	 * argument is provided a number between `0` and the given number will be
	 * returned. If `floating` is truey or either `min` or `max` are floats a
	 * floating-point number will be returned instead of an integer.
	 *
	 * @static
	 * @memberOf _
	 * @category Utilities
	 * @param {number} [min=0] The minimum possible value.
	 * @param {number} [max=1] The maximum possible value.
	 * @param {boolean} [floating=false] Specify returning a floating-point number.
	 * @returns {number} Returns a random number.
	 * @example
	 *
	 * _.random(0, 5);
	 * // => an integer between 0 and 5
	 *
	 * _.random(5);
	 * // => also an integer between 0 and 5
	 *
	 * _.random(5, true);
	 * // => a floating-point number between 0 and 5
	 *
	 * _.random(1.2, 5.2);
	 * // => a floating-point number between 1.2 and 5.2
	 */
	function random(min, max) {
		if (min == null && max == null) {
			max = 1;
		}
		min = +min || 0;
		if (max == null) {
			max = min;
			min = 0;
		} else {
			max = +max || 0;
		}
		return min + floor(nativeRandom() * (max - min + 1));
	}

	/**
	 * Resolves the value of `property` on `object`. If `property` is a function
	 * it will be invoked with the `this` binding of `object` and its result returned,
	 * else the property value is returned. If `object` is falsey then `undefined`
	 * is returned.
	 *
	 * @static
	 * @memberOf _
	 * @category Utilities
	 * @param {Object} object The object to inspect.
	 * @param {string} property The property to get the value of.
	 * @returns {*} Returns the resolved value.
	 * @example
	 *
	 * var object = {
   *   'cheese': 'crumpets',
   *   'stuff': function() {
   *     return 'nonsense';
   *   }
   * };
	 *
	 * _.result(object, 'cheese');
	 * // => 'crumpets'
	 *
	 * _.result(object, 'stuff');
	 * // => 'nonsense'
	 */
	function result(object, property) {
		if (object) {
			var value = object[property];
			return isFunction(value) ? object[property]() : value;
		}
	}

	/**
	 * A micro-templating method that handles arbitrary delimiters, preserves
	 * whitespace, and correctly escapes quotes within interpolated code.
	 *
	 * Note: In the development build, `_.template` utilizes sourceURLs for easier
	 * debugging. See http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
	 *
	 * For more information on precompiling templates see:
	 * http://lodash.com/custom-builds
	 *
	 * For more information on Chrome extension sandboxes see:
	 * http://developer.chrome.com/stable/extensions/sandboxingEval.html
	 *
	 * @static
	 * @memberOf _
	 * @category Utilities
	 * @param {string} text The template text.
	 * @param {Object} data The data object used to populate the text.
	 * @param {Object} [options] The options object.
	 * @param {RegExp} [options.escape] The "escape" delimiter.
	 * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
	 * @param {Object} [options.imports] An object to import into the template as local variables.
	 * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
	 * @param {string} [sourceURL] The sourceURL of the template's compiled source.
	 * @param {string} [variable] The data object variable name.
	 * @returns {Function|string} Returns a compiled function when no `data` object
	 *  is given, else it returns the interpolated text.
	 * @example
	 *
	 * // using the "interpolate" delimiter to create a compiled template
	 * var compiled = _.template('hello <%= name %>');
	 * compiled({ 'name': 'fred' });
	 * // => 'hello fred'
	 *
	 * // using the "escape" delimiter to escape HTML in data property values
	 * _.template('<b><%- value %></b>', { 'value': '<script>' });
	 * // => '<b>&lt;script&gt;</b>'
	 *
	 * // using the "evaluate" delimiter to generate HTML
	 * var list = '<% _.forEach(people, function(name) { %><li><%- name %></li><% }); %>';
	 * _.template(list, { 'people': ['fred', 'barney'] });
	 * // => '<li>fred</li><li>barney</li>'
	 *
	 * // using the ES6 delimiter as an alternative to the default "interpolate" delimiter
	 * _.template('hello ${ name }', { 'name': 'pebbles' });
	 * // => 'hello pebbles'
	 *
	 * // using the internal `print` function in "evaluate" delimiters
	 * _.template('<% print("hello " + name); %>!', { 'name': 'barney' });
	 * // => 'hello barney!'
	 *
	 * // using a custom template delimiters
	 * _.templateSettings = {
   *   'interpolate': /{{([\s\S]+?)}}/g
   * };
	 *
	 * _.template('hello {{ name }}!', { 'name': 'mustache' });
	 * // => 'hello mustache!'
	 *
	 * // using the `imports` option to import jQuery
	 * var list = '<% $.each(people, function(name) { %><li><%- name %></li><% }); %>';
	 * _.template(list, { 'people': ['fred', 'barney'] }, { 'imports': { '$': jQuery } });
	 * // => '<li>fred</li><li>barney</li>'
	 *
	 * // using the `sourceURL` option to specify a custom sourceURL for the template
	 * var compiled = _.template('hello <%= name %>', null, { 'sourceURL': '/basic/greeting.jst' });
	 * compiled(data);
	 * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
	 *
	 * // using the `variable` option to ensure a with-statement isn't used in the compiled template
	 * var compiled = _.template('hi <%= data.name %>!', null, { 'variable': 'data' });
	 * compiled.source;
	 * // => function(data) {
   *   var __t, __p = '', __e = _.escape;
   *   __p += 'hi ' + ((__t = ( data.name )) == null ? '' : __t) + '!';
   *   return __p;
   * }
	 *
	 * // using the `source` property to inline compiled templates for meaningful
	 * // line numbers in error messages and a stack trace
	 * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
	 *   var JST = {\
   *     "main": ' + _.template(mainText).source + '\
   *   };\
	 * ');
	 */
	function template(text, data, options) {
		var _ = lodash,
			settings = _.templateSettings;

		text = String(text || '');
		options = defaults({}, options, settings);

		var index = 0,
			source = "__p += '",
			variable = options.variable;

		var reDelimiters = RegExp(
			(options.escape || reNoMatch).source + '|' +
				(options.interpolate || reNoMatch).source + '|' +
				(options.evaluate || reNoMatch).source + '|$'
			, 'g');

		text.replace(reDelimiters, function(match, escapeValue, interpolateValue, evaluateValue, offset) {
			source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);
			if (escapeValue) {
				source += "' +\n_.escape(" + escapeValue + ") +\n'";
			}
			if (evaluateValue) {
				source += "';\n" + evaluateValue + ";\n__p += '";
			}
			if (interpolateValue) {
				source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
			}
			index = offset + match.length;
			return match;
		});

		source += "';\n";
		if (!variable) {
			variable = 'obj';
			source = 'with (' + variable + ' || {}) {\n' + source + '\n}\n';
		}
		source = 'function(' + variable + ') {\n' +
			"var __t, __p = '', __j = Array.prototype.join;\n" +
			"function print() { __p += __j.call(arguments, '') }\n" +
			source +
			'return __p\n}';

		try {
			var result = Function('_', 'return ' + source)(_);
		} catch(e) {
			e.source = source;
			throw e;
		}
		if (data) {
			return result(data);
		}
		result.source = source;
		return result;
	}

	/**
	 * Executes the callback `n` times, returning an array of the results
	 * of each callback execution. The callback is bound to `thisArg` and invoked
	 * with one argument; (index).
	 *
	 * @static
	 * @memberOf _
	 * @category Utilities
	 * @param {number} n The number of times to execute the callback.
	 * @param {Function} callback The function called per iteration.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {Array} Returns an array of the results of each `callback` execution.
	 * @example
	 *
	 * var diceRolls = _.times(3, _.partial(_.random, 1, 6));
	 * // => [3, 6, 4]
	 *
	 * _.times(3, function(n) { mage.castSpell(n); });
	 * // => calls `mage.castSpell(n)` three times, passing `n` of `0`, `1`, and `2` respectively
	 *
	 * _.times(3, function(n) { this.cast(n); }, mage);
	 * // => also calls `mage.castSpell(n)` three times
	 */
	function times(n, callback, thisArg) {
		n = (n = +n) > -1 ? n : 0;
		var index = -1,
			result = Array(n);

		callback = baseCreateCallback(callback, thisArg, 1);
		while (++index < n) {
			result[index] = callback(index);
		}
		return result;
	}

	/**
	 * The inverse of `_.escape` this method converts the HTML entities
	 * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to their
	 * corresponding characters.
	 *
	 * @static
	 * @memberOf _
	 * @category Utilities
	 * @param {string} string The string to unescape.
	 * @returns {string} Returns the unescaped string.
	 * @example
	 *
	 * _.unescape('Fred, Barney &amp; Pebbles');
	 * // => 'Fred, Barney & Pebbles'
	 */
	function unescape(string) {
		return string == null ? '' : String(string).replace(reEscapedHtml, unescapeHtmlChar);
	}

	/**
	 * Generates a unique ID. If `prefix` is provided the ID will be appended to it.
	 *
	 * @static
	 * @memberOf _
	 * @category Utilities
	 * @param {string} [prefix] The value to prefix the ID with.
	 * @returns {string} Returns the unique ID.
	 * @example
	 *
	 * _.uniqueId('contact_');
	 * // => 'contact_104'
	 *
	 * _.uniqueId();
	 * // => '105'
	 */
	function uniqueId(prefix) {
		var id = ++idCounter + '';
		return prefix ? prefix + id : id;
	}

	/*--------------------------------------------------------------------------*/

	/**
	 * Creates a `lodash` object that wraps the given value with explicit
	 * method chaining enabled.
	 *
	 * @static
	 * @memberOf _
	 * @category Chaining
	 * @param {*} value The value to wrap.
	 * @returns {Object} Returns the wrapper object.
	 * @example
	 *
	 * var characters = [
	 *   { 'name': 'barney',  'age': 36 },
	 *   { 'name': 'fred',    'age': 40 },
	 *   { 'name': 'pebbles', 'age': 1 }
	 * ];
	 *
	 * var youngest = _.chain(characters)
	 *     .sortBy('age')
	 *     .map(function(chr) { return chr.name + ' is ' + chr.age; })
	 *     .first()
	 *     .value();
	 * // => 'pebbles is 1'
	 */
	function chain(value) {
		value = new lodashWrapper(value);
		value.__chain__ = true;
		return value;
	}

	/**
	 * Invokes `interceptor` with the `value` as the first argument and then
	 * returns `value`. The purpose of this method is to "tap into" a method
	 * chain in order to perform operations on intermediate results within
	 * the chain.
	 *
	 * @static
	 * @memberOf _
	 * @category Chaining
	 * @param {*} value The value to provide to `interceptor`.
	 * @param {Function} interceptor The function to invoke.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * _([1, 2, 3, 4])
	 *  .tap(function(array) { array.pop(); })
	 *  .reverse()
	 *  .value();
	 * // => [3, 2, 1]
	 */
	function tap(value, interceptor) {
		interceptor(value);
		return value;
	}

	/**
	 * Enables explicit method chaining on the wrapper object.
	 *
	 * @name chain
	 * @memberOf _
	 * @category Chaining
	 * @returns {*} Returns the wrapper object.
	 * @example
	 *
	 * var characters = [
	 *   { 'name': 'barney', 'age': 36 },
	 *   { 'name': 'fred',   'age': 40 }
	 * ];
	 *
	 * // without explicit chaining
	 * _(characters).first();
	 * // => { 'name': 'barney', 'age': 36 }
	 *
	 * // with explicit chaining
	 * _(characters).chain()
	 *   .first()
	 *   .pick('age')
	 *   .value()
	 * // => { 'age': 36 }
	 */
	function wrapperChain() {
		this.__chain__ = true;
		return this;
	}

	/**
	 * Extracts the wrapped value.
	 *
	 * @name valueOf
	 * @memberOf _
	 * @alias value
	 * @category Chaining
	 * @returns {*} Returns the wrapped value.
	 * @example
	 *
	 * _([1, 2, 3]).valueOf();
	 * // => [1, 2, 3]
	 */
	function wrapperValueOf() {
		return this.__wrapped__;
	}

	/*--------------------------------------------------------------------------*/

	// add functions that return wrapped values when chaining
	lodash.after = after;
	lodash.bind = bind;
	lodash.bindAll = bindAll;
	lodash.chain = chain;
	lodash.compact = compact;
	lodash.compose = compose;
	lodash.countBy = countBy;
	lodash.debounce = debounce;
	lodash.defaults = defaults;
	lodash.defer = defer;
	lodash.delay = delay;
	lodash.difference = difference;
	lodash.filter = filter;
	lodash.flatten = flatten;
	lodash.forEach = forEach;
	lodash.functions = functions;
	lodash.groupBy = groupBy;
	lodash.indexBy = indexBy;
	lodash.initial = initial;
	lodash.intersection = intersection;
	lodash.invert = invert;
	lodash.invoke = invoke;
	lodash.keys = keys;
	lodash.map = map;
	lodash.max = max;
	lodash.memoize = memoize;
	lodash.min = min;
	lodash.omit = omit;
	lodash.once = once;
	lodash.pairs = pairs;
	lodash.partial = partial;
	lodash.pick = pick;
	lodash.pluck = pluck;
	lodash.range = range;
	lodash.reject = reject;
	lodash.rest = rest;
	lodash.shuffle = shuffle;
	lodash.sortBy = sortBy;
	lodash.tap = tap;
	lodash.throttle = throttle;
	lodash.times = times;
	lodash.toArray = toArray;
	lodash.union = union;
	lodash.uniq = uniq;
	lodash.values = values;
	lodash.where = where;
	lodash.without = without;
	lodash.wrap = wrap;
	lodash.zip = zip;

	// add aliases
	lodash.collect = map;
	lodash.drop = rest;
	lodash.each = forEach;
	lodash.extend = assign;
	lodash.methods = functions;
	lodash.object = zipObject;
	lodash.select = filter;
	lodash.tail = rest;
	lodash.unique = uniq;

	/*--------------------------------------------------------------------------*/

	// add functions that return unwrapped values when chaining
	lodash.clone = clone;
	lodash.contains = contains;
	lodash.escape = escape;
	lodash.every = every;
	lodash.find = find;
	lodash.has = has;
	lodash.identity = identity;
	lodash.indexOf = indexOf;
	lodash.isArguments = isArguments;
	lodash.isArray = isArray;
	lodash.isBoolean = isBoolean;
	lodash.isDate = isDate;
	lodash.isElement = isElement;
	lodash.isEmpty = isEmpty;
	lodash.isEqual = isEqual;
	lodash.isFinite = isFinite;
	lodash.isFunction = isFunction;
	lodash.isNaN = isNaN;
	lodash.isNull = isNull;
	lodash.isNumber = isNumber;
	lodash.isObject = isObject;
	lodash.isRegExp = isRegExp;
	lodash.isString = isString;
	lodash.isUndefined = isUndefined;
	lodash.lastIndexOf = lastIndexOf;
	lodash.mixin = mixin;
	lodash.noConflict = noConflict;
	lodash.random = random;
	lodash.reduce = reduce;
	lodash.reduceRight = reduceRight;
	lodash.result = result;
	lodash.size = size;
	lodash.some = some;
	lodash.sortedIndex = sortedIndex;
	lodash.template = template;
	lodash.unescape = unescape;
	lodash.uniqueId = uniqueId;

	// add aliases
	lodash.all = every;
	lodash.any = some;
	lodash.detect = find;
	lodash.findWhere = findWhere;
	lodash.foldl = reduce;
	lodash.foldr = reduceRight;
	lodash.include = contains;
	lodash.inject = reduce;

	/*--------------------------------------------------------------------------*/

	// add functions capable of returning wrapped and unwrapped values when chaining
	lodash.first = first;
	lodash.last = last;
	lodash.sample = sample;

	// add aliases
	lodash.take = first;
	lodash.head = first;

	/*--------------------------------------------------------------------------*/

	// add functions to `lodash.prototype`
	mixin(lodash);

	/**
	 * The semantic version number.
	 *
	 * @static
	 * @memberOf _
	 * @type string
	 */
	lodash.VERSION = '2.3.0';

	// add "Chaining" functions to the wrapper
	lodash.prototype.chain = wrapperChain;
	lodash.prototype.value = wrapperValueOf;

	// add `Array` mutator functions to the wrapper
	forEach(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {
		var func = arrayRef[methodName];
		lodash.prototype[methodName] = function() {
			var value = this.__wrapped__;
			func.apply(value, arguments);

			// avoid array-like object bugs with `Array#shift` and `Array#splice`
			// in Firefox < 10 and IE < 9
			if (!support.spliceObjects && value.length === 0) {
				delete value[0];
			}
			return this;
		};
	});

	// add `Array` accessor functions to the wrapper
	forEach(['concat', 'join', 'slice'], function(methodName) {
		var func = arrayRef[methodName];
		lodash.prototype[methodName] = function() {
			var value = this.__wrapped__,
				result = func.apply(value, arguments);

			if (this.__chain__) {
				result = new lodashWrapper(result);
				result.__chain__ = true;
			}
			return result;
		};
	});

	/*--------------------------------------------------------------------------*/

	// some AMD build optimizers like r.js check for condition patterns like the following:
	if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
		// Expose Lo-Dash to the global object even when an AMD loader is present in
		// case Lo-Dash was injected by a third-party script and not intended to be
		// loaded as a module. The global assignment can be reverted in the Lo-Dash
		// module by its `noConflict()` method.
		root._ = lodash;

		// define as an anonymous module so, through path mapping, it can be
		// referenced as the "underscore" module
		define('underscore',[],function() {
			return lodash;
		});
	}
	// check for `exports` after `define` in case a build optimizer adds an `exports` object
	else if (freeExports && freeModule) {
		// in Node.js or RingoJS
		if (moduleExports) {
			(freeModule.exports = lodash)._ = lodash;
		}
		// in Narwhal or Rhino -require
		else {
			freeExports._ = lodash;
		}
	}
	else {
		// in a browser or Rhino
		root._ = lodash;
	}
}.call(this));
//     Backbone.js 1.1.0

//     (c) 2010-2011 Jeremy Ashkenas, DocumentCloud Inc.
//     (c) 2011-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(){

  // Initial Setup
  // -------------

  // Save a reference to the global object (`window` in the browser, `exports`
  // on the server).
  var root = this;

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create local references to array methods we'll want to use later.
  var array = [];
  var push = array.push;
  var slice = array.slice;
  var splice = array.splice;

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both the browser and the server.
  var Backbone;
  if (typeof exports !== 'undefined') {
    Backbone = exports;
  } else {
    Backbone = root.Backbone = {};
  }

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '1.1.0';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore');

  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
  // the `$` variable.
  Backbone.$ = root.jQuery || root.Zepto || root.ender || root.$;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      this._events || (this._events = {});
      var events = this._events[name] || (this._events[name] = []);
      events.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = {};
        return this;
      }
      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (events = this._events[name]) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
      var listeningTo = this._listeningTo;
      if (!listeningTo) return this;
      var remove = !name && !callback;
      if (!callback && typeof name === 'object') callback = this;
      if (obj) (listeningTo = {})[obj._listenId] = obj;
      for (var id in listeningTo) {
        obj = listeningTo[id];
        obj.off(name, callback, this);
        if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
      }
      return this;
    }

  };

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
    }
  };

  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  _.each(listenMethods, function(implementation, method) {
    Events[method] = function(obj, name, callback) {
      var listeningTo = this._listeningTo || (this._listeningTo = {});
      var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
      listeningTo[id] = obj;
      if (!callback && typeof name === 'object') callback = this;
      obj[implementation](name, callback, this);
      return this;
    };
  });

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Allow the `Backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(Backbone, Events);

  // Backbone.Model
  // --------------

  // Backbone **Models** are the basic data object in the framework --
  // frequently representing a row in a table in a database on your server.
  // A discrete chunk of data and a bunch of useful, related methods for
  // performing computations and transformations on that data.

  // Create a new model with the specified attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var attrs = attributes || {};
    options || (options = {});
    this.cid = _.uniqueId('c');
    this.attributes = {};
    if (options.collection) this.collection = options.collection;
    if (options.parse) attrs = this.parse(attrs, options) || {};
    attrs = _.defaults({}, attrs, _.result(this, 'defaults'));
    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // The value returned during the last failed validation.
    validationError: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Proxy `Backbone.sync` by default -- but override this if you need
    // custom syncing semantics for *this* particular model.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      return _.escape(this.get(attr));
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Set a hash of model attributes on the object, firing `"change"`. This is
    // the core primitive operation of a model, updating the data and notifying
    // anyone who needs to know about the change in state. The heart of the beast.
    set: function(key, val, options) {
      var attr, attrs, unset, changes, silent, changing, prev, current;
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Extract attributes and options.
      unset           = options.unset;
      silent          = options.silent;
      changes         = [];
      changing        = this._changing;
      this._changing  = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }
      current = this.attributes, prev = this._previousAttributes;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      // For each `set` attribute, update or delete the current value.
      for (attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          this.changed[attr] = val;
        } else {
          delete this.changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // Trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = true;
        for (var i = 0, l = changes.length; i < l; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      // You might be wondering why there's a `while` loop here. Changes can
      // be recursively nested within `"change"` events.
      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"`. `unset` is a noop
    // if the attribute doesn't exist.
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // Clear all attributes on the model, firing `"change"`.
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) attrs[key] = void 0;
      return this.set(attrs, _.extend({}, options, {unset: true}));
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (attr == null) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var val, changed = false;
      var old = this._changing ? this._previousAttributes : this.attributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (attr == null || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overridden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        if (!model.set(model.parse(resp, options), options)) return false;
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, val, options) {
      var attrs, method, xhr, attributes = this.attributes;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options = _.extend({validate: true}, options);

      // If we're not waiting and attributes exist, save acts as
      // `set(attr).save(null, opts)` with validation. Otherwise, check if
      // the model will be valid when the attributes, if any, are set.
      if (attrs && !options.wait) {
        if (!this.set(attrs, options)) return false;
      } else {
        if (!this._validate(attrs, options)) return false;
      }

      // Set temporary attributes if `{wait: true}`.
      if (attrs && options.wait) {
        this.attributes = _.extend({}, attributes, attrs);
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        // Ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverAttrs = model.parse(resp, options);
        if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
        if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
          return false;
        }
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);

      method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
      if (method === 'patch') options.attrs = attrs;
      xhr = this.sync(method, this, options);

      // Restore attributes.
      if (attrs && options.wait) this.attributes = attributes;

      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var destroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(resp) {
        if (options.wait || model.isNew()) destroy();
        if (success) success(model, resp, options);
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      if (this.isNew()) {
        options.success();
        return false;
      }
      wrapError(this, options);

      var xhr = this.sync('delete', this, options);
      if (!options.wait) destroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || urlError();
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) === '/' ? '' : '/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return this.id == null;
    },

    // Check if the model is currently in a valid state.
    isValid: function(options) {
      return this._validate({}, _.extend(options || {}, { validate: true }));
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
      return false;
    }

  });

  // Underscore methods that we want to implement on the Model.
  var modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit'];

  // Mix in each Underscore method as a proxy to `Model#attributes`.
  _.each(modelMethods, function(method) {
    Model.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.attributes);
      return _[method].apply(_, args);
    };
  });

  // Backbone.Collection
  // -------------------

  // If models tend to represent a single row of data, a Backbone Collection is
  // more analagous to a table full of data ... or a small slice or page of that
  // table, or a collection of rows that belong together for a particular reason
  // -- all of the messages in this particular folder, all of the documents
  // belonging to this particular author, and so on. Collections maintain
  // indexes of their models, both in order, and for lookup by `id`.

  // Create a new **Collection**, perhaps to contain a specific type of `model`.
  // If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, _.extend({silent: true}, options));
  };

  // Default options for `Collection#set`.
  var setOptions = {add: true, remove: true, merge: true};
  var addOptions = {add: true, remove: false};

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model){ return model.toJSON(options); });
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Add a model, or list of models to the set.
    add: function(models, options) {
      return this.set(models, _.extend({merge: false}, options, addOptions));
    },

    // Remove a model, or a list of models from the set.
    remove: function(models, options) {
      var singular = !_.isArray(models);
      models = singular ? [models] : _.clone(models);
      options || (options = {});
      var i, l, index, model;
      for (i = 0, l = models.length; i < l; i++) {
        model = models[i] = this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byId[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model);
      }
      return singular ? models[0] : models;
    },

    // Update a collection by `set`-ing a new list of models, adding new ones,
    // removing models that are no longer present, and merging models that
    // already exist in the collection, as necessary. Similar to **Model#set**,
    // the core operation for updating the data contained by the collection.
    set: function(models, options) {
      options = _.defaults({}, options, setOptions);
      if (options.parse) models = this.parse(models, options);
      var singular = !_.isArray(models);
      models = singular ? (models ? [models] : []) : _.clone(models);
      var i, l, id, model, attrs, existing, sort;
      var at = options.at;
      var targetModel = this.model;
      var sortable = this.comparator && (at == null) && options.sort !== false;
      var sortAttr = _.isString(this.comparator) ? this.comparator : null;
      var toAdd = [], toRemove = [], modelMap = {};
      var add = options.add, merge = options.merge, remove = options.remove;
      var order = !sortable && add && remove ? [] : false;

      // Turn bare objects into model references, and prevent invalid models
      // from being added.
      for (i = 0, l = models.length; i < l; i++) {
        attrs = models[i];
        if (attrs instanceof Model) {
          id = model = attrs;
        } else {
          id = attrs[targetModel.prototype.idAttribute];
        }

        // If a duplicate is found, prevent it from being added and
        // optionally merge it into the existing model.
        if (existing = this.get(id)) {
          if (remove) modelMap[existing.cid] = true;
          if (merge) {
            attrs = attrs === model ? model.attributes : attrs;
            if (options.parse) attrs = existing.parse(attrs, options);
            existing.set(attrs, options);
            if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
          }
          models[i] = existing;

        // If this is a new, valid model, push it to the `toAdd` list.
        } else if (add) {
          model = models[i] = this._prepareModel(attrs, options);
          if (!model) continue;
          toAdd.push(model);

          // Listen to added models' events, and index models for lookup by
          // `id` and by `cid`.
          model.on('all', this._onModelEvent, this);
          this._byId[model.cid] = model;
          if (model.id != null) this._byId[model.id] = model;
        }
        if (order) order.push(existing || model);
      }

      // Remove nonexistent models if appropriate.
      if (remove) {
        for (i = 0, l = this.length; i < l; ++i) {
          if (!modelMap[(model = this.models[i]).cid]) toRemove.push(model);
        }
        if (toRemove.length) this.remove(toRemove, options);
      }

      // See if sorting is needed, update `length` and splice in new models.
      if (toAdd.length || (order && order.length)) {
        if (sortable) sort = true;
        this.length += toAdd.length;
        if (at != null) {
          for (i = 0, l = toAdd.length; i < l; i++) {
            this.models.splice(at + i, 0, toAdd[i]);
          }
        } else {
          if (order) this.models.length = 0;
          var orderedModels = order || toAdd;
          for (i = 0, l = orderedModels.length; i < l; i++) {
            this.models.push(orderedModels[i]);
          }
        }
      }

      // Silently sort the collection if appropriate.
      if (sort) this.sort({silent: true});

      // Unless silenced, it's time to fire all appropriate add/sort events.
      if (!options.silent) {
        for (i = 0, l = toAdd.length; i < l; i++) {
          (model = toAdd[i]).trigger('add', model, this, options);
        }
        if (sort || (order && order.length)) this.trigger('sort', this, options);
      }
      
      // Return the added (or merged) model (or models).
      return singular ? models[0] : models;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any granular `add` or `remove` events. Fires `reset` when finished.
    // Useful for bulk operations and optimizations.
    reset: function(models, options) {
      options || (options = {});
      for (var i = 0, l = this.models.length; i < l; i++) {
        this._removeReference(this.models[i]);
      }
      options.previousModels = this.models;
      this._reset();
      models = this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return models;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      return this.add(model, _.extend({at: this.length}, options));
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      return this.add(model, _.extend({at: 0}, options));
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Slice out a sub-array of models from the collection.
    slice: function() {
      return slice.apply(this.models, arguments);
    },

    // Get a model from the set by id.
    get: function(obj) {
      if (obj == null) return void 0;
      return this._byId[obj.id] || this._byId[obj.cid] || this._byId[obj];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of
    // `filter`.
    where: function(attrs, first) {
      if (_.isEmpty(attrs)) return first ? void 0 : [];
      return this[first ? 'find' : 'filter'](function(model) {
        for (var key in attrs) {
          if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
    },

    // Return the first model with matching attributes. Useful for simple cases
    // of `find`.
    findWhere: function(attrs) {
      return this.where(attrs, true);
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      options || (options = {});

      // Run sort based on type of `comparator`.
      if (_.isString(this.comparator) || this.comparator.length === 1) {
        this.models = this.sortBy(this.comparator, this);
      } else {
        this.models.sort(_.bind(this.comparator, this));
      }

      if (!options.silent) this.trigger('sort', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.invoke(this.models, 'get', attr);
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `reset: true` is passed, the response
    // data will be passed through the `reset` method instead of `set`.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success(collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      if (!(model = this._prepareModel(model, options))) return false;
      if (!options.wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(model, resp, options) {
        if (options.wait) collection.add(model, options);
        if (success) success(model, resp, options);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new collection with an identical list of models as this one.
    clone: function() {
      return new this.constructor(this.models);
    },

    // Private method to reset all internal state. Called when the collection
    // is first initialized or reset.
    _reset: function() {
      this.length = 0;
      this.models = [];
      this._byId  = {};
    },

    // Prepare a hash of attributes (or other model) to be added to this
    // collection.
    _prepareModel: function(attrs, options) {
      if (attrs instanceof Model) {
        if (!attrs.collection) attrs.collection = this;
        return attrs;
      }
      options = options ? _.clone(options) : {};
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model.validationError) return model;
      this.trigger('invalid', this, model.validationError, options);
      return false;
    },

    // Internal method to sever a model's ties to a collection.
    _removeReference: function(model) {
      if (this === model.collection) delete model.collection;
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if ((event === 'add' || event === 'remove') && collection !== this) return;
      if (event === 'destroy') this.remove(model, options);
      if (model && event === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        if (model.id != null) this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  // 90% of the core usefulness of Backbone Collections is actually implemented
  // right here:
  var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
    'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
    'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
    'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
    'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
    'lastIndexOf', 'isEmpty', 'chain'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.models);
      return _[method].apply(_, args);
    };
  });

  // Underscore methods that take a property name as an argument.
  var attributeMethods = ['groupBy', 'countBy', 'sortBy'];

  // Use attributes instead of properties.
  _.each(attributeMethods, function(method) {
    Collection.prototype[method] = function(value, context) {
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _[method](this.models, iterator, context);
    };
  });

  // Backbone.View
  // -------------

  // Backbone Views are almost more convention than they are actual code. A View
  // is simply a JavaScript object that represents a logical chunk of UI in the
  // DOM. This might be a single item, an entire list, a sidebar or panel, or
  // even the surrounding frame which wraps your whole app. Defining a chunk of
  // UI as a **View** allows you to define your DOM events declaratively, without
  // having to worry about render order ... and makes it easy for the view to
  // react to specific changes in the state of your models.

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    options || (options = {});
    _.extend(this, _.pick(options, viewOptions));
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be preferred to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    remove: function() {
      this.$el.remove();
      this.stopListening();
      return this;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      if (this.$el) this.undelegateEvents();
      this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = _.result(this, 'events')))) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) continue;

        var match = key.match(delegateEventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.on(eventName, method);
        } else {
          this.$el.on(eventName, selector, method);
        }
      }
      return this;
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.off('.delegateEvents' + this.cid);
      return this;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
        this.setElement($el, false);
      } else {
        this.setElement(_.result(this, 'el'), false);
      }
    }

  });

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // If we're sending a `PATCH` request, and we're in an old Internet Explorer
    // that still has ActiveX enabled by default, override jQuery to use that
    // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
    if (params.type === 'PATCH' && noXhrPatch) {
      params.xhr = function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
      };
    }

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  var noXhrPatch = typeof window !== 'undefined' && !!window.ActiveXObject && !(window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent);

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
  };

  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
  // Override this if you'd like to use a different library.
  Backbone.ajax = function() {
    return Backbone.$.ajax.apply(Backbone.$, arguments);
  };

  // Backbone.Router
  // ---------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        callback && callback.apply(router, args);
        router.trigger.apply(router, ['route:' + name].concat(args));
        router.trigger('route', name, args);
        Backbone.history.trigger('route', router, name, args);
      });
      return this;
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
      return this;
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      this.routes = _.result(this, 'routes');
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional) {
                     return optional ? match : '([^\/]+)';
                   })
                   .replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param) {
        return param ? decodeURIComponent(param) : null;
      });
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on either
  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
  // and URL fragments. If the browser supports neither (old IE, natch),
  // falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Cached regex for removing a trailing slash.
  var trailingSlash = /\/$/;

  // Cached regex for stripping urls of hash and query.
  var pathStripper = /[?#].*$/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
          fragment = this.location.pathname;
          var root = this.root.replace(trailingSlash, '');
          if (!fragment.indexOf(root)) fragment = fragment.slice(root.length);
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("Backbone.history has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      if (oldIE && this._wantsHashChange) {
        this.iframe = Backbone.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        Backbone.$(window).on('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        Backbone.$(window).on('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = this.location;
      var atRoot = loc.pathname.replace(/[^\/]$/, '$&/') === this.root;

      // Transition from hashChange to pushState or vice versa if both are
      // requested.
      if (this._wantsHashChange && this._wantsPushState) {

        // If we've started off with a route from a `pushState`-enabled
        // browser, but we're currently in a browser that doesn't support it...
        if (!this._hasPushState && !atRoot) {
          this.fragment = this.getFragment(null, true);
          this.location.replace(this.root + this.location.search + '#' + this.fragment);
          // Return immediately as browser will do redirect to new url
          return true;

        // Or if we've started out with a hash-based route, but we're currently
        // in a browser where it could be `pushState`-based instead...
        } else if (this._hasPushState && atRoot && loc.hash) {
          this.fragment = this.getHash().replace(routeStripper, '');
          this.history.replaceState({}, document.title, this.root + this.fragment + loc.search);
        }

      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      Backbone.$(window).off('popstate', this.checkUrl).off('hashchange', this.checkUrl);
      clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current === this.fragment && this.iframe) {
        current = this.getFragment(this.getHash(this.iframe));
      }
      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl();
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragment) {
      fragment = this.fragment = this.getFragment(fragment);
      var _any = _.any || _.some;
      return _any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: !!options};

      var url = this.root + (fragment = this.getFragment(fragment || ''));

      // Strip the fragment of the query and hash for matching.
      fragment = fragment.replace(pathStripper, '');

      if (this.fragment === fragment) return;
      this.fragment = fragment;

      // Don't include a trailing slash on the root.
      if (fragment === '' && url !== '/') url = url.slice(0, -1);

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, fragment, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) return this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // Some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    }

  });

  // Create the default Backbone.history.
  Backbone.history = new History;

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set up inheritance for the model, collection, router, view and history.
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error(model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

}).call(this);

define("backbone", ["underscore","jquery"], (function (global) {
    return function () {
        var ret, fn;
        return ret || global.Backbone;
    };
}(this)));

/*
 * This model stores the last 10 pages visited, which we'll pass to CAL
 * Thus when analyzing CAL log, we have clearer context about where user have been
 */
define('model/history',['backbone'], function (Backbone) {

	'use strict';

	var HistoryModel = Backbone.Model.extend({

		CONST_MAX_PAGE: 10,

		path: [],

		addPath: function addPath(path) {
			if (this.path.length === this.CONST_MAX_PAGE) {
				this.path.shift();
			}
			this.path.push(path);
		},

		getPath: function getPath() {
			return this.path.join(' > ');
		}
	});

	return new HistoryModel();
});

/**
 * Log client-side errors to the server
 */
define('core/error',['jquery', 'model/history'], function ($, historyModel) {

	'use strict';

	// max number of errors logged per session

	var MAX_ERRORS = 2;

	// error count
	var errors = 0;

	/**
  * post the messages to the server
  */
	function log(url, message, file, line, column, error) {
		$.post(url, {
			message: message,
			href: window.location.href,
			file: file,
			line: line,
			column: column,
			stack: error ? error.stack : '',
			history: historyModel.getPath(),
			userAgent: navigator.userAgent
		});
	}

	/**
  * start capturing global errors
  * @param URL where we POST the errors
  */
	function start(url) {

		window.onerror = function (message, file, line, column, errpr) {

			// avoid spamming the service if there are a lot of errors
			if (errors > MAX_ERRORS) {
				return;
			}

			// log the messages to the server
			log(url, message, file, line, column, errpr);
			errors++;
		};
	}

	return {
		start: start,
		log: log
	};
});

define('lib/shim/compat',[],function() {

	"use strict";

	if (!Function.prototype.bind) {
		Function.prototype.bind = function (oThis) {
			if (typeof this !== "function") {
				// closest thing possible to the ECMAScript 5 internal IsCallable function
				throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
			}

			var aArgs = Array.prototype.slice.call(arguments, 1),
				fToBind = this,
				fNOP = function () {},
				fBound = function () {
					return fToBind.apply(this instanceof fNOP && oThis
						? this
						: oThis,
						aArgs.concat(Array.prototype.slice.call(arguments)));
				};

			fNOP.prototype = this.prototype;
			fBound.prototype = new fNOP();

			return fBound;
		};
	}

});

/**
 * Enhance Backbone.sync to know about our AJAX error handling
 */

/*global define , window, $ , document*/
define('lib/bb-errors',['backbone'], function (Backbone) {

    'use strict';

    var originalSync = Backbone.sync;
    Backbone.sync = function (method, model, options) {

        // Set options to error to the new error function
        var oldSuccess = options.success;
        var oldError = options.error;

        // override the success handler to look for errors
        // these errors need to follow our special format
        options.success = function (response) {
            // handle errors
            if (response.error) {
                if (response.error.code === 'captcha') {
                    model.trigger('captcha', model, response, response.error.captcha);
                } else if (response.error.code === 'authRequired') {
                    // Redirect to the classic experience since authflow needs a fix in 8ball App or Authmessagingsparta
                    window.location = response.data.location;
                } else if (response.error.message) {
                    model.trigger('error', model, response, response.error.message); // add message as extra item
                }

                // An extra call (for loaders if you want)
                model.trigger('sync-error');
                return;
            }

            // handle success
            oldSuccess(response);
        };

        // this is reserved for errors that we did not properly catch
        // we cannot easiliy i18n these errors, because they are unexpected
        options.error = function (response) {
            // Show the generic error in this case
            if (response.error && response.error.code === 'authRequired') {
                model.trigger('error', model, response, $('body').data('genericerror'));
            } else if (response.status && response.status === 401) {
                document.location.href = '/businessprofile/mysettings';

            } else if (response.responseJSON && response.responseJSON.error && response.responseJSON.error.message) {
                model.trigger('error', model, response.responseJSON, response.responseJSON.error.message);
            }

            oldError(response);

        };

        // Call the stored original Backbone.sync method with the new settings
        originalSync(method, model, options);
    };
});

/**
 * Super simple jQuery plugin type thing to auto-submit forms that have this data attribute.
 */

define('lib/auto-submit',['jquery'], function ($) {
	var $form = $('form[data-auto-submit]');
	if ($form.length) {
		$form.submit();
	}
});

/*! Dust - Asynchronous Templating - v2.5.1
* http://linkedin.github.io/dustjs/
* Copyright (c) 2014 Aleksander Williams; Released under the MIT License */
(function(root) {
  var dust = {},
      NONE = 'NONE',
      ERROR = 'ERROR',
      WARN = 'WARN',
      INFO = 'INFO',
      DEBUG = 'DEBUG',
      loggingLevels = [DEBUG, INFO, WARN, ERROR, NONE],
      EMPTY_FUNC = function() {},
      logger = {},
      originalLog,
      loggerContext;

  dust.debugLevel = NONE;

  dust.config = {
    whitespace: false,
  };

  // Directive aliases to minify code
  dust._aliases = {
    "write": "w",
    "end": "e",
    "map": "m",
    "render": "r",
    "reference": "f",
    "section": "s",
    "exists": "x",
    "notexists": "nx",
    "block": "b",
    "partial": "p",
    "helper": "h"
  };

  // Try to find the console in global scope
  if (root && root.console && root.console.log) {
    loggerContext = root.console;
    originalLog = root.console.log;
  }

  // robust logger for node.js, modern browsers, and IE <= 9.
  logger.log = loggerContext ? function() {
      // Do this for normal browsers
      if (typeof originalLog === 'function') {
        logger.log = function() {
          originalLog.apply(loggerContext, arguments);
        };
      } else {
        // Do this for IE <= 9
        logger.log = function() {
          var message = Array.prototype.slice.apply(arguments).join(' ');
          originalLog(message);
        };
      }
      logger.log.apply(this, arguments);
  } : function() { /* no op */ };

  /**
   * Log dust debug statements, info statements, warning statements, and errors.
   * Filters out the messages based on the dust.debuglevel.
   * This default implementation will print to the console if it exists.
   * @param {String|Error} message the message to print/throw
   * @param {String} type the severity of the message(ERROR, WARN, INFO, or DEBUG)
   * @public
   */
  dust.log = function(message, type) {
    type = type || INFO;
    if (dust.debugLevel !== NONE && dust.indexInArray(loggingLevels, type) >= dust.indexInArray(loggingLevels, dust.debugLevel)) {
      if(!dust.logQueue) {
        dust.logQueue = [];
      }
      dust.logQueue.push({message: message, type: type});
      logger.log('[DUST ' + type + ']: ' + message);
    }
  };

  dust.helpers = {};

  dust.cache = {};

  dust.register = function(name, tmpl) {
    if (!name) {
      return;
    }
    dust.cache[name] = tmpl;
  };

  dust.render = function(name, context, callback) {
    var chunk = new Stub(callback).head;
    try {
      dust.load(name, chunk, Context.wrap(context, name)).end();
    } catch (err) {
      chunk.setError(err);
    }
  };

  dust.stream = function(name, context) {
    var stream = new Stream(),
        chunk = stream.head;
    dust.nextTick(function() {
      try {
        dust.load(name, stream.head, Context.wrap(context, name)).end();
      } catch (err) {
        chunk.setError(err);
      }
    });
    return stream;
  };

  dust.renderSource = function(source, context, callback) {
    return dust.compileFn(source)(context, callback);
  };

  dust.compileFn = function(source, name) {
    // name is optional. When name is not provided the template can only be rendered using the callable returned by this function.
    // If a name is provided the compiled template can also be rendered by name.
    name = name || null;
    var tmpl = dust.loadSource(dust.compile(source, name));
    return function(context, callback) {
      var master = callback ? new Stub(callback) : new Stream();
      dust.nextTick(function() {
        if(typeof tmpl === 'function') {
          tmpl(master.head, Context.wrap(context, name)).end();
        }
        else {
          dust.log(new Error('Template [' + name + '] cannot be resolved to a Dust function'), ERROR);
        }
      });
      return master;
    };
  };

  dust.load = function(name, chunk, context) {
    var tmpl = dust.cache[name];
    if (tmpl) {
      return tmpl(chunk, context);
    } else {
      if (dust.onLoad) {
        return chunk.map(function(chunk) {
          dust.onLoad(name, function(err, src) {
            if (err) {
              return chunk.setError(err);
            }
            if (!dust.cache[name]) {
              dust.loadSource(dust.compile(src, name));
            }
            dust.cache[name](chunk, context).end();
          });
        });
      }
      return chunk.setError(new Error('Template Not Found: ' + name));
    }
  };

  dust.loadSource = function(source, path) {
    return eval(source);
  };

  if (Array.isArray) {
    dust.isArray = Array.isArray;
  } else {
    dust.isArray = function(arr) {
      return Object.prototype.toString.call(arr) === '[object Array]';
    };
  }

  // indexOf shim for arrays for IE <= 8
  // source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
  dust.indexInArray = function(arr, item, fromIndex) {
    fromIndex = +fromIndex || 0;
    if (Array.prototype.indexOf) {
      return arr.indexOf(item, fromIndex);
    } else {
    if ( arr === undefined || arr === null ) {
      throw new TypeError( 'cannot call method "indexOf" of null' );
    }

    var length = arr.length; // Hack to convert object.length to a UInt32

    if (Math.abs(fromIndex) === Infinity) {
      fromIndex = 0;
    }

    if (fromIndex < 0) {
      fromIndex += length;
      if (fromIndex < 0) {
        fromIndex = 0;
      }
    }

    for (;fromIndex < length; fromIndex++) {
      if (arr[fromIndex] === item) {
        return fromIndex;
      }
    }

    return -1;
    }
  };

  dust.nextTick = (function() {
    return function(callback) {
      setTimeout(callback,0);
    };
  } )();

  dust.isEmpty = function(value) {
    if (dust.isArray(value) && !value.length) {
      return true;
    }
    if (value === 0) {
      return false;
    }
    return (!value);
  };

  // apply the filter chain and return the output string
  dust.filter = function(string, auto, filters) {
    if (filters) {
      for (var i=0, len=filters.length; i<len; i++) {
        var name = filters[i];
        if (name === 's') {
          auto = null;
        }
        else if (typeof dust.filters[name] === 'function') {
          string = dust.filters[name](string);
        }
        else {
          dust.log('Invalid filter [' + name + ']', WARN);
        }
      }
    }
    // by default always apply the h filter, unless asked to unescape with |s
    if (auto) {
      string = dust.filters[auto](string);
    }
    return string;
  };

  dust.filters = {
    h: function(value) { return dust.escapeHtml(value); },
    j: function(value) { return dust.escapeJs(value); },
    u: encodeURI,
    uc: encodeURIComponent,
    js: function(value) {
      if (!JSON) {
        dust.log('JSON is undefined.  JSON stringify has not been used on [' + value + ']', WARN);
        return value;
      } else {
        return JSON.stringify(value);
      }
    },
    jp: function(value) {
      if (!JSON) {dust.log('JSON is undefined.  JSON parse has not been used on [' + value + ']', WARN);
        return value;
      } else {
        return JSON.parse(value);
      }
    }
  };

  function Context(stack, global, blocks, templateName) {
    this.stack  = stack;
    this.global = global;
    this.blocks = blocks;
    this.templateName = templateName;
  }

  dust.makeBase = function(global) {
    return new Context(new Stack(), global);
  };

  Context.wrap = function(context, name) {
    if (context instanceof Context) {
      return context;
    }
    return new Context(new Stack(context), {}, null, name);
  };

  /**
   * Public API for getting a value from the context.
   * @method get
   * @param {string|array} path The path to the value. Supported formats are:
   * 'key'
   * 'path.to.key'
   * '.path.to.key'
   * ['path', 'to', 'key']
   * ['key']
   * @param {boolean} [cur=false] Boolean which determines if the search should be limited to the
   * current context (true), or if get should search in parent contexts as well (false).
   * @public
   * @returns {string|object}
   */
  Context.prototype.get = function(path, cur) {
    if (typeof path === 'string') {
      if (path[0] === '.') {
        cur = true;
        path = path.substr(1);
      }
      path = path.split('.');
    }
    return this._get(cur, path);
  };

  /**
   * Get a value from the context
   * @method _get
   * @param {boolean} cur Get only from the current context
   * @param {array} down An array of each step in the path
   * @private
   * @return {string | object}
   */
  Context.prototype._get = function(cur, down) {
    var ctx = this.stack,
        i = 1,
        value, first, len, ctxThis, fn;
    first = down[0];
    len = down.length;

    if (cur && len === 0) {
      ctxThis = ctx;
      ctx = ctx.head;
    } else {
      if (!cur) {
        // Search up the stack for the first value
        while (ctx) {
          if (ctx.isObject) {
            ctxThis = ctx.head;
            value = ctx.head[first];
            if (value !== undefined) {
              break;
            }
          }
          ctx = ctx.tail;
        }

        if (value !== undefined) {
          ctx = value;
        } else {
          ctx = this.global ? this.global[first] : undefined;
        }
      } else if (ctx) {
        // if scope is limited by a leading dot, don't search up the tree
        if(ctx.head) {
          ctx = ctx.head[first];
        } else {
          //context's head is empty, value we are searching for is not defined
          ctx = undefined;
        }
      }

      while (ctx && i < len) {
        ctxThis = ctx;
        ctx = ctx[down[i]];
        i++;
      }
    }

    // Return the ctx or a function wrapping the application of the context.
    if (typeof ctx === 'function') {
      fn = function() {
        try {
          return ctx.apply(ctxThis, arguments);
        } catch (err) {
          dust.log(err, ERROR);
          throw err;
        }
      };
      fn.__dustBody = !!ctx.__dustBody;
      return fn;
    } else {
      if (ctx === undefined) {
        dust.log('Cannot find the value for reference [{' + down.join('.') + '}] in template [' + this.getTemplateName() + ']');
      }
      return ctx;
    }
  };

  Context.prototype.getPath = function(cur, down) {
    return this._get(cur, down);
  };

  Context.prototype.push = function(head, idx, len) {
    return new Context(new Stack(head, this.stack, idx, len), this.global, this.blocks, this.getTemplateName());
  };

  Context.prototype.rebase = function(head) {
    return new Context(new Stack(head), this.global, this.blocks, this.getTemplateName());
  };

  Context.prototype.current = function() {
    return this.stack.head;
  };

  Context.prototype.getBlock = function(key, chk, ctx) {
    if (typeof key === 'function') {
      var tempChk = new Chunk();
      key = key(tempChk, this).data.join('');
    }

    var blocks = this.blocks;

    if (!blocks) {
      dust.log('No blocks for context[{' + key + '}] in template [' + this.getTemplateName() + ']', DEBUG);
      return;
    }
    var len = blocks.length, fn;
    while (len--) {
      fn = blocks[len][key];
      if (fn) {
        return fn;
      }
    }
  };

  Context.prototype.shiftBlocks = function(locals) {
    var blocks = this.blocks,
        newBlocks;

    if (locals) {
      if (!blocks) {
        newBlocks = [locals];
      } else {
        newBlocks = blocks.concat([locals]);
      }
      return new Context(this.stack, this.global, newBlocks, this.getTemplateName());
    }
    return this;
  };

  Context.prototype.getTemplateName = function() {
    return this.templateName;
  };

  function Stack(head, tail, idx, len) {
    this.tail = tail;
    this.isObject = head && typeof head === 'object';
    this.head = head;
    this.index = idx;
    this.of = len;
  }

  function Stub(callback) {
    this.head = new Chunk(this);
    this.callback = callback;
    this.out = '';
  }

  Stub.prototype.flush = function() {
    var chunk = this.head;

    while (chunk) {
      if (chunk.flushable) {
        this.out += chunk.data.join(''); //ie7 perf
      } else if (chunk.error) {
        this.callback(chunk.error);
        dust.log('Chunk error [' + chunk.error + '] thrown. Ceasing to render this template.', WARN);
        this.flush = EMPTY_FUNC;
        return;
      } else {
        return;
      }
      chunk = chunk.next;
      this.head = chunk;
    }
    this.callback(null, this.out);
  };

  function Stream() {
    this.head = new Chunk(this);
  }

  Stream.prototype.flush = function() {
    var chunk = this.head;

    while(chunk) {
      if (chunk.flushable) {
        this.emit('data', chunk.data.join('')); //ie7 perf
      } else if (chunk.error) {
        this.emit('error', chunk.error);
        dust.log('Chunk error [' + chunk.error + '] thrown. Ceasing to render this template.', WARN);
        this.flush = EMPTY_FUNC;
        return;
      } else {
        return;
      }
      chunk = chunk.next;
      this.head = chunk;
    }
    this.emit('end');
  };

  Stream.prototype.emit = function(type, data) {
    if (!this.events) {
      dust.log('No events to emit', INFO);
      return false;
    }
    var handler = this.events[type];
    if (!handler) {
      dust.log('Event type [' + type + '] does not exist', WARN);
      return false;
    }
    if (typeof handler === 'function') {
      handler(data);
    } else if (dust.isArray(handler)) {
      var listeners = handler.slice(0);
      for (var i = 0, l = listeners.length; i < l; i++) {
        listeners[i](data);
      }
    } else {
      dust.log('Event Handler [' + handler + '] is not of a type that is handled by emit', WARN);
    }
  };

  Stream.prototype.on = function(type, callback) {
    if (!this.events) {
      this.events = {};
    }
    if (!this.events[type]) {
      if(callback) {
        this.events[type] = callback;
      } else {
        dust.log('Callback for type [' + type + '] does not exist. Listener not registered.', WARN);
      }
    } else if(typeof this.events[type] === 'function') {
      this.events[type] = [this.events[type], callback];
    } else {
      this.events[type].push(callback);
    }
    return this;
  };

  Stream.prototype.pipe = function(stream) {
    this.on('data', function(data) {
      try {
        stream.write(data, 'utf8');
      } catch (err) {
        dust.log(err, ERROR);
      }
    }).on('end', function() {
      try {
        return stream.end();
      } catch (err) {
        dust.log(err, ERROR);
      }
    }).on('error', function(err) {
      stream.error(err);
    });
    return this;
  };

  function Chunk(root, next, taps) {
    this.root = root;
    this.next = next;
    this.data = []; //ie7 perf
    this.flushable = false;
    this.taps = taps;
  }

  Chunk.prototype.write = function(data) {
    var taps  = this.taps;

    if (taps) {
      data = taps.go(data);
    }
    this.data.push(data);
    return this;
  };

  Chunk.prototype.end = function(data) {
    if (data) {
      this.write(data);
    }
    this.flushable = true;
    this.root.flush();
    return this;
  };

  Chunk.prototype.map = function(callback) {
    var cursor = new Chunk(this.root, this.next, this.taps),
        branch = new Chunk(this.root, cursor, this.taps);

    this.next = branch;
    this.flushable = true;
    try {
      callback(branch);
    } catch(e) {
      dust.log(e, ERROR);
      branch.setError(e);
    }
    return cursor;
  };

  Chunk.prototype.tap = function(tap) {
    var taps = this.taps;

    if (taps) {
      this.taps = taps.push(tap);
    } else {
      this.taps = new Tap(tap);
    }
    return this;
  };

  Chunk.prototype.untap = function() {
    this.taps = this.taps.tail;
    return this;
  };

  Chunk.prototype.render = function(body, context) {
    return body(this, context);
  };

  Chunk.prototype.reference = function(elem, context, auto, filters) {
    if (typeof elem === 'function') {
      // Changed the function calling to use apply with the current context to make sure
      // that "this" is wat we expect it to be inside the function
      elem = elem.apply(context.current(), [this, context, null, {auto: auto, filters: filters}]);
      if (elem instanceof Chunk) {
        return elem;
      }
    }
    if (!dust.isEmpty(elem)) {
      return this.write(dust.filter(elem, auto, filters));
    } else {
      return this;
    }
  };

  Chunk.prototype.section = function(elem, context, bodies, params) {
    // anonymous functions
    if (typeof elem === 'function' && !elem.__dustBody) {
      try {
        elem = elem.apply(context.current(), [this, context, bodies, params]);
      } catch(e) {
        dust.log(e, ERROR);
        return this.setError(e);
      }
      // functions that return chunks are assumed to have handled the body and/or have modified the chunk
      // use that return value as the current chunk and go to the next method in the chain
      if (elem instanceof Chunk) {
        return elem;
      }
    }
    var body = bodies.block,
        skip = bodies['else'];

    // a.k.a Inline parameters in the Dust documentations
    if (params) {
      context = context.push(params);
    }

    /*
    Dust's default behavior is to enumerate over the array elem, passing each object in the array to the block.
    When elem resolves to a value or object instead of an array, Dust sets the current context to the value
    and renders the block one time.
    */
    //non empty array is truthy, empty array is falsy
    if (dust.isArray(elem)) {
      if (body) {
        var len = elem.length, chunk = this;
        if (len > 0) {
          // any custom helper can blow up the stack
          // and store a flattened context, guard defensively
          if(context.stack.head) {
            context.stack.head['$len'] = len;
          }
          for (var i=0; i<len; i++) {
            if(context.stack.head) {
              context.stack.head['$idx'] = i;
            }
            chunk = body(chunk, context.push(elem[i], i, len));
          }
          if(context.stack.head) {
            context.stack.head['$idx'] = undefined;
            context.stack.head['$len'] = undefined;
          }
          return chunk;
        }
        else if (skip) {
          return skip(this, context);
        }
      }
    } else if (elem  === true) {
     // true is truthy but does not change context
      if (body) {
        return body(this, context);
      }
    } else if (elem || elem === 0) {
       // everything that evaluates to true are truthy ( e.g. Non-empty strings and Empty objects are truthy. )
       // zero is truthy
       // for anonymous functions that did not returns a chunk, truthiness is evaluated based on the return value
      if (body) {
        return body(this, context.push(elem));
      }
     // nonexistent, scalar false value, scalar empty string, null,
     // undefined are all falsy
    } else if (skip) {
      return skip(this, context);
    }
    dust.log('Not rendering section (#) block in template [' + context.getTemplateName() + '], because above key was not found', DEBUG);
    return this;
  };

  Chunk.prototype.exists = function(elem, context, bodies) {
    var body = bodies.block,
        skip = bodies['else'];

    if (!dust.isEmpty(elem)) {
      if (body) {
        return body(this, context);
      }
    } else if (skip) {
      return skip(this, context);
    }
    dust.log('Not rendering exists (?) block in template [' + context.getTemplateName() + '], because above key was not found', DEBUG);
    return this;
  };

  Chunk.prototype.notexists = function(elem, context, bodies) {
    var body = bodies.block,
        skip = bodies['else'];

    if (dust.isEmpty(elem)) {
      if (body) {
        return body(this, context);
      }
    } else if (skip) {
      return skip(this, context);
    }
    dust.log('Not rendering not exists (^) block check in template [' + context.getTemplateName() + '], because above key was found', DEBUG);
    return this;
  };

  Chunk.prototype.block = function(elem, context, bodies) {
    var body = bodies.block;

    if (elem) {
      body = elem;
    }

    if (body) {
      return body(this, context);
    }
    return this;
  };

  Chunk.prototype.partial = function(elem, context, params) {
    var partialContext;
    //put the params context second to match what section does. {.} matches the current context without parameters
    // start with an empty context
    partialContext = dust.makeBase(context.global);
    partialContext.blocks = context.blocks;
    if (context.stack && context.stack.tail){
      // grab the stack(tail) off of the previous context if we have it
      partialContext.stack = context.stack.tail;
    }
    if (params){
      //put params on
      partialContext = partialContext.push(params);
    }

    if(typeof elem === 'string') {
      partialContext.templateName = elem;
    }

    //reattach the head
    partialContext = partialContext.push(context.stack.head);

    var partialChunk;
    if (typeof elem === 'function') {
      partialChunk = this.capture(elem, partialContext, function(name, chunk) {
        partialContext.templateName = partialContext.templateName || name;
        dust.load(name, chunk, partialContext).end();
      });
    } else {
      partialChunk = dust.load(elem, this, partialContext);
    }
    return partialChunk;
  };

  Chunk.prototype.helper = function(name, context, bodies, params) {
    var chunk = this;
    // handle invalid helpers, similar to invalid filters
    if(dust.helpers[name]) {
      try {
        return dust.helpers[name](chunk, context, bodies, params);
      } catch(e) {
        dust.log('Error in ' + name + ' helper: ' + e, ERROR);
        return chunk.setError(e);
      }
    } else {
      dust.log('Invalid helper [' + name + ']', WARN);
      return chunk;
    }
  };

  Chunk.prototype.capture = function(body, context, callback) {
    return this.map(function(chunk) {
      var stub = new Stub(function(err, out) {
        if (err) {
          chunk.setError(err);
        } else {
          callback(out, chunk);
        }
      });
      body(stub.head, context).end();
    });
  };

  Chunk.prototype.setError = function(err) {
    this.error = err;
    this.root.flush();
    return this;
  };

  // Chunk aliases
  for(var f in Chunk.prototype) {
    if(dust._aliases[f]) {
      Chunk.prototype[dust._aliases[f]] = Chunk.prototype[f];
    }
  }

  function Tap(head, tail) {
    this.head = head;
    this.tail = tail;
  }

  Tap.prototype.push = function(tap) {
    return new Tap(tap, this);
  };

  Tap.prototype.go = function(value) {
    var tap = this;

    while(tap) {
      value = tap.head(value);
      tap = tap.tail;
    }
    return value;
  };

  var HCHARS = /[&<>"']/,
      AMP    = /&/g,
      LT     = /</g,
      GT     = />/g,
      QUOT   = /\"/g,
      SQUOT  = /\'/g;

  //copied it from dust-core-2.6.0.js : This is XSS vulnerability patch
  dust.escapeHtml = function(s) {
    if (typeof s === "string" || (s && typeof s.toString === "function")) {
      if (typeof s !== "string") {
        s = s.toString();
      }
      if (!HCHARS.test(s)) {
        return s;
      }
      return s.replace(AMP,'&amp;').replace(LT,'&lt;').replace(GT,'&gt;').replace(QUOT,'&quot;').replace(SQUOT, '&#39;');
    }
    return s;
  };

  var BS = /\\/g,
      FS = /\//g,
      CR = /\r/g,
      LS = /\u2028/g,
      PS = /\u2029/g,
      NL = /\n/g,
      LF = /\f/g,
      SQ = /'/g,
      DQ = /"/g,
      TB = /\t/g;

  dust.escapeJs = function(s) {
    if (typeof s === 'string') {
      return s
        .replace(BS, '\\\\')
        .replace(FS, '\\/')
        .replace(DQ, '\\"')
        .replace(SQ, '\\\'')
        .replace(CR, '\\r')
        .replace(LS, '\\u2028')
        .replace(PS, '\\u2029')
        .replace(NL, '\\n')
        .replace(LF, '\\f')
        .replace(TB, '\\t');
    }
    return s;
  };


  if (typeof exports === 'object') {
    module.exports = dust;
  } else {
    root.dust = dust;
  }

})((function(){return this;})());
define("dust", (function (global) {
    return function () {
        var ret, fn;
        return ret || global.dust;
    };
}(this)));

/*! dustjs-helpers - v1.5.0
* https://github.com/linkedin/dustjs-helpers
* Copyright (c) 2014 Aleksander Williams; Released under the MIT License */
(function(dust){

// Use dust's built-in logging when available
var _log = dust.log ? function(msg, level) {
  level = level || "INFO";
  dust.log(msg, level);
} : function() {};

var _deprecatedCache = {};
function _deprecated(target) {
  if(_deprecatedCache[target]) { return; }
  _log("Deprecation warning: " + target + " is deprecated and will be removed in a future version of dustjs-helpers", "WARN");
  _log("For help and a deprecation timeline, see https://github.com/linkedin/dustjs-helpers/wiki/Deprecated-Features#" + target.replace(/\W+/g, ""), "WARN");
  _deprecatedCache[target] = true;
}

function isSelect(context) {
  var value = context.current();
  return typeof value === "object" && value.isSelect === true;
}

// Utility method : toString() equivalent for functions
function jsonFilter(key, value) {
  if (typeof value === "function") {
    //to make sure all environments format functions the same way
    return value.toString()
      //remove all leading and trailing whitespace
      .replace(/(^\s+|\s+$)/mg, '')
      //remove new line characters
      .replace(/\n/mg, '')
      //replace , and 0 or more spaces with ", "
      .replace(/,\s*/mg, ', ')
      //insert space between ){
      .replace(/\)\{/mg, ') {')
    ;
  }
  return value;
}

// Utility method: to invoke the given filter operation such as eq/gt etc
function filter(chunk, context, bodies, params, filterOp) {
  params = params || {};
  var body = bodies.block,
      actualKey,
      expectedValue,
      filterOpType = params.filterOpType || '';

  // when @eq, @lt etc are used as standalone helpers, key is required and hence check for defined
  if (params.hasOwnProperty("key")) {
    actualKey = dust.helpers.tap(params.key, chunk, context);
  } else if (isSelect(context)) {
    actualKey = context.current().selectKey;
    //  supports only one of the blocks in the select to be selected
    if (context.current().isResolved) {
      filterOp = function() { return false; };
    }
  } else {
    _log("No key specified for filter in:" + filterOpType + " helper ");
    return chunk;
  }
  expectedValue = dust.helpers.tap(params.value, chunk, context);
  // coerce both the actualKey and expectedValue to the same type for equality and non-equality compares
  if (filterOp(coerce(expectedValue, params.type, context), coerce(actualKey, params.type, context))) {
    if (isSelect(context)) {
      context.current().isResolved = true;
    }
    // we want helpers without bodies to fail gracefully so check it first
    if(body) {
     return chunk.render(body, context);
    } else {
      _log("No body specified for " + filterOpType + " helper ");
      return chunk;
    }
  } else if (bodies['else']) {
    return chunk.render(bodies['else'], context);
  }
  return chunk;
}

function coerce(value, type, context) {
  if (typeof value !== "undefined") {
    switch (type || typeof value) {
      case 'number': return +value;
      case 'string': return String(value);
      case 'boolean':
        value = (value === 'false' ? false : value);
        return Boolean(value);
      case 'date': return new Date(value);
      case 'context': return context.get(value);
    }
  }

  return value;
}

var helpers = {

  // Utility helping to resolve dust references in the given chunk
  // uses the Chunk.render method to resolve value
  /*
   Reference resolution rules:
   if value exists in JSON:
    "" or '' will evaluate to false, boolean false, null, or undefined will evaluate to false,
    numeric 0 evaluates to true, so does, string "0", string "null", string "undefined" and string "false".
    Also note that empty array -> [] is evaluated to false and empty object -> {} and non-empty object are evaluated to true
    The type of the return value is string ( since we concatenate to support interpolated references

   if value does not exist in JSON and the input is a single reference: {x}
     dust render emits empty string, and we then return false

   if values does not exist in JSON and the input is interpolated references : {x} < {y}
     dust render emits <  and we return the partial output

  */
  "tap": function(input, chunk, context) {
    // return given input if there is no dust reference to resolve
    // dust compiles a string/reference such as {foo} to a function
    if (typeof input !== "function") {
      return input;
    }

    var dustBodyOutput = '',
      returnValue;

    //use chunk render to evaluate output. For simple functions result will be returned from render call,
    //for dust body functions result will be output via callback function
    returnValue = chunk.tap(function(data) {
      dustBodyOutput += data;
      return '';
    }).render(input, context);

    chunk.untap();

    //assume it's a simple function call if return result is not a chunk
    if (returnValue.constructor !== chunk.constructor) {
      //use returnValue as a result of tap
      return returnValue;
    } else if (dustBodyOutput === '') {
      return false;
    } else {
      return dustBodyOutput;
    }
  },

  "sep": function(chunk, context, bodies) {
    var body = bodies.block;
    if (context.stack.index === context.stack.of - 1) {
      return chunk;
    }
    if (body) {
      return body(chunk, context);
    } else {
      return chunk;
    }
  },

  "idx": function(chunk, context, bodies) {
    var body = bodies.block;
    // Will be removed in 1.6
    _deprecated("{@idx}");
    if(body) {
      return body(chunk, context.push(context.stack.index));
    }
    else {
      return chunk;
    }
  },

  /**
   * contextDump helper
   * @param key specifies how much to dump.
   * "current" dumps current context. "full" dumps the full context stack.
   * @param to specifies where to write dump output.
   * Values can be "console" or "output". Default is output.
   */
  "contextDump": function(chunk, context, bodies, params) {
    var p = params || {},
      to = p.to || 'output',
      key = p.key || 'current',
      dump;
    to = dust.helpers.tap(to, chunk, context);
    key = dust.helpers.tap(key, chunk, context);
    if (key === 'full') {
      dump = JSON.stringify(context.stack, jsonFilter, 2);
    }
    else {
      dump = JSON.stringify(context.stack.head, jsonFilter, 2);
    }
    if (to === 'console') {
      _log(dump);
      return chunk;
    }
    else {
      // encode opening brackets when outputting to html
      dump = dump.replace(/</g, '\\u003c');

      return chunk.write(dump);
    }
  },
  /**
   if helper for complex evaluation complex logic expressions.
   Note : #1 if helper fails gracefully when there is no body block nor else block
          #2 Undefined values and false values in the JSON need to be handled specially with .length check
             for e.g @if cond=" '{a}'.length && '{b}'.length" is advised when there are chances of the a and b been
             undefined or false in the context
          #3 Use only when the default ? and ^ dust operators and the select fall short in addressing the given logic,
             since eval executes in the global scope
          #4 All dust references are default escaped as they are resolved, hence eval will block malicious scripts in the context
             Be mindful of evaluating a expression that is passed through the unescape filter -> |s
   @param cond, either a string literal value or a dust reference
                a string literal value, is enclosed in double quotes, e.g. cond="2>3"
                a dust reference is also enclosed in double quotes, e.g. cond="'{val}'' > 3"
    cond argument should evaluate to a valid javascript expression
   **/

  "if": function( chunk, context, bodies, params ) {
    var body = bodies.block,
        skip = bodies['else'],
        cond;

    if(params && params.cond) {
      // Will be removed in 1.6
      _deprecated("{@if}");

      cond = dust.helpers.tap(params.cond, chunk, context);
      // eval expressions with given dust references
      if(eval(cond)){
       if(body) {
        return chunk.render( bodies.block, context );
       }
       else {
         _log("Missing body block in the if helper!");
         return chunk;
       }
      }
      if(skip){
       return chunk.render( bodies['else'], context );
      }
    }
    // no condition
    else {
      _log("No condition given in the if helper!");
    }
    return chunk;
  },

  /**
   * math helper
   * @param key is the value to perform math against
   * @param method is the math method,  is a valid string supported by math helper like mod, add, subtract
   * @param operand is the second value needed for operations like mod, add, subtract, etc.
   * @param round is a flag to assure that an integer is returned
   */
  "math": function ( chunk, context, bodies, params ) {
    //key and method are required for further processing
    if( params && typeof params.key !== "undefined" && params.method ){
      var key  = params.key,
          method = params.method,
          // operand can be null for "abs", ceil and floor
          operand = params.operand,
          round = params.round,
          mathOut = null,
          operError = function(){
              _log("operand is required for this math method");
              return null;
          };
      key  = dust.helpers.tap(key, chunk, context);
      operand = dust.helpers.tap(operand, chunk, context);
      //  TODO: handle  and tests for negatives and floats in all math operations
      switch(method) {
        case "mod":
          if(operand === 0 || operand === -0) {
            _log("operand for divide operation is 0/-0: expect Nan!");
          }
          mathOut = parseFloat(key) %  parseFloat(operand);
          break;
        case "add":
          mathOut = parseFloat(key) + parseFloat(operand);
          break;
        case "subtract":
          mathOut = parseFloat(key) - parseFloat(operand);
          break;
        case "multiply":
          mathOut = parseFloat(key) * parseFloat(operand);
          break;
        case "divide":
         if(operand === 0 || operand === -0) {
           _log("operand for divide operation is 0/-0: expect Nan/Infinity!");
         }
          mathOut = parseFloat(key) / parseFloat(operand);
          break;
        case "ceil":
          mathOut = Math.ceil(parseFloat(key));
          break;
        case "floor":
          mathOut = Math.floor(parseFloat(key));
          break;
        case "round":
          mathOut = Math.round(parseFloat(key));
          break;
        case "abs":
          mathOut = Math.abs(parseFloat(key));
          break;
        default:
          _log("method passed is not supported");
     }

      if (mathOut !== null){
        if (round) {
          mathOut = Math.round(mathOut);
        }
        if (bodies && bodies.block) {
          // with bodies act like the select helper with mathOut as the key
          // like the select helper bodies['else'] is meaningless and is ignored
          return chunk.render(bodies.block, context.push({ isSelect: true, isResolved: false, selectKey: mathOut }));
        } else {
          // self closing math helper will return the calculated output
          return chunk.write(mathOut);
        }
       } else {
        return chunk;
      }
    }
    // no key parameter and no method
    else {
      _log("Key is a required parameter for math helper along with method/operand!");
    }
    return chunk;
  },
   /**
   select helper works with one of the eq/ne/gt/gte/lt/lte/default providing the functionality
   of branching conditions
   @param key,  ( required ) either a string literal value or a dust reference
                a string literal value, is enclosed in double quotes, e.g. key="foo"
                a dust reference may or may not be enclosed in double quotes, e.g. key="{val}" and key=val are both valid
   @param type (optional), supported types are  number, boolean, string, date, context, defaults to string
   **/
  "select": function(chunk, context, bodies, params) {
    var body = bodies.block;
    // key is required for processing, hence check for defined
    if( params && typeof params.key !== "undefined"){
      // returns given input as output, if the input is not a dust reference, else does a context lookup
      var key = dust.helpers.tap(params.key, chunk, context);
      // bodies['else'] is meaningless and is ignored
      if( body ) {
       return chunk.render(bodies.block, context.push({ isSelect: true, isResolved: false, selectKey: key }));
      }
      else {
       _log("Missing body block in the select helper ");
       return chunk;
      }
    }
    // no key
    else {
      _log("No key given in the select helper!");
    }
    return chunk;
  },

  /**
   eq helper compares the given key is same as the expected value
   It can be used standalone or in conjunction with select for multiple branching
   @param key,  The actual key to be compared ( optional when helper used in conjunction with select)
                either a string literal value or a dust reference
                a string literal value, is enclosed in double quotes, e.g. key="foo"
                a dust reference may or may not be enclosed in double quotes, e.g. key="{val}" and key=val are both valid
   @param value, The expected value to compare to, when helper is used standalone or in conjunction with select
   @param type (optional), supported types are  number, boolean, string, date, context, defaults to string
   Note : use type="number" when comparing numeric
   **/
  "eq": function(chunk, context, bodies, params) {
    if(params) {
      params.filterOpType = "eq";
      return filter(chunk, context, bodies, params, function(expected, actual) { return actual === expected; });
    }
    return chunk;
  },

  /**
   ne helper compares the given key is not the same as the expected value
   It can be used standalone or in conjunction with select for multiple branching
   @param key,  The actual key to be compared ( optional when helper used in conjunction with select)
                either a string literal value or a dust reference
                a string literal value, is enclosed in double quotes, e.g. key="foo"
                a dust reference may or may not be enclosed in double quotes, e.g. key="{val}" and key=val are both valid
   @param value, The expected value to compare to, when helper is used standalone or in conjunction with select
   @param type (optional), supported types are  number, boolean, string, date, context, defaults to string
   Note : use type="number" when comparing numeric
   **/
  "ne": function(chunk, context, bodies, params) {
    if(params) {
      params.filterOpType = "ne";
      return filter(chunk, context, bodies, params, function(expected, actual) { return actual !== expected; });
    }
    return chunk;
  },

  /**
   lt helper compares the given key is less than the expected value
   It can be used standalone or in conjunction with select for multiple branching
   @param key,  The actual key to be compared ( optional when helper used in conjunction with select)
                either a string literal value or a dust reference
                a string literal value, is enclosed in double quotes, e.g. key="foo"
                a dust reference may or may not be enclosed in double quotes, e.g. key="{val}" and key=val are both valid
   @param value, The expected value to compare to, when helper is used standalone  or in conjunction with select
   @param type (optional), supported types are  number, boolean, string, date, context, defaults to string
   Note : use type="number" when comparing numeric
   **/
  "lt": function(chunk, context, bodies, params) {
    if(params) {
      params.filterOpType = "lt";
      return filter(chunk, context, bodies, params, function(expected, actual) { return actual < expected; });
    }
    return chunk;
  },

  /**
   lte helper compares the given key is less or equal to the expected value
   It can be used standalone or in conjunction with select for multiple branching
   @param key,  The actual key to be compared ( optional when helper used in conjunction with select)
                either a string literal value or a dust reference
                a string literal value, is enclosed in double quotes, e.g. key="foo"
                a dust reference may or may not be enclosed in double quotes, e.g. key="{val}" and key=val are both valid
   @param value, The expected value to compare to, when helper is used standalone or in conjunction with select
   @param type (optional), supported types are  number, boolean, string, date, context, defaults to string
   Note : use type="number" when comparing numeric
  **/
  "lte": function(chunk, context, bodies, params) {
    if(params) {
      params.filterOpType = "lte";
      return filter(chunk, context, bodies, params, function(expected, actual) { return actual <= expected; });
    }
    return chunk;
  },


  /**
   gt helper compares the given key is greater than the expected value
   It can be used standalone or in conjunction with select for multiple branching
   @param key,  The actual key to be compared ( optional when helper used in conjunction with select)
                either a string literal value or a dust reference
                a string literal value, is enclosed in double quotes, e.g. key="foo"
                a dust reference may or may not be enclosed in double quotes, e.g. key="{val}" and key=val are both valid
   @param value, The expected value to compare to, when helper is used standalone  or in conjunction with select
   @param type (optional), supported types are  number, boolean, string, date, context, defaults to string
   Note : use type="number" when comparing numeric
   **/
  "gt": function(chunk, context, bodies, params) {
    // if no params do no go further
    if(params) {
      params.filterOpType = "gt";
      return filter(chunk, context, bodies, params, function(expected, actual) { return actual > expected; });
    }
    return chunk;
  },

 /**
   gte helper, compares the given key is greater than or equal to the expected value
   It can be used standalone or in conjunction with select for multiple branching
   @param key,  The actual key to be compared ( optional when helper used in conjunction with select)
                either a string literal value or a dust reference
                a string literal value, is enclosed in double quotes, e.g. key="foo"
                a dust reference may or may not be enclosed in double quotes, e.g. key="{val}" and key=val are both valid
   @param value, The expected value to compare to, when helper is used standalone or in conjunction with select
   @param type (optional), supported types are  number, boolean, string, date, context, defaults to string
   Note : use type="number" when comparing numeric
  **/
  "gte": function(chunk, context, bodies, params) {
     if(params) {
      params.filterOpType = "gte";
      return filter(chunk, context, bodies, params, function(expected, actual) { return actual >= expected; });
     }
    return chunk;
  },

  // to be used in conjunction with the select helper
  // TODO: fix the helper to do nothing when used standalone
  "default": function(chunk, context, bodies, params) {
    // does not require any params
     if(params) {
        params.filterOpType = "default";
      }
     return filter(chunk, context, bodies, params, function(expected, actual) { return true; });
  },

  /**
  * size helper prints the size of the given key
  * Note : size helper is self closing and does not support bodies
  * @param key, the element whose size is returned
  */
  "size": function( chunk, context, bodies, params ) {
    var key, value=0, nr, k;
    params = params || {};
    key = params.key;
    if (!key || key === true) { //undefined, null, "", 0
      value = 0;
    }
    else if(dust.isArray(key)) { //array
      value = key.length;
    }
    else if (!isNaN(parseFloat(key)) && isFinite(key)) { //numeric values
      value = key;
    }
    else if (typeof key  === "object") { //object test
      //objects, null and array all have typeof ojbect...
      //null and array are already tested so typeof is sufficient http://jsperf.com/isobject-tests
      nr = 0;
      for(k in key){
        if(Object.hasOwnProperty.call(key,k)){
          nr++;
        }
      }
      value = nr;
    } else {
      value = (key + '').length; //any other value (strings etc.)
    }
    return chunk.write(value);
  }


};

  for (var key in helpers) {
    dust.helpers[key] = helpers[key];
  }

  if(typeof exports !== 'undefined') {
    module.exports = dust;
  }

})(typeof exports !== 'undefined' ? require('dustjs-linkedin') : dust);

define("dust-helpers", ["dust"], function(){});



var extend = function extend(dust) {

    // Add new dust helpers in this style
    dust.helpers.link = function link(chunk, ctx, bodies, params) {
        'use strict';

        const hosts = require('../../js/hostutils');

        var href,
            host = ctx.getPath(false, ['context', 'pageInfo', 'hostName']),
            production,
            stage,
            sandbox,
            dev,
            cobrand,
            locale,
            pat,
            extension,
            type,
            str;

        // Get trailing part of url and extract extension, if any
        if (params) {
            if (params.href) {
                href = dust.helpers.tap(params.href, chunk, ctx);
                href = href.trim();
                pat = /\.[0-9a-z]{1,4}$/i;
                extension = href.match(pat);
            } else {
                return chunk.write(''); // if not href, generate empty output
            }
            if (params.type) {
                type = dust.helpers.tap(params.type, chunk, ctx);
                if (type === 'command') {
                    extension = ''; // Makes commands like xxx.do look like a command
                }
            }
            if (params.cobrand) {
                cobrand = dust.helpers.tap(params.cobrand, chunk, ctx);
            }
        }
        // Determine system type: internal=dev/stage, external=production/sandbox
        if (host) {
            if (host.indexOf('stage') >= 0 || (process && process.env && /stag/gi.test(process.env.DEPLOY_ENV))) {
                stage = true;
            } else if (host.indexOf('localhost.paypal.com') >= 0) {
                dev = true;
            } else if (host.indexOf('sandbox') >= 0) {
                sandbox = true;
            } else {
                production = true;
            }
        } else {
            host = hosts.cdn; // Assume external path if no host
        }

        // If no extension or it has a query string, assume this is a command url
        if (!extension || href.indexOf('?') >= 0) {
            if (href.charAt(0) === '/') {
                // Normally cobrand will not be defined. country holds the desired  value. Since
                // we are not supporting cobrand in urls, apps will not get cobrand automatically.
                // If an app requires cobrand in urls, it can define res.locals.context.locality.cobrand =
                // res.locals.context.locality.country. We will not advertise this unless an actual
                // requirement comes up.
                cobrand = cobrand || ctx.getPath(false, ['context', 'locality', 'cobrand']);
                if (cobrand) {
                    cobrand = cobrand.toLowerCase();
                    href = "/" + cobrand + href; // Prefix /cobrand to get server relative URL with cobrand
                }
            }
            return chunk.write(href);
        }

        // Has an extension so treat as resource url and need absolute url
        str = `https://${hosts.cdn}`;

        extension[0] = extension[0].toLowerCase();
        if (extension[0] === '.js' || extension[0] === '.css') {
            if (stage || sandbox) {
                if (host.indexOf(':') >= 0) {
                    host = host.substring(0, host.indexOf(':'));
                }
                str = 'https://' + host;
            }
            href = str + (href.charAt(0) !== '/' ? '/' + href : href);
            return chunk.write(href);
        }

        //Must be non-js, e.g. some object under webstatic like images
        str = `https://${hosts.cdn}/webstatic`;
        href = str + (href.charAt(0) !== '/' ? '/' + href : href);
        return chunk.write(href);
    };

    dust.helpers.provide = function provide(chunk, ctx, bodies, params) {
        'use strict';
        var resData,
            paramVals = {},
            k,
            localCtx = ctx,
            blockData,
            saveData = chunk.data;

        if (params) {
            localCtx = ctx.push(params); // make params available to all bodies
        }

        for (k in bodies) {
            if (k !== 'block') {
                chunk.data = [];
                try {
                    blockData = bodies[k](chunk, localCtx).data.join('');
                    resData = JSON.parse(blockData);
                } catch (e) {
                    resData = blockData; // not valid JSON so just return raw data
                } 
                paramVals[k] = resData;
            }
        }
        chunk.data = saveData;

        // combine block-defined params with any existing ones.
        // A block param overrides if the name duplicates regular param name
        return bodies.block(chunk, localCtx.push(paramVals));

    };

    dust.helpers['if'] = function (chunk, context, bodies, params) {
        var body = bodies.block,
            result,
            test,
            skip = bodies['else'];

        if (params) {
            if (params.test) {
                test = params.test;
                if (typeof test !== 'string') {
                    test = dust.helpers.tap(params.test, chunk, context);
                }
                var tokens = tokenize(test);
                try {
                    result = evaluate(tokens, test, context);
                } catch (e) {
                    console.log("Error:" + e);
                    return chunk;
                }
            } else if (params.cond) {
                var cond = dust.helpers.tap(params.cond, chunk, context);
                /*jshint evil:true */
                result = eval(cond);
            }
            // eval expressions with given dust references
            if (result) {
                if (body) {
                    return chunk.render(bodies.block, context);
                } else {
                    console.log("Missing body block in the if helper!");
                    return chunk;
                }
            }
            if (skip) {
                return chunk.render(bodies['else'], context);
            }
        }
        // no condition
        else {
            console.log("No condition given in the if helper!");
        }
        return chunk;
    };


    var regexHex = new RegExp('[0-9A-Fa-f]');

    // Token types
    var STR = 0,
        NUM = 1,
        OP = 2,
        NAME = 3,
        ERR = 4,
        END = 5;

    // Operator and grouping symbols
    var OROP = 0,
        ANDOP = 1,
        EQOP = 2,
        NEOP = 3,
        LTOP = 4,
        GTOP = 5,
        LEOP = 6,
        GEOP = 7,
        NOTOP = 8,
        LPARENOP = 9,
        RPARENOP = 10,
        LBRACKOP = 11,
        RBRACKOP = 12,
        ENDOP = 13;

    // Lookup table for operator number to string
    var OPS = ['||', '&&', '==', '!=', '<', '>', '<=', '>=', '!', '(', ')', '[', ']', 'end'];
    var actions = [or, and, eq, ne, lt, gt, le, ge, not];

    // Tokenizer symbols of interest
    var SPACE = 0x20,
        TAB = 0x09,
        EXCLAIM = 0x21,
        QUOTE = 0x22,
        DOLLAR = 0x24,
        AND = 0x26,
        APOS = 0x27,
        LPAREN = 0x28,
        RPAREN = 0x29,
        PLUS = 0x2b,
        MINUS = 0x2d,
        DOT = 0x2e,
        ZERO = 0x30,
        NINE = 0x39,
        LT = 0x3c,
        EQ = 0x3d,
        GT = 0x3e,
        A = 0x41,
        E = 0x45,
        X = 0x58,
        Z = 0x5a,
        LBRACK = 0x5b,
        BACKSLASH = 0x5c,
        RBRACK = 0x5d,
        USCORE = 0x5f,
        a = 0x61,
        e = 0x65,
        x = 0x78,
        z = 0x7a,
        OR = 0x7c;

    // Storage for a simple cache to hold the last TOK_CACHE_SIZE tokenized expressions.
    var TOK_CACHE_SIZE = 8; // Should be power of 2
    var tokCache = {};
    var tokCacheList = new Array(TOK_CACHE_SIZE),
        nextTokCacheEntry = 0;

    /*
     *  tokenize - Converts an input string to a tokenized expression form.
     *  @param input - String of expression
     *  @param d - Second character code.
     *  Returns - array of tokens
     */
    function tokenize(input) {
        'use strict';

        // Previous Op-Current Op allowed table
        var pocoOk = {
            "((": 1,
            "))": 1,
            "!!": 1,
            "<!": 1,
            ">!": 1,
            ">=!": 1,
            "<=!": 1,
            "==!": 1,
            "!=!": 1,
            "&&!": 1,
            "||!": 1,
            "]&&": 1,
            "]||": 1,
            "]>": 1,
            "]<": 1,
            "]<=": 1,
            "]>=": 1,
            "]==": 1,
            "]!=": 1,
            "].": 1,
            "[(": 1,
            "])": 1,
            ")&&": 1,
            ")||": 1,
            ")>": 1,
            ")<": 1,
            ")<=": 1,
            ")>=": 1,
            ")==": 1,
            ")!=": 1,
            ")!": 1,
            ")]": 1,
            "]]": 1,
            "&&(": 1,
            "||(": 1,
            ">'": 1,
            "<(": 1,
            "<=(": 1,
            ">=(": 1,
            "==(": 1,
            "!=(": 1,
            "!(": 1
        };

        var tokens = [],
            pos = 0,
            c, cc, posStart, chr, type, result, poco, po, num;

        if (tokCache[input]) {
            return tokCache[input];
        }

        while (pos < input.length) {
            posStart = pos;
            chr = input[pos];
            cc = input.charCodeAt(pos);

            // Handle whitespace
            if (cc === SPACE || cc === TAB) {
                pos++;
                // Handle character strings
            } else if (cc === QUOTE || cc === APOS) {
                type = STR;
                c = chr;
                // keep moving forward till the matching quote is found. if current char is a backslash, move one extra forward
                pos++;
                while (pos < input.length) {
                    if (input.charCodeAt(pos) === BACKSLASH) {
                        pos++;
                    }
                    c += input[pos];
                    if (input.charCodeAt(pos) === cc) {
                        break;
                    }
                    pos++;
                }
                if (c.charCodeAt(c.length - 1) !== cc) {
                    type = ERR;
                    c = '"Unclosed string constant"';
                }
                pushToken(tokens, type, c.slice(1, c.length - 1));
                pos++;
                // Handle numbers, decimal and hex
            } else if ((cc >= ZERO && cc <= NINE) || cc === MINUS || (cc === DOT && input.charCodeAt(pos + 1) >= ZERO && input.charCodeAt(pos + 1) <= NINE)) {
                // type = INT;
                if (cc === ZERO && input.charCodeAt(pos + 1) === x || input.charCodeAt(pos + 1) === X) {
                    // hex can not contain dots or exponents
                    while (++pos < input.length && regexHex.test(input[pos + 1])) {}
                    num = parseInt(input.slice(posStart, pos + 1), 16);
                    pushToken(tokens, NUM, num);
                } else {
                    if (cc !== DOT) { // first do integer part
                        pos = collectDigits(input, pos);
                        if (input.charCodeAt(pos + 1) === DOT) {
                            pos += 1; // skip dot. its not important
                        }
                    } else {
                        if (input.charCodeAt(pos + 1) === DOT) {
                            pushToken(tokens, ERR, 'Consecutive periods invalid' + input);
                            break;
                        }
                    }
                    // decimal part
                    pos = collectDigits(input, pos);
                    // exponent part
                    if (input.charCodeAt(pos + 1) === e || input.charCodeAt(pos + 1) === E) {
                        pos = collectExponent(input, pos);
                    }
                    num = parseFloat(input.slice(posStart, pos + 1));
                    pushToken(tokens, NUM, num);
                }
                pos++;
                // Handle operators and names
            } else {
                if (input.charCodeAt(pos) === DOT) {
                    pushToken(tokens, DOT, '.');
                    pos++;
                    continue;
                }
                result = testOperator(input.charCodeAt(pos), input.charCodeAt(pos + 1));
                if (result) {
                    type = OP;
                    pos = pos + result[1];
                    // Form previous operator (po), current operator (co) pair to check that these operators can be adjacent
                    poco = '';
                    if (tokens.length > 0) {
                        po = tokens[tokens.length - 1];
                        if (po.type === OP) {
                            poco = OPS[po.value] + OPS[result[0]];
                            if (!pocoOk[poco]) {
                                result[0] = "Invalid expression, consecutive operators " + poco + " in " + input;
                                result[2] = 0;
                                type = ERR;
                            }
                        }
                    }
                    // Push type=op, xxxOP, priority
                    pushToken(tokens, type, result[0], result[2]);
                } else {
                    // Assume it is an name or path part
                    c = '';
                    while (pos < input.length) {
                        if (isNameChar(input.charCodeAt(pos))) {
                            c = c + input[pos++];
                        } else {
                            pos--;
                            break; // end of match.
                        }
                    }
                    if (c.length) {
                        pushToken(tokens, NAME, c);
                        pos++;
                    } else {
                        pushToken(tokens, ERR, 'Invalid Expression near ' + input[pos] + input[pos + 1]);
                        return tokens;
                    }
                }
            }
        }
        var lastTok = tokens[tokens.length - 1];
        if (lastTok.type === OP && lastTok.value !== RPARENOP && lastTok.value !== RBRACKOP) {
            pushToken(tokens, ERR, 'Invalid expression, ended with an operator:' + input);
        }

        // Manage a simple cache to hold the last TOK_CACHE_SIZE tokenized expressions
        // to avoid re-tokenizing if reused frequently.  Each new tokenized entry discards
        // the oldest one from the list. LRU might be better but more complex. This will
        // handle loops with a few tests in them just fine. 
        if (!tokCache[input]) {
            tokCacheList[nextTokCacheEntry] = input;
            tokCache[input] = tokens;
            nextTokCacheEntry = (nextTokCacheEntry + 1) % TOK_CACHE_SIZE;
            if (tokCacheList[nextTokCacheEntry]) {
                delete tokCache[tokCacheList[nextTokCacheEntry]];
            }
        }
        return tokens;
    }

    function pushToken(tokens, type, value, priority) {
        'use strict';
        tokens.push({
            type: type,
            value: value,
            priority: priority
        });
    }

    /*
     *  isNameChar - Returns true if c is a valid character in a name.
     * Note that this is overly restrictive with respect to what JavaScript
     * will accept as a name but is faster than checking for all Unicode
     * values allowed in names.
     *  @param c - charCodeAt value of character
     *
     *  Returns - true if name character and false otherwise
     */
    function isNameChar(c) {
        'use strict';

        if (c >= a && c <= z) {
            return true;
        }
        if (c >= A && c <= Z) {
            return true;
        }
        if (c >= ZERO && c <= NINE) {
            return true;
        }
        if (c === USCORE) {
            return true;
        }
        if (c === DOLLAR) {
            return true;
        }
    }

    /*
     *  testOperator - Given two consecutive charCodeAt values, detemine if they are an operator
     *  @param c - First character code.
     *  @param d - Second character code.
     *
     *  Using charCodeAt and integer tests everywhere cuts time almost in half
     *  over using regex and string compares/
     *  Returns - array [operatorCode, operator length, priority] or undefined
     */
    function testOperator(c, d) {
        'use strict';

        if (c === EQ && d === EQ) {
            return [EQOP, 2, 30];
        }
        if (c === EXCLAIM) {
            if (d === EQ) {
                return [NEOP, 2, 30];
            }
            return [NOTOP, 1, 50];
        }
        if (c === LT) {
            if (d === EQ) {
                return [LEOP, 2, 40];
            }
            return [LTOP, 1, 40];
        }
        if (c === GT) {
            if (d === EQ) {
                return [GEOP, 2, 40];
            }
            return [GTOP, 1, 40];
        }

        if (c === AND && d === AND) {
            return [ANDOP, 2, 20];
        }
        if (c === OR && d === OR) {
            return [OROP, 2, 10];
        }

        if (c === LBRACK) {
            return [LBRACKOP, 1, 5];
        }
        if (c === RBRACK) {
            return [RBRACKOP, 1, 0];
        }
        if (c === LPAREN) {
            return [LPARENOP, 1, 5];
        }
        if (c === RPAREN) {
            return [RPARENOP, 1, 0];
        }
    }

    // Startng at pos +1, advance pos until non-digit is found. 
    // pos is returned pointing to last digit.
    function collectDigits(input, pos) {
        'use strict';
        while (pos < input.length && input.charCodeAt(pos + 1) >= ZERO && input.charCodeAt(pos + 1) <= NINE) {
            pos += 1;
        }
        return pos;
    }

    function collectExponent(input, pos) {
        'use strict';
        // optional prefix, may also be (a useless) plus sign
        if (input.charCodeAt(++pos + 1) === PLUS || input.charCodeAt(pos + 1) === MINUS) {
            pos += 1;
        }
        pos = collectDigits(input, pos);
        return pos;
    }

    /*
     *  evaluate - Interpret the token string to get a result
     *  @param toks - token string from tokenize
     *  @param expr - string form of the expression
     *  @param ctx - dust context for obtaining values for names and paths
     *
     *  Returns - value of the expression
     */
    function evaluate(toks, expr, ctx) {
        'use strict';

        var opstk = [],
            opndstk = [],
            nameParts = [],
            tok,
            i = 0;

        // Main loop of expression interpreter
        while (i < toks.length) {
            tok = toks[i];

            // Collect name or path, get value from context and stack it
            if (tok.type === NAME || (tok.type === DOT)) {
                i = collectName(toks, i, ctx, expr, nameParts);
                opndstk.push(getPathValue(nameParts, ctx));
                nameParts.length = 0;
                continue;
            }
            i++;
            if (tok.type === OP) {
                evalOperator(opstk, opndstk, tok, ctx);
            } else if (tok.type === NUM) {
                opndstk.push(tok.value);
            } else if (tok.type === STR) {
                opndstk.push(tok.value);
            } else if (tok.type === ERR) {
                opstk.length = 0;
                opndstk.length = 0;
                throw tok.value;
            }
        }

        // Process the residue, if any, on the operator/operand stacks
        while (opstk.length > 0) {
            tok = opstk[opstk.length - 1];
            // Diagnose leftover operator with no operands
            if (opstk.length >= 1 && opndstk.length === 0) {
                throw 'Invalid expression - too few operands:' + expr;
            }
            if (tok.value === RPARENOP || tok.value === LPARENOP) {
                // if (tok.value === ')' || tok.value === '(') {
                throw 'Unbalanced parentheses: ' + expr;
            }
            if (tok.value === RBRACKOP || tok.value === LBRACKOP) {
                throw 'Unbalanced brackets:' + expr;
            }

            // Flush the remaining operator/operands by sending a special end operator
            evalOperator(opstk, opndstk, {
                type: END,
                value: ENDOP,
                priority: -9999
            }, ctx);
        }
        if (opndstk.length > 1) {
            throw "Invalid expression - excess operands:" + expr;
        }
        return opndstk.pop();
    }

    /*
     *  collectName - Given the token stream and a starting postion i, collect a name or path.
     *  @param toks - The list of tokens.
     *  @param i - The starting position of a name part. Can be a leading period.
     *  @param ctx - The dust context holding values.
     *  @param expr - Text of the expression for diagnostic use.
     *  @param nameParts - Array for collecting the parts of the name
     *  Returns - new value of i after the end of the scanned name
     */
    function collectName(toks, i, ctx, expr, nameParts) {
        'use strict';

        var tok, lastTokenDot;
        // Mark name as anchored path
        if (toks[i].type === DOT) {
            nameParts.push('');
            // nameParts.push(toks[i].value);
            i++;
            lastTokenDot = true;
        }
        while (i < toks.length) {
            tok = toks[i];
            i++;
            if (tok.type === NAME) {
                nameParts.push(tok.value);
                lastTokenDot = false;
            } else if (tok.type === DOT) {
                if (lastTokenDot) {
                    throw 'Consecutive dots in paths are invalid' + expr;
                }
                lastTokenDot = true;
            } else if (tok.type === OP && tok.value === LBRACKOP) {
                i = evaluateSubscript(toks, i, expr, ctx, nameParts);
                lastTokenDot = false;
            } else {
                if (lastTokenDot && nameParts.length > 1) {
                    throw 'Path ending with . is invalid - ' + expr;
                }
                return i - 1; // end of name part -- hit something else
            }
        }
        if (lastTokenDot) {
            throw 'Path ending with . is invalid: ' + expr;
        }
        return i;
    }

    /*
     *  evaluateSubscript - Compute the value of a subscript part of path
     *  @param toks - token list
     *  @param i - position of subscript start in the token list
     *  @param expr - string form of the overall expression
     *  @param ctx - dust context for obtaining values for names and paths
     *
     *  Returns - updated position for i after processing the subscript
     */
    function evaluateSubscript(toks, i, expr, ctx, nameParts) {
        'use strict';

        var bracketCount = 1,
            endPos = i,
            subVal;

        while (endPos++) {
            if (endPos >= toks.length) {
                throw 'Unbalanced subscript brackets:' + expr;
            } else if (toks[endPos].value === LBRACKOP) {
                bracketCount++;
            } else if (toks[endPos].value === RBRACKOP) {
                bracketCount--;
            }
            if (bracketCount === 0) {
                subVal = evaluate(toks.slice(i, endPos), expr, ctx);
                nameParts.push(subVal);
                return endPos + 1;
            }
        }
    }

    // Called when we have operator token. 
    /*
     *  evalOperator - Evaluates the operator passed in tok.
     *  Will either evaluate the operator consuming its operands
     *  or push it for later if it's priority requires.
     *
     *  @param opstk - operator stack holding unprocessed operators
     *  @param opndstk - operand stack holding unprocessed operands
     *  @param tok - token holding the operator to process
     *
     */
    function evalOperator(opstk, opndstk, tok) {
        'use strict';

        var top, op, action, leftVal, rightVal, priority;

        priority = tok.priority;
        // Check priorities if there are ops on the stack
        if (opstk.length > 0) {

            // Just push open paren, bracket and unary !
            if (tok.value === LPARENOP || tok.value === LBRACKOP || tok.value === NOTOP) {
                opstk.push(tok);
                return;
            }
            top = opstk[opstk.length - 1];
            // Priority <= top of op stack. Evaluate with it's operands and push result
            while (top && priority <= top.priority) {

                if (tok.value === RPARENOP && top.value === LPARENOP) {
                    opstk.pop(); // remove opening paren from op stack
                    return; // parens matched. All done
                }
                action = actions[top.value];
                if (!action) {
                    throw 'Invalid expression format';
                }

                //if (priority <= ops[top.value]) {
                op = opstk.pop(); // discard as just evaluated
                top = opstk[opstk.length - 1];
                rightVal = opndstk.pop();
                // if unary operator, only pop one operand
                if (op.value === NOTOP) {
                    leftVal = rightVal;
                } else {
                    leftVal = opndstk.pop();
                }
                opndstk.push(action(leftVal, rightVal));
            }
        }
        if (tok.type !== END) {
            opstk.push(tok);
        }
    }

    /*
     *  getPathValue - Given a name or path, return the value from the context.
     *  @param path - Array of names and values describing the path. May have
     *                a leading period if the path search is anchored.
     *  Return - value from the context based on the path.
     */
    function getPathValue(path, ctx) {
        'use strict';

        if (path.length === 1 && path[0].length !== 0) {
            return ctx.get(path[0]);
        }
        // anchor = false;
        if (path[0].length === 0) {
            return ctx.getPath(true, path.slice(1));
        }
        return ctx.getPath(false, path);
    }

    // Operator functions for evaluations

    function lt(a, b) {
        return a < b;
    }

    function gt(a, b) {
        return a > b;
    }

    function le(a, b) {
        return a <= b;
    }

    function ge(a, b) {
        return a >= b;
    }

    function eq(a, b) {
        return a === b;
    }

    function ne(a, b) {
        return a !== b;
    }

    function and(a, b) {
        return a && b;
    }

    function or(a, b) {
        return a || b;
    }

    function not(a) {
        return !a;
    }

};

if (typeof exports !== 'undefined') {
    module.exports = extend;
} else {
    /* global dust: true */
    extend(dust);
}
;
define("dust-helpers-supplement", ["dust","dust-helpers"], function(){});

/*
 * nougat.js v0.0.1 - Application Mediator/Sandbox Library
 * This module performs the function of mediator/sandbox.
 *
 * @author Erik Toth <ertoth@paypal.com>
 */

/*global define:false, requirejs:true */
/*jslint plusplus:true, nomen:true */
/*eslint no-unused-vars:0, new-cap:0 */

define('nougat',['jquery', 'dust', 'dust-helpers-supplement'], function ($, dust) {

	'use strict';

	var ViewRenderer = null,
	    DustRenderer = null,
	    Nougat = null;

	/**
  * Executes a provided function once per array element or object property.
  * Based on http://es5.github.com/#x15.4.4.18
  * @param {Object} obj the array or object to enumerate
  * @param {Function} fn the function to invoke on each element
  * @param {Object} [context] Object to use as this when executing callback.
  */
	function forEach(obj, fn, context) {
		if (obj instanceof Array && Array.prototype.forEach) {
			return obj.forEach(fn, context);
		}

		var object = Object(obj),
		    prop = null,
		    result = null;

		for (prop in object) {
			if (object.hasOwnProperty(prop)) {
				result = fn.call(context, object[prop], prop, object);
				// Provide the ability to short circuit and fail-fast
				if (result === false) {
					break;
				}
			}
		}
	}

	/**
  * A basic object mixin implementation. Copies the properties from the source
  * object to the destination object.
  * @param {Object} src the object containing the properties to be copied
  * @param {Object} dest the object to which the properties should be copied
  */
	function mixin(src, dest) {
		var prop = null;
		for (prop in src) {
			if (src.hasOwnProperty(prop)) {
				dest[prop] = src[prop];
			}
		}
		return dest;
	}

	/**
  * A simple object extend implementation that copies properties from several
  * source objects into the destination object.
  * @param {Object} dest the object to which the properties should be copied
  * @param {Object...} sources the objects from which the properties should be copied
  */
	function extend(dest) {
		forEach(Array.prototype.slice.call(arguments, 1), function (src) {
			mixin(src, dest);
		});
		return dest;
	}

	/**
  * An abstract view renderer implementation that's based on Promises
  * @constructor
  */
	ViewRenderer = function ViewRenderer() {
		// Intentionally left blank
	};

	ViewRenderer.prototype = {

		/**
   * The main public API for rendering a template
   * @param template the name of the template to render
   * @param context the context to pass to the renderer
   * @returns a Promise
   */
		render: function render(template, context) {
			var deferred = new $.Deferred();
			this._doRender(template, context, function (error, out) {
				if (error) {
					return deferred.reject(error);
				}
				deferred.resolve(out, template);
			});
			return deferred.promise();
		},

		/**
   * The method to override to provide the view rendering implementation
   * @private
   * @param template the name of the template to render
   * @param context the content to pass to the renderer
   * @param callback the callback invoked when rendering is complete
   */
		_doRender: function _doRender(template, context, callback) {
			// TODO: Implement
		}
	};

	/**
  * A Dust view rendering implementation
  * @constructor
  */
	DustRenderer = function DustRenderer(nougat) {
		var DEFAULT_PATH = '/templates/%s.js';

		dust.onLoad = function (name, callback) {
			var path = nougat.getContext().templatePath || DEFAULT_PATH,
			    template = path.replace('%s', name);
			//alert('nougat :: template ' + template);
			require([template], function () {
				// Merely using requireJs to the load compiled template so undefining
				// it as soon as it's loaded so doesn't sit in the requireJs *and* dust.js
				// caches. Also, we know it's JS, thus doesn't need to be compiled so
				// callback has no arguments.
				requirejs.undef(template);
				setTimeout(callback, 0);
			});
		};
	};

	DustRenderer.prototype = extend(ViewRenderer.prototype, {
		_doRender: function _doRender(template, context, callback) {
			var base = {};
			context = context || {};

			// Ugh.
			if (context.content) {
				base.cn = context.content;
				delete context.content;
			}

			context = dust.makeBase(base).push(context);
			dust.render(template, context, callback);
		}
	});

	Nougat = function Nougat() {
		this._context = {};
		this._eventCache = {};
		this.viewRenderer = new DustRenderer(this);
	};

	Nougat.prototype = {

		/**
   * Sets the context
   * @param context
   * @returns the context
   */
		setContext: function setContext(context) {
			return mixin(context, this._context);
		},

		/**
   *
   * @returns the current context object
   */
		getContext: function getContext() {
			return this._context;
		},

		/**
   *
   * @returns the template path directory excluding language
   */
		getTemplateBasePath: function getTemplateBasePath() {
			var context = this.getContext(),
			    oldPath = context.templatePath,
			    fileType = '/%s.js',

			// templates are either on /templates/{country} or paypalobjects.com/{md5hash}/{country}
			pathLength = oldPath.lastIndexOf('/', oldPath.length - fileType.length - 1),
			    templateDirectory = oldPath.substring(0, pathLength) + '/';

			return templateDirectory;
		}

	};

	return new Nougat();
});

/*eslint no-unused-vars:0 */
/**
 * Abstract view which enables rendering contents with a template.
 */
define('BaseView',['nougat', 'underscore', 'backbone'], function (nougat, _, Backbone) {

	'use strict';

	return Backbone.View.extend({

		/**
   * The name of the template that represents this view.
   * Must be defined for render to succeed.
   */
		template: null,

		/**
   * A default implementation of the standard Backbone render method.
   * Handles rendering a template with the current view model.
   * @returns the current view instance
   */
		render: function render() {
			var renderer = nougat.viewRenderer,
			    data,
			    template;

			_.bindAll(this, '_doRender', 'renderError', 'afterRender');

			this.beforeRender();

			data = this.serialize();

			if (typeof this.template === 'function') {
				template = this.template();
			} else {
				template = this.template;
			}

			//alert('Template : ' + template);

			renderer.render(template, data).done(this._doRender).fail(this.renderError).always(this.afterRender);

			return this;
		},

		/**
   * 'Protected' implementation of what to do with template render result.
   * Override to get access to raw content string.
   * @param {String} content the rendered template string
   * @param {String} template the name of this template
   */
		_doRender: function _doRender(content, template) {
			this.$el.html(content);
		},

		/**
   * A handler to be invoked prior to a template being rendered
   * @optional
   */
		beforeRender: function beforeRender() {
			// TODO: [optional] override
		},

		/**
   * A handler to be invoked once template rendering is complete.
   */
		afterRender: function afterRender() {
			// TODO: [optional] override
		},

		/**
   * The error handler for template rendering
   * @param {Error} err the error that occurred
   */
		renderError: function renderError() {
			// TODO: [optional] override
		},

		/**
   * Gets the current model or collection in JSON form.
   * @returns
   */
		serialize: function serialize() {
			var data = this.model || this.collection;
			if (data && data.toJSON) {
				return data.toJSON();
			}
			return {};
		},

		/**
   * Toggle the loading spinner
   * Adds the hasSpinner class to the view's $el
   * @param isLoading - boolean true or false
   * @return this - the view
   */
		toggleLoading: function toggleLoading(isLoading) {
			this.$el.toggleClass('hasSpinner', isLoading);
			return this;
		},

		showLoading: function showLoading() {
			return this.toggleLoading(true);
		},

		hideLoading: function hideLoading() {
			return this.toggleLoading(false);
		}
	});
});

/*global define:true, s:true, fpti:true, PAYPAL:true */
/*eslint no-undefined:0 */

/**
 * @fileOverview Analytics – link and error tracking
 * @name Analytics Widget
 * @author dquock
 */
define('widgets/analytics',['jquery', 'require', 'backbone', 'BaseView', 'core/error'], function ($, require, Backbone, BaseView, error) {

	'use strict';

	var View = BaseView.extend({

		el: 'body',

		events: {
			// track a link with data-pagename
			'click [data-pagename]': 'trackLink'
		},

		initialize: function initialize() {
			// used to track an input button when successfully submitting forms
			this.listenTo(Backbone, 'trackLink', this.trackLink);

			// used to track a link on the same page
			this.listenTo(Backbone, 'trackLinkName', this.trackLinkName);

			// used to track an error
			this.listenTo(Backbone, 'trackError', this.trackError);
		},

		/**
   * Set FPTI/SC variables and fire tracking beacons
   * @param prop Prop value to record
   * @param isLink whether to record it as an link click or a page transition
   */
		fireBeacon: function fireBeacon(prop, isLink) {
			try {
				// instantiate analytics for FPTI
				if (!this.analytics) {
					this.analytics = new PAYPAL.analytics.Analytics();
				}

				s.prop7 = $('#settings').data("accountType");
				s.prop6 = $('#settings').data('account') ? $('#settings').data('account').encryptedAccountNumber : "";
				s.prop10 = $('#settings').data('country');

				if (isLink) {
					// micro/link tracking
					s.tl(true, 'o', prop);
					// fpti beacon
					this.analytics.recordClick();
				} else {
					// fire page-level link tracking event
					s.t();
					// fpti beacon
					this.analytics.recordImpression();
				}
			} catch (err) {
				var baseUrl = '/businessprofile/';
				error.log(baseUrl + 'error', 'analytics error', fpti.page, '', '', err);
			}
		},

		/**
   * Set FPTI/SC variables and fire tracking beacons
   * @param linkName
   * @param pageName
   * @param pageName2
   * @param trackType
   * @param transactionDetailsLinks
   */
		track: function track(linkName, pageName, pageName2, trackType, transactionDetailsLinks) {
			// set linkname
			fpti.link = s.prop26 = linkName;

			// set pageNames
			fpti.page = s.prop25 = s.eVar25 = pageName2;
			fpti.pgln = s.prop27 = s.pageName + '|' + s.prop26;
			fpti.pgrp = s.pageName = pageName;

			fpti.tmpl = "bizprofilenodeweb/public/templates/settings/index.dust";

			// clear out error props, in case they exist
			fpti.erpg = s.prop14 = undefined; // error message
			fpti.erfd = s.prop15 = undefined; // form field with error (field1|field2|field3)
			fpti.eccd = s.prop29 = undefined; // error code

			if (fpti.tajst) {
				delete fpti.tajst;
			}
			if (fpti.tajnd) {
				delete fpti.tajnd;
			}

			if (transactionDetailsLinks) {
				// prop28 is the sc var for transaction details links when
				// selecting a transaction (link1|link2|link3)
				s.prop28 = transactionDetailsLinks;
			}

			switch (trackType) {
				case 'link':
					this.fireBeacon(s.prop26, true);
					break;
				default:
					this.fireBeacon();
					break;
			}

			// set attrs for automation
			$('#analytics').attr('data-pagename', pageName).attr('data-c25', pageName2).attr('data-c27', s.prop27).attr('data-c28', s.prop28).attr('data-v56', s.eVar56);
		},

		/**
   * Link tracking
   * @param event - click event || the clicked jQuery object of the input used to submit a form
   * if event isn't defined or is null, explicitly specify params
   * @param linkName name attribute
   * @param pageName data-pagename the link is going to
   * @param pageName2 data-pagename2 the link is going to
   * @param trackType page-level or not
   * @param transactionDetailsLinks activity transaction details links
   */
		trackLink: function trackLink(event, linkName, pageName, pageName2, trackType, transactionDetailsLinks) {
			var target, $link;

			if (s && fpti) {
				if (event) {
					target = event.currentTarget;
					$link = target ? $(target) : event;
					linkName = $link.attr('name') || $link && $link.html();
					pageName = $link.data('pagename') || s.pageName;
					pageName2 = $link.data('pagename2');
					trackType = $link.data('track-type');
					transactionDetailsLinks = $link.data('transactiondetailslinks');
				}

				this.track(linkName, pageName, pageName2 || pageName + ':::', trackType, transactionDetailsLinks);
			}
		},

		/**
   *	Tracks link on a page
   *	keeps the pagenames the same, but tracks the link
   *	@param linkName linkName to track
   */
		trackLinkName: function trackLinkName(linkName) {
			if (s && fpti) {
				// set linkname
				fpti.link = s.prop26 = linkName;
				fpti.pgln = s.prop27 = s.pageName + '|' + s.prop26;

				// clear out error props, in case they exist
				fpti.erpg = s.prop14 = undefined; // error message
				fpti.erfd = s.prop15 = undefined; // form field with error (field1|field2|field3)
				fpti.eccd = s.prop29 = undefined; // error code

				if (fpti.tajst) {
					delete fpti.tajst;
				}
				if (fpti.tajnd) {
					delete fpti.tajnd;
				}

				this.fireBeacon(s.prop26, true);

				// set attr for automation
				$('#analytics').attr('data-c27', s.prop27);
			}
		},

		/**
   *	Tracks errors
   *	@param error The object containing the props to set
   */
		trackError: function trackError(error) {
			if (s && fpti) {
				// set error props
				fpti.erpg = s.prop14 = error.message; // error message
				fpti.erfd = s.prop15 = error.fieldId; // form field with error (field1|field2|field3)
				fpti.eccd = s.prop29 = error.code; // error code

				if (fpti.tajst) {
					delete fpti.tajst;
				}
				if (fpti.tajnd) {
					delete fpti.tajnd;
				}

				this.fireBeacon();

				// set attrs for automation
				$('#analytics').attr('data-pagename', s.pageName).attr('data-c25', s.prop25).attr('data-c27', s.prop27);
			}
		}
	}),
	    Analytics = {
		view: null, // to be instantiated in initialize
		/**
   *	Initialize Analytics
   */
		initialize: function initialize() {
			var prevPage = typeof s !== 'undefined' && typeof s.prop27 !== 'undefined' ? s.prop27 : '';

			// instantiate the view
			this.view = new View();

			// instantiate analytics for FPTI
			//if (typeof PAYPAL !== 'undefined' && typeof PAYPAL.analytics !== 'undefined') {
			//	this.view.analytics = new PAYPAL.analytics.Analytics();
			//}
			this.initAnalyticsIfNotSet();

			// initialize prop27 = previous pagename|linkname
			$('#analytics').attr('data-c27', prevPage);

			// can access FPTI performance info from PAYPAL.analytics.perf
			// https://dev.paypal.com/wiki/General/FPTI-PerformanceTracking
		},
		initAnalyticsIfNotSet: function initAnalyticsIfNotSet() {
			if (!this.view.analytics && typeof PAYPAL !== 'undefined' && typeof PAYPAL.analytics !== 'undefined') {
				this.view.analytics = new PAYPAL.analytics.Analytics();
			}
		},

		startModuleLoadTimer: function startModuleLoadTimer() {
			this.initAnalyticsIfNotSet();
			this.view.analytics.recordAjaxStartTime();
		},

		recordModuleLoadTime: function recordModuleLoadTime(sys, fptiPage, data) {
			if (sys) {
				this.initAnalyticsIfNotSet();
				var analyticsInstance = this.view.analytics,
				    fptiData = analyticsInstance.utils.queryStringToObject(sys.tracking.fpti.dataString);
				fptiData.page = fptiPage;
				fptiData.e = "im";

				if (data.serviceError) {
					fptiData.erpg = this.hawk_service_timeout_error;
					fptiData.eccd = data.serviceError;
				}

				sys.tracking.fpti.dataString = $.param(fptiData);
				analyticsInstance.recordAjaxPerformanceData({ sys: sys }); //fpti call with module load times
				this.clearFptiValues();
			}
		},

		recordLoadTime: function recordLoadTime(fptidata) {
			if (fpti) {

				this.initAnalyticsIfNotSet();
				$.each(fptidata, function (key, value) {
					fpti[key] = value;
				});
				//this.view.analytics.recordClick();
				this.view.analytics.recordImpression();
				this.clearFptiValues();
			}
		},

		recordImpression: function recordImpression(props) {
			if (fpti) {
				this.initAnalyticsIfNotSet();
				$.each(props, function (key, value) {
					fpti[key] = value;
				});
				this.view.analytics.recordImpression();
				this.clearFptiValues();
			}
		},
		recordClick: function recordClick(props) {
			if (fpti) {
				this.initAnalyticsIfNotSet();
				$.each(props, function (key, value) {
					fpti[key] = value;
				});
				this.view.analytics.recordClick();
				this.clearFptiValues();
			}
		},

		clearFptiValues: function clearFptiValues() {
			if (fpti) {
				delete fpti.tajst;
				delete fpti.tajnd;
			}
		}
	};

	return Analytics;
});

define('constants',[], function () {

	'use strict';

	return {
		ROOT: '/businessprofile/',
		PASSWORD_MIN_LENGTH: 8,
		PASSWORD_MAX_LENGTH: 20,
		PASSWORD_REQUIRED_SPECIAL_CHAR_OR_NUMBER: /[0-9\-!@#$%\^&*()_+|~=`{}\[\]:";'<>?,.\/\\]/,
		PASSWORD_UPPER_LOWER_CASE_REGEX: /^(?=.*[a-z])(?=.*[A-Z]).{1,21}$/,
		PASSWORD_VALIDATIONS: {
			"errorValidators": [{
				"type": "regexp",
				"regexp": /(.)\1{3}/i,
				"errorMsgKey": "PASSWORD_REPEAT_ERROR"
			}, {
				"type": "regexp",
				"regexp": /0123|1234|2345|3456|4567|5678|6789|7890|8901|9012/,
				"errorMsgKey": "PASSWORD_CONSECUTIVE_NUM_ERROR"
			}, {
				"type": "regexp",
				"regexp": /qwer|wert|erty|rtyu|tyui|yuio|uiop|asdf|sdfg|dfgh|fghj|ghjk|hjkl|zxcv|xcvb|cvbn|vbnm|QWER|WERT|ERTY|RTYU|TYUI|YUIO|UIOP|ASDF|SDFG|DFGH|FGHJ|GHJK|HJKL|ZXCV|XCVB|CVBN|VBNM/,
				"errorMsgKey": "PASSWORD_KEY_SEQUENCE_ERROR"
			}, {
				"type": "regexp",
				"regexp": /\s/i,
				"errorMsgKey": "PASSWORD_SPACE_ERROR"
			}, {
				"type": "regexp",
				"regexp": /access14|americanidol|baseball|baseball1|bigdaddy|blink182|butthead|cocacola|computer|corvette|cowboys|danielle|dolphins|einstein|firebird|football|football1|iloveyou|iloveyou1|internet|jennifer|jordan23|liverpool|liverpool1|marlboro|maverick|melanie|michelle|midnight|mistress|mountain|myspace1|password|password1|princess1|qwertyui|redwings|rush2112|samantha|scorpion|slipknot1|srinivas|startrek|starwars|sunshine|superman|superman1|swimming|trustno1|victoria|whatever|passwort|passwort1|frankfurt|fussball/i,
				"errorMsgKey": "PASSWORD_EASY_ERROR"
			}]
		}
	};
});

// backbone-subroute.js v0.4.1
//
// Copyright (C) 2012 Dave Cadwallader, Model N, Inc.  
// Distributed under the MIT License
//
// Documentation and full license available at:
// https://github.com/ModelN/backbone.subroute

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // Register as an AMD module if available...
        define('backboneSubroute',['underscore', 'backbone'], factory);
    } else {
        // Browser globals for the unenlightened...
        factory(_, Backbone);
    }
}(function(_, Backbone){

    Backbone.SubRoute = Backbone.Router.extend( {
        constructor:function ( prefix, options ) {

            // each subroute instance should have its own routes hash
            this.routes = _.clone(this.routes);

            // Prefix is optional, set to empty string if not passed
            this.prefix = prefix = prefix || "";

            // SubRoute instances may be instantiated using a prefix with or without a trailing slash.
            // If the prefix does *not* have a trailing slash, we need to insert a slash as a separator
            // between the prefix and the sub-route path for each route that we register with Backbone.        
            this.separator = ( prefix.slice( -1 ) === "/" ) ? "" : "/";

            // if you want to match "books" and "books/" without creating separate routes, set this
            // option to "true" and the sub-router will automatically create those routes for you.
            this.createTrailingSlashRoutes = options && options.createTrailingSlashRoutes;

            // Required to have Backbone set up routes
            Backbone.Router.prototype.constructor.call( this, options );

            // grab the full URL
            var hash;
            if (Backbone.history.fragment) {
                hash = Backbone.history.getFragment();
            } else {
                hash = Backbone.history.getHash();
            }

            // Trigger the subroute immediately.  this supports the case where 
            // a user directly navigates to a URL with a subroute on the first page load.
            // Check every element, if one matches, break. Prevent multiple matches
            _.every(this.routes, function(key, route){
                // Use the Backbone parser to turn route into regex for matching
                if(hash.match(Backbone.Router.prototype._routeToRegExp(route))) {
                    Backbone.history.loadUrl(hash);
                    return false;
                }
                return true;
            }, this);

            if (this.postInitialize) {
                this.postInitialize(options);
            }
        },
        navigate:function ( route, options ) {
            if ( route.substr( 0, 1 ) != '/' &&
                    route.indexOf( this.prefix.substr( 0, this.prefix.length - 1 ) ) !== 0 ) {

                route = this.prefix +
                        ( route ? this.separator : "") +
                        route;
            }
            Backbone.Router.prototype.navigate.call( this, route, options );
        },
        route : function (route, name, callback) {
            // strip off any leading slashes in the sub-route path, 
            // since we already handle inserting them when needed.
            if (route.substr(0) === "/") {
                route = route.substr(1, route.length);
            }

            var _route = this.prefix;
            if (route && route.length > 0)
                _route += (this.separator + route);

            if (this.createTrailingSlashRoutes) {
                this.routes[_route + '/'] = name;
                Backbone.Router.prototype.route.call(this, _route + '/', name, callback);
            }

            // remove the un-prefixed route from our routes hash
            delete this.routes[route];

            // add the prefixed-route.  note that this routes hash is just provided 
            // for informational and debugging purposes and is not used by the actual routing code.
            this.routes[_route] = name;

            // delegate the creation of the properly-prefixed route to Backbone
            return Backbone.Router.prototype.route.call(this, _route, name, callback);
        }
    } );
    return Backbone.SubRoute;
}));

/**
 * WURFL module
 * @author Tim Sullivan
 *
 */
define('lib/wurfl',[], function () {
	'use strict';

	var isWireless = document.body.getAttribute('data-iswireless') === 'true',
		isTablet = document.body.getAttribute('data-istablet') === 'true',
		isSmartphone = isWireless && !isTablet;

	return {
		isWireless: isWireless,
		isTablet: isTablet,
		isSmartphone: isSmartphone
	};
});

/**
 * Overpanel view. This is a full-screen replacement of modals. Subviews render inside the overpanel.
 */

define('widgets/theoverpanel',['jquery', 'underscore', 'BaseView', 'backbone'], function ($, _, BaseView, Backbone) {

	'use strict';

	var Overpanel = BaseView.extend({

		el: '#overpanel',

		events: {
			'click .close': 'abortOverpanel',

			'focus': 'setTabables',

			// after animation ends, focus on or hide the overpanel
			'animationend': 'animationEnd',
			'webkitAnimationEnd': 'animationEnd',
			'oAnimationEnd': 'animationEnd',
			'MSAnimationEnd': 'animationEnd'
		},

		/**
   * Initialize the overpanel
   */
		initialize: function initialize() {
			this.$body = $('body');

			this.canUseEsc = true;
			this.isOpen = false;

			// set pusher that pushed the state
			this.listenTo(Backbone, 'pushedState', this.setPusher);

			// trigger toggleLoading event if in an overpanel instead of using BaseView's
			this.listenTo(Backbone, 'toggleLoading', this.toggleLoading);

			this.listenTo(Backbone, 'overpanel:hide', this.hideOverpanel);
		},

		/**
   * Call the subview's beforeRender before the overpanel is rendered and shown
   */
		beforeRender: function beforeRender() {
			this.view.beforeRender();
		},

		/**
   * Call the subview's afterRender after the overpanel is rendered and show the overpanel
   */
		afterRender: function afterRender() {
			this.view.afterRender();
			this.showOverpanel();
		},

		/**
   * Sets the pusher that changed the route
   * @param $pusher the target that pushed the route
   */
		setPusher: function setPusher($pusher) {
			this.$pusher = $pusher;
		},

		/**
   * Toggle the loading spinner
   * Adds the hasSpinner class to the overpanel view's $el
   * Overrides BaseView
   * @param loading - boolean true or false
   * @return this - the view
   */
		toggleLoading: function toggleLoading(loading) {
			// if the overpanel is open and loading, don't listen to esc,
			// but turn on listening to esc after loading
			if (this.isOpen) {
				this.shouldListenToEsc(!loading);
			}

			this.$el.toggleClass('hasSpinner', loading);

			return this;
		},

		/**
   * Return if an overpanel exists
   * @returns {boolean} exists
   */
		exists: function exists() {
			return this.$el.length ? true : false;
		},

		/**
   * Set's the overpanel's content (template, model, collection) and render it
   * @param view - the view to render inside the overpanel
   * @param doRender - optional flag allows to prevent automatic rendering, true by default
   * @returns {Overpanel}
   */
		setContent: function setContent(view, doRender) {
			// the current view in the overpanel
			this.view = view;

			// set the element of the view being rendered in the overpanel to #overpanel
			this.view.setElement(this.$el);

			this.template = view.template;
			if (view.model) {
				this.model = view.model;
			} else {
				this.collection = view.collection;
			}

			this.serialize = $.proxy(view.serialize, view);

			if (typeof doRender === 'undefined' || doRender) {
				this.render();
			}

			return this;
		},

		/**
   * Sets the current tabables of the open overpanel
   */
		setTabables: function setTabables() {
			this.$tabables = this.$el.find('a, button, input, select, textarea, [tabindex=0]').filter(':visible:not(:disabled)');

			this.$footerLinks = $('.footer a').filter(':visible');
		},

		/**
   * Manages the focus inside of the open overpanel
   * @param event
   */
		manageFocus: function manageFocus(event) {
			var $focusedElement = $(document.activeElement),
			    onFirstPanel = $focusedElement.is(this.$tabables.eq(0)),
			    onLastPanel = $focusedElement.is(this.$tabables.eq(this.$tabables.length - 1)),
			    onFirstFooter = $focusedElement.is(this.$footerLinks.eq(0)),
			    onLastFooter = $focusedElement.is(this.$footerLinks.eq(this.$footerLinks.length - 1));

			if (event.which === 9) {
				// tab key
				if (event.shiftKey) {
					if (onFirstPanel) {
						// + shift key
						event.preventDefault(); // each time when set focus manually, should prevent default focus by tap
						this.$footerLinks.eq(this.$footerLinks.length - 1).focus();
					}
					if (onFirstFooter) {
						event.preventDefault();
						this.$tabables.eq(this.$tabables.length - 1).focus();
					}
				} else {
					if (onLastFooter) {
						event.preventDefault();
						this.$el.focus();
					}
					if (onLastPanel) {
						event.preventDefault();
						this.$footerLinks.eq(0).focus();
					}
				}
			}
		},

		/**
   * Show the overpanel and add keyup ESC listener to body
   */
		showOverpanel: function showOverpanel() {
			// overpanelOpen class disables scrolling on the body
			this.$body.addClass('overpanelOpen');

			this.$el.removeClass('fadeOutDownBig hide');

			/*
   *	This is required as there is a CSS cross browser issue with Chrome & Safari, when sidepanel is on a overpanel
   */
			if (!this.isOpen) {
				this.$el.addClass('fadeInUpBig');
			}

			this.$el.attr('aria-hidden', false);

			this.isOpen = true;
		},

		/**
   * After fade up in animation ends, focus on the open overpanel
   * After fade out down animation ends, add the hide class on the overpanel
   */
		animationEnd: function animationEnd() {
			var $overpanel = this.$el;

			if (this.isOpen) {
				Backbone.trigger('shouldHideContents', true);

				// (accessibility) put focus on the overpanel so contents are in immediate tab order
				$overpanel.focus();
				this.shouldApplyA11Y(true);

				// set the $element to focus on after you close the overpanel
				this.$focusOnClose = this.$pusher;

				if (this.canUseEsc) {
					this.shouldListenToEsc(true);
				}
			} else {
				this.hide();
			}
		},

		hide: function hide() {
			this.$el.addClass('hide').removeClass('fadeOutDownBig');

			// the element to focus on is undefined if deep linking to an overpanel
			this.$focusOnClose = this.$focusOnClose || this.$body;
			this.$focusOnClose.focus();
		},

		/**
   * Assume that overpanel flow was aborted, since overpanel was manually closed.
   * Trigger 'overpanel:abort' event and call hideOverpanel() and pass through arguments.
   */
		abortOverpanel: function abortOverpanel() {
			// fire abort event since we assume flow was aborted
			Backbone.trigger('overpanel:abort');
			// call hideOverpanel and pass all the args through.
			this.hideOverpanel.apply(this, arguments);

			// Avoid click action launching the url specified in Close button.
			// This helps Backbone.navigate (in hideOverpanel() ) to take precedence on loading the url.
			return false;
		},

		/**
   * Fade out down the overpanel
   * @param event - Optional
   * @param config - If config = {stopAutoNav: true}, overpanel doesn't auto-navigate to href in overpanel close button. - Optional
   */
		hideOverpanel: function hideOverpanel(event, config) {
			config = config || {};

			var $closeBtn = this.$('.close');

			if (event) {
				event.preventDefault();
			}

			if (this.isOpen) {
				this.isOpen = false;

				this.$body.removeClass('overpanelOpen');
				this.$el.removeClass('fadeInUpBig').addClass('fadeOutDownBig');
				this.$el.attr('aria-hidden', true);

				this.canUseEsc = true;

				// Fallback for browsers that do not trigger animationEnd (IE9)
				setTimeout($.proxy(function () {
					this.hide();
				}, this), 500);
			}

			this.shouldListenToEsc(false);
			this.shouldApplyA11Y(false);

			// navigate to the close button's url - '/businessprofile'
			// the $('.close') button is required in the overpanel template
			// wrap in a condition because sometimes this function mistakenly gets called when no content was rendered in the overpanel
			// if {config.stopAutoNav: true}, don't run this. Helps as this can cause event-collision problems with routes being double-navigated to.
			if ($closeBtn.length !== 0 && !config.stopAutoNav) {
				if ($closeBtn.data('navigate-out') === true) {
					document.location.href = $closeBtn.attr('href');
				} else {
					//Remove slice(16) - will mess up when JS is loaded from CDN? Also not great to depend on char count of url
					//Backbone.history.navigate($closeBtn.attr('href').slice(16), {trigger: true});


					// When js files are loaded from CDN and slice will not help.
					// Trimming the URL by identifying the index of the context path.
					var href = $closeBtn.attr('href');
					// Whenever there is redirection to /businessmanage/profile/loginSecurity, 
					// page was getting redirected to /businessprofile/profile/loginSecurity (which is not the correct URL )
					// Fixed this issue with below if condition
					if (href.indexOf('/businessmanage/') !== -1) {
						href = '/businessprofile/settings';
					}
					href = href.substring(href.indexOf('/businessprofile/') + 16);
					Backbone.history.navigate(href, { trigger: true });
				}
			}

			Backbone.trigger('shouldHideContents', false);
			Backbone.trigger('overpanel:close');
			// Reload for redesing exp 
			var redesignReload = $('#landingpage').data('redesignexp');
			if (redesignReload === true || redesignReload === "") {
				window.location.reload(true);
			}
		},

		/**
   * Hide overpanel and remove keydown event from $body
   */
		closeOverpanel: function closeOverpanel(event) {
			// if ESC button pressed
			if (event.which === 27) {
				this.abortOverpanel(); // close it via abort (since we assume flow was aborted)

				// track closing the overpanel
				Backbone.trigger('trackLink', this.$('.close'));
			}
		},

		/**
   * Listen for keydown and close overpanel if ESC was pressed
   */
		shouldListenToEsc: function shouldListenToEsc(listen) {
			if (listen) {
				this.$body.on('keydown', $.proxy(this.closeOverpanel, this));
			} else {
				this.$body.off('keydown', $.proxy(this.closeOverpanel, this));
			}
		},

		/**
   * toggle method to manage accessibility for overpanel with footer
   */
		shouldApplyA11Y: function shouldApplyA11Y(apply) {
			if (apply) {
				$('#overpanel, #footer').on('keydown', $.proxy(this.manageFocus, this));
			} else {
				$('#overpanel, #footer').off('keydown', $.proxy(this.manageFocus, this));
			}
		}
	});

	return new Overpanel();
});

define('routes/helper',['jquery', 'underscore', 'backbone', 'backboneSubroute', 'model/history', 'lib/wurfl', 'widgets/theoverpanel'], function ($, _, Backbone, SubRoute, historyModel, wurfl, overpanelView) {

	'use strict';

	return Backbone.SubRoute.extend({

		view: {}, /* Holds reference to current view loaded */

		_savedViews: {},

		/**
   * Handles default view use cases
   * @param {Object} options An object containing:
   * @param {String} name The action being passed to the route from the URI
   * @param {Object} args The arguments being passed to the view upon initialization
   * @param {Function} callback Function to execute after scripts are loaded
   */
		showView: function showView(options) {
			options = options || {};
			options.name = options.name || $('body').data('view-name');

			var name = options.name,
			    args = options.args,
			    callback = options.callback,
			    afterRender = options.afterRender;

			// name and callback are both optional
			if (typeof name === 'function') {
				callback = name;
				name = null;
			}

			if (typeof args === 'function') {
				this.showView({
					name: name,
					callback: args,
					afterRender: afterRender
				});
				return;
			}

			// callback immediately if already loaded
			if (require.defined('view/' + name) && callback && this._savedViews[name]) {
				callback(this._savedViews[name]);
				return;
			}

			if (name) {
				this.loadScripts(options);
			}

			historyModel.addPath(name);
		},

		getPath: function getPath(scriptName) {
			var scriptNameParts;

			if (wurfl.isWireless) {
				scriptNameParts = scriptName.split('/');
				return [scriptNameParts[0], 'phone', scriptNameParts.slice(1)].join('/');
			}

			return scriptName;
		},

		/**
   * Handles default view use cases
   * @param {Object} options An object containing optional arguments, a callback, and a stop-gap for afterRender
   */
		loadScripts: function loadScripts(options) {

			//alert('Options : ' + JSON.stringify(options));

			var name = options.name,
			    args = options.args,
			    callback = options.callback,

			// afterRender could be false
			afterRender = typeof options.afterRender !== 'undefined' ? options.afterRender : true,
			    path = this.getPath(name);

			// HACK: getPath adds "/phone/" for all script requests
			// on mobile devices (which breaks non-settings flows on mobile)
			path = name;

			// avoid duplicate loading
			if (this._savedViews[path]) {
				this.view = this._savedViews[path];
				if (callback) {
					return callback(name);
				}
				return this.view;
			}

			// load things and set them up
			require(['view/' + path], $.proxy(function (ViewClass) {
				this.view = new ViewClass(args);
				this._savedViews[path] = this.view;
				this.view.delegateEvents();
				if (afterRender) {
					this.view.afterRender();
				}
				if (callback) {
					callback(this.view);
				}
			}, this));
		},

		/**
   * Handling page cleanup of widgets from previous views
   * Subroute should handle the cleaning of the view
   */
		cleanView: function cleanView() {
			// close overpanel if it exists
			if (overpanelView.exists()) {
				overpanelView.hideOverpanel();
			}
			// close modal if it exists
			var $openModal = $('.openModal');
			if ($openModal && $openModal.modal) {
				$openModal.modal('hide');
			}
		}
	});
});

define('routes/settingRoutes',['jquery'], function ($) {

	'use strict';

	return {
		features: [],

		readConfig: function readConfig() {
			this.features = $('body').data('enabledfeatures');
		},

		checkIfFeatureEnabled: function checkIfFeatureEnabled(featureName) {
			if (this.features[featureName] === true) {
				return true;
			} else {
				return false;
			}
		}
	};
});

// jscs:disable safeContextKeyword
/* globals define */

define('routes/settings',['jquery', 'underscore', 'routes/helper', 'routes/settingRoutes', 'widgets/analytics'], function ($, _, SubRouteHelper, settingsRoutes, Analytics) {

    'use strict';

    return SubRouteHelper.extend({

        routes: {},

        initialize: function initialize(options) {

            settingsRoutes.readConfig();

            //Always have landing page - other features should be enabled/disabled
            this.route('', 'showSettings');

            if (settingsRoutes.checkIfFeatureEnabled('namechange') === true) {
                this.route('name', 'showName');

                // Muthu: Two types of UI flows were made for name change initially.
                /*Since the flow 2 (Edit options in landing page) is confirmed
                 for production, this one is commented. */
                /* Added for the existing Edit name UI flow (Name and Edit link
                 in landing page and all edit navigations in overlay) */
                this.route('name/edit_orig', 'editNameOrig');

                // Added for the new Edit name UI flow (Edit options in landing page)
                this.route('name/edit', 'editName');
            }

            if (settingsRoutes.checkIfFeatureEnabled('email') === true) {
                this.route('email', 'showEmail');
                this.route('email/add', 'addEmail');
                this.route('email/edit/confirm/:id', 'confirmEditEmail');
                this.route('email/edit/:id', 'editEmail');
                this.route('email/delete/:id', 'deleteEmail');
                this.route('email/delete/confirm/:id', 'confirmDeleteEmail');
                this.route('email/validate', 'validateEmail');
            }

            if (settingsRoutes.checkIfFeatureEnabled('address') === true) {
                this.route('address', 'showAddress');
                this.route('address/add', 'addAddress');
                this.route('address/edit/:id', 'editAddress');
                this.route('address/delete/:id', 'deleteAddress');
                this.route('address/primary/:id', 'setPrimaryAddress');
                this.route('address/business/:id', 'setBusinessAddress');
            }

            if (settingsRoutes.checkIfFeatureEnabled('phone') === true) {
                this.route('phone', 'showPhones');
                this.route('phone/edit/:id', 'editPhone');
                this.route('phone/edit/confirm/:id', 'confirmEditPhone');
                this.route('phone/delete/:id', 'deletePhone');
                this.route('phone/delete/confirm/:id', 'confirmDeletePhone');
                this.route('phone/validate/:id', 'validatePhone');
                this.route('phone/add', 'addPhone');
            }

            if (settingsRoutes.checkIfFeatureEnabled('language') === true || settingsRoutes.checkIfFeatureEnabled('timezone') === true) {
                this.route('options/:optionType', 'showOptions');
            }

            if (settingsRoutes.checkIfFeatureEnabled('info') === true) {
                this.route('info(/:action)', 'loadBusinessInfo');
            }

            if (settingsRoutes.checkIfFeatureEnabled('taxid') === true) {
                this.route('taxid', 'showTaxid');
                this.route('taxid/SSN', 'modifySsn');
                this.route('taxid/ITIN', 'modifyItin');
                this.route('taxid/EIN', 'modifyEin');
            }

            if (settingsRoutes.checkIfFeatureEnabled('password') === true) {
                this.route('password', 'updatePassword');
            }

            if (settingsRoutes.checkIfFeatureEnabled('securityQuestions') === true) {
                this.route('securityquestions', 'editSecurityQuestions');
            }

            if (settingsRoutes.checkIfFeatureEnabled('occupation') === true) {
                this.route('occupation', 'showOccupation');
            }
        },

        loadView: function loadView(type, args) {
            var name,
                self = this;

            // Default to 'index'
            type = type || 'index';

            if (!this.EmailView) {

                if (type === 'email/add' || type === 'email/edit') {
                    name = 'settings/email/index';
                    this.loadView('email/index', args);
                    this.showView({
                        name: name,
                        args: args,
                        afterRender: false,
                        callback: $.proxy(function (view) {
                            this.EmailView = view;
                            this.loadView(type, args);
                        }, this)
                    });
                    return;
                }
            }

            if (type === 'taxid/modify' && !this.settingsView) {
                name = 'settings/index';

                this.showView({
                    name: name,
                    args: args,
                    afterRender: false,
                    callback: $.proxy(function (view) {
                        this.settingsView = view;
                        this.settingsView.afterRoute(function () {
                            /*callback since the actual content is loaded
                            via a widget and taxid/index view is loaded there */
                            self.settingsView.taxidView.afterRoute();
                            self.loadView(type, args);
                        });
                    }, this)
                });
                return;
            }

            if ((type === 'phone/add' || type === 'phone/edit') && !this.phoneView) {
                name = 'settings/phone/index';
                this.showView({
                    name: name,
                    args: args,
                    afterRender: false,
                    callback: $.proxy(function (view) {
                        this.phoneView = view;
                        this.loadView(type, args);
                    }, this)
                });
                return;
            }

            if (type === 'occupation' && !this.occupationView) {
                name = 'settings/occupation';
                this.showView({
                    name: name,
                    args: args,
                    afterRender: false,
                    callback: $.proxy(function (view) {
                        this.occupationView = view;
                        this.loadView(type, args);
                    }, this)
                });
                return;
            }

            if ((type === 'password/index' || type === 'securityQuestions/edit') && !this.settingsView) {
                name = 'settings/index';
                this.showView({
                    name: name,
                    args: args,
                    afterRender: false,
                    callback: $.proxy(function (view) {
                        this.settingsView = view;
                        this.loadView(type, args);
                    }, this)
                });
                return;
            }

            if ((type === 'address/add' || type === 'address/edit' || type === 'address/delete' || type === 'address/primary' || type === 'address/business') && !this.AddressView) {
                name = 'settings/address/index';
                this.showView({
                    name: name,
                    args: args,
                    afterRender: false,
                    callback: $.proxy(function (view) {
                        this.AddressView = view;
                        this.loadView(type, args);
                    }, this)
                });
                return;
            }

            this.showView({
                name: 'settings/' + type,
                args: args,
                afterRender: false,
                callback: $.proxy(function (view) {
                    if (view) {
                        this.view = view;
                        this.view.options = args;
                        if (type === 'index') {
                            // setting the landing page view
                            this.settingsView = view;
                        }

                        if (type === 'email/index') {
                            this.EmailView = view;
                        }

                        if (type === 'address/index') {
                            this.AddressView = view;
                        }

                        if (type === 'phone') {
                            this.phoneView = view;
                        }
                    }

                    this.view.afterRoute(type);
                }, this)
            });
        },

        showSettings: function showSettings() {
            this.loadView('index');
        },

        // Show Name Change Options
        showName: function showName() {
            this.loadView('name');
        },

        showOccupation: function showOccupation() {
            this.loadView('occupation');
        },

        editName: function editName() {
            this.loadView('name/edit');
        },

        editNameOrig: function editNameOrig() {
            this.loadView('name/edit_orig');
        },

        showOptions: function showOptions() {
            this.loadView('options');
        },

        // tax id
        showTaxid: function showTaxid() {
            this.loadView('taxid/index');
        },

        modifySsn: function modifySsn() {
            this.loadView('taxid/modify', {
                id: 'SSN'
            });
        },

        modifyItin: function modifyItin() {
            this.loadView('taxid/modify', {
                id: 'ITIN'
            });
        },

        modifyEin: function modifyEin() {
            this.loadView('taxid/modify', {
                id: 'EIN'
            });
        },

        //email
        showEmail: function showEmail() {
            this.loadView('email/index');
        },

        addEmail: function addEmail() {
            this.loadView('email/add');
        },

        editEmail: function editEmail(id) {
            this.loadView('email/edit', {
                id: id
            });
        },

        confirmEditEmail: function confirmEditEmail(id) {
            var fptidata = {};
            fptidata.page = 'main:businessweb:profile:settings:email:editConfirmation:init';
            fptidata.tajnd = $.now();
            fptidata.tmpl = 'bizprofilenodeweb/public/templates/settings/email/editConfirmation.dust';
            fptidata.pgrp = 'main:businessweb:profile:settings:email';
            Analytics.recordLoadTime(fptidata);
            this.loadView('email/editConfirmation', {
                id: id
            });
        },

        confirmDeleteEmail: function confirmDeleteEmail(id) {
            var fptidata = {};
            fptidata.page = 'main:businessweb:profile:settings:email:deleteConfirmation:init';
            fptidata.tajnd = $.now();
            fptidata.tmpl = 'bizprofilenodeweb/public/templates/settings/email/deleteConfirmation.dust';
            fptidata.pgrp = 'main:businessweb:profile:settings:email';
            Analytics.recordLoadTime(fptidata);
            this.loadView('email/deleteConfirmation', {
                id: id
            });
        },

        deleteEmail: function deleteEmail(id) {
            this.loadView('email/delete', {
                id: id
            });
        },

        validateEmail: function validateEmail() {
            this.loadView('email/validate');
        },

        //address
        showAddress: function showAddress() {
            this.loadView('address/index');
        },

        addAddress: function addAddress() {
            this.loadView('address/add');
        },

        editAddress: function editAddress(id) {
            this.loadView('address/edit', {
                id: id
            });
        },

        deleteAddress: function deleteAddress(id) {
            this.loadView('address/delete', {
                id: id
            });
        },

        setPrimaryAddress: function setPrimaryAddress(id) {
            this.loadView('address/primary', {
                id: id
            });
        },

        setBusinessAddress: function setBusinessAddress(id) {
            this.loadView('address/business', {
                id: id
            });
        },

        //phones
        showPhones: function showPhones() {
            this.loadView('phone/index');
        },

        editPhone: function editPhone(id) {
            this.loadView('phone/edit', {
                id: id
            });
        },

        confirmEditPhone: function confirmEditPhone(id) {
            var fptidata = {};
            fptidata.page = 'main:businessweb:profile:settings:phone:editConfirmation:init';
            fptidata.tajnd = $.now();
            fptidata.tmpl = 'bizprofilenodeweb/public/templates/settings/phone/editConfirmation.dust';
            fptidata.pgrp = 'main:businessweb:profile:settings:phone';
            Analytics.recordLoadTime(fptidata);
            this.loadView('phone/editConfirmation', {
                id: id
            });
        },

        deletePhone: function deletePhone(id) {
            this.loadView('phone/delete', {
                id: id
            });
        },

        confirmDeletePhone: function confirmDeletePhone(id) {
            var fptidata = {};
            fptidata.page = 'main:businessweb:profile:settings:phone:deleteConfirmation:init';
            fptidata.tajnd = $.now();
            fptidata.tmpl = 'bizprofilenodeweb/public/templates/settings/phone/deleteConfirmation.dust';
            fptidata.pgrp = 'main:businessweb:profile:settings:phone';
            Analytics.recordLoadTime(fptidata);
            this.loadView('phone/deleteConfirmation', {
                id: id
            });
        },

        validatePhone: function validatePhone(id) {
            this.loadView('phone/validate', {
                id: id
            });
        },

        addPhone: function addPhone() {
            this.loadView('phone/add');
        },

        //show business info
        loadBusinessInfo: function loadBusinessInfo(action) {

            // Check if it is new business info flow.
            var isNewBusinessInfo = $('body').data('viewName') === 'settings/info/business-info';
            var isAdroitStakeholderExperience = $('body').data('adroit-stakeholder-experience') === true;
            if (isNewBusinessInfo) {
                this.loadView('info/business-info', { adroitStakeholderExperience: isAdroitStakeholderExperience });
            } else {
                var view;
                if (!action) {
                    action = 'view';
                }

                if (action === 'view') {
                    view = 'info/index';
                } else {
                    view = 'info/editinfo';
                }

                //Show the spinner till the page render completes
                $('#businessInfo').toggleClass('hasSpinner', true);
                this.loadView(view, { action: action, adroitStakeholderExperience: isAdroitStakeholderExperience });
            }
        },

        updatePassword: function updatePassword() {
            this.loadView('password/index');
        },

        editSecurityQuestions: function editSecurityQuestions() {
            this.loadView('securityQuestions/edit');
        },

        noop: $.noop
    });
});

define('routes/mymoney',['jquery', 'underscore', 'routes/helper'], function ($, _, SubRouteHelper) {

	'use strict';

	return SubRouteHelper.extend({

		routes: {
			'': 'showMoney'
		},

		loadView: function loadView(type, args) {
			var name;

			// Default to 'index'
			type = type || 'index';

			if (!this.moneyView) {
				name = 'mymoney/index';

				this.showView({
					name: name,
					args: args,
					afterRender: false,
					callback: $.proxy(function (view) {
						this.moneyView = view;
						this.loadView(type, args);
					}, this)
				});
				return;
			}

			this.showView({
				name: 'mymoney/' + type,
				args: args,
				afterRender: false,
				callback: $.proxy(function (view) {
					if (view) {
						this.view = view;
						this.view.options = args;
					}
					// Ensure moneyView (master view) goes first.
					//if (this.panels.indexOf(type) > -1 && this.view.afterRoute && this.moneyView !== this.view) {
					//	this.moneyView.afterRoute(type);
					//} else {
					this.view.afterRoute(type);
					//}
				}, this)
			});
		},

		showMoney: function showMoney() {
			this.loadView('index');
		},

		noop: $.noop
	});
});

/* globals define, document */
define('routes/mysettings',['jquery', 'underscore', 'routes/helper', 'routes/settingRoutes'], function ($, _, SubRouteHelper, settingsRoutes) {

    'use strict';

    return SubRouteHelper.extend({
        routes: {
            '': 'showMySettings'
        },

        initialize: function initialize(options) {
            settingsRoutes.readConfig();
            if (settingsRoutes.checkIfFeatureEnabled('travelplan') === true) {
                this.route('travelplan/add', 'addTravelPlan');
                this.route('travelplan/edit', 'editTravelPlan');
                this.route('travelplan/delete', 'deleteTravelPlan');
            }

            if (settingsRoutes.checkIfFeatureEnabled('loginwithpaypal') === true) {
                this.route('loginwithpaypal', 'showLipp');
            }

            if (settingsRoutes.checkIfFeatureEnabled('devices') === true) {
                this.route('devices', 'showDevices');
            }

            if (settingsRoutes.checkIfFeatureEnabled('nfcdevices') === true) {
                this.route('nfcdevices', 'showNfcdevices');
            }

            if (settingsRoutes.checkIfFeatureEnabled('notifications') === true) {
                this.route('notifications', 'showNotifications');
            }
        },

        loadView: function loadView(type, args) {
            var name;

            // Default to 'index'
            type = type || 'index';
            if ((type === 'devices' || type === 'travelplan/add' || type === 'travelplan/edit' || type === 'travelplan/delete' || type === 'nfcdevices') && !this.mysettingsView) {
                if (type === 'travelplan/delete') {

                    // same thing if we use window.location.href or document.location.href
                    document.location.href = 'businessprofile/mysettings';
                } else {
                    name = 'mysettings/index';
                    this.showView({
                        name: name,
                        args: args,
                        afterRender: false,
                        callback: $.proxy(function (view) {
                            this.mysettingsView = view;
                            this.loadView(type, args);
                        }, this)
                    });
                    return;
                }
            }

            if (!this.mysettingsView) {
                name = 'mysettings/index';
                this.showView({
                    name: name,
                    args: args,
                    afterRender: false,
                    callback: $.proxy(function (view) {
                        this.mysettingsView = view;
                        this.loadView(type, args);
                    }, this)
                });
                return;
            }

            this.showView({
                name: 'mysettings/' + type,
                args: args,
                afterRender: false,
                callback: $.proxy(function (view) {
                    if (view) {
                        this.view = view;
                        this.view.options = args;
                    }

                    // Ensure mysettingsView (master view) goes first.
                    //if (this.panels.indexOf(type) > -1 && this.view.afterRoute &&
                    // this.mysettingsView !== this.view) {
                    // this.mysettingsView.afterRoute(type);
                    //} else {
                    this.view.afterRoute(type);

                    //}
                }, this)
            });
        },

        showMySettings: function showMySettings() {
            this.loadView('index');
        },

        addTravelPlan: function addTravelPlan() {
            this.loadView('travelplan/add');
        },

        editTravelPlan: function editTravelPlan() {
            this.loadView('travelplan/edit');
        },

        deleteTravelPlan: function deleteTravelPlan() {
            this.loadView('travelplan/delete');
        },

        showLipp: function showLipp() {
            this.loadView('loginwithpaypal/index');
        },

        showDevices: function showDevices() {
            this.loadView('devices');
        },

        showNfcdevices: function showNfcdevices() {
            this.loadView('index');
            this.loadView('nfcdevices');
        },

        showNotifications: function showNotifications() {
            this.loadView('notificationPreferences');
        },

        noop: $.noop
    });
});

define('routes/mytools',['jquery', 'underscore', 'routes/helper', 'routes/settingRoutes'], function ($, _, SubRouteHelper, settingRoutes) {

    'use strict';

    return SubRouteHelper.extend({

        routes: {
            '': 'showMyTools'
        },

        initialize: function initialize(options) {
            settingRoutes.readConfig();

            if (settingRoutes.checkIfFeatureEnabled('apiaccess') === true) {
                this.route('apiaccess', 'getApiaccess');
                this.route('apiaccess/firstparty', 'getFirstParty');
                this.route('apiaccess/firstparty/signature', 'getSignature');
                this.route('apiaccess/firstparty/cert', 'getCertificate');
            }
        },

        loadView: function loadView(type, args) {
            var name;

            // Default to 'index'
            type = type || 'index';

            if (!this.myToolsView) {
                name = 'mytools/index';

                this.showView({
                    name: name,
                    args: args,
                    afterRender: false,
                    callback: $.proxy(function (view) {
                        this.myToolsView = view;
                        this.loadView(type, args);
                    }, this)
                });
                return;
            }

            this.showView({
                name: 'mytools/' + type,
                args: args,
                afterRender: false,
                callback: $.proxy(function (view) {
                    if (view) {
                        this.view = view;
                        this.view.options = args;
                    }

                    // Ensure moneyView (master view) goes first.
                    //if (this.panels.indexOf(type) > -1 &&
                    // this.view.afterRoute && this.moneyView !== this.view) {
                    //	this.moneyView.afterRoute(type);
                    //} else {
                    this.view.afterRoute(type, args);

                    //}
                }, this)
            });
        },

        showMyTools: function showMyTools() {
            this.loadView('index');
        },

        getApiaccess: function getApiaccess() {
            this.loadView('apiaccess/index');
        },

        getFirstParty: function getFirstParty() {
            this.loadView('apiaccess/firstparty/index');
        },

        getSignature: function getSignature() {
            this.loadView('apiaccess/firstparty/index', {
                type: 'SGNTR'
            });
        },

        getCertificate: function getCertificate() {
            this.loadView('apiaccess/firstparty/index', {
                type: 'CERT'
            });
        },

        noop: $.noop
    });
});

define('view/global',['backbone'], function (Backbone, nougat, constants, SettingsRoute, GlobalPageView) {

    'use strict';

    return Backbone.View.extend({

        el: 'body',
        events: {
            'click a[id="change_loginwithpaypal"]': 'pushStateAnchors',
            'click a[data-push-replace]': 'pushStateAnchors',
            'click a[id="add_travel_plan"]': 'pushStateAnchors',
            'click a[id="edit_travel_plan"]': 'pushStateAnchors',
            'click a[id="del_travel_plan"]': 'pushStateAnchors',
            'click a[id="revoke_by_device"]': 'pushStateAnchors',
            'click a[id="tap_and_pay"]': 'pushStateAnchors',
            'click .popup': 'popup',
            'click .print-btn': 'initiatePrint'
        },

        initialize: function initialize() {
            // listen to if the mainContents should be hidden
            this.listenTo(Backbone, 'shouldHideContents', this.shouldHideContents);
        },

        /**
        	 * Toggles the hiding of the main #contents since the #overpanel is outside of it
        	 * @param hide
        	 */
        shouldHideContents: function shouldHideContents(hide) {
            this.$('.mainContents').toggleClass('hide', hide);
        },

        /**
        	 *	When clicking anchors with that [data-push-replace] attribute, we want to use Backbone's navigate
        	 * @param event		click event
        	 */
        pushStateAnchors: function pushStateAnchors(event) {
            event.preventDefault();
            var currentTarget = event.currentTarget,
                href = currentTarget.getAttribute('href'),
                isReplace = currentTarget.getAttribute('data-push-replace'),
                splitHref;

            // Coerce strings to booleans because backbone does truthy tests on 'isReplace'.
            isReplace = isReplace === 'true' ? true : false;

            // Handling urls from 3 tabs
            if (href.indexOf('https://') === 0) {
                splitHref = href.split(Backbone.history.options.root);
                if (splitHref.length >= 2) {
                    href = '/' + splitHref[1];
                }
            }

            href = href.replace(Backbone.history.options.root, ''); // remove root
            Backbone.history.navigate(href, { trigger: true, replace: isReplace });

            // trigger pushed state event
            // @arg this.$(currentTarget) the target that pushed the route change
            Backbone.trigger('pushedState', this.$(currentTarget));

            return false;
        },

        /**
        	 * Opens window in a new popup.
        	 *
        	 * @param event
        	 */
        popup: function popup(event) {
            event.preventDefault();
            var currentTarget = event.currentTarget,
                href = currentTarget.getAttribute('href'),
                width = currentTarget.getAttribute('data-width') || '640',
                height = currentTarget.getAttribute('data-height') || '400',
                windowOptions = 'width=' + width + ', height=' + height;

            window.open(href, 'popup', windowOptions);

            return false;
        },

        /**
        	 * Invoke the standard OS print dialog
        	 *
        	 * @param event
        	 */
        initiatePrint: function initiatePrint(event) {
            event.preventDefault();

            window.print();
        }
    });
});

/**
 * Created by netn on 25/09/15.
 */
define('routes/partner',['jquery', 'underscore', 'routes/helper'], function ($, _, SubRouteHelper) {

    'use strict';

    return SubRouteHelper.extend({

        routes: {
            'consents': 'showConsentList'
        },

        loadView: function loadView(type, args) {
            var name;

            this.showView({
                name: 'partner/' + type,
                args: args,
                afterRender: false,
                callback: $.proxy(function (view) {
                    if (view) {
                        this.view = view;
                        this.view.options = args;
                    }
                    this.view.afterRoute(type);
                }, this)
            });
        },

        // Show the list of consents
        showConsentList: function showConsentList() {
            this.loadView('consents');
        },

        noop: $.noop
    });
});

define('routes/mypreferences',['jquery', 'underscore', 'routes/helper', 'routes/settingRoutes'], function ($, _, SubRouteHelper, settingsRoutes) {

    'use strict';

    return SubRouteHelper.extend({

        routes: {
            '': 'showPreferences'
        },

        initialize: function initialize(options) {
            settingsRoutes.readConfig();
            if (settingsRoutes.checkIfFeatureEnabled('search') === true) {
                this.route('edit', 'editPreferences');
            }
        },

        loadView: function loadView(type, args) {
            var name;

            // Default to 'index'
            type = type || 'index';

            if (!this.preferencesView) {
                name = 'mypreferences/index';

                this.showView({
                    name: name,
                    args: args,
                    afterRender: false,
                    callback: $.proxy(function (view) {
                        this.preferencesView = view;
                        this.loadView(type, args);
                    }, this)
                });
                return;
            }

            this.showView({
                name: 'mypreferences/' + type,
                args: args,
                afterRender: false,
                callback: $.proxy(function (view) {
                    if (view) {
                        this.view = view;
                        this.view.options = args;
                    }

                    this.view.afterRoute(type);
                }, this)
            });
        },

        showPreferences: function showPreferences() {
            this.loadView('index');
        },

        editPreferences: function editPreferences() {
            this.loadView('editPreference');
        },

        noop: $.noop
    });
});

/*!
 * Bootstrap v3.4.1 (https://getbootstrap.com/)
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under the MIT license
 */
if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");!function(t){"use strict";var e=jQuery.fn.jquery.split(" ")[0].split(".");if(e[0]<2&&e[1]<9||1==e[0]&&9==e[1]&&e[2]<1||3<e[0])throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4")}(),function(n){"use strict";n.fn.emulateTransitionEnd=function(t){var e=!1,i=this;n(this).one("bsTransitionEnd",function(){e=!0});return setTimeout(function(){e||n(i).trigger(n.support.transition.end)},t),this},n(function(){n.support.transition=function o(){var t=document.createElement("bootstrap"),e={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var i in e)if(t.style[i]!==undefined)return{end:e[i]};return!1}(),n.support.transition&&(n.event.special.bsTransitionEnd={bindType:n.support.transition.end,delegateType:n.support.transition.end,handle:function(t){if(n(t.target).is(this))return t.handleObj.handler.apply(this,arguments)}})})}(jQuery),function(s){"use strict";var e='[data-dismiss="alert"]',a=function(t){s(t).on("click",e,this.close)};a.VERSION="3.4.1",a.TRANSITION_DURATION=150,a.prototype.close=function(t){var e=s(this),i=e.attr("data-target");i||(i=(i=e.attr("href"))&&i.replace(/.*(?=#[^\s]*$)/,"")),i="#"===i?[]:i;var o=s(document).find(i);function n(){o.detach().trigger("closed.bs.alert").remove()}t&&t.preventDefault(),o.length||(o=e.closest(".alert")),o.trigger(t=s.Event("close.bs.alert")),t.isDefaultPrevented()||(o.removeClass("in"),s.support.transition&&o.hasClass("fade")?o.one("bsTransitionEnd",n).emulateTransitionEnd(a.TRANSITION_DURATION):n())};var t=s.fn.alert;s.fn.alert=function o(i){return this.each(function(){var t=s(this),e=t.data("bs.alert");e||t.data("bs.alert",e=new a(this)),"string"==typeof i&&e[i].call(t)})},s.fn.alert.Constructor=a,s.fn.alert.noConflict=function(){return s.fn.alert=t,this},s(document).on("click.bs.alert.data-api",e,a.prototype.close)}(jQuery),function(s){"use strict";var n=function(t,e){this.$element=s(t),this.options=s.extend({},n.DEFAULTS,e),this.isLoading=!1};function i(o){return this.each(function(){var t=s(this),e=t.data("bs.button"),i="object"==typeof o&&o;e||t.data("bs.button",e=new n(this,i)),"toggle"==o?e.toggle():o&&e.setState(o)})}n.VERSION="3.4.1",n.DEFAULTS={loadingText:"loading..."},n.prototype.setState=function(t){var e="disabled",i=this.$element,o=i.is("input")?"val":"html",n=i.data();t+="Text",null==n.resetText&&i.data("resetText",i[o]()),setTimeout(s.proxy(function(){i[o](null==n[t]?this.options[t]:n[t]),"loadingText"==t?(this.isLoading=!0,i.addClass(e).attr(e,e).prop(e,!0)):this.isLoading&&(this.isLoading=!1,i.removeClass(e).removeAttr(e).prop(e,!1))},this),0)},n.prototype.toggle=function(){var t=!0,e=this.$element.closest('[data-toggle="buttons"]');if(e.length){var i=this.$element.find("input");"radio"==i.prop("type")?(i.prop("checked")&&(t=!1),e.find(".active").removeClass("active"),this.$element.addClass("active")):"checkbox"==i.prop("type")&&(i.prop("checked")!==this.$element.hasClass("active")&&(t=!1),this.$element.toggleClass("active")),i.prop("checked",this.$element.hasClass("active")),t&&i.trigger("change")}else this.$element.attr("aria-pressed",!this.$element.hasClass("active")),this.$element.toggleClass("active")};var t=s.fn.button;s.fn.button=i,s.fn.button.Constructor=n,s.fn.button.noConflict=function(){return s.fn.button=t,this},s(document).on("click.bs.button.data-api",'[data-toggle^="button"]',function(t){var e=s(t.target).closest(".btn");i.call(e,"toggle"),s(t.target).is('input[type="radio"], input[type="checkbox"]')||(t.preventDefault(),e.is("input,button")?e.trigger("focus"):e.find("input:visible,button:visible").first().trigger("focus"))}).on("focus.bs.button.data-api blur.bs.button.data-api",'[data-toggle^="button"]',function(t){s(t.target).closest(".btn").toggleClass("focus",/^focus(in)?$/.test(t.type))})}(jQuery),function(p){"use strict";var c=function(t,e){this.$element=p(t),this.$indicators=this.$element.find(".carousel-indicators"),this.options=e,this.paused=null,this.sliding=null,this.interval=null,this.$active=null,this.$items=null,this.options.keyboard&&this.$element.on("keydown.bs.carousel",p.proxy(this.keydown,this)),"hover"==this.options.pause&&!("ontouchstart"in document.documentElement)&&this.$element.on("mouseenter.bs.carousel",p.proxy(this.pause,this)).on("mouseleave.bs.carousel",p.proxy(this.cycle,this))};function r(n){return this.each(function(){var t=p(this),e=t.data("bs.carousel"),i=p.extend({},c.DEFAULTS,t.data(),"object"==typeof n&&n),o="string"==typeof n?n:i.slide;e||t.data("bs.carousel",e=new c(this,i)),"number"==typeof n?e.to(n):o?e[o]():i.interval&&e.pause().cycle()})}c.VERSION="3.4.1",c.TRANSITION_DURATION=600,c.DEFAULTS={interval:5e3,pause:"hover",wrap:!0,keyboard:!0},c.prototype.keydown=function(t){if(!/input|textarea/i.test(t.target.tagName)){switch(t.which){case 37:this.prev();break;case 39:this.next();break;default:return}t.preventDefault()}},c.prototype.cycle=function(t){return t||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(p.proxy(this.next,this),this.options.interval)),this},c.prototype.getItemIndex=function(t){return this.$items=t.parent().children(".item"),this.$items.index(t||this.$active)},c.prototype.getItemForDirection=function(t,e){var i=this.getItemIndex(e);if(("prev"==t&&0===i||"next"==t&&i==this.$items.length-1)&&!this.options.wrap)return e;var o=(i+("prev"==t?-1:1))%this.$items.length;return this.$items.eq(o)},c.prototype.to=function(t){var e=this,i=this.getItemIndex(this.$active=this.$element.find(".item.active"));if(!(t>this.$items.length-1||t<0))return this.sliding?this.$element.one("slid.bs.carousel",function(){e.to(t)}):i==t?this.pause().cycle():this.slide(i<t?"next":"prev",this.$items.eq(t))},c.prototype.pause=function(t){return t||(this.paused=!0),this.$element.find(".next, .prev").length&&p.support.transition&&(this.$element.trigger(p.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},c.prototype.next=function(){if(!this.sliding)return this.slide("next")},c.prototype.prev=function(){if(!this.sliding)return this.slide("prev")},c.prototype.slide=function(t,e){var i=this.$element.find(".item.active"),o=e||this.getItemForDirection(t,i),n=this.interval,s="next"==t?"left":"right",a=this;if(o.hasClass("active"))return this.sliding=!1;var r=o[0],l=p.Event("slide.bs.carousel",{relatedTarget:r,direction:s});if(this.$element.trigger(l),!l.isDefaultPrevented()){if(this.sliding=!0,n&&this.pause(),this.$indicators.length){this.$indicators.find(".active").removeClass("active");var h=p(this.$indicators.children()[this.getItemIndex(o)]);h&&h.addClass("active")}var d=p.Event("slid.bs.carousel",{relatedTarget:r,direction:s});return p.support.transition&&this.$element.hasClass("slide")?(o.addClass(t),"object"==typeof o&&o.length&&o[0].offsetWidth,i.addClass(s),o.addClass(s),i.one("bsTransitionEnd",function(){o.removeClass([t,s].join(" ")).addClass("active"),i.removeClass(["active",s].join(" ")),a.sliding=!1,setTimeout(function(){a.$element.trigger(d)},0)}).emulateTransitionEnd(c.TRANSITION_DURATION)):(i.removeClass("active"),o.addClass("active"),this.sliding=!1,this.$element.trigger(d)),n&&this.cycle(),this}};var t=p.fn.carousel;p.fn.carousel=r,p.fn.carousel.Constructor=c,p.fn.carousel.noConflict=function(){return p.fn.carousel=t,this};var e=function(t){var e=p(this),i=e.attr("href");i&&(i=i.replace(/.*(?=#[^\s]+$)/,""));var o=e.attr("data-target")||i,n=p(document).find(o);if(n.hasClass("carousel")){var s=p.extend({},n.data(),e.data()),a=e.attr("data-slide-to");a&&(s.interval=!1),r.call(n,s),a&&n.data("bs.carousel").to(a),t.preventDefault()}};p(document).on("click.bs.carousel.data-api","[data-slide]",e).on("click.bs.carousel.data-api","[data-slide-to]",e),p(window).on("load",function(){p('[data-ride="carousel"]').each(function(){var t=p(this);r.call(t,t.data())})})}(jQuery),function(a){"use strict";var r=function(t,e){this.$element=a(t),this.options=a.extend({},r.DEFAULTS,e),this.$trigger=a('[data-toggle="collapse"][href="#'+t.id+'"],[data-toggle="collapse"][data-target="#'+t.id+'"]'),this.transitioning=null,this.options.parent?this.$parent=this.getParent():this.addAriaAndCollapsedClass(this.$element,this.$trigger),this.options.toggle&&this.toggle()};function n(t){var e,i=t.attr("data-target")||(e=t.attr("href"))&&e.replace(/.*(?=#[^\s]+$)/,"");return a(document).find(i)}function l(o){return this.each(function(){var t=a(this),e=t.data("bs.collapse"),i=a.extend({},r.DEFAULTS,t.data(),"object"==typeof o&&o);!e&&i.toggle&&/show|hide/.test(o)&&(i.toggle=!1),e||t.data("bs.collapse",e=new r(this,i)),"string"==typeof o&&e[o]()})}r.VERSION="3.4.1",r.TRANSITION_DURATION=350,r.DEFAULTS={toggle:!0},r.prototype.dimension=function(){return this.$element.hasClass("width")?"width":"height"},r.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var t,e=this.$parent&&this.$parent.children(".panel").children(".in, .collapsing");if(!(e&&e.length&&(t=e.data("bs.collapse"))&&t.transitioning)){var i=a.Event("show.bs.collapse");if(this.$element.trigger(i),!i.isDefaultPrevented()){e&&e.length&&(l.call(e,"hide"),t||e.data("bs.collapse",null));var o=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[o](0).attr("aria-expanded",!0),this.$trigger.removeClass("collapsed").attr("aria-expanded",!0),this.transitioning=1;var n=function(){this.$element.removeClass("collapsing").addClass("collapse in")[o](""),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return n.call(this);var s=a.camelCase(["scroll",o].join("-"));this.$element.one("bsTransitionEnd",a.proxy(n,this)).emulateTransitionEnd(r.TRANSITION_DURATION)[o](this.$element[0][s])}}}},r.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var t=a.Event("hide.bs.collapse");if(this.$element.trigger(t),!t.isDefaultPrevented()){var e=this.dimension();this.$element[e](this.$element[e]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.$trigger.addClass("collapsed").attr("aria-expanded",!1),this.transitioning=1;var i=function(){this.transitioning=0,this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")};if(!a.support.transition)return i.call(this);this.$element[e](0).one("bsTransitionEnd",a.proxy(i,this)).emulateTransitionEnd(r.TRANSITION_DURATION)}}},r.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()},r.prototype.getParent=function(){return a(document).find(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each(a.proxy(function(t,e){var i=a(e);this.addAriaAndCollapsedClass(n(i),i)},this)).end()},r.prototype.addAriaAndCollapsedClass=function(t,e){var i=t.hasClass("in");t.attr("aria-expanded",i),e.toggleClass("collapsed",!i).attr("aria-expanded",i)};var t=a.fn.collapse;a.fn.collapse=l,a.fn.collapse.Constructor=r,a.fn.collapse.noConflict=function(){return a.fn.collapse=t,this},a(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(t){var e=a(this);e.attr("data-target")||t.preventDefault();var i=n(e),o=i.data("bs.collapse")?"toggle":e.data();l.call(i,o)})}(jQuery),function(a){"use strict";var r='[data-toggle="dropdown"]',o=function(t){a(t).on("click.bs.dropdown",this.toggle)};function l(t){var e=t.attr("data-target");e||(e=(e=t.attr("href"))&&/#[A-Za-z]/.test(e)&&e.replace(/.*(?=#[^\s]*$)/,""));var i="#"!==e?a(document).find(e):null;return i&&i.length?i:t.parent()}function s(o){o&&3===o.which||(a(".dropdown-backdrop").remove(),a(r).each(function(){var t=a(this),e=l(t),i={relatedTarget:this};e.hasClass("open")&&(o&&"click"==o.type&&/input|textarea/i.test(o.target.tagName)&&a.contains(e[0],o.target)||(e.trigger(o=a.Event("hide.bs.dropdown",i)),o.isDefaultPrevented()||(t.attr("aria-expanded","false"),e.removeClass("open").trigger(a.Event("hidden.bs.dropdown",i)))))}))}o.VERSION="3.4.1",o.prototype.toggle=function(t){var e=a(this);if(!e.is(".disabled, :disabled")){var i=l(e),o=i.hasClass("open");if(s(),!o){"ontouchstart"in document.documentElement&&!i.closest(".navbar-nav").length&&a(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(a(this)).on("click",s);var n={relatedTarget:this};if(i.trigger(t=a.Event("show.bs.dropdown",n)),t.isDefaultPrevented())return;e.trigger("focus").attr("aria-expanded","true"),i.toggleClass("open").trigger(a.Event("shown.bs.dropdown",n))}return!1}},o.prototype.keydown=function(t){if(/(38|40|27|32)/.test(t.which)&&!/input|textarea/i.test(t.target.tagName)){var e=a(this);if(t.preventDefault(),t.stopPropagation(),!e.is(".disabled, :disabled")){var i=l(e),o=i.hasClass("open");if(!o&&27!=t.which||o&&27==t.which)return 27==t.which&&i.find(r).trigger("focus"),e.trigger("click");var n=i.find(".dropdown-menu li:not(.disabled):visible a");if(n.length){var s=n.index(t.target);38==t.which&&0<s&&s--,40==t.which&&s<n.length-1&&s++,~s||(s=0),n.eq(s).trigger("focus")}}}};var t=a.fn.dropdown;a.fn.dropdown=function e(i){return this.each(function(){var t=a(this),e=t.data("bs.dropdown");e||t.data("bs.dropdown",e=new o(this)),"string"==typeof i&&e[i].call(t)})},a.fn.dropdown.Constructor=o,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=t,this},a(document).on("click.bs.dropdown.data-api",s).on("click.bs.dropdown.data-api",".dropdown form",function(t){t.stopPropagation()}).on("click.bs.dropdown.data-api",r,o.prototype.toggle).on("keydown.bs.dropdown.data-api",r,o.prototype.keydown).on("keydown.bs.dropdown.data-api",".dropdown-menu",o.prototype.keydown)}(jQuery),function(a){"use strict";var s=function(t,e){this.options=e,this.$body=a(document.body),this.$element=a(t),this.$dialog=this.$element.find(".modal-dialog"),this.$backdrop=null,this.isShown=null,this.originalBodyPad=null,this.scrollbarWidth=0,this.ignoreBackdropClick=!1,this.fixedContent=".navbar-fixed-top, .navbar-fixed-bottom",this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,a.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};function r(o,n){return this.each(function(){var t=a(this),e=t.data("bs.modal"),i=a.extend({},s.DEFAULTS,t.data(),"object"==typeof o&&o);e||t.data("bs.modal",e=new s(this,i)),"string"==typeof o?e[o](n):i.show&&e.show(n)})}s.VERSION="3.4.1",s.TRANSITION_DURATION=300,s.BACKDROP_TRANSITION_DURATION=150,s.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},s.prototype.toggle=function(t){return this.isShown?this.hide():this.show(t)},s.prototype.show=function(i){var o=this,t=a.Event("show.bs.modal",{relatedTarget:i});this.$element.trigger(t),this.isShown||t.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.setScrollbar(),this.$body.addClass("modal-open"),this.escape(),this.resize(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.$dialog.on("mousedown.dismiss.bs.modal",function(){o.$element.one("mouseup.dismiss.bs.modal",function(t){a(t.target).is(o.$element)&&(o.ignoreBackdropClick=!0)})}),this.backdrop(function(){var t=a.support.transition&&o.$element.hasClass("fade");o.$element.parent().length||o.$element.appendTo(o.$body),o.$element.show().scrollTop(0),o.adjustDialog(),t&&o.$element[0].offsetWidth,o.$element.addClass("in"),o.enforceFocus();var e=a.Event("shown.bs.modal",{relatedTarget:i});t?o.$dialog.one("bsTransitionEnd",function(){o.$element.trigger("focus").trigger(e)}).emulateTransitionEnd(s.TRANSITION_DURATION):o.$element.trigger("focus").trigger(e)}))},s.prototype.hide=function(t){t&&t.preventDefault(),t=a.Event("hide.bs.modal"),this.$element.trigger(t),this.isShown&&!t.isDefaultPrevented()&&(this.isShown=!1,this.escape(),this.resize(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),this.$dialog.off("mousedown.dismiss.bs.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",a.proxy(this.hideModal,this)).emulateTransitionEnd(s.TRANSITION_DURATION):this.hideModal())},s.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(t){document===t.target||this.$element[0]===t.target||this.$element.has(t.target).length||this.$element.trigger("focus")},this))},s.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keydown.dismiss.bs.modal",a.proxy(function(t){27==t.which&&this.hide()},this)):this.isShown||this.$element.off("keydown.dismiss.bs.modal")},s.prototype.resize=function(){this.isShown?a(window).on("resize.bs.modal",a.proxy(this.handleUpdate,this)):a(window).off("resize.bs.modal")},s.prototype.hideModal=function(){var t=this;this.$element.hide(),this.backdrop(function(){t.$body.removeClass("modal-open"),t.resetAdjustments(),t.resetScrollbar(),t.$element.trigger("hidden.bs.modal")})},s.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},s.prototype.backdrop=function(t){var e=this,i=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var o=a.support.transition&&i;if(this.$backdrop=a(document.createElement("div")).addClass("modal-backdrop "+i).appendTo(this.$body),this.$element.on("click.dismiss.bs.modal",a.proxy(function(t){this.ignoreBackdropClick?this.ignoreBackdropClick=!1:t.target===t.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus():this.hide())},this)),o&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!t)return;o?this.$backdrop.one("bsTransitionEnd",t).emulateTransitionEnd(s.BACKDROP_TRANSITION_DURATION):t()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var n=function(){e.removeBackdrop(),t&&t()};a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",n).emulateTransitionEnd(s.BACKDROP_TRANSITION_DURATION):n()}else t&&t()},s.prototype.handleUpdate=function(){this.adjustDialog()},s.prototype.adjustDialog=function(){var t=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&t?this.scrollbarWidth:"",paddingRight:this.bodyIsOverflowing&&!t?this.scrollbarWidth:""})},s.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:"",paddingRight:""})},s.prototype.checkScrollbar=function(){var t=window.innerWidth;if(!t){var e=document.documentElement.getBoundingClientRect();t=e.right-Math.abs(e.left)}this.bodyIsOverflowing=document.body.clientWidth<t,this.scrollbarWidth=this.measureScrollbar()},s.prototype.setScrollbar=function(){var t=parseInt(this.$body.css("padding-right")||0,10);this.originalBodyPad=document.body.style.paddingRight||"";var n=this.scrollbarWidth;this.bodyIsOverflowing&&(this.$body.css("padding-right",t+n),a(this.fixedContent).each(function(t,e){var i=e.style.paddingRight,o=a(e).css("padding-right");a(e).data("padding-right",i).css("padding-right",parseFloat(o)+n+"px")}))},s.prototype.resetScrollbar=function(){this.$body.css("padding-right",this.originalBodyPad),a(this.fixedContent).each(function(t,e){var i=a(e).data("padding-right");a(e).removeData("padding-right"),e.style.paddingRight=i||""})},s.prototype.measureScrollbar=function(){var t=document.createElement("div");t.className="modal-scrollbar-measure",this.$body.append(t);var e=t.offsetWidth-t.clientWidth;return this.$body[0].removeChild(t),e};var t=a.fn.modal;a.fn.modal=r,a.fn.modal.Constructor=s,a.fn.modal.noConflict=function(){return a.fn.modal=t,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(t){var e=a(this),i=e.attr("href"),o=e.attr("data-target")||i&&i.replace(/.*(?=#[^\s]+$)/,""),n=a(document).find(o),s=n.data("bs.modal")?"toggle":a.extend({remote:!/#/.test(i)&&i},n.data(),e.data());e.is("a")&&t.preventDefault(),n.one("show.bs.modal",function(t){t.isDefaultPrevented()||n.one("hidden.bs.modal",function(){e.is(":visible")&&e.trigger("focus")})}),r.call(n,s,this)})}(jQuery),function(g){"use strict";var o=["sanitize","whiteList","sanitizeFn"],a=["background","cite","href","itemtype","longdesc","poster","src","xlink:href"],t={"*":["class","dir","id","lang","role",/^aria-[\w-]*$/i],a:["target","href","title","rel"],area:[],b:[],br:[],col:[],code:[],div:[],em:[],hr:[],h1:[],h2:[],h3:[],h4:[],h5:[],h6:[],i:[],img:["src","alt","title","width","height"],li:[],ol:[],p:[],pre:[],s:[],small:[],span:[],sub:[],sup:[],strong:[],u:[],ul:[]},r=/^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi,l=/^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;function u(t,e){var i=t.nodeName.toLowerCase();if(-1!==g.inArray(i,e))return-1===g.inArray(i,a)||Boolean(t.nodeValue.match(r)||t.nodeValue.match(l));for(var o=g(e).filter(function(t,e){return e instanceof RegExp}),n=0,s=o.length;n<s;n++)if(i.match(o[n]))return!0;return!1}function n(t,e,i){if(0===t.length)return t;if(i&&"function"==typeof i)return i(t);if(!document.implementation||!document.implementation.createHTMLDocument)return t;var o=document.implementation.createHTMLDocument("sanitization");o.body.innerHTML=t;for(var n=g.map(e,function(t,e){return e}),s=g(o.body).find("*"),a=0,r=s.length;a<r;a++){var l=s[a],h=l.nodeName.toLowerCase();if(-1!==g.inArray(h,n))for(var d=g.map(l.attributes,function(t){return t}),p=[].concat(e["*"]||[],e[h]||[]),c=0,f=d.length;c<f;c++)u(d[c],p)||l.removeAttribute(d[c].nodeName);else l.parentNode.removeChild(l)}return o.body.innerHTML}var m=function(t,e){this.type=null,this.options=null,this.enabled=null,this.timeout=null,this.hoverState=null,this.$element=null,this.inState=null,this.init("tooltip",t,e)};m.VERSION="3.4.1",m.TRANSITION_DURATION=150,m.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0},sanitize:!0,sanitizeFn:null,whiteList:t},m.prototype.init=function(t,e,i){if(this.enabled=!0,this.type=t,this.$element=g(e),this.options=this.getOptions(i),this.$viewport=this.options.viewport&&g(document).find(g.isFunction(this.options.viewport)?this.options.viewport.call(this,this.$element):this.options.viewport.selector||this.options.viewport),this.inState={click:!1,hover:!1,focus:!1},this.$element[0]instanceof document.constructor&&!this.options.selector)throw new Error("`selector` option must be specified when initializing "+this.type+" on the window.document object!");for(var o=this.options.trigger.split(" "),n=o.length;n--;){var s=o[n];if("click"==s)this.$element.on("click."+this.type,this.options.selector,g.proxy(this.toggle,this));else if("manual"!=s){var a="hover"==s?"mouseenter":"focusin",r="hover"==s?"mouseleave":"focusout";this.$element.on(a+"."+this.type,this.options.selector,g.proxy(this.enter,this)),this.$element.on(r+"."+this.type,this.options.selector,g.proxy(this.leave,this))}}this.options.selector?this._options=g.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},m.prototype.getDefaults=function(){return m.DEFAULTS},m.prototype.getOptions=function(t){var e=this.$element.data();for(var i in e)e.hasOwnProperty(i)&&-1!==g.inArray(i,o)&&delete e[i];return(t=g.extend({},this.getDefaults(),e,t)).delay&&"number"==typeof t.delay&&(t.delay={show:t.delay,hide:t.delay}),t.sanitize&&(t.template=n(t.template,t.whiteList,t.sanitizeFn)),t},m.prototype.getDelegateOptions=function(){var i={},o=this.getDefaults();return this._options&&g.each(this._options,function(t,e){o[t]!=e&&(i[t]=e)}),i},m.prototype.enter=function(t){var e=t instanceof this.constructor?t:g(t.currentTarget).data("bs."+this.type);if(e||(e=new this.constructor(t.currentTarget,this.getDelegateOptions()),g(t.currentTarget).data("bs."+this.type,e)),t instanceof g.Event&&(e.inState["focusin"==t.type?"focus":"hover"]=!0),e.tip().hasClass("in")||"in"==e.hoverState)e.hoverState="in";else{if(clearTimeout(e.timeout),e.hoverState="in",!e.options.delay||!e.options.delay.show)return e.show();e.timeout=setTimeout(function(){"in"==e.hoverState&&e.show()},e.options.delay.show)}},m.prototype.isInStateTrue=function(){for(var t in this.inState)if(this.inState[t])return!0;return!1},m.prototype.leave=function(t){var e=t instanceof this.constructor?t:g(t.currentTarget).data("bs."+this.type);if(e||(e=new this.constructor(t.currentTarget,this.getDelegateOptions()),g(t.currentTarget).data("bs."+this.type,e)),t instanceof g.Event&&(e.inState["focusout"==t.type?"focus":"hover"]=!1),!e.isInStateTrue()){if(clearTimeout(e.timeout),e.hoverState="out",!e.options.delay||!e.options.delay.hide)return e.hide();e.timeout=setTimeout(function(){"out"==e.hoverState&&e.hide()},e.options.delay.hide)}},m.prototype.show=function(){var t=g.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(t);var e=g.contains(this.$element[0].ownerDocument.documentElement,this.$element[0]);if(t.isDefaultPrevented()||!e)return;var i=this,o=this.tip(),n=this.getUID(this.type);this.setContent(),o.attr("id",n),this.$element.attr("aria-describedby",n),this.options.animation&&o.addClass("fade");var s="function"==typeof this.options.placement?this.options.placement.call(this,o[0],this.$element[0]):this.options.placement,a=/\s?auto?\s?/i,r=a.test(s);r&&(s=s.replace(a,"")||"top"),o.detach().css({top:0,left:0,display:"block"}).addClass(s).data("bs."+this.type,this),this.options.container?o.appendTo(g(document).find(this.options.container)):o.insertAfter(this.$element),this.$element.trigger("inserted.bs."+this.type);var l=this.getPosition(),h=o[0].offsetWidth,d=o[0].offsetHeight;if(r){var p=s,c=this.getPosition(this.$viewport);s="bottom"==s&&l.bottom+d>c.bottom?"top":"top"==s&&l.top-d<c.top?"bottom":"right"==s&&l.right+h>c.width?"left":"left"==s&&l.left-h<c.left?"right":s,o.removeClass(p).addClass(s)}var f=this.getCalculatedOffset(s,l,h,d);this.applyPlacement(f,s);var u=function(){var t=i.hoverState;i.$element.trigger("shown.bs."+i.type),i.hoverState=null,"out"==t&&i.leave(i)};g.support.transition&&this.$tip.hasClass("fade")?o.one("bsTransitionEnd",u).emulateTransitionEnd(m.TRANSITION_DURATION):u()}},m.prototype.applyPlacement=function(t,e){var i=this.tip(),o=i[0].offsetWidth,n=i[0].offsetHeight,s=parseInt(i.css("margin-top"),10),a=parseInt(i.css("margin-left"),10);isNaN(s)&&(s=0),isNaN(a)&&(a=0),t.top+=s,t.left+=a,g.offset.setOffset(i[0],g.extend({using:function(t){i.css({top:Math.round(t.top),left:Math.round(t.left)})}},t),0),i.addClass("in");var r=i[0].offsetWidth,l=i[0].offsetHeight;"top"==e&&l!=n&&(t.top=t.top+n-l);var h=this.getViewportAdjustedDelta(e,t,r,l);h.left?t.left+=h.left:t.top+=h.top;var d=/top|bottom/.test(e),p=d?2*h.left-o+r:2*h.top-n+l,c=d?"offsetWidth":"offsetHeight";i.offset(t),this.replaceArrow(p,i[0][c],d)},m.prototype.replaceArrow=function(t,e,i){this.arrow().css(i?"left":"top",50*(1-t/e)+"%").css(i?"top":"left","")},m.prototype.setContent=function(){var t=this.tip(),e=this.getTitle();this.options.html?(this.options.sanitize&&(e=n(e,this.options.whiteList,this.options.sanitizeFn)),t.find(".tooltip-inner").html(e)):t.find(".tooltip-inner").text(e),t.removeClass("fade in top bottom left right")},m.prototype.hide=function(t){var e=this,i=g(this.$tip),o=g.Event("hide.bs."+this.type);function n(){"in"!=e.hoverState&&i.detach(),e.$element&&e.$element.removeAttr("aria-describedby").trigger("hidden.bs."+e.type),t&&t()}if(this.$element.trigger(o),!o.isDefaultPrevented())return i.removeClass("in"),g.support.transition&&i.hasClass("fade")?i.one("bsTransitionEnd",n).emulateTransitionEnd(m.TRANSITION_DURATION):n(),this.hoverState=null,this},m.prototype.fixTitle=function(){var t=this.$element;(t.attr("title")||"string"!=typeof t.attr("data-original-title"))&&t.attr("data-original-title",t.attr("title")||"").attr("title","")},m.prototype.hasContent=function(){return this.getTitle()},m.prototype.getPosition=function(t){var e=(t=t||this.$element)[0],i="BODY"==e.tagName,o=e.getBoundingClientRect();null==o.width&&(o=g.extend({},o,{width:o.right-o.left,height:o.bottom-o.top}));var n=window.SVGElement&&e instanceof window.SVGElement,s=i?{top:0,left:0}:n?null:t.offset(),a={scroll:i?document.documentElement.scrollTop||document.body.scrollTop:t.scrollTop()},r=i?{width:g(window).width(),height:g(window).height()}:null;return g.extend({},o,a,r,s)},m.prototype.getCalculatedOffset=function(t,e,i,o){return"bottom"==t?{top:e.top+e.height,left:e.left+e.width/2-i/2}:"top"==t?{top:e.top-o,left:e.left+e.width/2-i/2}:"left"==t?{top:e.top+e.height/2-o/2,left:e.left-i}:{top:e.top+e.height/2-o/2,left:e.left+e.width}},m.prototype.getViewportAdjustedDelta=function(t,e,i,o){var n={top:0,left:0};if(!this.$viewport)return n;var s=this.options.viewport&&this.options.viewport.padding||0,a=this.getPosition(this.$viewport);if(/right|left/.test(t)){var r=e.top-s-a.scroll,l=e.top+s-a.scroll+o;r<a.top?n.top=a.top-r:l>a.top+a.height&&(n.top=a.top+a.height-l)}else{var h=e.left-s,d=e.left+s+i;h<a.left?n.left=a.left-h:d>a.right&&(n.left=a.left+a.width-d)}return n},m.prototype.getTitle=function(){var t=this.$element,e=this.options;return t.attr("data-original-title")||("function"==typeof e.title?e.title.call(t[0]):e.title)},m.prototype.getUID=function(t){for(;t+=~~(1e6*Math.random()),document.getElementById(t););return t},m.prototype.tip=function(){if(!this.$tip&&(this.$tip=g(this.options.template),1!=this.$tip.length))throw new Error(this.type+" `template` option must consist of exactly 1 top-level element!");return this.$tip},m.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},m.prototype.enable=function(){this.enabled=!0},m.prototype.disable=function(){this.enabled=!1},m.prototype.toggleEnabled=function(){this.enabled=!this.enabled},m.prototype.toggle=function(t){var e=this;t&&((e=g(t.currentTarget).data("bs."+this.type))||(e=new this.constructor(t.currentTarget,this.getDelegateOptions()),g(t.currentTarget).data("bs."+this.type,e))),t?(e.inState.click=!e.inState.click,e.isInStateTrue()?e.enter(e):e.leave(e)):e.tip().hasClass("in")?e.leave(e):e.enter(e)},m.prototype.destroy=function(){var t=this;clearTimeout(this.timeout),this.hide(function(){t.$element.off("."+t.type).removeData("bs."+t.type),t.$tip&&t.$tip.detach(),t.$tip=null,t.$arrow=null,t.$viewport=null,t.$element=null})},m.prototype.sanitizeHtml=function(t){return n(t,this.options.whiteList,this.options.sanitizeFn)};var e=g.fn.tooltip;g.fn.tooltip=function i(o){return this.each(function(){var t=g(this),e=t.data("bs.tooltip"),i="object"==typeof o&&o;!e&&/destroy|hide/.test(o)||(e||t.data("bs.tooltip",e=new m(this,i)),"string"==typeof o&&e[o]())})},g.fn.tooltip.Constructor=m,g.fn.tooltip.noConflict=function(){return g.fn.tooltip=e,this}}(jQuery),function(n){"use strict";var s=function(t,e){this.init("popover",t,e)};if(!n.fn.tooltip)throw new Error("Popover requires tooltip.js");s.VERSION="3.4.1",s.DEFAULTS=n.extend({},n.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),((s.prototype=n.extend({},n.fn.tooltip.Constructor.prototype)).constructor=s).prototype.getDefaults=function(){return s.DEFAULTS},s.prototype.setContent=function(){var t=this.tip(),e=this.getTitle(),i=this.getContent();if(this.options.html){var o=typeof i;this.options.sanitize&&(e=this.sanitizeHtml(e),"string"===o&&(i=this.sanitizeHtml(i))),t.find(".popover-title").html(e),t.find(".popover-content").children().detach().end()["string"===o?"html":"append"](i)}else t.find(".popover-title").text(e),t.find(".popover-content").children().detach().end().text(i);t.removeClass("fade top bottom left right in"),t.find(".popover-title").html()||t.find(".popover-title").hide()},s.prototype.hasContent=function(){return this.getTitle()||this.getContent()},s.prototype.getContent=function(){var t=this.$element,e=this.options;return t.attr("data-content")||("function"==typeof e.content?e.content.call(t[0]):e.content)},s.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")};var t=n.fn.popover;n.fn.popover=function e(o){return this.each(function(){var t=n(this),e=t.data("bs.popover"),i="object"==typeof o&&o;!e&&/destroy|hide/.test(o)||(e||t.data("bs.popover",e=new s(this,i)),"string"==typeof o&&e[o]())})},n.fn.popover.Constructor=s,n.fn.popover.noConflict=function(){return n.fn.popover=t,this}}(jQuery),function(s){"use strict";function n(t,e){this.$body=s(document.body),this.$scrollElement=s(t).is(document.body)?s(window):s(t),this.options=s.extend({},n.DEFAULTS,e),this.selector=(this.options.target||"")+" .nav li > a",this.offsets=[],this.targets=[],this.activeTarget=null,this.scrollHeight=0,this.$scrollElement.on("scroll.bs.scrollspy",s.proxy(this.process,this)),this.refresh(),this.process()}function e(o){return this.each(function(){var t=s(this),e=t.data("bs.scrollspy"),i="object"==typeof o&&o;e||t.data("bs.scrollspy",e=new n(this,i)),"string"==typeof o&&e[o]()})}n.VERSION="3.4.1",n.DEFAULTS={offset:10},n.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)},n.prototype.refresh=function(){var t=this,o="offset",n=0;this.offsets=[],this.targets=[],this.scrollHeight=this.getScrollHeight(),s.isWindow(this.$scrollElement[0])||(o="position",n=this.$scrollElement.scrollTop()),this.$body.find(this.selector).map(function(){var t=s(this),e=t.data("target")||t.attr("href"),i=/^#./.test(e)&&s(e);return i&&i.length&&i.is(":visible")&&[[i[o]().top+n,e]]||null}).sort(function(t,e){return t[0]-e[0]}).each(function(){t.offsets.push(this[0]),t.targets.push(this[1])})},n.prototype.process=function(){var t,e=this.$scrollElement.scrollTop()+this.options.offset,i=this.getScrollHeight(),o=this.options.offset+i-this.$scrollElement.height(),n=this.offsets,s=this.targets,a=this.activeTarget;if(this.scrollHeight!=i&&this.refresh(),o<=e)return a!=(t=s[s.length-1])&&this.activate(t);if(a&&e<n[0])return this.activeTarget=null,this.clear();for(t=n.length;t--;)a!=s[t]&&e>=n[t]&&(n[t+1]===undefined||e<n[t+1])&&this.activate(s[t])},n.prototype.activate=function(t){this.activeTarget=t,this.clear();var e=this.selector+'[data-target="'+t+'"],'+this.selector+'[href="'+t+'"]',i=s(e).parents("li").addClass("active");i.parent(".dropdown-menu").length&&(i=i.closest("li.dropdown").addClass("active")),i.trigger("activate.bs.scrollspy")},n.prototype.clear=function(){s(this.selector).parentsUntil(this.options.target,".active").removeClass("active")};var t=s.fn.scrollspy;s.fn.scrollspy=e,s.fn.scrollspy.Constructor=n,s.fn.scrollspy.noConflict=function(){return s.fn.scrollspy=t,this},s(window).on("load.bs.scrollspy.data-api",function(){s('[data-spy="scroll"]').each(function(){var t=s(this);e.call(t,t.data())})})}(jQuery),function(r){"use strict";var a=function(t){this.element=r(t)};function e(i){return this.each(function(){var t=r(this),e=t.data("bs.tab");e||t.data("bs.tab",e=new a(this)),"string"==typeof i&&e[i]()})}a.VERSION="3.4.1",a.TRANSITION_DURATION=150,a.prototype.show=function(){var t=this.element,e=t.closest("ul:not(.dropdown-menu)"),i=t.data("target");if(i||(i=(i=t.attr("href"))&&i.replace(/.*(?=#[^\s]*$)/,"")),!t.parent("li").hasClass("active")){var o=e.find(".active:last a"),n=r.Event("hide.bs.tab",{relatedTarget:t[0]}),s=r.Event("show.bs.tab",{relatedTarget:o[0]});if(o.trigger(n),t.trigger(s),!s.isDefaultPrevented()&&!n.isDefaultPrevented()){var a=r(document).find(i);this.activate(t.closest("li"),e),this.activate(a,a.parent(),function(){o.trigger({type:"hidden.bs.tab",relatedTarget:t[0]}),t.trigger({type:"shown.bs.tab",relatedTarget:o[0]})})}}},a.prototype.activate=function(t,e,i){var o=e.find("> .active"),n=i&&r.support.transition&&(o.length&&o.hasClass("fade")||!!e.find("> .fade").length);function s(){o.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!1),t.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded",!0),n?(t[0].offsetWidth,t.addClass("in")):t.removeClass("fade"),t.parent(".dropdown-menu").length&&t.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!0),i&&i()}o.length&&n?o.one("bsTransitionEnd",s).emulateTransitionEnd(a.TRANSITION_DURATION):s(),o.removeClass("in")};var t=r.fn.tab;r.fn.tab=e,r.fn.tab.Constructor=a,r.fn.tab.noConflict=function(){return r.fn.tab=t,this};var i=function(t){t.preventDefault(),e.call(r(this),"show")};r(document).on("click.bs.tab.data-api",'[data-toggle="tab"]',i).on("click.bs.tab.data-api",'[data-toggle="pill"]',i)}(jQuery),function(l){"use strict";var h=function(t,e){this.options=l.extend({},h.DEFAULTS,e);var i=this.options.target===h.DEFAULTS.target?l(this.options.target):l(document).find(this.options.target);this.$target=i.on("scroll.bs.affix.data-api",l.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",l.proxy(this.checkPositionWithEventLoop,this)),this.$element=l(t),this.affixed=null,this.unpin=null,this.pinnedOffset=null,this.checkPosition()};function i(o){return this.each(function(){var t=l(this),e=t.data("bs.affix"),i="object"==typeof o&&o;e||t.data("bs.affix",e=new h(this,i)),"string"==typeof o&&e[o]()})}h.VERSION="3.4.1",h.RESET="affix affix-top affix-bottom",h.DEFAULTS={offset:0,target:window},h.prototype.getState=function(t,e,i,o){var n=this.$target.scrollTop(),s=this.$element.offset(),a=this.$target.height();if(null!=i&&"top"==this.affixed)return n<i&&"top";if("bottom"==this.affixed)return null!=i?!(n+this.unpin<=s.top)&&"bottom":!(n+a<=t-o)&&"bottom";var r=null==this.affixed,l=r?n:s.top;return null!=i&&n<=i?"top":null!=o&&t-o<=l+(r?a:e)&&"bottom"},h.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(h.RESET).addClass("affix");var t=this.$target.scrollTop(),e=this.$element.offset();return this.pinnedOffset=e.top-t},h.prototype.checkPositionWithEventLoop=function(){setTimeout(l.proxy(this.checkPosition,this),1)},h.prototype.checkPosition=function(){if(this.$element.is(":visible")){var t=this.$element.height(),e=this.options.offset,i=e.top,o=e.bottom,n=Math.max(l(document).height(),l(document.body).height());"object"!=typeof e&&(o=i=e),"function"==typeof i&&(i=e.top(this.$element)),"function"==typeof o&&(o=e.bottom(this.$element));var s=this.getState(n,t,i,o);if(this.affixed!=s){null!=this.unpin&&this.$element.css("top","");var a="affix"+(s?"-"+s:""),r=l.Event(a+".bs.affix");if(this.$element.trigger(r),r.isDefaultPrevented())return;this.affixed=s,this.unpin="bottom"==s?this.getPinnedOffset():null,this.$element.removeClass(h.RESET).addClass(a).trigger(a.replace("affix","affixed")+".bs.affix")}"bottom"==s&&this.$element.offset({top:n-t-o})}};var t=l.fn.affix;l.fn.affix=i,l.fn.affix.Constructor=h,l.fn.affix.noConflict=function(){return l.fn.affix=t,this},l(window).on("load",function(){l('[data-spy="affix"]').each(function(){var t=l(this),e=t.data();e.offset=e.offset||{},null!=e.offsetBottom&&(e.offset.bottom=e.offsetBottom),null!=e.offsetTop&&(e.offset.top=e.offsetTop),i.call(t,e)})})}(jQuery);
define("lib/bootstrap-3.4.1", function(){});

// moment.js
// version : 2.0.0
// author : Tim Wood
// license : MIT
// momentjs.com
(function(e){function O(e,t){return function(n){return j(e.call(this,n),t)}}function M(e){return function(t){return this.lang().ordinal(e.call(this,t))}}function _(){}function D(e){H(this,e)}function P(e){var t=this._data={},n=e.years||e.year||e.y||0,r=e.months||e.month||e.M||0,i=e.weeks||e.week||e.w||0,s=e.days||e.day||e.d||0,o=e.hours||e.hour||e.h||0,u=e.minutes||e.minute||e.m||0,a=e.seconds||e.second||e.s||0,f=e.milliseconds||e.millisecond||e.ms||0;this._milliseconds=f+a*1e3+u*6e4+o*36e5,this._days=s+i*7,this._months=r+n*12,t.milliseconds=f%1e3,a+=B(f/1e3),t.seconds=a%60,u+=B(a/60),t.minutes=u%60,o+=B(u/60),t.hours=o%24,s+=B(o/24),s+=i*7,t.days=s%30,r+=B(s/30),t.months=r%12,n+=B(r/12),t.years=n}function H(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e}function B(e){return e<0?Math.ceil(e):Math.floor(e)}function j(e,t){var n=e+"";while(n.length<t)n="0"+n;return n}function F(e,t,n){var r=t._milliseconds,i=t._days,s=t._months,o;r&&e._d.setTime(+e+r*n),i&&e.date(e.date()+i*n),s&&(o=e.date(),e.date(1).month(e.month()+s*n).date(Math.min(o,e.daysInMonth())))}function I(e){return Object.prototype.toString.call(e)==="[object Array]"}function q(e,t){var n=Math.min(e.length,t.length),r=Math.abs(e.length-t.length),i=0,s;for(s=0;s<n;s++)~~e[s]!==~~t[s]&&i++;return i+r}function R(e,t){return t.abbr=e,s[e]||(s[e]=new _),s[e].set(t),s[e]}function U(e){return e?(!s[e]&&o&&require("./lang/"+e),s[e]):t.fn._lang}function z(e){return e.match(/\[.*\]/)?e.replace(/^\[|\]$/g,""):e.replace(/\\/g,"")}function W(e){var t=e.match(a),n,r;for(n=0,r=t.length;n<r;n++)A[t[n]]?t[n]=A[t[n]]:t[n]=z(t[n]);return function(i){var s="";for(n=0;n<r;n++)s+=typeof t[n].call=="function"?t[n].call(i,e):t[n];return s}}function X(e,t){function r(t){return e.lang().longDateFormat(t)||t}var n=5;while(n--&&f.test(t))t=t.replace(f,r);return C[t]||(C[t]=W(t)),C[t](e)}function V(e){switch(e){case"DDDD":return p;case"YYYY":return d;case"YYYYY":return v;case"S":case"SS":case"SSS":case"DDD":return h;case"MMM":case"MMMM":case"dd":case"ddd":case"dddd":case"a":case"A":return m;case"X":return b;case"Z":case"ZZ":return g;case"T":return y;case"MM":case"DD":case"YY":case"HH":case"hh":case"mm":case"ss":case"M":case"D":case"d":case"H":case"h":case"m":case"s":return c;default:return new RegExp(e.replace("\\",""))}}function $(e,t,n){var r,i,s=n._a;switch(e){case"M":case"MM":s[1]=t==null?0:~~t-1;break;case"MMM":case"MMMM":r=U(n._l).monthsParse(t),r!=null?s[1]=r:n._isValid=!1;break;case"D":case"DD":case"DDD":case"DDDD":t!=null&&(s[2]=~~t);break;case"YY":s[0]=~~t+(~~t>68?1900:2e3);break;case"YYYY":case"YYYYY":s[0]=~~t;break;case"a":case"A":n._isPm=(t+"").toLowerCase()==="pm";break;case"H":case"HH":case"h":case"hh":s[3]=~~t;break;case"m":case"mm":s[4]=~~t;break;case"s":case"ss":s[5]=~~t;break;case"S":case"SS":case"SSS":s[6]=~~(("0."+t)*1e3);break;case"X":n._d=new Date(parseFloat(t)*1e3);break;case"Z":case"ZZ":n._useUTC=!0,r=(t+"").match(x),r&&r[1]&&(n._tzh=~~r[1]),r&&r[2]&&(n._tzm=~~r[2]),r&&r[0]==="+"&&(n._tzh=-n._tzh,n._tzm=-n._tzm)}t==null&&(n._isValid=!1)}function J(e){var t,n,r=[];if(e._d)return;for(t=0;t<7;t++)e._a[t]=r[t]=e._a[t]==null?t===2?1:0:e._a[t];r[3]+=e._tzh||0,r[4]+=e._tzm||0,n=new Date(0),e._useUTC?(n.setUTCFullYear(r[0],r[1],r[2]),n.setUTCHours(r[3],r[4],r[5],r[6])):(n.setFullYear(r[0],r[1],r[2]),n.setHours(r[3],r[4],r[5],r[6])),e._d=n}function K(e){var t=e._f.match(a),n=e._i,r,i;e._a=[];for(r=0;r<t.length;r++)i=(V(t[r]).exec(n)||[])[0],i&&(n=n.slice(n.indexOf(i)+i.length)),A[t[r]]&&$(t[r],i,e);e._isPm&&e._a[3]<12&&(e._a[3]+=12),e._isPm===!1&&e._a[3]===12&&(e._a[3]=0),J(e)}function Q(e){var t,n,r,i=99,s,o,u;while(e._f.length){t=H({},e),t._f=e._f.pop(),K(t),n=new D(t);if(n.isValid()){r=n;break}u=q(t._a,n.toArray()),u<i&&(i=u,r=n)}H(e,r)}function G(e){var t,n=e._i;if(w.exec(n)){e._f="YYYY-MM-DDT";for(t=0;t<4;t++)if(S[t][1].exec(n)){e._f+=S[t][0];break}g.exec(n)&&(e._f+=" Z"),K(e)}else e._d=new Date(n)}function Y(t){var n=t._i,r=u.exec(n);n===e?t._d=new Date:r?t._d=new Date(+r[1]):typeof n=="string"?G(t):I(n)?(t._a=n.slice(0),J(t)):t._d=n instanceof Date?new Date(+n):new Date(n)}function Z(e,t,n,r,i){return i.relativeTime(t||1,!!n,e,r)}function et(e,t,n){var i=r(Math.abs(e)/1e3),s=r(i/60),o=r(s/60),u=r(o/24),a=r(u/365),f=i<45&&["s",i]||s===1&&["m"]||s<45&&["mm",s]||o===1&&["h"]||o<22&&["hh",o]||u===1&&["d"]||u<=25&&["dd",u]||u<=45&&["M"]||u<345&&["MM",r(u/30)]||a===1&&["y"]||["yy",a];return f[2]=t,f[3]=e>0,f[4]=n,Z.apply({},f)}function tt(e,n,r){var i=r-n,s=r-e.day();return s>i&&(s-=7),s<i-7&&(s+=7),Math.ceil(t(e).add("d",s).dayOfYear()/7)}function nt(e){var n=e._i,r=e._f;return n===null||n===""?null:(typeof n=="string"&&(e._i=n=U().preparse(n)),t.isMoment(n)?(e=H({},n),e._d=new Date(+n._d)):r?I(r)?Q(e):K(e):Y(e),new D(e))}function rt(e,n){t.fn[e]=t.fn[e+"s"]=function(e){var t=this._isUTC?"UTC":"";return e!=null?(this._d["set"+t+n](e),this):this._d["get"+t+n]()}}function it(e){t.duration.fn[e]=function(){return this._data[e]}}function st(e,n){t.duration.fn["as"+e]=function(){return+this/n}}var t,n="2.0.0",r=Math.round,i,s={},o=typeof module!="undefined"&&module.exports,u=/^\/?Date\((\-?\d+)/i,a=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g,f=/(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,l=/([0-9a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)/gi,c=/\d\d?/,h=/\d{1,3}/,p=/\d{3}/,d=/\d{1,4}/,v=/[+\-]?\d{1,6}/,m=/[0-9]*[a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF]+\s*?[\u0600-\u06FF]+/i,g=/Z|[\+\-]\d\d:?\d\d/i,y=/T/i,b=/[\+\-]?\d+(\.\d{1,3})?/,w=/^\s*\d{4}-\d\d-\d\d((T| )(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/,E="YYYY-MM-DDTHH:mm:ssZ",S=[["HH:mm:ss.S",/(T| )\d\d:\d\d:\d\d\.\d{1,3}/],["HH:mm:ss",/(T| )\d\d:\d\d:\d\d/],["HH:mm",/(T| )\d\d:\d\d/],["HH",/(T| )\d\d/]],x=/([\+\-]|\d\d)/gi,T="Month|Date|Hours|Minutes|Seconds|Milliseconds".split("|"),N={Milliseconds:1,Seconds:1e3,Minutes:6e4,Hours:36e5,Days:864e5,Months:2592e6,Years:31536e6},C={},k="DDD w W M D d".split(" "),L="M D H h m s w W".split(" "),A={M:function(){return this.month()+1},MMM:function(e){return this.lang().monthsShort(this,e)},MMMM:function(e){return this.lang().months(this,e)},D:function(){return this.date()},DDD:function(){return this.dayOfYear()},d:function(){return this.day()},dd:function(e){return this.lang().weekdaysMin(this,e)},ddd:function(e){return this.lang().weekdaysShort(this,e)},dddd:function(e){return this.lang().weekdays(this,e)},w:function(){return this.week()},W:function(){return this.isoWeek()},YY:function(){return j(this.year()%100,2)},YYYY:function(){return j(this.year(),4)},YYYYY:function(){return j(this.year(),5)},a:function(){return this.lang().meridiem(this.hours(),this.minutes(),!0)},A:function(){return this.lang().meridiem(this.hours(),this.minutes(),!1)},H:function(){return this.hours()},h:function(){return this.hours()%12||12},m:function(){return this.minutes()},s:function(){return this.seconds()},S:function(){return~~(this.milliseconds()/100)},SS:function(){return j(~~(this.milliseconds()/10),2)},SSS:function(){return j(this.milliseconds(),3)},Z:function(){var e=-this.zone(),t="+";return e<0&&(e=-e,t="-"),t+j(~~(e/60),2)+":"+j(~~e%60,2)},ZZ:function(){var e=-this.zone(),t="+";return e<0&&(e=-e,t="-"),t+j(~~(10*e/6),4)},X:function(){return this.unix()}};while(k.length)i=k.pop(),A[i+"o"]=M(A[i]);while(L.length)i=L.pop(),A[i+i]=O(A[i],2);A.DDDD=O(A.DDD,3),_.prototype={set:function(e){var t,n;for(n in e)t=e[n],typeof t=="function"?this[n]=t:this["_"+n]=t},_months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),months:function(e){return this._months[e.month()]},_monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),monthsShort:function(e){return this._monthsShort[e.month()]},monthsParse:function(e){var n,r,i,s;this._monthsParse||(this._monthsParse=[]);for(n=0;n<12;n++){this._monthsParse[n]||(r=t([2e3,n]),i="^"+this.months(r,"")+"|^"+this.monthsShort(r,""),this._monthsParse[n]=new RegExp(i.replace(".",""),"i"));if(this._monthsParse[n].test(e))return n}},_weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdays:function(e){return this._weekdays[e.day()]},_weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysShort:function(e){return this._weekdaysShort[e.day()]},_weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),weekdaysMin:function(e){return this._weekdaysMin[e.day()]},_longDateFormat:{LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D YYYY",LLL:"MMMM D YYYY LT",LLLL:"dddd, MMMM D YYYY LT"},longDateFormat:function(e){var t=this._longDateFormat[e];return!t&&this._longDateFormat[e.toUpperCase()]&&(t=this._longDateFormat[e.toUpperCase()].replace(/MMMM|MM|DD|dddd/g,function(e){return e.slice(1)}),this._longDateFormat[e]=t),t},meridiem:function(e,t,n){return e>11?n?"pm":"PM":n?"am":"AM"},_calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[last] dddd [at] LT",sameElse:"L"},calendar:function(e,t){var n=this._calendar[e];return typeof n=="function"?n.apply(t):n},_relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},relativeTime:function(e,t,n,r){var i=this._relativeTime[n];return typeof i=="function"?i(e,t,n,r):i.replace(/%d/i,e)},pastFuture:function(e,t){var n=this._relativeTime[e>0?"future":"past"];return typeof n=="function"?n(t):n.replace(/%s/i,t)},ordinal:function(e){return this._ordinal.replace("%d",e)},_ordinal:"%d",preparse:function(e){return e},postformat:function(e){return e},week:function(e){return tt(e,this._week.dow,this._week.doy)},_week:{dow:0,doy:6}},t=function(e,t,n){return nt({_i:e,_f:t,_l:n,_isUTC:!1})},t.utc=function(e,t,n){return nt({_useUTC:!0,_isUTC:!0,_l:n,_i:e,_f:t})},t.unix=function(e){return t(e*1e3)},t.duration=function(e,n){var r=t.isDuration(e),i=typeof e=="number",s=r?e._data:i?{}:e,o;return i&&(n?s[n]=e:s.milliseconds=e),o=new P(s),r&&e.hasOwnProperty("_lang")&&(o._lang=e._lang),o},t.version=n,t.defaultFormat=E,t.lang=function(e,n){var r;if(!e)return t.fn._lang._abbr;n?R(e,n):s[e]||U(e),t.duration.fn._lang=t.fn._lang=U(e)},t.langData=function(e){return e&&e._lang&&e._lang._abbr&&(e=e._lang._abbr),U(e)},t.isMoment=function(e){return e instanceof D},t.isDuration=function(e){return e instanceof P},t.fn=D.prototype={clone:function(){return t(this)},valueOf:function(){return+this._d},unix:function(){return Math.floor(+this._d/1e3)},toString:function(){return this.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")},toDate:function(){return this._d},toJSON:function(){return t.utc(this).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")},toArray:function(){var e=this;return[e.year(),e.month(),e.date(),e.hours(),e.minutes(),e.seconds(),e.milliseconds()]},isValid:function(){return this._isValid==null&&(this._a?this._isValid=!q(this._a,(this._isUTC?t.utc(this._a):t(this._a)).toArray()):this._isValid=!isNaN(this._d.getTime())),!!this._isValid},utc:function(){return this._isUTC=!0,this},local:function(){return this._isUTC=!1,this},format:function(e){var n=X(this,e||t.defaultFormat);return this.lang().postformat(n)},add:function(e,n){var r;return typeof e=="string"?r=t.duration(+n,e):r=t.duration(e,n),F(this,r,1),this},subtract:function(e,n){var r;return typeof e=="string"?r=t.duration(+n,e):r=t.duration(e,n),F(this,r,-1),this},diff:function(e,n,r){var i=this._isUTC?t(e).utc():t(e).local(),s=(this.zone()-i.zone())*6e4,o,u;return n&&(n=n.replace(/s$/,"")),n==="year"||n==="month"?(o=(this.daysInMonth()+i.daysInMonth())*432e5,u=(this.year()-i.year())*12+(this.month()-i.month()),u+=(this-t(this).startOf("month")-(i-t(i).startOf("month")))/o,n==="year"&&(u/=12)):(o=this-i-s,u=n==="second"?o/1e3:n==="minute"?o/6e4:n==="hour"?o/36e5:n==="day"?o/864e5:n==="week"?o/6048e5:o),r?u:B(u)},from:function(e,n){return t.duration(this.diff(e)).lang(this.lang()._abbr).humanize(!n)},fromNow:function(e){return this.from(t(),e)},calendar:function(){var e=this.diff(t().startOf("day"),"days",!0),n=e<-6?"sameElse":e<-1?"lastWeek":e<0?"lastDay":e<1?"sameDay":e<2?"nextDay":e<7?"nextWeek":"sameElse";return this.format(this.lang().calendar(n,this))},isLeapYear:function(){var e=this.year();return e%4===0&&e%100!==0||e%400===0},isDST:function(){return this.zone()<t([this.year()]).zone()||this.zone()<t([this.year(),5]).zone()},day:function(e){var t=this._isUTC?this._d.getUTCDay():this._d.getDay();return e==null?t:this.add({d:e-t})},startOf:function(e){e=e.replace(/s$/,"");switch(e){case"year":this.month(0);case"month":this.date(1);case"week":case"day":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return e==="week"&&this.day(0),this},endOf:function(e){return this.startOf(e).add(e.replace(/s?$/,"s"),1).subtract("ms",1)},isAfter:function(e,n){return n=typeof n!="undefined"?n:"millisecond",+this.clone().startOf(n)>+t(e).startOf(n)},isBefore:function(e,n){return n=typeof n!="undefined"?n:"millisecond",+this.clone().startOf(n)<+t(e).startOf(n)},isSame:function(e,n){return n=typeof n!="undefined"?n:"millisecond",+this.clone().startOf(n)===+t(e).startOf(n)},zone:function(){return this._isUTC?0:this._d.getTimezoneOffset()},daysInMonth:function(){return t.utc([this.year(),this.month()+1,0]).date()},dayOfYear:function(e){var n=r((t(this).startOf("day")-t(this).startOf("year"))/864e5)+1;return e==null?n:this.add("d",e-n)},isoWeek:function(e){var t=tt(this,1,4);return e==null?t:this.add("d",(e-t)*7)},week:function(e){var t=this.lang().week(this);return e==null?t:this.add("d",(e-t)*7)},lang:function(t){return t===e?this._lang:(this._lang=U(t),this)}};for(i=0;i<T.length;i++)rt(T[i].toLowerCase().replace(/s$/,""),T[i]);rt("year","FullYear"),t.fn.days=t.fn.day,t.fn.weeks=t.fn.week,t.fn.isoWeeks=t.fn.isoWeek,t.duration.fn=P.prototype={weeks:function(){return B(this.days()/7)},valueOf:function(){return this._milliseconds+this._days*864e5+this._months*2592e6},humanize:function(e){var t=+this,n=et(t,!e,this.lang());return e&&(n=this.lang().pastFuture(t,n)),this.lang().postformat(n)},lang:t.fn.lang};for(i in N)N.hasOwnProperty(i)&&(st(i,N[i]),it(i.toLowerCase()));st("Weeks",6048e5),t.lang("en",{ordinal:function(e){var t=e%10,n=~~(e%100/10)===1?"th":t===1?"st":t===2?"nd":t===3?"rd":"th";return e+n}}),o&&(module.exports=t),typeof ender=="undefined"&&(this.moment=t),typeof define=="function"&&define.amd&&define("moment",[],function(){return t})}).call(this);
/*global define:true */
define('lib/business/businessHelper',[
			'nougat',
			'underscore',
			'jquery',
			'backbone',
			'moment'
		],
		function (nougat, _, $, Backbone, moment) {

		"use strict";

		var Helper = {

			hawk_service_timeout_error : 'HAWK_SERVICE_TIMEOUT',

			fetchAndCallback: function (sUrl, oConfig, fptiPage) {
				if (fptiPage) {
					this.startModuleLoadTimer();
				}
                		var jqxhr = $.get(sUrl, oConfig.form, $.proxy(function (response) {
					oConfig.callback.call(this, response, oConfig);
					if (fptiPage) {
						this.recordModuleLoadTime(response.sys, fptiPage, response.data);
					}
				}, this)).fail (function(xhr){
					var redirectUrl = (xhr) ? xhr.getResponseHeader("location") : null;
					if(typeof redirectUrl === "string") {
						window.location = redirectUrl;
					}
				});
				return jqxhr;
			},

			simpleFetchAndRender: function (sUrl, elementID, template, view, func, fptiPage) {
				if(fptiPage) {
					this.startModuleLoadTimer();
				}
                $.ajax({
                	url: sUrl,
                	type: 'GET',
                	cache: false
				}).done($.proxy(function (data) {
					view.template = template;
					view.model.set(data);
					view.afterRender = function (content) {
						$(elementID).removeClass('loading');
						$(elementID).html(content);

						// Who is using this? When should it be called? Before or after fpti?
						if (typeof func === 'function') {
							func();
						}
						//Triggers the view name once fetched
						$('body').trigger("viewLoaded", [view.template]);
					};
					view.render();
					if (fptiPage) {
						this.recordModuleLoadTime(view.model.get("sys"), fptiPage, data.data);
					}
				}, this)).fail (function(xhr){
					view.template = template;
					view.model.set({data : {error : true, errorInfo : true}});
					$('body').trigger("viewLoaded", [view.template]);
					view.afterRender = function (content) {
						$(elementID).removeClass('loading');
						$(elementID).html(content);
					};
					view.render();
					var redirectUrl = (xhr) ? xhr.getResponseHeader("location") : null;
					if(typeof redirectUrl === "string") {
						window.location = redirectUrl;
					}
				});
			},

            fetchAndRender: function (sUrl, oConfig, view, fptiPage) {

                //need to redo with different pxpContext pxpSessionActivity
               var pxpSessionActivity = window.sessionStorage.getItem("pxpSessionActivity");
                if (pxpSessionActivity === "true") {
                    $(window).scroll(function () {
                        if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
                            if ($('#showMoreID').is(":visible")) {
                                $('#showMoreID').click();
                            }
                        }
                    });
                }
                var pxpBackToActivityLink = window.sessionStorage.getItem("pxpBackToActivityLink");
                this.cachedRendered = false;

                if (pxpSessionActivity === "true" && pxpBackToActivityLink ==="true") {
                    return this.fetchFromCache(0, view, sUrl, oConfig, fptiPage);
                }
                else {
                    return this.fetchNew(sUrl, oConfig, view, fptiPage);
                }

            },




				checkForNewUpdatedTransactions: function (sUrl, oConfig) {
					oConfig.form.next_page_token="";
					var jqxhr = $.get(sUrl, oConfig.form, $.proxy(function (response) {

						var cachedTdActivities = window.sessionStorage.getItem('cachedActivities'), cachedActivities;
						if (cachedTdActivities) {
							cachedActivities = JSON.parse(cachedTdActivities);
						}


                                var compareDataTD = cachedActivities[0].data.transactions,
                                cachedDataTD = response.data.transactions,
                                key,
                                compareDataTDObj = {},
                                cachedDataTDObj = {};
						for(key in compareDataTD){
							compareDataTDObj[compareDataTD[key].transactionId]=compareDataTD[key].transactionStatus;
						}

						for(key in cachedDataTD){
							cachedDataTDObj[cachedDataTD[key].transactionId]=cachedDataTD[key].transactionStatus;
						}

					    var updateResult=false;
						for(key in compareDataTDObj){
							if(compareDataTDObj[key]!==cachedDataTDObj[key]){
								updateResult=true;
								break;
							}
						}
						if (updateResult) {
							$('#newOrUpdatedTransactions').remove();
							$('<div id="newOrUpdatedTransactions" >'+response.data.updateTransactionMsg.msg
									+' <a id="ShowNewOrUpdatedTransactions">'+response.data.updateTransactionMsg.show+'</a></div>')
									.insertAfter('.merchant-header');
							$('#ShowNewOrUpdatedTransactions').click(function() {
								this.clearCachedActivitiesInSession();
								location.href = location.href;
							});
						}


					}, this)).done(function (data) {
					}).fail(function (xhr) {

					});

				},


				clearCachedActivitiesInSession:function(viewTemplate){
					if (viewTemplate === "transactions/activityPxpColumns") {
						window.sessionStorage.setItem('cachedActivities', null);

					} else if (viewTemplate === "transactions/bookkeeping") {
						window.sessionStorage.setItem('cachedBookkeeping', null);
					}
				},

				fetchNew:function (sUrl, oConfig, view, fptiPage){
					var jqxhr = $.get(sUrl, oConfig.form, $.proxy(function (data) {
						var renderView = true;
						oConfig.callback.call(this, data, oConfig);
						if (oConfig.renderCheck && typeof oConfig.renderCheck === 'function') {
							renderView = oConfig.renderCheck(data);
						}
						if(this.incrementalFetch===false){
							this.clearCachedActivitiesInSession(oConfig.template);
						}
						if (renderView) {
							view.template = oConfig.template;
							view.model.set(data);
							var cachedItem, cachedActivitesTmp;
							cachedItem = {data: data, oConfig: JSON.parse(JSON.stringify(oConfig))};
							if(oConfig.template==="transactions/activityPxpColumns") {
								  cachedActivitesTmp = JSON.parse(window.sessionStorage.getItem('cachedActivities')) || [];
								  cachedActivitesTmp.push(cachedItem);
								  window.sessionStorage.setItem('cachedActivities', JSON.stringify(cachedActivitesTmp));

							}else if(oConfig.template==="transactions/bookkeeping"){
								cachedActivitesTmp = JSON.parse(window.sessionStorage.getItem('cachedBookkeeping')) || [];
								cachedActivitesTmp.push(cachedItem);
								window.sessionStorage.setItem('cachedBookkeeping', JSON.stringify(cachedActivitesTmp));

							}
							view.render();
						}
						window.sessionStorage.hawk_filter_updated = false;
						if (fptiPage) {
							this.recordModuleLoadTime(view.model.get("sys"), fptiPage, data.data);
						}
					}, this)).done(function (data) {
						//Triggers the view name once fetched
						$('body').trigger("viewLoaded", [data.viewName]);

					}).fail(function (xhr) {
						var redirectUrl = (xhr) ? xhr.getResponseHeader("location") : null;
						if (typeof redirectUrl === "string") {
							window.location = redirectUrl;
						}
					});
					return jqxhr;

				},

				fetchFromCache:function(itr,view,sUrl,oConfig,fptiPage){
					window.sessionStorage.setItem("activitydetailtransit","false");
					var self=view;
					var cachedActivities;
					if(self.template==="transactions/activityPxpColumns") {
						var cachedActivities = window.sessionStorage.getItem('cachedActivities');

						if (cachedActivities) {
							cachedActivities = JSON.parse(cachedActivities);
						}
					}
					else if(self.template==="transactions/bookkeeping"){
						 cachedActivities = window.sessionStorage.getItem('cachedBookkeeping');
						if (cachedActivities) {
							cachedActivities = JSON.parse(cachedActivities);
						}
					}

					if (cachedActivities) {
						if (itr < cachedActivities.length) {
							var cachedItem = cachedActivities[itr].data;
							if (itr) {
								self.incrementalFetch = true;
							}
							else {
								self.incrementalFetch = false;
							}
							self.oConfigCallback(cachedItem);
							self.cachedRendered = true;
							self.cachedRenderedNext = itr + 1;
                            if(itr === (cachedActivities.length-1)){
                                self.cachedRenderedLastsection=true;
                            }
							self.model.set(cachedItem);
							self.render();
							if (itr === 0 && sUrl) {
								this.checkForNewUpdatedTransactions(sUrl, JSON.parse(JSON.stringify(cachedActivities[0].oConfig)));
							}

						}
						if(itr === (cachedActivities.length-1)){
							this.fetchSingleTransaction(cachedActivities,sUrl, self.template);

						}
					}
					else{
						return this.fetchNew(sUrl, oConfig, view, fptiPage);
					}

				},
            fetchSingleTransaction: function(cachedActivities,sUrl, template){
                var tUrl=null;
                var redirectedtransactionId=window.sessionStorage.getItem('transactiodIdReidrect');
                var that=this;

                //We need to search for 3 years range and create url for search
                if(redirectedtransactionId) {
                    var currentDate = moment();
                    var datePastThreeYears = moment().subtract(3, 'years').add(1, 'day');
                    var fromDate = {};
                    var toDate = {};
                    fromDate.info = {};
                    toDate.info = {};
                    fromDate.info.month = datePastThreeYears.month();
                    fromDate.info.day = datePastThreeYears.date();
                    fromDate.info.year = datePastThreeYears.year();
                    toDate.info.month = currentDate.month();
                    toDate.info.day = currentDate.date();
                    toDate.info.year = currentDate.year();
                    tUrl=sUrl+'/searchTransactions?search_text='+redirectedtransactionId+'&limit=&sort=time_created&incrementalFetch=false&need_actions=true&need_shipping_info=true&next_page_token=&searchtype=TRANSACTION_ID&fromdate_year='+fromDate.info.year+'&fromdate_month='+fromDate.info.month +'&fromdate_day='+fromDate.info.day+'&todate_year='+toDate.info.year+'&todate_month='+toDate.info.month+'&todate_day='+toDate.info.day;
                }

                //This call is made to get the data of single transaction and see if any data is modified
                $.ajax({
                    url: tUrl,
                    type: 'GET',
                    cache: false
                }).done(function (data) {
	                if(data.data.transactions) {
	                    var result = data.data.transactions.filter(function( obj ) {
	                        return obj.transactionId ===redirectedtransactionId;
	                    });
	                    //result[0].transactionDescription.name='shubham'
	                    var cachedResult = [];
	                    var cacheLength=cachedActivities.length;
	                	for(var i=0;i<cacheLength;i++){
								cachedResult=cachedActivities[i].data.data.transactions.filter(function( obj ) {
								return obj.transactionId == redirectedtransactionId;
							});
						}
	                    var isEqual = true;
	                    var subsetResult = that.cloneAndPluck(result[0],["transactionDescription","actionList", "transactionTime", "grossAmount", "feeAmount", "netAmount", "balanceAmount"]);
	                    var subsetCache = that.cloneAndPluck(cachedResult[0],["transactionDescription","actionList", "transactionTime", "grossAmount", "feeAmount", "netAmount", "balanceAmount"]);
	                    if(JSON.stringify(subsetResult) !== JSON.stringify(subsetCache)){
	                        isEqual = false;
	                    }
	                    var isUpdated=false;
	                    var elementPos=null;
	                    var cacheIndex=null;

	                    if(!isEqual){
	                    	for(var i=0;i<cacheLength;i++){
										elementPos=cachedActivities[i].data.data.transactions.map(function(x) {return x.transactionId; }).indexOf(redirectedtransactionId);
										if(elementPos){
											cacheIndex=i;
											break;
										}
							}
	                    }
	                    var isactivityPage=  true;
	                    var rowToEdit = document.getElementById(redirectedtransactionId);

	                    if(template==="transactions/bookkeeping"){
	                        isactivityPage=false;
	                        var searchBookkeepingRow=redirectedtransactionId+'-';
	                        rowToEdit = document.getElementById(searchBookkeepingRow);
	                    }

	                    if(!isEqual){
	                        if(isactivityPage){
	                            if(result[0].transactionDescription.name !== cachedResult[0].transactionDescription.name){
	                                rowToEdit.getElementsByClassName('name')[0].childNodes[2].innerHTML=result[0].transactionDescription.name;
	                                cachedActivities[cacheIndex].data.data.transactions[elementPos].transactionDescription.name=result[0].transactionDescription.name;
	                                isUpdated = true;
	                            }
	                            if(result[0].transactionDescription.description !== cachedResult[0].transactionDescription.description){
	                                rowToEdit.getElementsByClassName('type')[0].childNodes[0].innerHTML=result[0].transactionDescription.description;
	                                cachedActivities[cacheIndex].data.data.transactions[elementPos].transactionDescription.description = result[0].transactionDescription.description;
	                                isUpdated = true;
	                            }
	                            if(result[0].actionList.length>0){
	                                if(JSON.stringify(result[0].actionList) !== JSON.stringify(cachedResult[0].actionList)){
	                                    var alink='',
	                                            liLink='';
	                                    var button = '<button class="action-toggle btn dropdown-toggle" data-toggle="dropdown"><span class="icon icon-small icon-arrow-down-small"></span></button>';
	                                    var dropdownHtml = '<ul class="dropdown-menu">';
	                                    for(var i=0;i<result[0].actionList.length;i++){
	                                        if(result[0].actionList[i].url){
	                                            var linkClass='action-transit';
	                                            if(result[0].actionList[i].isNewWindow){
	                                                linkClass='popupLink';
	                                            }
	                                            if(result[0].actionList[i].orderurl){
	                                                if(i===0){
	                                                    alink = '<a href="/cgi-bin/webscr?cmd='+result[0].actionList[0].url+'" data-action-name='+result[0].actionList[0].name+' class="btn action-link'+linkClass+'">'+result[0].actionList[0].name+'</a>';
	                                                }
	                                                liLink = '<li><a href="/cgi-bin/webscr?cmd='+result[0].actionList[i].url+'" data-action-name='+result[0].actionList[i].name+' class="action-link'+linkClass+'">'+result[0].actionList[i].name+'</a></li>';

	                                            }
	                                            else{
	                                                if(i===0){
	                                                    alink = '<a href="/webscr?cmd='+result[0].actionList[0].url+'" data-action-name='+result[0].actionList[0].name+' class="btn action-link'+linkClass+'">'+result[0].actionList[0].name+'</a>';
	                                                }
	                                                liLink = '<li><a href="/webscr?cmd='+result[0].actionList[i].url+'" data-action-name='+result[0].actionList[i].name+' class="action-link'+linkClass+'">'+result[0].actionList[i].name+'</a></li>';
	                                            }
	                                        }
	                                        else{
	                                            var linkClassNotUrl='archive';
	                                            if(result[0].actionList[i].type==='SHOW'){
	                                                linkClassNotUrl = 'unarchive';
	                                            }
	                                            if(i===0){
	                                                alink = '<a href="javascript:void(0)" data-action-name='+result[0].actionList[0].name+' class="btn '+linkClassNotUrl+' action-link">'+result[0].actionList[0].name+'</a>';
	                                            }
	                                            liLink = '<li><a href="javascript:void(0)" data-action-name='+result[0].actionList[i].name+' class=" '+linkClassNotUrl+' action-link">'+result[0].actionList[i].name+'</a></li>';
	                                        }
	                                        dropdownHtml = dropdownHtml + liLink;
	                                    }
	                                    dropdownHtml=dropdownHtml+'</ul>';
	                                    rowToEdit.getElementsByClassName('show')[0].childNodes[0].classList.remove('single-item');
	                                    rowToEdit.getElementsByClassName('show')[0].childNodes[0].innerHTML=alink+button+dropdownHtml;
	                                }
	                            }
	                            else{
	                                rowToEdit.getElementsByClassName('show')[0].innerHTML='';
	                            }
	                            cachedActivities[cacheIndex].data.data.transactions[elementPos].actionList=result[0].actionList;
	                            isUpdated = true;

	                        }

	                        if(result[0].transactionTime != cachedResult[0].transactionTime){
	                            if(isactivityPage){
	                                rowToEdit.getElementsByClassName('date')[0].childNodes[0].innerHTML=result[0].transactionTime;
	                            }
	                            else{
	                                rowToEdit.getElementsByClassName('date')[0].innerHTML=result[0].transactionTime;
	                            }
	                            cachedActivities[cacheIndex].data.data.transactions[elementPos].transactionTime=result[0].transactionTime
	                            isUpdated = true;
	                        }
	                        if(result[0].grossAmount.amountInSymbolCurrencyCode != cachedResult[0].grossAmount.amountInSymbolCurrencyCode){
	                            if(isactivityPage){
	                                rowToEdit.getElementsByClassName('price')[0].childNodes[0].innerHTML = result[0].grossAmount.amountInSymbolCurrencyCode;
	                            }
	                            else{
	                                rowToEdit.getElementsByClassName('gross')[0].innerHTML = result[0].grossAmount.amountInSymbolCurrencyCode;
	                            }
	                            cachedActivities[cacheIndex].data.data.transactions[elementPos].grossAmount.amountInSymbolCurrencyCode=result[0].grossAmount.amountInSymbolCurrencyCode
	                            isUpdated = true;
	                        }
	                        if(result[0].feeAmount.amount != cachedResult[0].feeAmount.amount){
	                            if(isactivityPage){
	                                rowToEdit.getElementsByClassName('price')[0].childNodes[1].innerHTML = result[0].feeAmount.amount;
	                            }
	                            else{
	                                rowToEdit.getElementsByClassName('fee')[0].innerHTML = result[0].feeAmount.amount;
	                            }
	                            cachedActivities[cacheIndex].data.data.transactions[elementPos].feeAmount.amount=result[0].feeAmount.amount;
	                            isUpdated = true;
	                        }
	                        if(result[0].netAmount.amount != cachedResult[0].netAmount.amount){
	                            if(isactivityPage){
	                                rowToEdit.getElementsByClassName('net')[0].childNodes[0].innerHTML = result[0].netAmount.amount;
	                            }
	                            else{
	                                rowToEdit.getElementsByClassName('net')[0].innerHTML = result[0].netAmount.amount;
	                            }
	                            cachedActivities[cacheIndex].data.data.transactions[elementPos]
	                            isUpdated = true;
	                        }
	                        if(result[0].balanceAmount.amountInSymbolCurrencyCode != cachedResult[0].balanceAmount.amountInSymbolCurrencyCode){
	                            if(isactivityPage){
	                                rowToEdit.getElementsByClassName('balance')[0].childNodes[0].innerHTML = result[0].balanceAmount.amountInSymbolCurrencyCode;
	                            }
	                            else{
	                                rowToEdit.getElementsByClassName('balance')[0].innerHTML = result[0].balanceAmount.amountInSymbolCurrencyCode;
	                            }
	                            cachedActivities[cacheIndex].data.data.transactions[elementPos]
	                            isUpdated=true;
	                        }
	                        if(!isactivityPage){
	                            var ablink=null;
	                            if(result[0].NewNodeURL){
	                                ablink='<a class="rowClick" href="/activity/payments/'+result[0].transactionId+'" data-pa-click="'+result[0].fptiPageName+'">&nbsp;</a>';
	                            }
	                            else{
	                                ablink='<a class="rowClick" href="/webscr?cmd=_history-details-from-hub&id='+result[0].transactionId+'" data-pa-click="'+result[0].fptiPageName+'">&nbsp;</a>';
	                            }
	                            isUpdated = true;
	                            var nameText='<strong class="descMini">'+result[0].transactionDescription.description +' '+ result[0].transactionDescription.name+'</strong>';
	                            rowToEdit.getElementsByClassName('desc')[0].innerHTML=ablink+nameText;
	                        }
	                    }
	                    if(isUpdated){
	                        $(rowToEdit).children().css("background-color",'#FFFFE0');
	                        setTimeout(function () {
	                            $(rowToEdit).children().css("background-color",'');
	                        }, 3000);

	                        if(template==="transactions/bookkeeping"){
	                            window.sessionStorage.setItem('cachedBookkeeping',JSON.stringify(cachedActivities));
	                        }
	                        else if(template==="transactions/activityPxpColumns") {
	                            window.sessionStorage.setItem('cachedActivities',JSON.stringify(cachedActivities));
	                        }
	                    }
	                }
                }, this).fail (function(xhr){

                });
            },

            cloneAndPluck: function(sourceObject, keys) {
                var newObject = {};
                keys.forEach(function(key) { newObject[key] = sourceObject[key]; });
                return newObject;
            },



            fetchAndRenderWithTabCheck: function (sUrl, oConfig, view, fptiPage) {
                    if (fptiPage) {
                        this.startModuleLoadTimer();
                    }
                    this.cachedRendered = false;
                    var activityBookkeepingTabRevisit = false;
                    var activityDetailsBack = false;
                    var currTab, checkForRevisit = false;
                    if (this.template === "transactions/activityPxpColumns") {
                        currTab = "activity";
                        checkForRevisit = true;

                    } else if (this.template === "transactions/bookkeeping") {
                        currTab = "bookkeeping";
                        checkForRevisit = true;
                    }

                    var visitedPage = window.sessionStorage.getItem("visitedActivityPage");
                    if (visitedPage !== null && visitedPage !== "cleared" && checkForRevisit) {
                        visitedPage = JSON.parse(visitedPage);
                        if (visitedPage[currTab]) {
                            activityBookkeepingTabRevisit = true;
                        } else {
                            visitedPage[currTab] = true;
                            window.sessionStorage.setItem("visitedActivityPage", JSON.stringify(visitedPage));
                        }
                    } else {
                        visitedPage = {};
                        visitedPage[currTab] = true;
                        window.sessionStorage.setItem("visitedActivityPage", JSON.stringify(visitedPage));
                    }
                    if (window.sessionStorage.getItem("activitydetailtransit") === "true") {
                        activityDetailsBack = true;
                    }


                    if (activityDetailsBack || activityBookkeepingTabRevisit) {
                        return this.fetchFromCache(0, view, sUrl, oConfig, fptiPage);
                    }
                    else {
                        return this.fetchNew(sUrl, oConfig, view, fptiPage);
                    }


				},


            startModuleLoadTimer: function(){
                try {
                    window.PAYPAL.analytics.Analytics.prototype.recordAjaxStartTime();
                  }
                catch(err) {
                    // Error Caught for Analytics
                }
            },
            recordModuleLoadTime: function(sys, fptiPage, data){
                if(sys){
                    var analyticsInstance = window.PAYPAL.analytics.instance,
                        fptiData = analyticsInstance && analyticsInstance.utils.queryStringToObject(sys.tracking.fpti.dataString);
                    fptiData.page = fptiPage;
                    fptiData.e = "im";
                    fptiData.pgrp = "main:businessweb:home::main";

                    // added to read fpti data from sparta activity tile
                    if(fptiPage === "main:businessweb:home::main:activity-module::") {
                        fptiData.tssrq = data.moduleLoadStartTime;
                        fptiData.tssrs = data.moduleLoadEndTime;
                    }

					if(data.serviceError) {
						fptiData.erpg = this.hawk_service_timeout_error;
						fptiData.eccd = data.serviceError;
					}

                    sys.tracking.fpti.dataString = $.param(fptiData);
                    analyticsInstance.recordAjaxPerformanceData({sys: sys}); //fpti call with module load times
                }
            },

			handleErrorScenarios: function (data, eDest) {
				if (data && data.data && data.data.errorInfo) {
					var errorHtml = '<div class="row-fluid"><div class="error-wrap ' + data.data.errorInfo.messageType + ' clearfix"><span class="message-wrap"><span class="message">' + data.data.errorInfo.message + '</span></span><i class="icon"></i></div></div>';
					$(eDest).html(errorHtml);
				} else if (data === undefined || data.type == 'redirect') {
					window.location.href = data ? data.url : window.location.href;
				}
			},

			/**
			 * Updates DateModified Flag, when triggered from DateRangeFilterView
			 */
			updateDateModifiedFlag: function (oFilter) {
				if (!this.dateModified) {
					this.dateModified = true;
					// console.log('dateModified Flag: '+this.dateModified);
					// console.log(oFilter);
					this.applyFilter(oFilter);
				}
			},

			updateCurrencyFlag: function (oFilter) {
				if (!this.currencyModified) {
					this.currencyModified = true;
					// console.log('currencyModified Flag: '+this.currencyModified);
					this.applyFilter(oFilter);
				}
			},

			updateIncrementalFetch: function (event) {
				this.applyFilter({
					incrementalFetch: true
				});
			},

			//hide all Datefilter instances & show the right one
			showTabSpecificDateFilter: function () {
				$('.dateFilterWrap').hide();
				$('#' + this.mainTab + 'DateFilter').show();
			},

			/* Append UTC formatted dates to the request */
			convertDatesToUTC: function(eForm) {
				var sMomentDateFormat = $("#datePattern").val().toUpperCase();
				if(eForm.fromdate) {
					eForm.fromdate_utc = moment(eForm.fromdate, sMomentDateFormat).utc().format();
				}
				if(eForm.todate) {
					eForm.todate_utc = moment(eForm.todate, sMomentDateFormat).utc().format();
				}
			},

			/* Append day, month and year to the request */
			appendDateInfo: function(eForm) {
				var sMomentDateFormat = $("#datePattern").val().toUpperCase();
				var momentFromDate = null, momentToDate = null;
				if(eForm.fromdate) {
					momentFromDate = moment(eForm.fromdate, sMomentDateFormat);
					if(momentFromDate) {
						eForm.fromdate_year = momentFromDate.year();
						eForm.fromdate_month = momentFromDate.month();
						eForm.fromdate_day = momentFromDate.date();
					}
				}
				if(eForm.todate) {
					momentToDate = moment(eForm.todate, sMomentDateFormat);
					if(momentFromDate) {
						eForm.todate_year = momentToDate.year();
						eForm.todate_month = momentToDate.month();
						eForm.todate_day = momentToDate.date();
					}
				}
			},

			//Update new set of options to currency list / transaction type list, if the options are more than one, else hide it.
			updateMainFilterDropdownList: function (data, sDateFilterId,flag) {
			  var dropdownObjParams;
			  if(flag === "currency")
			  {
			  	dropdownObjParams={
			  		"listLength":data.transactionsCurrenciesList.optionList.length,
			  		"dropdownID":sDateFilterId + '-currency',
			  		"spanID":sDateFilterId + '-currencySelectWrap',
			  		"dropdownData":data.transactionsCurrenciesList
			  	};
			  }
			  else{
			  	dropdownObjParams={
			  		"listLength":data.transactionsTypesList.optionList.length,
			  		"dropdownID":sDateFilterId + '-transaction-type',
			  		"spanID":sDateFilterId + '-transaction-filter-select .dropdownWrapper',
			  		"dropdownData":data.transactionsTypesList
			  	};
			  }
			  $(dropdownObjParams.dropdownID).html('');
              for(var i=0; i<dropdownObjParams.listLength; i += 1){
                var currentItem = dropdownObjParams.dropdownData.optionList[i],
                    optionItem = $('<option>');
                if(currentItem.optionValue === dropdownObjParams.dropdownData['defaultOption']) {
                  $(dropdownObjParams.spanID +' .dropdown .option-text').html(currentItem.optionName);
                    optionItem.val(currentItem.optionValue).text(currentItem.optionName).appendTo(dropdownObjParams.dropdownID).attr('selected', 'selected');
                } else {
                    optionItem.val(currentItem.optionValue).text(currentItem.optionName).appendTo(dropdownObjParams.dropdownID);
                }
              }
              if(data.fpti){
              optionItem.addClass("scTrack:"+currentItem.optionValue);
            }

              if(flag === "currency"){
              	var currencyFilterSet = $(sDateFilterId + '-currencySelectWrap, ' + sDateFilterId + '-transactionSelectWrap+.filter-text');
				(dropdownObjParams.listLength <= 1) ? currencyFilterSet.hide() : currencyFilterSet.show();
              }
              else{
              	var transactionsFilterSet  = $(sDateFilterId + '-transaction-filter-select');
             	transactionsFilterSet.show();
              }
		    },


            /**
             *  This function provides click tracking by firing off an fpti event.
             *  This should be used instead of scTrack, which is unreliable.
             */
            fptiRecordClick: function (pageName, pageGroup, template, link, toolName) {
                if (window.PAYPAL && window.PAYPAL.analytics && window.PAYPAL.analytics.instance && window.PAYPAL.analytics.instance.recordClick) {

                    if (window.fpti) {
                        window.fpti.page = pageName;
                        window.fpti.e = "cl";
                        window.fpti.pgrp = pageGroup;
                        window.fpti.tmpl = template;
                        window.fpti.toolName = toolName;
                        window.fpti.link = link;

                        window.PAYPAL.analytics.instance.recordClick();
                    }
                }
            },

			fptiRecordImpression: function(pageName, pageGroup, template) {
				if (window.PAYPAL && window.PAYPAL.analytics && window.PAYPAL.analytics.instance && window.PAYPAL.analytics.instance.recordImpression) {
					if (window.fpti) {
						window.fpti.page = pageName;
						window.fpti.e = "im";
						window.fpti.pgrp = pageGroup;
						window.fpti.tmpl = template;

						window.PAYPAL.analytics.instance.recordImpression();
					}
				}
			},

			getParameterByName: function(name, url) {
				var regex, results;
			    name = name.replace(/[\[\]]/g, "\\$&");// This is just to avoid case sensitiveness for query parameter name
			    regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			    results = regex.exec(url);
			    if (!results) return null;
			    if (!results[2]) return '';
			    return decodeURIComponent(results[2].replace(/\+/g, " "));
			}
		};

		return Helper;
	});

define('view/api/loadingIcon',['jquery', 'backbone', 'BaseView'], function ($, Backbone, BaseView) {
	'use strict';

	var View = BaseView.extend({

		el: '.loadingIcon',

		template: 'api/inc/loadingIcon',

		events: {},

		initialize: function initialize() {
			this.render();
		}
	});

	return View;
});

define('view/api/responseMessage',['jquery', 'backbone', 'BaseView'], function ($, Backbone, BaseView) {
	'use strict';

	var View = BaseView.extend({

		el: '.accessTokenHeader',

		template: 'api/inc/responseMessage',

		events: {},

		initialize: function initialize() {
			//this.render();
		}
	});

	return View;
});

define('view/api/index',['jquery', 'backbone', 'lib/bootstrap-3.4.1', 'lib/business/businessHelper', 'BaseView', 'nougat', 'underscore', 'dust', 'view/api/loadingIcon', 'view/api/responseMessage'], function ($, Backbone, Bootstrap, businessHelper, BaseView, nougat, _, Dust, LodingIconView, ResponseMessageView) {
	'use strict';

	var View = BaseView.extend({

		el: '#accessToken',

		template: 'api/inc/accessToken',
		//FPTI page constants
		PAGE_NAME: "main:businessweb:apiaccess::main:::",
		PAGE_GROUP: "main:businessweb:apiaccess::main",
		TEMPLATE: "bizprofilenodeweb/public/templates/api/inc/accessToken.dust",

		events: {
			'click .tokenButton': 'showHideToken',
			'click .button': 'submitEmail',
			'keyup #emailAddress': 'checkValidEmail',
			'click .requestToken': 'requestToken'
		},

		initialize: function initialize() {

			this.listenTo(Backbone, 'toggleLoading', this.toggleLoading);
			this.loadingIconView = this.loadingIconView || new LodingIconView({
				model: new Backbone.Model()
			});
			this.responseMessageView = this.responseMessageView || new ResponseMessageView({
				model: new Backbone.Model()
			});
			this.model = this.model || new Backbone.Model();
		},
		render: function render() {
			this.responseMessageView.$el.detach();
			Dust.render(this.template, this.model.toJSON(), function (err, html) {
				this.$el.html(html);
				if (!this.model.attributes.error) {
					this.$el.find('.accessTokenHeader').replaceWith(this.responseMessageView.el);
				}
				this.$('.showHideToken').toggle();
				this.$('.apiToken').toggleClass('inline-block');
			}.bind(this));
		},

		/*
   * @Function: showHideToken
   * Show/Hide Braintree access token
  */
		showHideToken: function showHideToken(event) {
			var fptiLink = "show_API_Token";
			event.preventDefault();
			// Fire fpti event when show/hide is clicked

			if ($('.hideToken').is(":visible")) {
				fptiLink = "hide_API_Token";
			}
			businessHelper.fptiRecordClick(this.PAGE_NAME, this.PAGE_GROUP, this.TEMPLATE, fptiLink);
			this.$('.showHideToken').toggle();
			this.$('.apiToken').toggleClass('inline-block');
		},

		/*
   * @Function: checkValidEmail
   * Validate email address
  */

		checkValidEmail: function checkValidEmail(event) {

			var emailAddress = this.$('#emailAddress'),
			    emailInput = this.$('.emailInput'),
			    submitButton = this.$('.button');

			submitButton.prop('disabled', false);

			submitButton.removeClass('disabled');

			if (emailAddress[0].checkValidity()) {
				this.$('#helpBlock').hide();
				emailInput.addClass('has-success');
			} else {
				emailInput.removeClass('has-success').addClass('has-error');
			}
		},

		/*
   * @Function: submitEmail
   * Submit email
  */

		submitEmail: function submitEmail(event) {

			var emailAddress = this.$('#emailAddress'),
			    emailInput = this.$('.emailInput'),
			    errorBlock = this.$('#helpBlock'),
			    emailLoading = this.$('.emailLoading'),
			    fptiLink = "submit_Email";

			// Fire fpti event when submitEmail is clicked
			businessHelper.fptiRecordClick(this.PAGE_NAME, this.PAGE_GROUP, this.TEMPLATE, fptiLink);

			event.preventDefault();
			if (emailAddress[0].checkValidity()) {
				errorBlock.hide();
				this.loadingIconView.setElement('.showLoading').render();
				this.responseMessageView.model.url = Backbone.history.options.root + 'api/accessToken/sendEmail';

				emailInput.removeClass('has-success').removeClass('has-error');
				emailLoading.show();
				this.listenToOnce(this.responseMessageView.model, 'sync', this.submitEmailSuccess);
				this.listenToOnce(this.responseMessageView.model, 'error', this.submitEmailError);
				this.responseMessageView.model.save({ data: { email: emailAddress.val() } });
			} else {
				emailInput.removeClass('has-success').addClass('has-error');
				errorBlock.show();
			}
		},

		/*
   * @Function: submitEmailSuccess
   * Handle success email use case
  */

		submitEmailSuccess: function submitEmailSuccess(model, response) {
			var emailAddress = this.$('#emailAddress'),
			    emailLoading = this.$('.emailLoading');
			emailLoading.hide();
			emailAddress.val('');
			this.responseMessageView.model.set('data', response.data);
			this.responseMessageView.render();
		},

		/*
   * @Function: submitEmailError
   * Handle error email use case
  */

		submitEmailError: function submitEmailError(error, model, response) {

			if (this.verifyValidSession(response)) {
				this.responseMessageView.model.set('data', response.data);
				this.responseMessageView.render();
			}
		},

		/*
   * @Function: requestToken
   * Request New Braintree Access Token
  */

		requestToken: function requestToken(event) {
			var fptiLink = "vzero_credentials_request_token";

			event.preventDefault();

			if (!$(this.el).data('supported-account')) {
				this.requestTokenNotAllowed();
			} else {
				businessHelper.fptiRecordClick(this.PAGE_NAME, this.PAGE_GROUP, this.TEMPLATE, fptiLink);
				this.loadingIconView.setElement('.section').render();

				this.model.url = Backbone.history.options.root + 'api/accessToken/create';

				this.listenToOnce(this.model, 'sync', this.requestTokenSuccess);
				this.listenToOnce(this.model, 'error', this.requestTokenError);
				this.model.save();
			}
		},

		requestTokenNotAllowed: function requestTokenNotAllowed() {
			var data = {
				typeError: true,
				country: $(this.el).data('country')
			};
			this.responseMessageView.model.set('data', data);
			this.responseMessageView.render();
		},

		requestTokenSuccess: function requestTokenSuccess(model, response) {
			var successfptiLink = "vzero_credentials_request_token_success";
			if (model.attributes.error) {
				businessHelper.fptiRecordClick(this.PAGE_NAME, this.PAGE_GROUP, this.TEMPLATE, model.attributes.error.code);
			} else {
				businessHelper.fptiRecordClick(this.PAGE_NAME, this.PAGE_GROUP, this.TEMPLATE, successfptiLink);
			}
			this.model.set('data', response.data);
			this.render();
		},

		requestTokenError: function requestTokenError(error, model, response) {
			var errorfptiLink = "vzero_credentials_request_token_error";
			businessHelper.fptiRecordClick(this.PAGE_NAME, this.PAGE_GROUP, this.TEMPLATE, errorfptiLink);
			if (this.verifyValidSession(response)) {
				this.responseMessageView.model.set('data', response.data);
				this.responseMessageView.render();
			}
		},

		/*
   * @Function: verifyValidSession
   * Verify if user session exist if not .. please redirect to login page to login again.
  */
		verifyValidSession: function verifyValidSession(response) {

			var redirectUrl,
			    xhrRequest = response.xhr;
			// If user is not authorize please redirect user to login page
			if (xhrRequest.status === 401) {
				redirectUrl = xhrRequest ? xhrRequest.getResponseHeader("location") : null;
				if (typeof redirectUrl === "string") {
					window.location = redirectUrl;
				}
				return false;
			}
			return true;
		}
	});

	return View;
});

define('router',['jquery', 'underscore', 'backbone', 'nougat', 'constants', 'routes/settings', 'routes/mymoney', 'routes/mysettings', 'routes/mytools', 'routes/mypreferences', 'view/global', 'routes/partner', 'view/api/index'], function ($, _, Backbone, nougat, constants, SettingsRoute, MyMoneyRoute, MySettingsRoute, MyToolsRoute, MyPreferencesRoute, GlobalPageView, PartnerRoute, ApiView) {

	'use strict';

	return Backbone.Router.extend({

		/* Detect if the browser supports HTML5 push state */
		hasPushState: window.history && 'pushState' in window.history,

		/**
   * Register all the interesting URIs that will fire off generic or specific functionality
   */
		routes: {
			'partner(/*subroute)': 'invokePartner',
			'settings(/*subroute)': 'invokeSettings',
			'mymoney(/*subroute)': 'invokeMyMoney',
			'mysettings(/*subroute)': 'invokeMySettings',
			'mytools(/*subroute)': 'invokeMyTools',
			'mypreferences(/*subroute)': 'invokeMyPreferences',
			'profile(/*subroute)': 'invokeProfile'
			/* No generic route to avoid downloading/initializing JS files that do not exist */
		},

		/**
   * Important setup to start using the router.
   */
		initialize: function initialize() {

			// Get current fragment or current path for route for non pushState browsers
			var hash = window.location.hash,
			    fragment = hash && hash.length === 0 ? hash : window.location.pathname.substr(constants.ROOT.length);

			// set the default templates path depending on the value from json contract
			//alert('Context : ' + JSON.stringify($(document.body).data()));
			nougat.setContext($(document.body).data());

			this.globalPageView = new GlobalPageView();

			if ($("body").data("view-name") === "api/index") {
				new ApiView();
			}

			Backbone.history.start({
				silent: true, // Add hashUrl before executing the route for IE
				pushState: this.hasPushState, // Use HTML5 Push State if it's supported
				root: constants.ROOT // Initial path for app
			});

			// Load the initial route, using pushstate if supported, hashUrl if not
			if (this.hasPushState) {
				Backbone.history.loadUrl(Backbone.history.getFragment());
			} else {
				var rootLength = Backbone.history.options.root.length;
				// Get current fragment or current path for route for non pushState browsers
				fragment = window.location.hash || window.location.pathname.substr(rootLength);

				// Clear the history for IE for refreshing the page
				Backbone.history.fragment = null;
				$(window).scrollTop();

				Backbone.history.navigate(fragment, { trigger: true, replace: true });
			}
		},

		invokePartner: function invokePartner() {
			if (!this.PartnerRoute) {
				this.PartnerRoute = new PartnerRoute('partner', { createTrailingSlashRoutes: true });
			}
		},

		invokeSettings: function invokeSettings() {
			//alert('Inside invokesettings..!!');
			if (!this.SettingsRoute) {
				this.SettingsRoute = new SettingsRoute('settings', { createTrailingSlashRoutes: true });
			}
		},

		invokeMyMoney: function invokeMyMoney() {
			if (!this.MyMoneyRoute) {
				this.MyMoneyRoute = new MyMoneyRoute('mymoney', { createTrailingSlashRoutes: true });
			}
		},

		invokeMySettings: function invokeMySettings() {
			if (!this.MySettingsRoute) {
				this.MySettingsRoute = new MySettingsRoute('mysettings', { createTrailingSlashRoutes: true });
			}
		},

		invokeMyTools: function invokeMyTools() {
			if (!this.MyToolsRoute) {
				this.MyToolsRoute = new MyToolsRoute('mytools', { createTrailingSlashRoutes: true });
			}
		},

		invokeMyPreferences: function invokeMyPreferences() {
			if (!this.MyPreferencesRoute) {
				this.MyPreferencesRoute = new MyPreferencesRoute('mypreferences', { createTrailingSlashRoutes: true });
			}
		}
	});
});

