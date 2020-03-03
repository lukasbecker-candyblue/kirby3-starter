const gulp          = require('gulp');
const del           = require('del');
const sass          = require("gulp-sass");
const sourcemaps    = require('gulp-sourcemaps');
const autoprefixer  = require('gulp-autoprefixer');
const cssmin        = require('gulp-cssmin');
const shorthand     = require('gulp-shorthand');
const purgecss      = require('gulp-purgecss')
//const uglify        = require('gulp-uglify');
const webpack       = require('webpack-stream');
const sizereport    = require('gulp-sizereport');
const notify        = require("gulp-notify");
const browserSync   = require('browser-sync').create();
const mode          = require('gulp-mode')();

const dir = {
  dist: './dist',
  dist: {
    scss: './dist/site/scss/**',
    webpack: './dist/assets/webpack/**',
    cache: './dist/site/cache/**',
    sessions: './dist/site/sessions/**',
  },
  html: './src/**/*.+(html|erb|md)',
  scss: {
    in: './src/assets/scss/**/*.+(scss|sass)',
    out: './src/assets/css/'
  },
  js: {
    in: './src/assets/js/**/*.js',
    out: './src/assets/js/'
  },
  svg: {
    in: './src/svg/**/*.svg'
  },
  fonts: {
    in: './src/fonts/**/*.{ttf,woff,woff2,eot,svg}'
  },
  img: {
    in: './assets/img/**/*.{png,jpg,svg}'
  },
};

const sitename = 'kirby3-starter'; // set your siteName here
const username = 'lukas'; // set your macOS userName here


function clean_before_build(done) {
  return del(
    //[dir.dest + '*', dir.dist]
    [dir.dist]
  );
  done();
}
function clean_after_build(done) {
  return del(
    //[dir.dest + '*', dir.dist]
    [dir.dist.scss, dir.dist.webpack, dir.dist.cache, dir.dist.sessions]
  );
  done();
}

function cleanBuild(done) {
  return del(
    [dir.dest + '*', dir.dist]
  );
  done();
}



function scss() {
  return (
    gulp.src(dir.scss.in)
      //.pipe(
      //  (mode.development(
      //    sourcemaps.init()
      //  ))
      //)
      .pipe(sass())
      .on("error", sass.logError)
      //.pipe(pixrem())
      //.pipe(purgecss({
      //  content: ['layouts/**/*.html']
      //  css: [], // css
      //  whitelistPatterns: [/red$/],
      //  whitelistPatternsChildren: [/blue$/]
      //}))
      .pipe(autoprefixer())
      .pipe(shorthand())
      .pipe(cssmin({removeDuplicateRules: true}))
      .pipe(
        (mode.development(
          sourcemaps.write('.')
        ))
      )
      .pipe(gulp.dest(dir.scss.out))
      .pipe(
        (mode.development(
          browserSync.stream()
        ))
      )
    );
}

function js() {
  return (
    gulp.src(dir.js.in)
      .pipe(
        webpack(require('./webpack.config.js'))
      )
      .pipe(gulp.dest(dir.js.out))
      .pipe(
        (mode.development(
          browserSync.stream()
        ))
      )
  );
}


exports.scss        = scss;
//exports.js            = js;
//exports.svg           = svg;
//exports.fonts         = fonts;
//exports.img           = img;
//exports.icons         = icons;
//exports.watch         = watch;
exports.clean_before_build    = clean_before_build;
exports.clean_after_build     = clean_after_build;


function reload() {
  browserSync.reload();
}

function watch() {
  browserSync.init({
    notify: false,
    ghostMode: false,
    proxy: sitename +'.test',
    /*
    proxy: "https://" + sitename + ".test",
    host: sitename + ".test",
    open: false,
    reloadOnRestart: true,
    reloadDelay: 300,
    port: 8000,
    //ui: {
    //  port: 7001
    //}
    https: {
      key: '/Users/' + username + '/.config/valet/Certificates/' + sitename + '.test.key',
      cert: '/Users/' + username + '/.config/valet/Certificates/' + sitename + '.test.crt'
    }
    */
  });
  gulp.watch(dir.scss.in, { ignoreInitial: false, delay: 100 }, scss);
  //gulp.watch(dir.js.in, { ignoreInitial: false, delay: 100 }, js);
  //gulp.watch(dir.svg.in, { ignoreInitial: false, delay: 100 }, svg);
  //gulp.watch(dir.fonts.in, { ignoreInitial: false, delay: 100 }, fonts);
  //gulp.watch(dir.data, { ignoreInitial: false }, reload);
}

/*
 * Add sizereport to build-taks
 *
gulp.task('sizereport', function (done) {
  return gulp.src('./dist/*')
    .pipe(sizereport({
      gzip: true
    }));
    done();
});
 *
 * Add notify to build-task
gulp.task('notify', function (done) {
  return gulp.src('./public/*')
    .pipe(notify({
      "onLast": true,
      "title": "Gulp",
      "message": "project build successfully",
    }));
    done();
});
*/

gulp.task('build:dev', gulp.series(watch));
//gulp.task('build', gulp.series(cleanAssets, styles, js, svg, fonts, img));
