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
module.exports = (function (undefined) {

    const
        fs      = require('fs'),
        mkdirp  = require('mkdirp');

    var Builder,
        cache,
        traversed;

    Builder = {

        /** 
         * Concatenates all source files
         * and wraps them in a self-executing function
         * @param {Object} options
         */
        build: function (options) {

            var fixedOrder = options.fixedOrder;

            cache = [];
            cache.push(getHeader());

            traversed = options.exclude || [];

            if (fixedOrder && fixedOrder.length) {

                fixedOrder.forEach(function (path) {
                    traverse(options.srcDir + '/' + path);
                });
            }

            traverse(options.srcDir);

            cache.push(getFooter());

            writeFile(options.output, cache.join('\n'));
        }
    };

    /**
     * Returns the content of a file
     * @param {String} path
     * @return {String}
     */
    function getFileContents (path) {

        return fs.readFileSync(path);
    }

    /**
     * Returns the anonymous function wrapper call
     * @returns {String}
     */
    function getFooter () {
        return [
            "    return this.app;",
            "}(this));"
        ].join('\n');
    }

    /**
     * Returns a string with the global requires
     * @returns {String}
     */
    function getHeader () {
        return [
            "module.exports = (function (context) {",
            "    var _      = require('lodash'),",
            "        d3     = require('d3'),",
            "        jQuery = require('jquery');",
            "",
            "    this.app = {",
            "        context: {",
            "            _:      _,",
            "            d3:     d3,",
            "            jQuery: jQuery",
            "        }",
            "    };",
            ""
        ].join('\n');
    }

    /**
     * Checks if path is a directory
     * @param {String} path
     * @returns {Boolean}
     */
    function isDirectory (path) {

        return fs.statSync(path).isDirectory();
    }

    /**
     * Checks if path has a .js(x) extension
     * @param {String} path
     * @returns {Boolean}
     */
    function isJavaScriptFile (path) {

        return /\.js[x]?$/g.test(path);
    }

    /**
     * Recursively traverses a directory structure and adds js file contents to the cache
     * @param {String} path
     */
    function traverse (path) {
        var classPath;

        // console.log(path);

        if (traversed.indexOf(path) !== -1) {
            // console.log('skipping');
            return;
        }

        if (isJavaScriptFile(path)) {

            cache.push(getFileContents(path));

        } else if (isDirectory(path)) {

            fs.readdirSync(path + '/')
                .map(function (file) { return path + '/' + file; })
                .forEach(traverse);
        }

        traversed.push(path);
    }

    /**
     * Writes the compiled file, creates the directory structure if not present
     * @param {String} filePath
     * @param {String} content
     */
    function writeFile (filePath, content) {

        // create the directory structure if it doesn't exist
        mkdirp.sync(filePath.split('/').slice(0, -1).join('/'));

        fs.writeFileSync(filePath, content, { flag: 'w+' });
    }

    return Builder;
}());