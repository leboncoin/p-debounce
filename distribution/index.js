'use strict';

module.exports = function (fn, wait, opts) {
	if (!isFinite(wait)) {
		throw new TypeError('Expected `wait` to be a finite number');
	}

	opts = opts || {};

	var leadingVal = void 0;
	var timer = void 0;
	var resolveList = [];

	return function () {
		var ctx = this;
		var args = arguments;

		return new Promise(function (resolve) {
			var runImmediately = opts.leading && !timer;

			clearTimeout(timer);

			timer = setTimeout(function () {
				timer = null;

				var res = opts.leading ? leadingVal : fn.apply(ctx, args);

				for (var i = 0, len = resolveList.length; i < len; i++) {
					resolve(res);
				}

				resolveList = [];
			}, wait);

			if (runImmediately) {
				leadingVal = fn.apply(ctx, args);
				resolve(leadingVal);
			} else {
				resolveList.push(resolve);
			}
		});
	};
};