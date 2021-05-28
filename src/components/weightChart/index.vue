<template>
  <div id="weight" style="height: 330px;width: 200;"></div>
</template>

<script>
import {mapGetters} from "vuex"
import {getMapDate} from '@/api/index'
export default {
    computed:{
        ...mapGetters(['name','economicDate','weight_option','weight_myChart'])
    },
    data(){
        return{
            // 经济指标
            economicIndicators:[],
            xAxisData:[],
            data1:[],
            data2:[],
            data3:[],
            data4:[],
            emphasisStyle:{},
        }
    },
    methods:{
        // 发起请求获取数据,同时对数据进行处理
         async getEconomicDate(){
           let res = await getMapDate()
           this.$store.commit('weight/geteConomicDate',res)
           console.log(2,this.economicDate);
           this.economicDate.data.soecorela.forEach(element => {
                this.economicIndicators.push(element['Relativity Value']);
                this.xAxisData.push(element['Socio-Economic indicators name']);
            });
            this.getweightChart()
            this.Chart()
         },
        // 指定图表的配置项和数据
        getweightChart(){
            this.emphasisStyle = {
            itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0,0.3)'
            }
            };
            let option = {
            title: {
                left: 'center',
                text: 'Weight of 20-socio-Economic Indicators',
            },
            tooltip: {},
            xAxis: {
                data: this.xAxisData,
                name: 'X Axis',
                show: false,
                axisLine: { onZero: true },
                splitLine: { show: false },
                splitArea: { show: false },
                // 柱状图的x轴文字纵向显示
                axisLabel: {
                    formatter: function(value) {
                        return value.split("").join("\n");
                    }
                }
            },
            yAxis: {
                name: 'Relatively Value',
            },
            // grid: {
            //     bottom: 100
            // },
            grid: {
                left: '8%',
                top: '20%',
                right: '0%',
                bottom: '4%',
                // containLabel: true

            },
            series: [{
                    name: 'bar',
                    type: 'bar',
                    stack: 'one',
                    emphasis: this.emphasisStyle,
                    // data: data1,
                    data: this.economicIndicators,
                    barWidth: 20,
                    barMinHeight: 2,

                    // 为每个柱子给定颜色，不够的话开始循环
                    itemStyle: {
                        normal: {
                            //这里是重点
                            // 循环这样子方便点 
                            color: function(params) {
                                let colorList = ['#FF4933', '#3498DB', '#F4D03F ', '#6C3483 ', '#FF8C33', '#2ECC71', '#2980B9', '#33B7FF', '#334EFF', '#CB33FF', '#943126', '#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622'];
                                return colorList[params.dataIndex % colorList.length];
                            }
                        }
                    }
                },
                {
                    name: 'bar2',
                    type: 'bar',
                    stack: 'one',
                    emphasis:this.emphasisStyle,
                    data: this.data2
                },
                {
                    name: 'bar3',
                    type: 'bar',
                    stack: 'two',
                    emphasis: this.emphasisStyle,
                    data: this.data3
                },
                {
                    name: 'bar4',
                    type: 'bar',
                    stack: 'two',
                    emphasis: this.emphasisStyle,
                    data: this.data4
                }
            ]
            };
            this.$store.commit('weight/getWeight_option',option)
        },
        // 图标接受数据开始渲染
        Chart(){
            // 使用刚指定的配置项和数据显示图表。
            this.weight_myChart.setOption(this.weight_option);
            // 把配置项给实例对象，跟着浏览器同比例缩放
            window.addEventListener('resize', function() {
                myChart.resize();
            })
        }
    },
    mounted(){
        // console.log(2,this.economicDate);
        this.$store.state.weight.name = 'jia'
        console.log(this.name);
        let myChart = this.$echarts.init(document.getElementById('weight'));
        this.$store.commit('weight/getWeight_myChart',myChart)
        this.getEconomicDate()
    },
    
    

}
</script>

<style>

</style>