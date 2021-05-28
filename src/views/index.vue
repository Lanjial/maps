<template>
  <div id="app">
    <div class="map">
      <div class="map_le">
        <div class="map_content">
            <MapBox class="mapbox"></MapBox>
            <div class="Suspension">
            <h5>Town Name</h5>
            <div v-for="(item,index) in exports" :key="index" class="option">
            <span :style="`background-color:${item.properties.color}`"></span>
            {{item.properties.name}}
        </div>
    </div>
        </div>
      </div>
      <div class="map_ri">
        <Weight class="weight"></Weight>
        <Mobility class="mobility"></Mobility>
      </div>
    </div>
    <div class="bt_chart">
      <div class="bt_chart_le">
        <Linetrend></Linetrend>
      </div>
      <div class="bt_chart_ri">
        <Case></Case>
      </div>
    </div>

  </div>
</template>

<script>
import MapBox from "@/components/mapbox";
import Weight from "@/components/weightChart";
import Mobility from "@/components/mobilityChart";
import Case from '@/components/caseChart';
import Linetrend from '@/components/Linetrend';
import Export from "../../static/Export_Output.json"
import { mapState } from 'vuex';
export default {
  components:{
    MapBox,
    Weight,
    Mobility,
    Case,
    Linetrend
  },
  computed:{
    ...mapState([])
  },
  data(){
    return{
      exports:""
    }
  },
  created(){
    this.getUserInfo()
  },
  mounted(){

  },
  methods:{
    getUserInfo(){
      this.$store.Exports = Export
      this.exports = Export.features
    }
  }
}
</script>

<style lang="less">
#app{
  .map{
    display: flex;
    width: 100%;
    height: 660px;
    .map_le{
      width: 50%;
        .map_content{
            position: absolute;
            width: 50%;
          .Suspension{
            background-color: #fff;
            position: absolute;
            right: 10px;
            top: 10px;
            width: 120px;
           .option{
             display: flex;
             text-align:left;
             align-items: center;
             padding-left: 10px;
               span{
               display: block;
               margin-right: 5px;
               width: 15px;
               height: 15px;
               border-radius: 50%;
             }
           }
          }
        }
      }
    .map_ri{
      width: 50%;
      .mobility{
        height: 300px;
      }
    }
  }
  .bt_chart{
    width: 100%;
    display: flex;
    .bt_chart_le{
      width: 50%;
    }
    .bt_chart_ri{
      width: 50%;
    }
  }
}
</style>
