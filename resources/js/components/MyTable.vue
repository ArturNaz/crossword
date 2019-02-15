<template>
    <div>
        <table :style="{'margin-left':(horizontalRowCount*15)+'px'}">
            <tr v-for="raw in verticalData">
                <th v-for="col in raw">{{col}}</th>
            </tr>

        </table>
        <div class="row">
            <table>
                <tr v-for="raw in horizontalData">
                    <th v-for="col in raw">{{col}}</th>
                </tr>

            </table>
            <slot></slot>
        </div>




    </div>
    
</template>

<script>
    export default {
        props:['img'],
        data() {
            return {

            }
        },
        watch:{

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

                    for (let j in self.img) {

                         temp = 0;
                        hData[j] = [];
                        for (let i in self.img[j]) {

                            if (self.img[j][i]){
                                temp++;
                            }else{
                                temp === 0 || hData[j].push(temp);
                                temp = 0;
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

                   for (let j in self.img) {

                       temp = 0;
                       hData[j] = [];
                       for (let i in self.img[j]) {

                           if (self.img[i][j]){
                               temp++;
                           }else{
                               temp === 0 || hData[j].push(temp);
                               temp = 0;
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
           }

       }
    }
</script>

<style scoped>
    table, th, td {
        border: 1px solid black;
        border-collapse: collapse;
        min-width: 15px;
        height: 15px;
        box-sizing: border-box;
        font-family: Arial;
        font-size: 10px;
        user-select: none;
        pointer-events: none;
    }
    .row{
        display: flex;
    }
</style>