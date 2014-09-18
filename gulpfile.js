/**
 * Created by benjaminsmiley-andrews on 14/09/2014.
 */
// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var bower = require('gulp-bower');

var changed = require('gulp-changed');
var minifyHTML = require('gulp-minify-html');

// include plug-ins
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');

var bowerSrc = require('gulp-bower-src');

// Setup paths
var DIST_PATH = 'app/dist/';
var DIST_TEST_PATH = 'app/dist_test/';

// CSS concat, auto prefix, minify, then rename output file
gulp.task('minify-css', function() {

    var src = [
        'app/css/*.css',
        'app/bower_components/html5-boilerplate/css/normalize.css',
        'app/bower_components/html5-boilerplate/css/main.css',
        'app/libs/flags/stylesheets/flags/common.css',
        'app/libs/flags/stylesheets/flags/flags32.css',
        'app/libs/flags/stylesheets/flags/flags16.css',
        //'app/bower_components/uikit/dist/css/uikit.css',
        //'app/bower_components/uikit/dist/css/uikit.gradient.css',
        '!*.min.css',
        '!/**/*.min.css'
    ]

  return gulp.src(src)
    .pipe(concat('styles.css'))
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min' }))
      // Copy to _ otherwise flags won't work
    .pipe(gulp.dest(DIST_PATH + 'css/_'))
    .pipe(gulp.dest(DIST_TEST_PATH + 'css/_'));
});

gulp.task('copy', function () {

	gulp.src('app/img/*.*').pipe(gulp.dest( DIST_PATH + 'img'));
	gulp.src('app/img/*.*').pipe(gulp.dest( DIST_TEST_PATH + 'img'));
	
	gulp.src('app/libs/**/*.*').pipe(gulp.dest( DIST_PATH + 'libs'));
	gulp.src('app/libs/**/*.*').pipe(gulp.dest( DIST_TEST_PATH + 'libs'));
	
//	gulp.src('app/bower_components/**/*.*').pipe(gulp.dest( DIST_PATH + 'bower_components'));
//	gulp.src('app/bower_components/**/*.*').pipe(gulp.dest( DIST_TEST_PATH + 'bower_components'));

    gulp.src('app/bower_components/uikit/dist/**/*.*').pipe(gulp.dest( DIST_PATH + 'bower_components/uikit/dist/'));
    gulp.src('app/bower_components/uikit/dist/**/*.*').pipe(gulp.dest( DIST_TEST_PATH + 'bower_components/uikit/dist/'));

    // Copy the flag images
    gulp.src('app/libs/flags/images/flags/*.png').pipe(gulp.dest( DIST_PATH + 'images/flags/'));
    gulp.src('app/libs/flags/images/flags/*.png').pipe(gulp.dest( DIST_TEST_PATH + 'images/flags/'));


});

// Lint Task
gulp.task('lint', function() {
    return gulp.src('app/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// minify new or changed HTML pages
gulp.task('minify-html', function() {
var opts = {empty:true, quotes:true};

  return gulp.src('app/partials/*.html')
    //.pipe(changed(htmlPath.htmlDest))
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest(DIST_PATH + 'partials'))
    .pipe(gulp.dest(DIST_TEST_PATH + 'partials'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {

    var paths = [
//        'app/env.js',
        'app/js/*.js'
    ];

    gulp.src(paths)
        .pipe(concat('all.js'))
        .pipe(gulp.dest(DIST_PATH + 'js'))
        .pipe(gulp.dest(DIST_TEST_PATH + 'js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(DIST_PATH + 'js'))
        .pipe(gulp.dest(DIST_TEST_PATH + 'js'));

    paths = [
        'app/bower_components/html5-boilerplate/js/vendor/modernizr-2.6.2.min.js',
        'app/bower_components/jquery/jquery.min.js',
        'app/bower_components/uikit/dist/js/uikit.min.js',
        'app/bower_components/angular/angular.min.js',
        'app/bower_components/angular-file-upload/dist/angular-file-upload.min.js',
        'app/bower_components/angular-file-upload/dist/angular-file-upload-shim.min.js',
        'app/bower_components/firebase/firebase.js',
        'app/bower_components/angularfire/dist/angularfire.min.js',
        'app/bower_components/firebase-simple-login/firebase-simple-login.js',
        'app/bower_components/angular-facebook/lib/angular-facebook.js',
        'app/bower_components/FileSaver/FileSaver.js',
        'app/bower_components/moment/moment.js',
        'app/libs/sha256.js'
    ];

    gulp.src(paths)
        .pipe(concat('dist.min.js'))
        .pipe(gulp.dest(DIST_PATH + 'js'))
        .pipe(gulp.dest(DIST_TEST_PATH + 'js'));

});

// gulp.task('bower', function () {
//     bower(gulp.src('app'))
//         .pipe(gulp.dest('app/dist_test/vendor'));
// });

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('app/js/*.js', ['lint', 'scripts', 'minify-html', 'minify-css', 'copy']);
});


// Default Task
gulp.task('default', ['lint', 'scripts', 'minify-html', 'minify-css', 'copy', 'watch']);