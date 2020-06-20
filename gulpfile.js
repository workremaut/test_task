let imageswatch  = 'jpg,jpeg,png,webp,svg';
let fileswatch   = 'html,htm,txt,json,md,woff2';

const { src, dest, parallel, series, watch } = require('gulp')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const mqpacker = require('css-mqpacker')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const newer = require('gulp-newer')
const imagemin = require('gulp-imagemin')
const browserSync  = require('browser-sync').create()
const twig = require('gulp-twig')
const pug = require('gulp-pug')
const del = require('del')
const webpack = require('webpack-stream')
const moduleImporter = require('sass-module-importer')


let mode_dev = true
let mode_prod = !mode_dev

let webpack_config = {
    output: {
        filename: 'app.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            }
        ]
    },
    mode: mode_dev ? 'development' : 'production',
    devtool: mode_dev ? 'eval-source-map' : 'none'
}

function browsersync() {
	browserSync.init({
		server: { baseDir: 'dist' },
		notify: false,
		// online: false, // Work offline without internet connection
	})
}

function template() {
    // TWIG
    // return src('src/pages/*.html')
    //     .pipe(twig())
    //     .pipe(dest('dist'))
    //     .pipe(browserSync.stream());

    // PUG
    return src('src/pages/*.pug')
        .pipe(pug({
            basedir: __dirname + 'src',
            pretty: true
        }))
        .pipe(dest('dist'))
        .pipe(browserSync.stream());
}


function styles() {
    let plugins = [
        autoprefixer(),
        cssnano(),
        mqpacker()
    ];
    return src('src/scss/**/*.scss')
            .pipe(sass({ importer: moduleImporter() }))
            .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
            .pipe(postcss(plugins))
            .pipe(sourcemaps.write(''))
            .pipe(dest('dist/css'))
            .pipe(browserSync.stream())
}

function scripts() {
    return src('src/js/app.js')
    .pipe(webpack(webpack_config))
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream())
}

function images() {
	return src('src/img/**/*')
	.pipe(newer('src/img/**/*'))
	.pipe(imagemin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
    }))
	.pipe(dest('dist/img'))
}

function clean() {
	return del(['dist/img/**/*', 'dist/common', 'dist/include'], { force: true })
}

function copy() {
    return src(['src/fonts/**/*', 'src/assets/*', 'src/img/**/*'],{
        base: 'src'
    })
    .pipe(dest('dist'));
}

function startwatch() {
	watch('src/scss/**/*', parallel('styles'));
	watch(['src/js/*.js'], parallel('scripts'));
	watch(['src/pages/**/*.pug'], parallel('template'));
	watch(['src/**/*.{' + imageswatch + '}'], parallel('images'));
	watch(['dist/**/*.{' + fileswatch + '}']).on('change', browserSync.reload);
}

exports.browsersync = browsersync;
exports.assets      = series(clean, styles, scripts, template, images);
exports.styles      = styles;
exports.scripts     = scripts;
exports.images      = images;
exports.clean       = clean;
exports.template    = template;
exports.default     = parallel(copy, images, styles, scripts, template, browsersync, startwatch);