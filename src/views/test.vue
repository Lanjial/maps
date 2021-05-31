<template>
   <Case></Case>
</template>

<script>
import Weight from "@/components/weightChart";
import Mobility from "@/components/mobilityChart";
import Case from '@/components/caseChart';
export default {
    components:{
        Weight,
        Mobility,
        Case,
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