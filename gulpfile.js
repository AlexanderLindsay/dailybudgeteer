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

    return merge(mithril, jquery, semantic, compiled)
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