<template>
    <div class="my-canvas-wrapper">
        <canvas ref="my-canvas"></canvas>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props:['img'],
        data() {
            return {

              context: null,
                stroke:15,

            }
        },
        watch:{
            img(){
                this.$refs['my-canvas'].width = this.img[0].length * this.stroke;
                this.$refs['my-canvas'].height = this.img.length * this.stroke;
                this.init();
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
                var self = this;
                if(self.img.length) {
                    console.log('start');
                    for (var j in self.img) {
                        for (var i in self.img) {
                            if (self.img[j][i])
                                this.context.fillRect(i * self.stroke, j * self.stroke, self.stroke, self.stroke);
                            else
                                this.context.strokeRect(i * self.stroke, j * self.stroke, self.stroke, self.stroke);
                        }
                    }
                }
            }
        }
    }
</script>