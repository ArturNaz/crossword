window.$ = window.Jquery = require('jquery');
window.Vue = require('vue');

let GRAVITY = .1;
window.fountain = new Vue({
    el: '#fountain',
    data: {
        ctx: null,
        points: [],
    },
    mounted() {

        const self = this;
        self.ctx = self.$refs['my-canvas'].getContext('2d');
        self.$refs['my-canvas'].width = 1000;
        self.$refs['my-canvas'].height = 1000;
        console.log(self.ctx);
        for(let i = 0; i < 1000; i++){

            setTimeout(()=>{
                self.points.push(new Point(randomInt(0,1000),0,0,randomInt(-4,4),randomInt(0,1),'#000',1,self.ctx));
            },i*2)

        }
        self.render();

        //self.points[0].draw();

    },
    beforeCreate() {
        let self = this;


    },

    methods: {
        render(time){
            const self = this;

            self.ctx.clearRect(0,0,1000,1000);

             for(let i in self.points){

                 self.points[i].draw();
                 self.points[i].update();
             }


             window.requestAnimationFrame(self.render);



        },

    }


});

function Point(x, y, vx, vy, size, color, opacity, ctx) {
    this.x = x;
    this.y = y;
    this.vy = vy;
    this.vx = vx;
    this.size = size;
    this.color = color;
    this.opacity = opacity;
    this.time = new Date().getTime();
    this.dvx = randomInt(-1,1);
    this.blow = 0;
    this.update = () => {
        let time = new Date().getTime() - this.time;


        this.vy += GRAVITY;

        this.x += this.vx;
        this.y += this.vy;
        this.size += 0 ;
        this.opacity ;
        if(!this.inside())
            this.reset();

    };
    this.draw = () => {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
        //ctx.stroke();
        //ctx.fillRect(this.x, this.y, this.size, this.size);

    };
    this.reset = () => {
        this.x = x;
        this.y = y;
        this.size = size ;
        this.vy =  randomInt(1,1);
        this.vx = randomInt(1,1);
        this.color = '#fff';//getRandomColor();
        this.opacity = 1;
    };
    this.inside = () => {
        return (this.x < 1000 && this.y < 1000 && this.x > 0 && this.y > 0);
    }



}
function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min+Math.random();
}
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
