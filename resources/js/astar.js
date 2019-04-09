window.$ = window.Jquery = require('jquery');
window.Vue = require('vue');

let GRAVITY = .1;
window.astar = new Vue({
    el: '#astar',
    data: {
        ctx: null,
        points: [],
        width:40,
        height:40,
        stroke:20,

    },
    mounted() {

        const self = this;
        self.ctx = self.$refs['my-canvas'].getContext('2d');
        self.grid = self.$refs['my-grid'].getContext('2d');
        self.$refs['my-grid'].width = self.$refs['my-canvas'].width = self.width * self.stroke;
        self.$refs['my-grid'].height = self.$refs['my-canvas'].height = self.height * self.stroke;
        console.log(self.ctx);
        for(let i = 0; i <= self.width; i++){
            self.points[i] = [];
            for(let j = 0; j <= self.height; j++){
                self.points[i][j] = new Point(self, i, j, Math.random() > .99,1);
            }
        }
        self.drawSpace();
        self.drawPoints();

        //self.points[0].draw();

    },
    methods: {

        drawSpace(){
            const self = this;
            self.grid.strokeStyle = "#302f2b";
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
            let start = self.points[2][5];
            let end = self.points[30][35];
            start.start();
            end.end();
            self.ctx.lineWidth = 2;
            for(let i = 0; i < self.width; i++){
                for(let j = 0; j < self.height; j++){
                        self.points[i][j].draw();
                }
            }
        },
        render(time){

            const self = this;
            self.points[2][5].is_visited = true;
            let start = self.points[2][5];
            let end = self.points[30][35];
            start.start();
            end.end();

            var frontier = [];
            frontier.push(start);
            //console.log('h',frontier);
          /*  let loop = setInterval(function () {
                if(frontier.length === 0){
                    clearInterval(loop);
                    return;
                }



               // console.log('h',frontier);
                let current = frontier.shift();
                let neighbours = current.neighbours();
                for(let n of neighbours){
                    if(!n.is_visited && !n.is_wall){
                        n.is_visited = true;
                        n.is_border = false;

                        frontier.push(n)
                        let Nneighbours = n.neighbours();
                        for(let nn of Nneighbours){
                            if(!nn.is_visited){
                                nn.is_border = true;
                            }
                        }

                     }
                }
                self.ctx.clearRect(0,0,1000,1000);
                self.drawPoints();


            }.bind(frontier,self), .01);*/

            self.calc(frontier, self, start, end);



        },
        calc(frontier, self, start, end){
            let current = frontier.shift();
            let neighbours = current.neighbours();
            if (current == end){
                return self.path(start,end);
            }
            for(let n of neighbours){
                if(!n.is_visited && !n.is_wall){
                    n.is_visited = current;
                    n.is_border = false;
                    frontier.push(n);
                    frontier.sort(function (a, b) {
                        if (a.coast > b.coast) {
                            return 1;
                        }
                        if (a.coast < b.coast) {
                            return -1;
                        }
                        // a должно быть равным b
                        return 0;
                    });

                    let Nneighbours = n.neighbours();
                    for(let nn of Nneighbours){
                        if(!nn.is_visited){
                            nn.is_border = true;
                        }
                    }

                }
            }
            self.ctx.clearRect(0,0,1000,1000);
            self.drawPoints();

            if(frontier.length !== 0){

                window.requestAnimationFrame(()=>{self.calc(frontier, self, start, end);});
            }else{
                self.path(start,end)
            }
        },
        arrow(x,y,side) {

            const self = this;
            const dir ={
                left:0,
                up_left:45,
                up:90,
                up_right:135,
                right:180,
                down_right:225,
                down:270,
                down_left:315,
            };
            let image = new Image();
            image.src = 'https://static.thenounproject.com/png/109117-200.png';
            self.ctx.beginPath();
            self.ctx.save();
            self.ctx.translate(x * self.stroke + self.stroke/2, y * self.stroke + self.stroke/2 );
            self.ctx.rotate(dir[side] *  Math.PI/180);
            self.ctx.drawImage(image,-(self.stroke/2), -(self.stroke/2) , self.stroke - 1, self.stroke - 1);
            self.ctx.restore();
            self.grid.closePath();
        },
        path(start,end){
            const self = this;
            let current = end;
            let path = [];path.push(current);
            while (current !== start){
                    current = current.is_visited;
                    path.push(current)
            }
            self.grid.strokeStyle = "#ff7f50";
            self.grid.beginPath();
            self.grid.moveTo(end.x* self.stroke+ .5 *self.stroke, end.y* self.stroke+ .5 *self.stroke);
            for (let pos of path) {

                self.grid.lineTo(pos.x * self.stroke + .5 *self.stroke, pos.y * self.stroke +  .5 *self.stroke);

            }
            start.start();
            end.end();
            self.grid.lineWidth = 5;

            self.grid.stroke();
            self.grid.closePath();

        },
        addWall(e){
            console.log();
            let x = Math.floor(e.clientX/this.stroke);
            let y = Math.floor(e.clientY/this.stroke);
            /*if(!this.points[x][y].is_wall){
                this.points[x][y].is_wall = true;
                this.points[x][y].wall()
            }else{
                this.points[x][y].is_wall = false;
                this.points[x][y].simple()
            }*/
            if(this.points[x][y].coast == 1){
                this.points[x][y].coast = 2;
                this.points[x][y].weight()
            }else{
                this.points[x][y].coast = 1;
                this.points[x][y].weight()
            }

        }


    }


});

function Point(app, x, y, is_wall, coast) {
    this.x = x;
    this.y = y;
    this.is_wall = is_wall;
    this.is_visited = false;
    this.is_border = false;
    this.coast = coast;
    this.s = false;
    this.e = false;
    this.start = function () {
        this.s = true;
        app.ctx.fillStyle = "#10f4aa";
        app.ctx.fillRect(this.x  * app.stroke, this.y  * app.stroke, app.stroke, app.stroke);
    };
    this.end = function () {
        this.e = true;
        app.ctx.fillStyle = "#d70011";
        app.ctx.fillRect(this.x  * app.stroke, this.y  * app.stroke, app.stroke, app.stroke);
    };
    this.weight = function () {
        app.ctx.fillStyle = "#fff";
        app.ctx.fillRect(this.x  * app.stroke, this.y  * app.stroke, app.stroke, app.stroke);
        app.ctx.strokeStyle = this.coast == 2 ? "#e17f2a" : "#0fd731";
        app.ctx.beginPath();
        app.ctx.arc(this.x * app.stroke + app.stroke/2, this.y * app.stroke + app.stroke/2, app.stroke * 0.35, 0, 2 * Math.PI);
        app.ctx.stroke();
        app.grid.closePath();
    };
    this.wall = function () {
        app.ctx.fillStyle = "#000000";
        app.ctx.fillRect(this.x  * app.stroke, this.y  * app.stroke, app.stroke, app.stroke);
    };
    this.simple = function () {
        app.ctx.fillStyle = "#fff";
        app.ctx.fillRect(this.x  * app.stroke, this.y  * app.stroke, app.stroke, app.stroke);
        app.ctx.strokeStyle = this.coast == 2 ? "#e17f2a" : "#0fd731";
        app.ctx.beginPath();
        app.ctx.arc(this.x * app.stroke + app.stroke/2, this.y * app.stroke + app.stroke/2, app.stroke * 0.35, 0, 2 * Math.PI);
        app.ctx.stroke();
        app.grid.closePath();
    };
    this.border = function () {
        app.ctx.fillStyle = "#fff";
        app.ctx.fillRect(this.x  * app.stroke, this.y  * app.stroke, app.stroke, app.stroke);
        app.ctx.strokeStyle = "#2738f4";
        app.ctx.beginPath();
        app.ctx.arc(this.x * app.stroke + app.stroke/2, this.y * app.stroke + app.stroke/2, app.stroke * 0.35, 0, 2 * Math.PI);
        app.ctx.stroke();
        app.grid.closePath();
    };
    this.dir = function () {
        if(this.x > this.is_visited.x && this.y > this.is_visited.y)
            return 'up_left';
        if(this.x === this.is_visited.x && this.y > this.is_visited.y)
            return 'up';
        if(this.x < this.is_visited.x && this.y > this.is_visited.y)
            return 'up_right';

        if(this.x > this.is_visited.x && this.y === this.is_visited.y)
            return 'left';
        if(this.x < this.is_visited.x && this.y === this.is_visited.y)
            return 'right';

        if(this.x > this.is_visited.x && this.y < this.is_visited.y)
            return 'down_left';
        if(this.x === this.is_visited.x && this.y < this.is_visited.y)
            return 'down';
        if(this.x < this.is_visited.x && this.y < this.is_visited.y)
            return 'down_right';
    }
    this.draw = function () {
        if(this.s){
            return this.start();
        }
        if(this.e){
            return this.end();
        }
        if(this.is_wall){
            return this.wall();
        }
        if(this.is_visited){
            return app.arrow(this.x,this.y, this.dir());
        }
        if(this.is_border){
            return this.border();
        }

        this.simple();
    };
    this.neighbours = function(){
        const self = astar;
        let neighbours = [];
        ///top
        /*if(this.x > 0 && this.y > 0)
            neighbours.push(self.points[this.x - 1][this.y - 1]);*/
        if(this.y > 0)
            neighbours.push(self.points[this.x][this.y - 1]);
       /* if(this.x < self.width - 1 && this.y > 0)
            neighbours.push(self.points[this.x + 1][this.y - 1]);*/
        ///middle
        if(this.x > 0)
            neighbours.push(self.points[this.x - 1][this.y]);
        if(this.x < self.width - 1)
            neighbours.push(self.points[this.x + 1][this.y]);
        ///bottom
       /* if(this.x > 0 && this.y < self.height - 1)
            neighbours.push(self.points[this.x - 1][this.y + 1]);*/
        if(this.y < self.height - 1)
            neighbours.push(self.points[this.x][this.y + 1]);
      /*  if(this.x < self.width - 1 && this.y < self.height - 1)
            neighbours.push(self.points[this.x + 1][this.y + 1]);*/

        return shuffle(neighbours);
    };

}
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
function countDuplicates(original) {

    let counts = {},
        duplicate = 0;
    original.forEach(function(x) {
        counts[x] = (counts[x] || 0) + 1;
    });

    for (var key in counts) {
        if (counts.hasOwnProperty(key)) {
            counts[key] > 1 ? duplicate++ : duplicate;
        }
    }

    return duplicate;

}