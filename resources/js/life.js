window.$ = window.Jquery = require('jquery');
window.Vue = require('vue');

let GRAVITY = .1;
window.life = new Vue({
    el: '#life',
    data: {
        ctx: null,
        points: [],
        width:150,
        height:150,
        stroke:6,
    },
    mounted() {

        const self = this;
        self.ctx = self.$refs['my-canvas'].getContext('2d');
        self.grid = self.$refs['my-grid'].getContext('2d');
        self.$refs['my-grid'].width = self.$refs['my-canvas'].width = self.width * self.stroke;
        self.$refs['my-grid'].height = self.$refs['my-canvas'].height = self.height * self.stroke;
        console.log(self.ctx);
        for(let i = 0; i < self.width; i++){
            self.points[i] = [];
            for(let j = 0; j < self.height; j++){
                self.points[i][j] = Number(Math.random() > .5);

            }
        }
        self.drawSpace();
        self.drawPoints();
        //self.points[0].draw();

    },
    beforeCreate() {
        let self = this;


    },

    methods: {
        nextStep(x, y){
            const self = this;
            let neighboures = self.neighbourCount(x, y);
            if(self.points[x][y]) {
                return Number(neighboures === 2 || neighboures === 3);
            }else{
                return Number(neighboures === 3);
            }
        },
        checkX(x, num){
            const self = this;
            if (x + num > self.width - 1){
                return 0
            }
            if(x + num < 0){
              return self.width - 1;
            }

            return x + num;
        },
        checkY(y, num){
            const self = this;
            if (y + num > self.height - 1){
                return 0
            }
            if(y + num < 0){
                return self.height - 1;
            }

            return y + num;
        },
        neighbourCount(x, y){
            const self = this;
            let count = 0;
            ///top
            if(self.points[self.checkX(x,-1)][self.checkY(y,-1)])
                count++;
            if(self.points[x][self.checkY(y,-1)])
                count++;
            if(self.points[self.checkX(x,1)][self.checkY(y,-1)])
                count++;
            ///middle
            if(self.points[self.checkX(x,-1)][y])
                count++;
            if(self.points[self.checkX(x,1)][y])
                count++;
            ///bottom
            if(self.points[self.checkX(x,-1)][self.checkY(y,1)])
                count++;
            if(self.points[x][self.checkY(y,1)])
                count++;
            if(self.points[self.checkX(x,1)][self.checkY(y,1)])
                count++;

            return count
        },
        drawSpace(){
            const self = this;
            self.grid.strokeStyle = "#ffffff";
            for (let i = 0; i < this.width * this.stroke + 1; i += this.stroke) {
                self.grid.beginPath();
                    self.grid.moveTo(.5, i + .5);
                    self.grid.lineTo(this.width * this.stroke + .5, i + .5);
                    self.grid.lineWidth = 1;

                self.grid.stroke();
                self.grid.closePath();
            }
            for (let i = 0; i < this.height * this.stroke + 1; i += this.stroke) {
                self.grid.beginPath();
                    self.grid.lineWidth = 1;
                    self.grid.moveTo(i + .5, .5);
                    self.grid.lineTo(i + .5, this.height * this.stroke + .5);

                self.grid.stroke();

                self.grid.closePath();
            } 
        },
        drawPoints(){
            const self = this;
            self.ctx.fillStyle = "#e17f2a";
            for(let i = 0; i < self.width; i++){
                for(let j = 0; j < self.height; j++){
                    if (self.points[i][j]){
                        //self.ctx.fillRect(i * self.stroke, j * self.stroke, self.stroke, self.stroke);

                        self.ctx.beginPath();
                        self.ctx.strokeStyle = "#e17f2a";
                        self.ctx.arc(i * self.stroke - self.stroke/2, j * self.stroke - self.stroke/2, self.stroke * 0.25, 0, 2 * Math.PI);
                        self.ctx.stroke();
                        self.grid.closePath();
                    }

                }
            }
        },
        render(time){
            const self = this;
            let temp = [];

            self.ctx.clearRect(0,0,1000,1000);
            for(let i = 0; i < self.width; i++){
                temp[i] = [];
                for(let j = 0; j < self.height; j++){
                    temp[i][j] = self.nextStep(i, j);

                }
            }
            self.points = temp;

            self.drawPoints();

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
