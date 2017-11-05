var gulp = require('gulp');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var ignore = require('gulp-ignore');
var rimraf = require('gulp-rimraf');
var packager = require('electron-packager');
var semanticBuild = require('./semantic/tasks/build');

gulp.task('cleanClient', function () {
    return gulp.src(['compiled/*'], { read: false })
        .pipe(rimraf());
});

gulp.task('cleanTest', function () {
    return gulp.src(['test/client', 'test/test'], { read: false })
        .pipe(rimraf());
});

gulp.task('cleanMain', function () {
    return gulp.src(['main.js', 'main.js.map'], { read: false })
        .pipe(rimraf());
});

var tsClientProject = ts.createProject('./client/tsconfig.json');
var tsMainProject = ts.createProject('./tsconfig.json');

gulp.task('client', ['cleanClient'], function () {
    var compiled = tsClientProject.src()
        .pipe(tsClientProject());

    var mithril = gulp.src('node_modules/mithril/mithril.min.js');
    var jquery = gulp.src('node_modules/jquery/dist/jquery.min.js');
    var semantic = gulp.src('semantic/dist/semantic.min.js');

    return merge(mithril, jquery, semantic, compiled.js)
        .pipe(gulp.dest('compiled/.'));
});

gulp.task('main', ['cleanMain'], function () {
    var tsResult = tsMainProject.src()
        .pipe(tsMainProject());
    return tsResult.js.pipe(gulp.dest('.'));
});

gulp.task('semantic-build', semanticBuild);

gulp.task('build', ['main', 'client']);

gulp.task('package', function () {
   packager({
       arch: "all",
       dir: ".",
       platform: "all",
       name: "DailyBudgeteer",
       version: "1.2.0",
       out: "builds",
       overwrite: true,
       ignore: "(README.md)|(readme-images.*)|(\.gitignore)|(gulpfile\.js)|(\.vscode.*)|(typings.*)|(tsconfig.json)|(semantic.json)|(builds.*)|(client.*)|(test.*)|(^/node_modules/(?!.*(d3|mithril|jquery|moment|semantic|mousetrap)))|(semantic/src.*)|(semantic/tasks.*)"
   }, function(err, appPath){}) 
});