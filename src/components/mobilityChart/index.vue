<template>
  <div id="mobility"></div>
</template>

<script>
import  {mapGetters} from 'vuex'
import {getMobility} from '@/api/index'
export default {
    computed:{
        ...mapGetters(['mobility','mobility_option','mobility_myChart'])
    },
    data(){
        return{
            // 乡镇名称
            TownName:[],
            // 对象名称
            TargetName:[],
            // 处理完毕的数据
            ProcessedData:[],
            days:[],
            hours:[],
        }
    },
    mounted(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('mobility'));
        this.$store.commit('mobility/getMobility_myChart',myChart)
        this.getMobilitys()
    },
    methods:{
        //  发出请求获取数据并加以处理
        async getMobilitys(){
            let Mobility = await getMobility()
            this.$store.commit('mobility/getMobility',Mobility)
            this.mobilityDataHandle()
        },
        // 数据处理
        mobilityDataHandle(){
            // 
            this.mobility.data.Mobility.forEach(element => {
                this.TownName.push(element['TownName']);
                this.TargetName.push(element['TargetName']);
            });
            // 数组去重
            let days = [...new Set(this.TownName)];
            days.sort()
            let hours = [...new Set(this.TargetName)];
            hours.sort()
  
            let agency = [];
            this.mobility.data.Mobility.forEach(element => {
                agency = [];
                days.findIndex(function(days_value, days_index) {
                        if (days_value === element['TownName']) {
                            //则包含该元素
                            // console.log('成功找到' + value + index)
                            hours.findIndex(function(hours_value, hours_index) {
                                if (hours_value === element['TargetName']) {
                                    //则包含该元素
                                    agency.push(hours_index);
                                    agency.push(days_index)
                                    agency.push(element['Probability'])
                                        // console.log('成功找到' + value + index)
                                }
                            })
                        }
                    })
                this.ProcessedData.push(agency)
            });

            // 配置图表数据
            let option = {
            title: {
                top: '0%',
                left: 'center',
                text: 'Probability of Population Mobility',
                // bottom: '5%'
            },
            tooltip: {
                position: 'top'
            },
            grid: {
                left: '9%',
                top: '17%',
                right: '0%',
                bottom: '0%',
                // containLabel: true
            },
            xAxis: {
                position: 'top',
                type: 'category',
                data: hours,
                splitArea: {
                    show: true
                },
                axisLabel: {
                    // 坐标轴刻度标签的相关设置。
                    show: true,
                    interval: 0,
                    formatter: function(value) { //关键代码
                        let res = value
                        if (res.length > 7) {
                            res = res.substring(0, 6) + '..'
                        }
                        return res
                    },
                },
            },
            yAxis: {
                type: 'category',
                data: days,
                splitArea: {
                    show: true
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        // color: '#fff',
                        fontSize: '9'
                    }
                },
                inverse: true

                // boundaryGap: [0.5, 0.5]
            },
            visualMap: {
                min: 0,
                // max: 10,
                max: 0.2,
                type: 'continuous',
                // 是否显示拖拽用的手柄（手柄能拖拽调整选中范围）。
                calculable: true,
                show: false,
                orient: 'horizontal',
                left: 'center',
                bottom: '15%',
                // inRange: { color: ['red', 'blue'] },
                inRange: { color: ['#A3E4D7', '#1A5276'] },
            },
            series: [{
                name: 'Probility',
                type: 'heatmap',
                // data: data,
                data: this.ProcessedData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
            };
            this.$store.commit('mobility/getMobility_option',option)
            this.mobilityChartRender()
        },
        // 图表渲染
        mobilityChartRender(){
            // 使用刚指定的配置项和数据显示图表。
            this.mobility_myChart.setOption(this.mobility_option);

            // 把配置项给实例对象，跟着浏览器同比例缩放
            window.addEventListener('resize', function() {
                myChart.resize();
            })
        }

    }
}
</script>

<style>

</style>