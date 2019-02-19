window.$ = window.Jquery = require('jquery');
window.Vue = require('vue');
import MyTable from './components/MyTable';

window.app = new Vue({
    el: '#app',
    components: {MyTable},
    data: {

        img: [],
        loading: false,
        size:20,
    },
    beforeCreate() {
        let self = this;
        console.log('beforeCreate');
        $.get('/image.php').then(function (data) {
            self.img = JSON.parse(data);
            self.loading = true;
        });

    },

    methods: {
        getCoords(e) {
            this.x = e.clientX;
            this.y = e.clientY;
        },
    }


});
