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
 * @author Sid Mijnders
 */
const
    Builder    = require('./build/Builder'),
    browserify = require('browserify'),
    gulp       = require('gulp'),
    rename     = require('gulp-rename'),
    uglify     = require('gulp-uglify'),
    source     = require('vinyl-source-stream');


gulp.task('build', function () {
    Builder.build({
        srcDir: './js',
        output: './js/nodium.js',
        fixedOrder: [
            'namespace',
            'util/wrappers.js',
            'util/super.js',
            'util',
            'event',
            'model'
        ],
        exclude: [
            'nodium.js',
            'wrapper.js'
        ]
    });

    var bundler,
        stream;

    bundler = browserify('./js/wrapper.js');

    stream = bundler.bundle();

    return stream
        .pipe(source('nodium.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('minify', function () {

    return gulp.src('./dist/nodium.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist'));
});