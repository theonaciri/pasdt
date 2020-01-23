const mix = require('laravel-mix');
const webpack = require('webpack');

require('laravel-mix-bundle-analyzer');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.webpackConfig({
  plugins: [
   // reduce bundle size by ignoring moment js local files
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
});

mix.js('resources/js/app.js', 'public/js')
   .js('resources/js/checkout.js', 'public/js')
   .sass('resources/sass/app.scss', 'public/css')
   .extract(['pdfmake', 'pdfmake/build/vfs_fonts']);

mix.browserSync('127.0.0.1:8000');

if (!mix.inProduction()) {
    mix.bundleAnalyzer();
}