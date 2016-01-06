(function(window, document) {
var gQuery=
function gQuery(selector, context) {
	if (this instanceof $) {
		return this._initialize(selector, context);
	}
	else {
		return new $(selector, context);
	}
}

window.gQuery = (function() {
	var S_LENGTH = 'length';  // happy after minified
	var $ = gQuery;
	var $$ = $.fn = $.prototype;
	var f_forEach = [].forEach;

	$$._initialize = function(arg0, context) {
		var that = this;  // happy after minified

		var nodes;
		// gQuery('#foo .bar')
		if (typeof arg0 === 'string') {
			nodes = (context || document).querySelectorAll(arg0);
		}
		// gQuery(document.querySelectorAll('#foo .bar'))
		else if (arg0 && S_LENGTH in arg0) {
			nodes = arg0;
		}
		// gQuery(document.querySelector('#foo .bar'))
		else {
			nodes = (arg0 ? [arg0] : []);
		}

		that[S_LENGTH] = nodes[S_LENGTH];
		f_forEach.call(nodes, function(el, index) {
			that[index] = el;
		});

		return that;
	};

	$$.forEach = function(fn) {
		f_forEach.call(this, fn);
		return this;
	};

	return $;
})();

gQuery.extend = function(source /*, ... */) {
	var args = Array.prototype.slice.call(arguments, 1);
	args.forEach(function(props) {
		for (var name in props) { source[name] = props[name]; }
	});
	return source;
};

/**
 * Get an attribute's value.
 * @param {String} name An attribute's name.
 * @returns {String} The value of the specified attribute.
 */
gQuery.prototype.attr = function(name, value) {
	if (arguments.length < 2) {
		// multi setter
		if (typeof name !== 'string') {
			var attrs = name;
			for (name in attrs) {
				value = attrs[name];
				this.forEach(function(el, index) {
					el.setAttribute(name, value);
				});
			}
			return this;
		}
		// getter
		else {
			var el = this[0];
			return el && el.getAttribute(name);
		}
	}
	// setter
	else {
		this.forEach(function(el, index) {
			el.setAttribute(name, value);
		});
		return this;
	}
};

gQuery.fn.children = function(selector) {
	var els = [];
	this.forEach(function(el) {
		var children = el.childNodes;
		for (var i=0, l=children.length; i<l; i++) {
			var child = children[i];
			if (!selector || child.matches(selector)) {
				els.push(child);
			}
		}
	});
	return gQuery(els);
};

gQuery.fn.css = function(name, value) {
	if (arguments.length < 2) {
		// multi setter
		if (typeof name !== 'string') {
			var attrs = name;
			for (name in attrs) {
				value = attrs[name];
				this.forEach(function(el, index) {
					el.style[name] = value;
				});
			}
			return this;
		}
		// getter
		else {
			var el = this[0];
			return el && window.getComputedStyle(el)[name];
		}
	}
	// setter
	else {
		this.forEach(function(el, index) {
			el.style[name] = value;
		});
		return this;
	}
};

gQuery.fn.eq = function(index) {
	return gQuery(this[index]);
};

gQuery.fn.filter = function(selector) {
	var els = [];
	this.forEach(function(el) {
		if (el.matches(selector)) {
			els.push(el);
		}
	});
	return gQuery(els);
};

gQuery.fn.find = function(selector) {
	var trimmed = String.trim(selector);
	if (trimmed.charAt(0) === '>') {
		return this.children(trimmed.slice(1));
	}
	else {
		var els = [];
		this.forEach(function(el) {
			gQuery(selector, el).forEach(function(el) {
				els.push(el);
			});
		});
		return gQuery(els);
	}
};

gQuery.fn.html = function(html) {
	if (arguments.length < 1) {
		if (this.length > 0) {
			return this[0].innerHTML;
		}
		// else {
		// 	return undefined;
		// }
	}
	else {
		this.forEach(function(el) {
			el.innerHTML = html;
		});
		return this;
	}
};
gQuery.fn._initialize = (function() {
	var f_initialize = gQuery.fn._initialize;
	return function(arg0, context) {
		if (typeof arg0 === 'string' && arg0[0] === '<') {
			var elOuter = document.createElement('div');
			elOuter.innerHTML = arg0;
			arg0 = elOuter.childNodes;
		}

		return f_initialize.call(this, arg0, context);
	};
})();

gQuery.fn.is = function(selector) {
	var matched = true;
	this.forEach(function(el) {
		matched = matched && el.matches(selector);
	});
	return matched;
};

gQuery.fn.on = function(type, listener) {
	this.forEach(function(el, index) {
		el.addEventListener(type, listener, false);
	});
	return this;
};

gQuery.fn.parent = function(selector) {
	var els = [];
	this.forEach(function(el) {
		var parent = el.parentNode;
		if (parent) {
			els.push(parent);
		}
	});
	return gQuery(els);
};

gQuery.fn.prop = function(name, value) {
	// getter
	if (arguments.length < 2) {
		if (this.length > 0) {
			var el = this[0];
			return el[name];
		}
		// else {
		// 	return undefined;
		// }
	}
	// setter
	else {
		this.forEach(function(el, index) {
			el[name] = value;
		});
		return this;
	}
};

gQuery.fn.remove = function() {
	this.forEach(function(el, index) {
		var parent = el.parentNode;
		if (parent) {
			parent.removeChild(el);
		}
	});
	return this;
};

gQuery.fn.text = function(text) {
	if (arguments.length < 1) {
		if (this.length > 0) {
			return this[0].textContent;
		}
		// else {
		// 	return undefined;
		// }
	}
	else {
		this.forEach(function(el) {
			el.textContent = text;
		});
		return this;
	}
};

// Dependences
// prop
gQuery.fn.val = function(value) {
	if (arguments.length < 1) {
		return this.prop('value');
	}
	else {
		return this.prop('value', value);
	}
};

})(window, document)