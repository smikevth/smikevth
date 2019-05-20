const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const del = require('del');
const bs = require('browser-sync');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const preprocess = require('gulp-preprocess');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const postCSS = require('gulp-postcss');
const extractMedia = require('postcss-extract-media');
const connect = require('gulp-connect');
const swPrecache = require('sw-precache');

var large = 2800;
var medium = 1400;
var mobile = 1000;

var vendorJSPaths = [
  "./node_modules/cssuseragent/cssua.js",
  "./node_modules/fg-loadcss/dist/loadCSS.min.js",
  "./node_modules/jquery/dist/jquery.min.js",
  "./node_modules/requirejs/require.js",
]


var input = "./src";
var output = "./dist";

gulp.task('critSass', function(){
  var plugins = [
    autoprefixer({browsers: ['last 4 version']}),
    extractMedia({
      match: '(min-width: '+large+'px)', prefix: '-large'
    }),
    extractMedia({
      match: '(min-width: '+(mobile+1)+'px) and (max-width: '+medium+'px)', prefix: '-medium'
    }),
    extractMedia({
      match: '(min-width: '+(mobile+1)+'px)', prefix: '-desktop'
    }),
    extractMedia({
      match: '(max-width: '+mobile+'px)', prefix: '-mobile'
    })
  ];
  return gulp.src(input+"/css/**/*crit.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest(output+"/css"))
    .pipe(postCSS(plugins))
    .pipe(gulp.dest(output+"/css"))
    .pipe(sourcemaps.write('./'))
})

gulp.task('nonCritSass', function(){
  var plugins = [
    autoprefixer({browsers: ['last 4 version']}),
    extractMedia({
      match: '(min-width: '+large+'px)', prefix: '-large'
    }),
    extractMedia({
      match: '(min-width: '+(mobile+1)+'px) and (max-width: '+medium+'px)', prefix: '-medium'
    }),
    extractMedia({
      match: '(min-width: '+(mobile+1)+'px)', prefix: '-desktop'
    }),
    extractMedia({
      match: '(max-width: '+mobile+'px)', prefix: '-mobile'
    })
  ];
  return gulp.src([input+"/css/**/*.scss", "!"+input+"/css/**/*crit.scss"])
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest(output+"/css"))
    .pipe(postCSS(plugins))
    .pipe(gulp.dest(output+"/css"))
    .pipe(sourcemaps.write('./'))
})


gulp.task('compileVendorJS', function(){
  return gulp.src(vendorJSPaths)
  .pipe(babel({
    presets: [],
    minified: true,
    compact: true,
    plugins: ["syntax-dynamic-import"]
  }))
  .pipe(gulp.dest(input+'/js/vendor'))
})

/*gulp.task('compileVendorCSS', function(){
  return gulp.src(vendorCSSPaths)
//  .pipe(concat("vendor.css"))
  .pipe(sass({outputStyle: 'compressed'}))
  .pipe(gulp.dest(output+"/css/vendor"))
})*/

/*gulp.task('rev', function(){
  del([output+'/**', '!'+output]);
  return gulp.src([output+'/css/**'])
  .pipe(revall.revision({}))
  .pipe(gulp.dest(output+'/css'))
  .pipe(revall.manifestFile())
  .pipe(gulp.dest("craft/resources"));
})*/

gulp.task('compileVendor', gulp.series(['compileVendorJS']));

gulp.task('image', function(){
  return gulp.src(['./src/img/**/*'])
  .pipe(imagemin())
  .pipe(gulp.dest(output+'/img'))
})

gulp.task('webp', function(){
  return gulp.src([input+'/img/**/*'])
  .pipe(webp())
  .pipe(gulp.dest(output+'/img'))
})

gulp.task('js', function() {
  return gulp.src([input+'/js/**/*.js'])
  .pipe(sourcemaps.init())
  .pipe(preprocess())
  .pipe(babel({
    presets: [],
    minified: true,
    compact: true,
    plugins: ["syntax-dynamic-import"]
  }))
  .pipe(gulp.dest(output+'/js'))
})

gulp.task('html', function(){
  return gulp.src(input+'/*.html')
  .pipe(preprocess())
  .pipe(gulp.dest(output))
})

gulp.task('other', function() {
  return gulp.src([input+'/sw.js'])
  .pipe(gulp.dest(output))
})

gulp.task('move', function(){
  del([output+'/**', '!'+output, '!'+output+'/assets', '!'+output+'/assets/**', '!'+output+'/js','!'+output+'/js/**', '!'+output+'/img']);
  return gulp.src([output+'/**', output+'/img/**', '!'+output+'/css/**','!'+output+'/js/**'])
  .pipe(gulp.dest(output))
})


gulp.task('start', function(){
  connect.server({
    root: output,
    livereload: true
  });
  bs.init({
    proxy: "localhost:8080"
  })
  gulp.watch([input+'/css/**/*crit.scss'], gulp.series(['critSass'],function(done){
    bs.reload();
    done();
  }));

  gulp.watch([input+'/css/**/*.scss', '!'+input+'/css/**/*crit.scss'], gulp.series(['nonCritSass'],function(done){
    bs.reload();
    done();
  }));

  gulp.watch([input+'/js/**/*.js'], gulp.series(['js'], function(done){
    bs.reload();
    done();
  }));
  gulp.watch([input+'/**/*.html'], gulp.series(['html'], function(done){
    bs.reload();
    done();
  }));
  gulp.watch([input+'/**/sw.js'], gulp.series(['other'], function(done){
    bs.reload();
    done();
  }));
  gulp.watch([input+'/img/**/*'], gulp.series(['image', 'webp'], function(done){
    bs.reload();
    done();
  }));
})

gulp.task('build', gulp.series(['compileVendor', 'html', 'critSass', 'nonCritSass', 'js','image','webp']));

gulp.task('generateSW', function(callback) {
  swPrecache.write(`${output}/sw.js`, {
    staticFileGlobs: [
      output+'/',
      output+'/index.html',
      output+'/css/main.css',
      output+'/js/main.js',
      output+'/js/helpers/utilities.js',
      output+'/js/helpers/workers.js',
      output+'/js/modules/intro.js',
      output+'/js/vendor/cssua.js',
      output+'/js/vendor/jquery.min.js',
      output+'/js/vendor/loadCSS.min.js',
      output+'/js/vendor/require.js',
    ],
    stripPrefix: output
  }, callback);
})
