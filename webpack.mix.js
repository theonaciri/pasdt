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
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    //new webpack.IgnorePlugin(/^\.\/widgets$/, /jquery-ui$/)
  ],
  /*module: {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: Config.babel()
                        }
                    ]
 
                }
            ]
        }*/
});

if (!mix.inProduction()) {
  //mix.bundleAnalyzer();
  mix.js('resources/js/app.js', 'public/js')
     //.babel('public/js/app.js', 'public/js/app.es5.js')
     //.js('resources/js/dependencies/anychart-bundle.js', 'public/js/anychart-bundle.js')
     //.js('resources/js/checkout.js', 'public/js')
     //.babel('public/js/checkout.js', 'public/js/checkout.es5.js')
     .sass('resources/sass/app.scss', 'public/css')
     //.extract(['pdfmake', 'pdfmake/build/vfs_fonts'])
     //.babel('public/js/vendor.js', 'public/js/vendor.es5.js');
  mix.browserSync('127.0.0.1:8000');
} else {

mix.js('resources/js/app.js', 'public/js')
   .babel('public/js/app.js', 'public/js/app.es5.js')
   //.js('resources/js/dependencies/anychart-bundle.js', 'public/js/anychart-bundle.js')
   //.js('resources/js/checkout.js', 'public/js')
   //.babel('public/js/checkout.js', 'public/js/checkout.es5.js')
   .sass('resources/sass/app.scss', 'public/css')
   //.extract(['pdfmake', 'pdfmake/build/vfs_fonts'])
   //.babel('public/js/vendor.js', 'public/js/vendor.es5.js');

}
