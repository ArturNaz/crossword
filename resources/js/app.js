window.$ = window.Jquery = require('jquery');
window.Vue = require('vue');
import MyTable from './components/MyTable';
import MyCanvas from './components/MyCanvas';
window.app = new Vue({
    el: '#app',
    components: {MyCanvas,MyTable},
    data: {

        img: [],
    },
    beforeCreate() {
        let self = this;

        $.get('/image.php').then(function (data) {
            self.img = JSON.parse(data);
           // self.init();
        });
    },


});
