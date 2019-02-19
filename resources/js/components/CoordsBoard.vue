<template>
    <div class="board" :style="boardPos">
        <p>x: {{position.x}}</p>
        <p>y: {{position.y}}</p>
        <p>hc: {{hc}}</p>
        <p>vc: {{vc}}</p>
    </div>
</template>

<script>
    export default {
        data(){
            return {

            }
        },
        props:['x','y','stroke', 'vc', 'hc'],
        mounted(){

        },
        computed:{
           position(){
               return {
                   x:Math.floor(this.x / this.stroke + 1),
                   y:Math.floor(this.y / this.stroke + 1)
               };
           },
           boardPos(){
               return{
                   top:this.y + 20 + 'px',
                   left:this.x + 20 + 'px',
               }
           }

        }
    }
</script>

<style scoped>
    .board{
        background: #ffffffa3;
        position: absolute;
        font-family: Arial;
        border-radius: 8px;
        line-height: 1;
        margin: 0;
        padding: 5px 10px;
        box-shadow: 2px 2px 5px #00000059;
        white-space: nowrap;
        z-index: 3;

    }
    .board p{
        margin: 0;
    }
</style>