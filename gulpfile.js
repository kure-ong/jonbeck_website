var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gulpIf = require('gulp-if');
var autoprefix = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();

// var bourbon = require('node-bourbon').includePaths;
// var neat = require('node-neat').includePaths;


var dev = {
	styles: ['dev/scss/**/*.+(scss|sass)'],
	scripts: ['node_modules/retinajs/dist/retina.min.js','node_modules/owl.carousel/dist/owl.carousel.min.js','dev/js/custom.js'],
	images: ['dev/img/**/*.+(png|jpg|jpeg|gif|svg)'],
	fonts: ['dev/fonts/**/*'],
}

var jsImports = [
	'node_modules/jquery/dist/jquery.min.js'
]

var sassImports = [
	'node_modules/normalize.css/normalize.css',
	'node_modules/retinajs/dist/_retina.scss',
	'node_modules/owl.carousel/dist/assets/owl.carousel.css'
]

gulp.task('browserSync', function(){
	browserSync.init({
		server: {
			baseDir: 'build'
		}
	});
});

gulp.task('clean:build', function() {
	return del.sync('build');
});

gulp.task('images', function(){
	return gulp.src(dev.images)
		.pipe(cache(imagemin()))
		.pipe(gulp.dest('build/img'));
});

gulp.task('fonts', function() {
	return gulp.src(dev.fonts)
		.pipe(gulp.dest('build/fonts'));
})

gulp.task('sassImports', function() {
	return gulp.src(sassImports)
		.pipe(gulpIf('!*.scss',cache(rename({prefix:'_',extname:'.scss'}))))
		.pipe(gulp.dest('dev/scss/generic'));
})

gulp.task('jsImports', function() {
	return gulp.src(jsImports)
		.pipe(gulpIf('!*.min.js',cache(uglify())))
		.pipe(gulpIf('!*.min.js',cache(rename({suffix:'.min',extname:'.js'}))))
		.pipe(gulp.dest('build/js'));
})

gulp.task('sass', function(){
	return gulp.src(dev.styles)
		.pipe(sass({
			outputStyle: 'expanded', //nested,expanded,compact,compressed
      // includePaths: bourbon,
      // includePaths: neat,
      }).on('error', sass.logError))
		.pipe(autoprefix({ browsers: ['last 2 versions'] }))
		// .pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('build/css'))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('scripts', function() {
	return gulp.src(dev.scripts)
	// .pipe(uglify())
	.pipe(concat('build.js'))
	// .pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('build/js'))
	.pipe(browserSync.reload({stream:true}));
});

gulp.task('html', function() {
	return gulp.src('dev/**/*.html')
			.pipe(gulp.dest('build'))
			.pipe(browserSync.reload({stream:true}));
})

gulp.slurped = false;

gulp.task('watch',['browserSync','sassImports','sass','scripts','html','images','fonts'], function(){
	if (!gulp.slurped) {
		gulp.watch('gulpfile.js', ['build']);
		gulp.watch(dev.images,['images']);
		gulp.watch(dev.fonts, ['fonts']);
		gulp.watch(dev.styles,['sass']);
		gulp.watch(dev.scripts, ['scripts'],browserSync.reload);
		gulp.watch('dev/**/*.html',['html'],browserSync.reload);
		gulp.slurped = true;
	}
});

gulp.task('build', function(callback){
	runSequence('clean:build',['sassImports','jsImports','sass','scripts','html','images','fonts'],callback);
});

gulp.task('default', function(callback){
	runSequence(['sassImports','sass','scripts','html','images','fonts','watch'],callback);
});