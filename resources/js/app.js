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
        console.log('beforeCreate');
        $.get('/image.php').then(function (data) {
            self.img = JSON.parse(data);
           // self.init();
        });
    },
    created(){
        console.log('created');
    },
     beforeMount(){
         console.log('beforeMount');
     },
    mounted(){
        console.log('mounted');
    },
    beforeUpdate(){
        console.log('beforeUpdate');
    },
    updated(){
        console.log('updated');
    },
    methods:{
        getCoords(e){
            this.x = e.clientX;
            this.y = e.clientY;
        },
    }



});
