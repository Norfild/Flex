var gulp      = require('gulp'),
    gutil     = require('gulp-util'),
    nodemon   = require('nodemon'),
    jshint    = require('gulp-jshint'),
    del       = require('del'),
    jade      = require('gulp-jade'),
    compass   = require('gulp-compass'),
    minifyCSS = require('gulp-minify-css');



// Main configuration
var config = {

    host:          'flex.dev',
    port:          '3050',
    appFolder:     'app',
    buildFolder:   'build',

    src: {
        styles:    './app/stylesheets/*.sass',
        scripts:   './app/scripts/**/*.js',
        templates: './app/templates/**/*.jade'
    },

    dest: {
        build:     './build/',
        styles:    './build/stylesheets/',
        scripts:   './build/javascript'
    }

};



// Configure the jshint task
gulp.task('server', function() {
    nodemon({'script' : './index.js' });
});

gulp.task('compass', function() {
    return gulp.src(config.src.styles)
        .pipe(compass({
            style: 'compressed',
            css:   'app/css',
            sass:  'app/stylesheets',
            image: 'app/images'
        }))
        .on('error', function(error) {
            // Would like to catch the error here
            console.log(error);
            this.emit('end');
        })
        .pipe(minifyCSS())
        .pipe(gulp.dest(config.dest.styles));
});

// Configure the jshint task
gulp.task('jshint', function() {
    return gulp.src(config.src.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('templates', function() {
    return gulp.src(config.src.templates)
        .pipe(jade())
        .pipe(gulp.dest(config.dest.build))
});

gulp.task('scripts', function(){
    return gulp.src(config.src.scripts)
        .pipe(gulp.dest(config.dest.scripts))
});

// Cleaner
gulp.task('clean', function(){
    del.sync('./build/')
});

// Gulp task build
gulp.task('builder', ['clean', 'templates', 'scripts', 'compass']);

// Configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
    gulp.watch(config.src.scripts,   ['scripts']);
    gulp.watch(config.src.templates, ['templates']);
    gulp.watch(config.src.styles,    ['compass']);
});

gulp.task('default', ['builder', 'watch'], function() {
    //return gutil.log('compass watch');
    gulp.start('server');
    return gutil.log('http://localhost:3050/');
    //gulp.start('watch');
});
