var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    nodemon = require('nodemon'),
    jshint = require('gulp-jshint'),
    del = require('del'),
    haml = require('gulp-haml'),
    jade = require('gulp-jade'),
    compass = require('gulp-compass'),
    minifyCSS = require('gulp-minify-css');

// Main configuration
var config = {

    //host:               'flex.dev',
    //indexFile:          'index.html',

    appFolder:          'app',
    buildFolder:         'build',

    src: {
        styles:         './app/stylesheets/*.sass',
        scripts:        ['./app/scripts/**/*.js'],
        resourcesToMove: [
            './app/images/**/*.*',
            './app/fonts/**/*.*',
            './app/vendors/**/*.js'
        ]
    },
    dest: {
        styles: './build/stylesheets/'
    }
};

// configure the jshint task
gulp.task('server', function() {
    nodemon({'script' : './index.js' })
});

gulp.task('compass', function() {
    return gulp.src(config.src.styles)
        .pipe(compass({
            style: 'compressed',
            css: 'app/css',
            sass: 'app/stylesheets',
            image: 'app/assets/images'
        }))
        .on('error', function(error) {
            // Would like to catch the error here
            console.log(error);
            this.emit('end');
        })
        .pipe(minifyCSS())
        .pipe(gulp.dest('build/css'));
});

// configure the jshint task
gulp.task('jshint', function() {
    return gulp.src(config.src.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});


//Gulp task build
gulp.task('indexHaml', function() {
    gulp.src('./app/templates/index.haml')
        .pipe(haml())
        .pipe(gulp.dest('./build'));
});

gulp.task('templates', function() {
    return gulp.src('./app/templates/**/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('./build/'))
});

gulp.task('scripts', function(){
    return gulp.src('./app/scripts/**/*.js')
        .pipe(gulp.dest('./build/javascript'))
});

//Cleaner
gulp.task('clean', function(){
    del.sync('./build/')
});

//Gulp task build
gulp.task('builder', ['clean', 'templates', 'scripts', 'compass']);

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
    //gulp.watch(config.src.scripts, ['jshint']);
    gulp.watch('./app/scripts/**/*.js', ['scripts']);
    gulp.watch('./app/templates/**/*.jade', ['templates']);
    gulp.watch(config.src.styles, ['compass']);
});

gulp.task('default', ['builder', 'watch'], function() {
    //return gutil.log('compass watch');
    gulp.start('server');
    //return gutil.log('Gulp is running!');
    //gulp.start('watch');
});
