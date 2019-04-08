const {mix} = require('laravel-mix');
const LiveReloadPlugin = require('webpack-livereload-plugin');

mix.js('resources/js/app.js', 'public/js')
   .js('resources/js/fountain.js', 'public/js')
    .js('resources/js/life.js', 'public/js')
    .js('resources/js/astar.js', 'public/js')
   .sass('resources/sass/app.scss', 'public/css')
   .version();
   //.browserSync();

mix.webpackConfig({
    plugins: [
        new LiveReloadPlugin()
    ]
});
