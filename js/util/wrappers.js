/**
 * This file is part of the Nodium core package
 *
 * (c) Niko van Meurs & Sid Mijnders
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @author Niko van Meurs <nikovanmeurs@gmail.com>
 */
(function (context, undefined) {

var app                 = context.setNamespace('app');

	// check if window
	if (context.window) {
	    app.clearTimeout    = window.clearTimeout.bind(context),
	    app.setTimeout      = window.setTimeout.bind(context),
	    app.open            = window.open.bind(context);
	}

}(this));