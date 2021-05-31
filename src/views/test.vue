<template>
    <MapBox></MapBox>
</template>

<script>
import Weight from "@/components/weightChart";
import Mobility from "@/components/mobilityChart";
import Case from '@/components/caseChart';
import Linetrend from '@/components/Linetrend';
import MapBox from "@/components/mapbox";
export default {
    components:{
        Weight,
        Mobility,
        Case,
        Linetrend,
        MapBox
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