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

    var util = context.setNamespace('app.util');

    /**
     * Used to retrieve a function with name functionName from a superClass's prototype object
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf|Object.getPrototypeOf()}
     * @param {String} functionName
     * @returns {Function}
     */
    util.super = function (functionName) {

        var superContext = this._superContext,
            prototype = Object.getPrototypeOf(this._superContext),
            args;

        args = [].slice.call(arguments, 0);

        this._superContext = prototype;

        if (prototype.hasOwnProperty(functionName)) {

            return prototype[functionName].apply(this, args);
        }

        this._superContext = superContext;
    };
}(this));
