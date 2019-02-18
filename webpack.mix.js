const {mix} = require('laravel-mix');
const LiveReloadPlugin = require('webpack-livereload-plugin');

mix.js('resources/js/app.js', 'public/js')
   .sass('resources/sass/app.scss', 'public/css')
   .version();
   //.browserSync();

mix.webpackConfig({
    plugins: [
        new LiveReloadPlugin()
    ]
});
