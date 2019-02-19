<template>
    <div class="my-canvas-wrapper">
        <canvas ref="my-canvas" @mousemove="getCoords" @contextmenu.prevent="markBox" @click="fillBox"
                :width="canvasWidth" :height="canvasHeight"></canvas>
        <canvas class="layer" ref="top-layer" :width="canvasWidth" :height="canvasHeight"></canvas>
        <coords-board :x="x" :y="y" :stroke="stroke" :vc="vCount" :hc="hCount"></coords-board>
        <!--  <div class="vertical-line" :style="{left:pos.x * stroke + 'px'}"></div>
          <div class="horizontal-line" :style="{top:pos.y * stroke + 'px','width':width +'px'}"></div>-->
    </div>
</template>

<script>

    import CoordsBoard from './CoordsBoard';

    export default {
        props: ['img', 'width', 'height'],
        components: {CoordsBoard},
        data() {
            return {
                field: [],
                context: null,
                layer: null,
                stroke: 20,
                x: 0,
                y: 0,
                highlightBox: {startX: 0, endX: 0, startY: 0, endY: 0, x: 0, y: 0},
                vCount: 0,
                hCount: 0,
                mousedown:false,

            }
        },
        watch: {

            pos(newVal, oldVal) {
                const self = this;

                if (newVal.x !== oldVal.x || newVal.y !== oldVal.y) {
                    self.highlightBox = self.calcHighlight(self.pos.x, self.pos.y);
                    if(self.mousedown){
                        self.fillBox(true);
                    }
                }



            },

            highlightBox(newVal, oldVal) {
                const self = this;

                try {
                    self.highlightOff(oldVal);
                    self.highlightOn(newVal);
                } catch (e) {

                }


            }
        },
        mounted() {
            const self = this;

            for (let i in self.img) {
                self.field[i] = new Array(self.width).fill(0);
            }


            self.context = self.$refs['my-canvas'].getContext('2d');
            self.layer = self.$refs['top-layer'].getContext('2d');
            self.$refs['my-canvas'].addEventListener('mousedown',e =>{
                e.preventDefault();
                self.fillBox(true);
               self.mousedown = true;
            });
            self.$refs['my-canvas'].addEventListener('mouseup',e =>{
                e.preventDefault();
                self.mousedown = false;
                self.fillBox(true);
            });
            self.init();
        },
        methods: {
            init() {

                const self = this;


                if (false && self.img.length) {

                    self.context.fillStyle = "#adadad";
                    for (let j in self.img) {
                        for (let i in self.img) {
                            if (self.img[j][i])
                                self.context.fillRect(i * self.stroke, j * self.stroke, self.stroke, self.stroke);
                        }
                    }

                }
                self.createField();
            },
            fillBox(mode) {

                const self = this;
                if (mode || self.field[self.pos.y][self.pos.x] === 0) {
                    self.field[self.pos.y][self.pos.x] = 1;
                    self.context.fillStyle = "#373737";

                } else {
                    self.field[self.pos.y][self.pos.x] = 0;
                    self.context.fillStyle = "#ffffff";
                }

                self.context.fillRect(self.pos.x * self.stroke + 1, self.pos.y * self.stroke + 1, self.stroke - 1, self.stroke - 1);
            },
            markBox(e) {

                const self = this;
                self.context.fillStyle = "#ffffff";
                self.context.fillRect(self.pos.x * self.stroke + 1, self.pos.y * self.stroke + 1, self.stroke - 1, self.stroke - 1);
                if (self.field[self.pos.x][self.pos.y] > 1) {
                    self.field[self.pos.x][self.pos.y] = 0;

                } else {

                    self.field[self.pos.x][self.pos.y] = 3;
                    self.drawMark();

                }


            },
            drawMark() {
                const self = this;
                self.context.strokeStyle = "#000000";
                self.context.lineWidth = 1;
                self.context.beginPath();

                self.context.moveTo(self.pos.x * self.stroke + 1,self.pos.y * self.stroke + 1);
                self.context.lineTo(self.pos.x * self.stroke + self.stroke,self.pos.y * self.stroke  + self.stroke);
                self.context.stroke();
                self.context.closePath();

                self.context.beginPath();
                self.context.moveTo(self.pos.x * self.stroke  + self.stroke,self.pos.y * self.stroke + 1);
                self.context.lineTo(self.pos.x * self.stroke,self.pos.y * self.stroke  + self.stroke);
                self.context.stroke();
                self.context.closePath();
            },
            createField() {
                const self = this;
                self.context.strokeStyle = "#8F8F8F";
                for (let i = 0; i < this.width * this.stroke + 1; i += this.stroke) {
                    self.context.beginPath();


                    if (i / this.stroke % 5 === 0) {
                        self.context.moveTo(0, i);
                        self.context.lineTo(this.width * this.stroke, i);
                        self.context.lineWidth = 2;
                    } else {

                        self.context.moveTo(.5, i + .5);
                        self.context.lineTo(this.width * this.stroke + .5, i + .5);
                        self.context.lineWidth = 1;
                    }
                    self.context.stroke();
                    self.context.closePath();
                }
                for (let i = 0; i < this.height * this.stroke + 1; i += this.stroke) {
                    self.context.beginPath();


                    if (i / this.stroke % 5 === 0) {
                        self.context.lineWidth = 2;
                        self.context.moveTo(i, 0);
                        self.context.lineTo(i, this.height * this.stroke);
                    } else {
                        self.context.lineWidth = 1;
                        self.context.moveTo(i + .5, .5);
                        self.context.lineTo(i + .5, this.height * this.stroke + .5);

                    }
                    self.context.stroke();

                    self.context.closePath();
                }
            },
            getCoords(e) {
                const self = this;
                self.x = e.offsetX;
                self.y = e.offsetY;
            },

            isFilled(x, y) {
                if (x > this.width || y > this.height || x < 0 || y < 0)
                    return false;

                return Boolean(this.field[y][x] === 1);
            },
            calcHighlight(x, y) {
                const self = this;
                if (!self.isFilled(x, y))
                    return;

                let startX = x, startY = y;
                let endX = x, endY = y;
                let tempX = x, tempY = y;

                while (this.isFilled(--tempX, y)) {
                    --startX;
                }
                tempX = x;
                while (this.isFilled(++tempX, y)) {
                    ++endX;
                }

                while (this.isFilled(x, --tempY)) {
                    --startY;
                }
                tempY = y;
                while (this.isFilled(x, ++tempY)) {
                    ++endY;
                }

                return {startX: startX, endX: endX, startY: startY, endY: endY, x: x, y: y};

            },
            highlightOn(pos) {
                const self = this;
                this.layer.lineWidth = 2;
                this.layer.fillStyle = "rgba(255,255,255,0.2)";
                let vCount = (pos.endY - pos.startY + 1);
                let hCount = (pos.endX - pos.startX + 1);

                if ((pos.endX - pos.startX))
                    this.layer.fillRect(pos.startX * self.stroke, pos.y * self.stroke, self.stroke * (pos.endX - pos.startX + 1), self.stroke);
                if ((pos.endY - pos.startY))
                    this.layer.fillRect(pos.x * self.stroke, pos.startY * self.stroke, self.stroke, self.stroke * (pos.endY - pos.startY + 1));
                self.vCount = vCount;
                self.hCount = hCount;
            },
            highlightOff(pos) {
                const self = this;
                this.layer.lineWidth = 2;
                this.layer.fillStyle = "#000000";
                if ((pos.endX - pos.startX))
                    this.layer.clearRect(pos.startX * self.stroke, pos.y * self.stroke, self.stroke * (pos.endX - pos.startX + 1), self.stroke);
                if ((pos.endY - pos.startY))
                    this.layer.clearRect(pos.x * self.stroke, pos.startY * self.stroke, self.stroke, self.stroke * (pos.endY - pos.startY + 1));
            }

        },
        computed: {

            canvasWidth() {
                return this.width * this.stroke;
            },
            canvasHeight() {
                return this.height * this.stroke;
            },
            pos() {
                return {
                    x: Math.floor(this.x / this.stroke),
                    y: Math.floor(this.y / this.stroke)
                };
            },
        }
    }
</script>
<style scoped>
    .my-canvas-wrapper {
        position: relative;
        border: 1px solid black;
        box-sizing: border-box;
        background: white;
    }

    .vertical-line {
        position: absolute;
        width: 15px;
        height: 100%;
        top: 0;
        background: #ffffff61;
    }

    .horizontal-line {
        position: absolute;
        width: 100%;
        height: 15px;
        top: 0;
        background: #ffffff61;
    }

    .layer {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        pointer-events: none;

    }
</style>