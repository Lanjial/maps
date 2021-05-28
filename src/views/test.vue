<template>
   <Mobility class="mobility" style="height: 300px;width: 200;"></Mobility>
</template>

<script>
import Weight from "@/components/weightChart";
import Mobility from "@/components/mobilityChart";
export default {
    components:{
        Weight,
        Mobility,
    },
    mounted(){
        // this.$axios.get("json/beijing.json").then((res) => {
        //     console.log(res);
        // }).catch((err) => {
        //     console.log(err);
        // });
    }



    
}
</script>

<style>

</style>