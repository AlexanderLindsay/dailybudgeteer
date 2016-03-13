var gulp = require('gulp');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var ignore = require('gulp-ignore');
var rimraf = require('gulp-rimraf');
var packager = require('electron-packager');
var semanticBuild = require('./semantic/tasks/build');

gulp.task('clean', function () {
    return gulp.src(['compiled/*', 'test/client', 'test/test'], { read: false })
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
    var jquery = gulp.src('node_modules/jquery/dist/jquery.min.js');
    var semantic = gulp.src('semantic/dist/semantic.min.js');
    var moment = gulp.src('node_modules/moment/moment.js');
    var d3 = gulp.src('node_modules/d3/d3.min.js');

    return merge(mithril, jquery, semantic, moment, d3, compiled)
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

gulp.task('semantic-build', semanticBuild);

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
       ignore: "(\.gitignore)|(gulpfile\.js)|(\.vscode.*)|(typings.*)|(tsconfig.json)|(semantic.json)|(builds.*)|(client.*)|(test.*)|(node_modules.*)|(semantic/src.*)|(semantic/tasks.*)"
   }, function(err, appPath){}) 
});