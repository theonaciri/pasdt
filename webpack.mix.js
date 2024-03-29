const mix = require('laravel-mix');
const webpack = require('webpack');
require('url-search-params-polyfill');

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
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    })
  ]
});

if (!mix.inProduction()) {
  require('laravel-mix-bundle-analyzer');
    mix.webpackConfig({mode: 'development'})
    .sass('resources/sass/app.scss', 'public/css')
    .js('resources/js/public_blog.js', 'public/js')
    .js('resources/js/app.js', 'public/js')
    .js('resources/js/extra-monitoring.js', 'public/js')
     //.babel('public/js/app.js', 'public/js/app.es5.js')
     //.js('resources/js/dependencies/anychart-bundle.js', 'public/js/anychart-bundle.js')
     //.js('resources/js/checkout.js', 'public/js')
     //.babel('public/js/checkout.js', 'public/js/checkout.es5.js')
     //.extract(['pdfmake', 'pdfmake/build/vfs_fonts'])
    //.copy("resources/js/lang/*.js", "public/json/locales/js/")
    .browserSync('127.0.0.1:8000')
    //.bundleAnalyzer({"default-sizes": "stat"});
} else {
  //require('laravel-mix-polyfill');
  mix.webpackConfig({mode: 'production'})
     .js('resources/js/app.js', 'public/js')
     .js('resources/js/extra-monitoring.js', 'public/js')
     .babel('public/js/extra-monitoring.js', 'public/js/extra-monitoring.es5.js')
     .sass('resources/sass/app.scss', 'public/css')
     .js(['resources/js/dependencies/polyfills/allpolyfills.js', 'resources/js/app.js'], 'public/js/app.es5.js')
     .babel('public/js/app.es5.js', 'public/js/app.es5.js')
     .copy("resources/js/lang/*.js", "public/json/locales/js/")
     .js('resources/js/dependencies/anychart-bundle.js', 'public/js/anychart-bundle.js')
     .js('resources/js/public_blog.js', 'public/js')
     .babel('public/js/public_blog.es5.js', 'public/js/public_blog.es5.js')
     /*.polyfill({
      enabled: true,
      useBuiltIns: "usage",
      targets: {"firefox": "50", "ie": 11}
   });*/
}