<template>
  <Card title="用户积分排行" :loading="loading">
    <Segmented v-model:value="value" block :options="tab"/>
    <div ref="chartRef" :style="{ width, height }"></div>
  </Card>
</template>
<script lang="ts" setup>
  import { onMounted, Ref, ref ,watch} from 'vue';
  import { Card,Segmented } from 'ant-design-vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { getUserPointTopTen,getUserPointUsedTopTen } from "@/api/point/client"

  const value = ref('积分余额排行')
  const tab = ['积分余额排行','积分消耗排行','积分获取排行']
  const props = defineProps({
    loading: Boolean,
    width: {
      type: String as PropType<string>,
      default: '100%',
    },
    height: {
      type: String as PropType<string>,
      default: '280px',
    },
  });
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

  watch(()=>value.value,(val)=>{
    switch (val) {
      case '积分余额排行':
        userPointTopTen()
        break;
      case '积分消耗排行':
        userPointUsedTopTen(2)
        break;
      case '积分获取排行':
        userPointUsedTopTen(1)
        break;
    }
  },{
    immediate:true
  }
  )
  
  onMounted(()=>{
  })

  async function userPointTopTen(){
    const res = await getUserPointTopTen()
    const data = res.filter(item=>{
      return item.point !== 0 
    })
    option.xAxis.data = data.map(x=>x.name)
    option.series[0].data = data.map(x=>x.point)
    console.log('sdfasdfs',option)
    setOptions(option)
  }
  async function userPointUsedTopTen(status){
    const res = await getUserPointUsedTopTen(status)
    const data = res.filter(item=>{
      return item.point !== 0 
    })
    option.xAxis.data = data.map(x=>x.name)
    option.series[0].data = data.map(x=>x.point)
    console.log('sdfasdfs',option)
    setOptions(option)
  }
  

  const option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
          lineStyle: {
            width: 1,
            color: '#019680',
          },
        },
      },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisLabel: { interval: 0, rotate: 30 }
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar'
    }
  ]
};

</script>
