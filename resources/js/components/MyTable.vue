<template>
    <div class="crossword">
        <table :style="{'margin-left':(horizontalRowCount*size)+'px'}">
            <tr v-for="raw in verticalData">
                <th v-for="col in raw" :class="{num:(col > 0)}">{{col}}</th>
            </tr>

        </table>
        <div class="row">
            <table>
                <tr v-for="raw in horizontalData">
                    <th v-for="col in raw" :class="{num:(col > 0)}">{{col}}</th>
                </tr>

            </table>
            <my-canvas  :img="img" :width="width" :height="height">

            </my-canvas>
        </div>




    </div>
    
</template>

<script>
    import MyCanvas from './MyCanvas';
    export default {
        props:['img', 'size'],
        components: {MyCanvas},
        data() {
            return {

            }
        },
        watch:{

        },
        beforeCreate(){

        },

        mounted(){

        },
       computed:{
           horizontalData:function(){

                let self = this;
                let hData = [];
                let length = 0;
                let temp = 0;

                if(self.img.length) {

                    for (let j = 0; j < this.height; j ++) {

                        temp = 0;
                        hData[j] = [];
                        for (let i = 0; i < this.width + 1; i ++) {

                            if (self.img[j][i]){
                                temp++;
                            }else{
                                temp === 0 || hData[j].push(temp);
                                temp = 0;
                            }
                            if(temp === this.width){
                                hData[j].push(temp);
                            }
                        }
                        if(hData[j].length > length){
                            length = hData[j].length
                        }
                    }

                }
                for (let j in hData) {
                    hData[j] =  new Array(length - hData[j].length ).fill(' ').concat(hData[j])
                }


                return hData;
            },
           verticalData:function(){

               let self = this;
               let hData = [];
               let length = 0;
               let temp = 0;

               if(self.img.length) {
                   for (let j = 0; j < this.width; j ++) {

                       temp = 0;
                       hData[j] = [];
                       for (let i = 0; i < this.height; i ++) {
                           if (self.img[i][j]) {
                               temp++;
                           }else{
                               temp === 0 || hData[j].push(temp);
                               temp = 0;
                           }

                           if(temp === this.height){
                               hData[j].push(temp);
                           }

                       }
                       if(hData[j].length > length){
                           length = hData[j].length
                       }
                   }

               }
               let x = [];
               for (let j in hData) {
                   hData[j] =  new Array(length - hData[j].length ).fill(' ').concat(hData[j])
                   x[j] =[];
               }

               for (let j in hData) {

                   for (let i = 0; i < length;i++) {
                       x[i].push(hData[j][i])
                   }
               }


               return x;
           },
           horizontalRowCount(){
               let self = this;
               let countArray = self.horizontalData.map(function callback(array,index) {
                   return array.length
               });
               return Math.max(...countArray)
           },
           width() {

               return this.img[0].length;
           },
           height() {
               return this.img.length;
           },

       }
    }
</script>

<style scoped>
    .crossword{

    }
    table, th, td {
        border: 1px solid #808080;
        border-collapse: collapse;
        min-width: 20px;
        height: 20px;
        box-sizing: border-box;
        font-family: Arial;
        font-size: 10px;
        user-select: none;
        pointer-events: none;
        background: #dadada;

    }
    .num{
        background: #d0d0d0;
    }
    .row{
        display: flex;
    }
</style>