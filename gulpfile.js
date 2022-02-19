/* package */
const { src, dest, watch, series, parallel } = require("gulp");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const sassGlob = require("gulp-sass-glob-use-forward");
const mmq = require("gulp-merge-media-queries");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssdeclsort = require("css-declaration-sorter");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");


/* 以下はいずれかのブロック1つのみ実行すること */
/* node -v14系 gulp-dart-sassを使用しない時 */
// // package
// const gulp = require("gulp");
// const sass = require("gulp-sass");
// const fiber = require('fibers');
// // select use compiler
// sass.compiler = require("sass"); // Dart Sass = "sass"

/* node -v16系 gulp-dart-sassを使用時 */
// const gulpDartSass = require('gulp-dart-sass');

/* gulp-sassのみで DartSass使用 */
const sass = require('gulp-sass')(require('sass'));

const cached = require('gulp-cached');
const dependents = require('gulp-dependents');
const dependentsConfig = {
  ".scss": {
    parserSteps: [
    /(?:^|;|{|}|\*\/)\s*@(import|use|forward|include)\s+((?:"[^"]+"|'[^']+'|url\((?:"[^"]+"|'[^']+'|[^)]+)\)|meta\.load\-css\((?:"[^"]+"|'[^']+'|[^)]+)\))(?:\s*,\s*(?:"[^"]+"|'[^']+'|url\((?:"[^"]+"|'[^']+'|[^)]+)\)|meta\.load\-css\((?:"[^"]+"|'[^']+'|[^)]+)\)))*)(?=[^;]*;)/gm,
    /"([^"]+)"|'([^']+)'|url\((?:"([^"]+)"|'([^']+)'|([^)]+))\)|meta\.load\-css\((?:"([^"]+)"|'([^']+)'|([^)]+))\)/gm
    ],
    prefixes: ["_"],
    postfixes: [".scss", ".sass"],
    basePaths: []
  }
};

const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const imageminSvgo = require("imagemin-svgo");
const browserSync = require("browser-sync");
const imagemin = require("gulp-imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");


// 読み込み先
const srcPath = {
	css: './src/sass/**/*.scss',
	js: './src/js/**/*.js',
	img: './src/img/**/*',
	ejs: ['./src/ejs/**/*.ejs', '!' + '/**/_*.ejs']
}

// html反映用
const destPath = {
	all: './dist/**/*',
	css: './dist/css/',
	js: './dist/js/',
	img: './dist/img/',
	html: './dist/',
}

// WordPress反映用
// const themeName = "WordPressTheme"; // WordPress theme name
// const destWpPath = {
// 	css: `../${themeName}/assets/css/`,
// 	js: `../${themeName}/assets/js/`,
// 	img: `../${themeName}/assets/img/`,
// }

// 不要ファイルを削除
const del = require('del');
const delPath = {
	// css: './dist/css/', // no such file or directoryエラーが出るため停止
	js: './dist/js/script.js',
	jsMin: './dist/js/script.min.js',
	img: './dist/img/',
	html: './dist/*.html',
	// wpcss: `../${themeName}/assets/css/`,
	// wpjs: `../${themeName}/assets/js/script.js`,
	// wpjsMin: `../${themeName}/assets/js/script.min.js`,
	// wpImg: `../${themeName}/assets/img/`,
}
const clean = (done) => {
	// del(delPath.css, { force: true, });
	del(delPath.js, { force: true, });
	del(delPath.jsMin, { force: true, });
	del(delPath.img, { force: true, });
	del(delPath.html, { force: true, });
	// del(delPath.wpcss, { force: true, });
	// del(delPath.wpjs, { force: true, });
	// del(delPath.wpjsMin, { force: true, });
	// del(delPath.wpImg, {force: true,});
	done();
};

const cssSass = () => {
	return src(srcPath.css)
		.pipe(sourcemaps.init())
		.pipe(
			plumber({
				errorHandler: notify.onError('Error:<%= error.message %>')
			}))
		.pipe(sassGlob()) // Globを有効化
		/* 変更があったファイルと依存関係のあるファイrのみコンパイル（コンパイル速度向上対策） */
		.pipe(cached('scss')) // キャッシュ
		.pipe(dependents(dependentsConfig)) // @use・@forwardの依存関係を解決（依存元のファイルを処理に通す）
		.pipe(sassGlob()) // 依存元のファイルのGlobを有効化

		/* 以下はいずれかのみ使用すること */
		/* node -v14系 gulpDartSassを使用しない時 */
		// .pipe(sass({
		// 	fiber: fiber,
		// 	outputStyle: 'expanded'
		// })) //指定できるキー expanded compressed

		/* node -v16系 gulpDartSassを使用時 */
		// .pipe(gulpDartSass({
		// 	includePaths: ['src/sass'], // 階層を指定しなくても@useで読み込み可能
		// 	outputStyle: 'expanded'
		// })) //指定できるキー expanded compressed

		/* gulp-sassでDartSassを使用 */
		.pipe(sass.sync({
			includePaths: ['src/sass'],
			outputStyle: 'expanded'
		}))

		.pipe(postcss([autoprefixer({ // autoprefixer
			grid: true
		})]))
		.pipe(postcss([cssdeclsort({ // sort
			order: "alphabetical"
		})]))
		.pipe(mmq()) // media query mapper
		.pipe(dest(destPath.css))
		// .pipe(dest(destWpPath.css))
		.pipe(cleanCSS())
		.pipe(rename({ extname: '.min.css' }))
		.pipe(sourcemaps.write('./map'))
		.pipe(dest(destPath.css))
		// .pipe(dest(destWpPath.css))
		.pipe(notify({
			message: 'Sassをコンパイルしました！',
			onLast: true
		}))
};


//  EJSコンパイル
const ejs = require("gulp-ejs");
const replace = require("gulp-replace");
const htmlbeautify = require("gulp-html-beautify");

const ejsCompile = () => {
	return src(srcPath.ejs)
		.pipe(
			plumber({
				errorHandler: notify.onError(function (error) {
					return {
						message: "Error: <%= error.message %>",
						sound: false,
					};
				}),
			})
		)
		.pipe(ejs({}))
		.pipe(rename({ extname: ".html" }))
		.pipe(replace(/^[ \t]*\n/gim, ""))
		.pipe(
			htmlbeautify({
				indent_size: 2,
				indent_char: " ",
				max_preserve_newlines: 0,
				preserve_newlines: false,
				extra_liners: [],
			})
		)
		.pipe(dest(destPath.html));
	// done();
};

// 画像圧縮
const imgImagemin = () => {
	return src(srcPath.img)
		.pipe(
			imagemin(
				[
					imageminMozjpeg({
						quality: 80
					}),
					imageminPngquant(),
					imageminSvgo({
						plugins: [
							{
								removeViewbox: false
							}
						]
					})
				],
				{
					verbose: true
				}
			)
		)
		.pipe(dest(destPath.img))
		// .pipe(dest(destWpPath.img))
}

// js圧縮
const jsBabel = () => {
	return src(srcPath.js)
		.pipe(
			plumber(
				{
					errorHandler: notify.onError('Error: <%= error.message %>')
				}
			)
		)
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(dest(destPath.js))
		// .pipe(dest(destWpPath.js))
		.pipe(uglify())
		.pipe(
			rename(
				{ extname: '.min.js' }
			)
		)
		.pipe(dest(destPath.js))
		// .pipe(dest(destWpPath.js))
}

// ブラウザーシンク
const browserSyncOption = {
	server: "./dist/"
}
const browserSyncFunc = () => {
	browserSync.init(browserSyncOption);
}
const browserSyncReload = (done) => {
	browserSync.reload();
	done();
}

// ファイル監視
const watchFiles = () => {
	watch(srcPath.css, series(cssSass, browserSyncReload))
	watch(srcPath.js, series(jsBabel, browserSyncReload))
	watch(srcPath.img, series(imgImagemin, browserSyncReload))
	watch(srcPath.ejs, series(ejsCompile, browserSyncReload))
}
exports.default = series(series(clean, cssSass, jsBabel, imgImagemin, ejsCompile), parallel(watchFiles, browserSyncFunc));
