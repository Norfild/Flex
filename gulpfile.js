var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    compass = require('gulp-compass'),
    minifyCSS = require('gulp-minify-css');

// Main configuration
var config = {

    //host:               'flex.dev',
    //indexFile:          'index.html',

    appFolder:          'app',
    buildFolder:         'build',

    src: {
        styles:         './app/stylesheets/**/*.scss',
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


gulp.task('default', ['watch'], function() {
    return gutil.log('Gulp is running!')
});

gulp.task('compass', function() {
    gulp.src(config.src.styles)
        .pipe(compass({
            config_file: './config.rb',
            css: 'stylesheets',
            sass: 'sass'
        }))
        .on('error', function(error) {
            // Would like to catch the error here
            console.log(error);
            this.emit('end');
        })
        .pipe(minifyCSS())
        .pipe(gulp.dest('app/temp'));
});

// configure the jshint task
gulp.task('jshint', function() {
    return gulp.src(config.src.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
    gulp.watch(config.src.scripts, ['jshint']);
    gulp.watch(config.src.styles, ['compass']);
});
