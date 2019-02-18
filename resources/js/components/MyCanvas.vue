<template>
    <div class="my-canvas-wrapper">
        <canvas ref="my-canvas" @mousemove="getCoords"></canvas>
        <coords-board :x="x" :y="y" :stroke="stroke" :vc="vCount" :hc="hCount"></coords-board>
    </div>
</template>

<script>

    import CoordsBoard from './CoordsBoard';
    export default {
        props:['img'],
        components: {CoordsBoard},
        data() {
            return {

              context: null,
              stroke:15,
              x:0,
              y:0,
              highlightBox:{},
              vCount:0,
              hCount:0,

            }
        },
        watch:{
            img(){
                this.$refs['my-canvas'].width = this.img[0].length * this.stroke;
                this.$refs['my-canvas'].height = this.img.length * this.stroke;
                this.init();
            },
            pos(newVal, oldVal){
                const self = this;

                if(newVal.x !== oldVal.x || newVal.y !== oldVal.y){}
                self.highlightBox = self.calcHighlight(self.pos.x, self.pos.y);

            },

            highlightBox(newVal, oldVal){
                const self = this;

                self.highlightOff(oldVal);
                self.highlightOn(newVal);

            }
        },
        mounted() {

            // We can't access the rendering context until the canvas is mounted to the DOM.
            // Once we have it, provide it to all child components.
            this.context = this.$refs['my-canvas'].getContext('2d');

            // Resize the canvas to fit its parent's width.
            // Normally you'd use a more flexible resize system.
            this.$refs['my-canvas'].width = this.img.length;
            this.$refs['my-canvas'].height = this.img.length;

            this.init();
        },
        methods:{
            init() {

                const self = this;

                if(self.img.length) {

                    self.context.fillStyle = "#373737";
                    for (let j in self.img) {
                        for (let i in self.img) {
                            if (self.img[j][i])
                                self.context.fillRect(i * self.stroke, j * self.stroke, self.stroke, self.stroke);
                        }
                    }

                }
                self.createField();
            },
            createField(){
                const self = this;
                self.context.translate(0.5, 0.5);
                self.context.strokeStyle = "#000000";
                for (let i = 0; i < this.width * this.stroke + 1; i += this.stroke )
                {
                    self.context.beginPath();

                    self.context.moveTo(0 , i);
                    self.context.lineTo(this.width * this.stroke , i);

                     if(i / this.stroke % 5 === 0){
                         self.context.lineWidth = 2;
                     } else{
                         self.context.lineWidth = 1;
                     }
                    self.context.stroke();
                    self.context.closePath();
                }
                self.context.translate(+0.5, +0.5);
                for (let i = 0; i < this.height * this.stroke+1; i += this.stroke)
                {
                    self.context.beginPath();

                    self.context.moveTo(i, 0);
                    self.context.lineTo(i,this.height * this.stroke);

                    if(i / this.stroke % 5 === 0){
                        self.context.lineWidth = 2;
                    } else{
                        self.context.lineWidth = 1;
                    }
                    self.context.stroke();

                    self.context.closePath();
                   /* self.context.moveTo(i * this.stroke +.5, 0 +.5);
                    self.context.lineTo(i * this.stroke +.5,this.height * this.stroke +.5);
                    self.context.stroke();*/
                }
            },
            getCoords(e){
                const self = this;
                self.x = e.offsetX;
                self.y = e.offsetY;
            },

            isFilled(x,y){
                if(x > this.width || y > this.height || x < 0 || y < 0)
                    return false;

                return Boolean(this.img[y][x]);
            },
            calcHighlight(x,y){
                const self = this;
                if(!self.isFilled(x,y))
                    return;

                let startX = x,startY = y;
                let endX = x, endY = y;
                let tempX = x,tempY = y;

                while(this.isFilled(--tempX,y)){
                    --startX;
                }
                tempX = x;
                while(this.isFilled(++tempX,y)){
                    ++endX;
                }

                while(this.isFilled(x, --tempY)){
                    --startY;
                }
                tempY = y;
                while(this.isFilled(x, ++tempY)){
                    ++endY;
                }

                return {startX:startX, endX:endX, startY:startY, endY:endY, x:x, y:y};

            },
            highlightOn(pos){
                const self = this;
                this.context.lineWidth = 1;
                this.context.strokeStyle = "white";
                let vCount = (pos.endY - pos.startY +1);
                let hCount = (pos.endX - pos.startX +1);

                if((pos.endX - pos.startX))
                    this.context.strokeRect(pos.startX * self.stroke, pos.y * self.stroke, self.stroke * (pos.endX - pos.startX +1), self.stroke);
                if((pos.endY - pos.startY))
                    this.context.strokeRect(pos.x * self.stroke, pos.startY * self.stroke, self.stroke, self.stroke * (pos.endY - pos.startY +1));
                self.vCount = vCount;
                self.hCount = hCount;
            },
            highlightOff(pos){
                const self = this;
                this.context.lineWidth = 2;
                this.context.strokeStyle = "#000000";
                if((pos.endX - pos.startX))
                    this.context.strokeRect(pos.startX * self.stroke, pos.y * self.stroke, self.stroke * (pos.endX - pos.startX +1), self.stroke);
                if((pos.endY - pos.startY))
                    this.context.strokeRect(pos.x * self.stroke, pos.startY * self.stroke, self.stroke, self.stroke * (pos.endY - pos.startY +1));
            }

        },
        computed:{
             width(){
                 return this.img[0].length;
             },
            height(){
                return this.img.length;
            },
            pos(){
                return {
                    x:Math.floor(this.x / this.stroke),
                    y:Math.floor(this.y / this.stroke)
                };
            },
        }
    }
</script>
<style scoped>
    .my-canvas-wrapper{
        position: relative;
    }
</style>