var gulp = require('gulp');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var ignore = require('gulp-ignore');
var rimraf = require('gulp-rimraf');
var packager = require('electron-packager');

gulp.task('clean', function () {
    return gulp.src(['./**/*.js', 'compiled/*'], { read: false }) // much faster
        .pipe(ignore(['node_modules/**', 'gulpfile.js']))
        .pipe(rimraf());
});

gulp.task('client', ['clean'], function () {
    var compiled = gulp.src('client/**/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            sortOutput: true,
            module: "commonjs"
        }));

    var mithril = gulp.src('node_modules/mithril/mithril.min.js');
    var semantic = gulp.src('semantic/dist/semantic.min.js');
    var moment = gulp.src('node_modules/moment/moment.js');

    return merge(mithril, semantic, moment, compiled)
        .pipe(gulp.dest('compiled/.'));
});

gulp.task('main', ['clean'], function () {
    return gulp.src('main.ts')
        .pipe(ts({
            noImplicitAny: true,
            out: 'main.js'
        }))
        .pipe(gulp.dest('.'));
});

gulp.task('build', ['main', 'client']);

gulp.task('package', function () {
   packager({
       arch: "x64",
       dir: ".",
       platform: "win32",
       name: "PerTurn",
       version: "0.36.9",
       out: "builds",
       overwrite: true,
       ignore: "(\.gitignore)|(gulpfile\.js)|(\.vscode.*)|(typings.*)|(tsconfig.json)|(semantic.json)|(builds.*)|(client.*)|(node_modules.*)|(semantic/src.*)|(semantic/tasks.*)"
   }, function(err, appPath){}) 
});