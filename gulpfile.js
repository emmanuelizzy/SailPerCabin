const gulp              = require( 'gulp' );
const browserSync       = require('browser-sync').create();

// CSS related plugins
const sass              = require('gulp-sass')(require('sass'));
const postcss           = require('gulp-postcss');
const postcssImport     = require('postcss-import');
const autoprefixer      = require('autoprefixer');
const cssnano           = require('cssnano');

// JS related plugins
const uglify            = require('gulp-uglify');
const babelify          = require('babelify');

// Utility plugins
const fs                = require('fs');
const path              = require('path');
const rename            = require( 'gulp-rename' );
const through2          = require('through2');
const sourcemaps        = require( 'gulp-sourcemaps' );
const browserify        = require('browserify');
const source            = require('vinyl-source-stream');
const buffer            = require('vinyl-buffer');
const zip               = require('gulp-zip').default;

// Load export manifest
const exportManifest    = require('./export-manifest.json');

// Custom importer to resolve @scss alias to ./src/scss
const scssAliasImporter = {
    findFileUrl(url) {
        if (!url.startsWith('@scss/')) return null;
        return new URL('file://' + path.resolve('./src/scss', url.slice('@scss/'.length)));
    }
};

// Paths for CSS and JS files
const cssFiles = [
    {
        src: './src/scss/style.scss',
        dest: './assets/css'
    },
];

const jsFiles = [
    { src: './src/js/script.js', dest: './assets/js' },
];

async function styles(done) {
    const tasks = cssFiles.map(file => {
        return gulp.src(file.src)
            .pipe(sourcemaps.init())
            .pipe(sass({
                errorLogToConsole: true,
                outputStyle: 'expanded',
                importers: [scssAliasImporter]
            }).on('error', sass.logError))
            .pipe(postcss([
                postcssImport(),
                autoprefixer({ grid: true })
            ]))
            .pipe(gulp.dest(file.dest))
            .pipe(rename({ suffix: '.min' }))
            .pipe(postcss([
                postcssImport(),
                autoprefixer({ grid: true }),
                cssnano()
            ]))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(file.dest))
            .pipe(browserSync.stream());
    });

    Promise.all(tasks).then(() => done()).catch(done);
}

function scripts(done) {
    const tasks = jsFiles.map(file => {
        return browserify({
            entries: file.src,
            debug: true
        })
        .transform(babelify, {
            presets: ["@babel/preset-env"],
            sourceMaps: true
        })
        .bundle()
        .pipe(source(file.src.split('/').pop()))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(gulp.dest(file.dest))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(file.dest))
        .pipe(browserSync.stream());
    });

    Promise.all(tasks).then(() => done()).catch(done);
}

function watch(done) {
    // browserSync.init({
    //     notify: false,
    //     injectChanges: true,
	// 	open: false
    // });

    gulp.watch('./src/scss/**/*.scss', styles);
    gulp.watch('./src/js/**/*.js', scripts);

    // Reload the browser when CSS or JS files are changed
    gulp.watch('./assets/css/*.css').on('change', browserSync.reload);
    gulp.watch('./assets/js/*.js').on('change', browserSync.reload);
    gulp.watch('./index.html').on('change', browserSync.reload);

    done();
}

const build = gulp.series(gulp.parallel(styles, scripts));

function zipFiles(done) {
    const filesToZip = [
        ...exportManifest.files,
        ...exportManifest.directories,
        '!**/*.map'
    ];

    const version = exportManifest.version;
    const folderName = exportManifest.name;
    const zipFilename = `${exportManifest.name}-${version}.zip`;

    return gulp.src(filesToZip, { base: './', encoding: false })
        // Prefix all files with the folder name
        .pipe(through2.obj(function(file, enc, cb) {
            if (file.relative) {
                file.base = file.cwd;
                file.path = path.join(file.cwd, folderName, file.relative);
            }
            cb(null, file);
        }))
        .pipe(zip(zipFilename))
        .pipe(gulp.dest('./dist'))
        .on('end', function() {
            // Increment patch version
            const versionParts = version.split('.');
            versionParts[2] = parseInt(versionParts[2]) + 1;
            exportManifest.version = versionParts.join('.');

            // Write updated manifest back to file
            fs.writeFileSync(
                './export-manifest.json',
                JSON.stringify(exportManifest, null, 4) + '\n'
            );

            console.log(`\nVersion updated to ${exportManifest.version} for next build`);
        });
}

const production = gulp.series(build, zipFiles);

gulp.task('watch', gulp.series(build, watch));

// Gulp tasks
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('zip', zipFiles);
gulp.task('production', production);
gulp.task('watch', gulp.series(build, watch));
gulp.task('default', build);