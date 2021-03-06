var browserSync  = require('browser-sync');
var watchify     = require('watchify');
var browserify   = require('browserify');
var source       = require('vinyl-source-stream');
var buffer       = require('vinyl-buffer');
var gulp         = require('gulp');
var gutil        = require('gulp-util');
var gulpSequence = require('gulp-sequence');
var processhtml  = require('gulp-minify-html');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var watch        = require('gulp-watch');
var minifycss    = require('gulp-minify-css');
var uglify       = require('gulp-uglify');
var streamify    = require('gulp-streamify');
var sourcemaps   = require('gulp-sourcemaps');
var concat       = require('gulp-concat');
var babel        = require('gulp-babel');
//var prod         = gutil.env.prod;
var prod = false;

var ghPages = require('gulp-gh-pages');

var onError = function(err) {
  console.log(err.message);
  this.emit('end');
};

// bundling js with browserify and watchify
var b = watchify(browserify('./src/js/main', {
  cache: {},
  packageCache: {},
  fullPaths: true
  }));

gulp.task('js', bundle);
b.on('update', bundle);
b.on('log', gutil.log);

function bundle() {
  return b.bundle()
  .on('error', onError)
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init())
  .pipe(prod ? babel({
      presets: ['es2015']
      }) : gutil.noop())
  .pipe(concat('bundle.js'))
  .pipe(!prod ? sourcemaps.write('.') : gutil.noop())
  .pipe(prod ? streamify(uglify()) : gutil.noop())
  .pipe(gulp.dest('./build/js'))
  .pipe(browserSync.stream());
}


// libs: the third-party libs like Three.js, TweenLite, etc.
gulp.task('libs', function() {
   gulp.src([
    './src/js/vendor/three.min.js',
    './src/js/vendor/OrbitControls.js',
    './src/js/vendor/CurveExtras.js',
    './src/js/vendor/ParametricGeometries.js',
    './src/js/vendor/stats.min.js',
    './src/js/vendor/UVsUtils.js'
    ])
   .pipe(concat('libs.js'))
   .pipe(gulp.dest('./build/js'));
   });

// html
gulp.task('html', function() {
  return gulp.src('./src/templates/**/*')
  //.pipe(processhtml())f
  .pipe(gulp.dest('build'))
  .pipe(browserSync.stream());
  });

// textures
gulp.task('textures', function() {
  return gulp.src('./src/textures/**/*')
  //.pipe(processhtml())f
  .pipe(gulp.dest('build/textures'))
  .pipe(browserSync.stream());
  });

// sass
gulp.task('sass', function() {
  return gulp.src('./src/scss/**/*.scss')
  .pipe(sass({
      includePaths: [].concat(['node_modules/foundation-sites/scss', 'node_modules/motion-ui/src'])
      }))
  .on('error', onError)
  .pipe(prod ? minifycss() : gutil.noop())
  .pipe(prod ? autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
      }) : gutil.noop())
  .pipe(gulp.dest('./build/stylesheets'))
  .pipe(browserSync.stream());
  });


// deploy to gh-pages
gulp.task('deploy', function() {
  return gulp.src('./build/**/*')
    .pipe(ghPages());
});

// browser sync server for live reload
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: './build'
        }
    }
    );
    gulp.watch('./src/templates/**/*', ['html']);
    gulp.watch('./src/scss/**/*.scss', ['sass']);
}
);

// use gulp-sequence to finish building html, sass and js before first page load
gulp.task('default', gulpSequence(['html', 'textures', 'sass', 'libs', 'js'], 'serve'));