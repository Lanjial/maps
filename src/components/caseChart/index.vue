<template>
  <div id="case" style="height: 330px;width: 200;"></div>
</template>

<script>
import Cases_Number_Monthly from "../../../static/Cases_Number_Monthly.json"
import {getMonthlyCases} from "@/api/index"
import { mapGetters,mapState} from 'vuex';
export default {
    computed:{
      ...mapGetters(['horizhistData','horizhist_option','horizhist_myChart']),
        ...mapState(['data_set_from_json','date_set_from_json','TownName_set_from_json','colorList'])
    },
    data(){
        return{
            data_total_from_json :[],
            data_set1_from_json:[],
        }
    },
    mounted(){
        window.horizhist_myChart = this.$echarts.init(document.getElementById('case'));
        this.$store.commit('horizhist/getHorizhist_myChart',window.horizhist_myChar)
        this.getMonthlyCases()
    },
    methods:{
    // 发送请求，获取数据
    async getMonthlyCases(){
        let horizhistDatas = await getMonthlyCases()
        this.$store.commit('horizhist/getHorizhistData',horizhistDatas)
        // 时间与名称的全局数据处理
        this.$store.commit('timeNameDataHandle',this.horizhistData.data);
        this.dataTotalHandle();
    },
    // 对其中的值进行运算从而得出各个值得总数
    dataTotalHandle(){
        this.data_total_from_json =  this.data_set_from_json.map(item=>{
        let arr = []
        let total = ""
        item.forEach(itemNumber=>{
           total = parseInt(total + itemNumber)
        })
        arr.push(total)
            return arr
        })
        this.dataSetHandle();
    },
    // 将日期与名称数据整合到data_set1中
    dataSetHandle(){
        // 将日期值与名称直接关联起来
        for (let i = 0; i < this.data_total_from_json.length; i++) {
             let agency = [];
             agency.push(this.data_total_from_json[i]);
             agency.push(this.TownName_set_from_json[i]);
            this.data_set1_from_json.push(agency)
            // 降序处理
            this.$utils.bubbleSort(this.data_set1_from_json);
            // 图表数据处理
            this.dataHorizhistHandle()
        }
    },
    // 图表数据处理
    dataHorizhistHandle(){
        window.colorList = this.colorList
        window.horizhist_colorlist = [];
        window.horizhist_colorlist_clear = [];
        window.horizhist_arealist = [];
        window.horizhist_data_set1_from_json = this.data_set1_from_json
        // 获取到各个地区相应的颜色，并再次将变量名取出与索引一一对应，同时提升至全局
        for (let i = 0; i < this.data_set1_from_json.length; i++) {
              window.horizhist_colorlist.push(window.colorList[window.relation_between_area_colorlist[this.data_set1_from_json[i][1]]])
              window.horizhist_arealist.push(this.data_set1_from_json[i][1])
        }
        window.horizhist_option = {
            title: {
                top: '0%',
                left: 'center',
                text: 'Rank of Case Number',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: { containLabel: true },
            xAxis: { name: 'amount' },
            yAxis: {
                type: 'category',
                // name: 'Town Name',
                axisLabel: {
                    show: true,
                    textStyle: {
                        // color: '#fff',
                        fontSize: '9'
                    }
                },
                inverse: true
            },
            grid: {
                left: '11%',
                top: '8%',
                right: '10%',
                bottom: '10%',
            },
            series: [{
                type: 'bar',
                encode: {
                    x: 'amount',
                    y: 'townname'
                },
                // 为每个柱子给定颜色，不够的话开始循环
                itemStyle: {
                    normal: {
                        color: function(params) {
                            return window.horizhist_colorlist[params.dataIndex % colorList.length];
                        }
                    }
                },
                data: this.data_set1_from_json
            }]
        };
        this.$store.commit('horizhist/getHorizhist_option',window.horizhist_option)
        this.HorizhistRender()
    },
    // 图标渲染
    HorizhistRender(){
        // 使用刚指定的配置项和数据显示图表。
        window.horizhist_myChart.setOption(window.horizhist_option);
        // 把配置项给实例对象，跟着浏览器同比例缩放
        window.addEventListener('resize', function() {
            window.horizhist_myChart.resize();
        })
    }
    }
  

}
</script>

<style>

</style>