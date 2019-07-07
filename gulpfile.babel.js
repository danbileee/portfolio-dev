//-----------------------
// List of packages
//-----------------------

import gulp from 'gulp';

// nunjucks packages
import nunjucksRender from 'gulp-nunjucks-render'

// css packages
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';

// js packages
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';

// image packages
import imagemin from 'gulp-imagemin';

// server packages
import browserSync from 'browser-sync';

// others
import data from 'gulp-data';
import plumber from 'gulp-plumber';
import newer from 'gulp-newer';


//-----------------------
// Custom paths
//-----------------------

const paths = {

  styles: {
    src: 'app/assets/scss/**/*.scss',
    dest: 'dist/assets/css'
  },

  scripts: {
    // Order of concatenation
    src: [
      'app/assets/js/vendor/jquery-3.2.1.min.js',
      'app/assets/js/vendor/*.js',
      'app/assets/js/main.js'
    ],
    dest: 'dist/assets/js'
  },

  images: {
    src: 'app/assets/img/**/*',
    dest: 'dist/assets/img'
  },

  font: {
    src: 'app/assets/font/**/*',
    dest: 'dist/assets/font'
  },

  njk: {
    src: 'app/pages/**/*.njk',
    // data path must have './'
    data: './app/_data/data.json',
    template: 'app/_template',
    dest: 'dist'
  },

  server: 'dist'

}


//-----------------------
// Gulping around
//-----------------------

// scss compile
export function styles() {
  const plugins = [
    autoprefixer({grid: true, browsers: ["last 50 version"]}),
    cssnano()
  ];
  return gulp.src(paths.styles.src)
    .pipe(plumber())
    .pipe(newer(paths.styles.dest))
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.styles.dest));
}

// contact js
export function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(plumber())
    .pipe(newer(paths.scripts.dest))
    // .pipe(sourcemaps.init())  // Uncomment if you want sourcemap on JS too 
    .pipe(concat("all.min.js"))
    .pipe(uglify())
    // .pipe(sourcemaps.write(".")) // Uncomment if you want sourcemap on JS too 
    .pipe(gulp.dest(paths.scripts.dest));
}

// optimize images
export function images() {
  return gulp.src(paths.images.src)
    .pipe(plumber())
    .pipe(newer(paths.images.dest))
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dest))
}

// move fonts
export function fonts() {
  return gulp.src(paths.font.src)
    .pipe(plumber())
    .pipe(newer(paths.font.dest))
    .pipe(gulp.dest(paths.font.dest))
}

// render nunjucks
export function nunjucks() {
  return gulp.src(paths.njk.src)
    .pipe(plumber())
    .pipe(newer(paths.njk.dest))
    .pipe(data(function () {
      return require(paths.njk.data)
    }))
    .pipe(nunjucksRender({
      path: paths.njk.template,
      ext: '.html',
      inheritExtension: false,
      envOptions: {
        watch: false
      },
      manageEnv: null,
      loaders: null
    }))
    .pipe(gulp.dest(paths.njk.dest))
}

// run server
const createServer = browserSync.create();
export function server(done) {
  createServer.init({
    notify: false,
    server: {
      baseDir: paths.server
    }
  })
  done();
}

// reload server on changes
export function reload(done) {
  createServer.reload();
  done();
}

export function watch() {
  gulp.watch(paths.njk.src, gulp.series(nunjucks, reload));
  gulp.watch(paths.njk.template, gulp.series(nunjucks, reload));
  gulp.watch(paths.njk.data, gulp.series(nunjucks, reload));
  gulp.watch(paths.styles.src, gulp.series(styles, reload));
  gulp.watch(paths.scripts.src, gulp.series(scripts, reload));
  gulp.watch(paths.images.src, gulp.series(images, reload));
  gulp.watch(paths.font.src, gulp.series(fonts, reload));
}


const build = gulp.series(gulp.parallel(styles, scripts, images, fonts, nunjucks), server, watch)

export default build;