<template>
  <Card title="兑换分析" :loading="loading">
    <div ref="chartRef" :style="{ width, height }"></div>
  </Card>
</template>
<script lang="ts" setup>
  import { Ref, ref, watch,onMounted } from 'vue';
  import { Card } from 'ant-design-vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { getExchangeAnalysis } from '@/api/point/orders'

  const props = defineProps({
    loading: Boolean,
    width: {
      type: String as PropType<string>,
      default: '100%',
    },
    height: {
      type: String as PropType<string>,
      default: '300px',
    },
  });
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
  const options = {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          bottom: '1%',
          left: 'center',
        },
        series: [
          {
            color: [],
            name: '奖品类型',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '12',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: [
            ],
            animationType: 'scale',
            animationEasing: 'exponentialInOut',
            animationDelay: function () {
              return Math.random() * 100;
            },
          },
        ],
      }
    onMounted(()=>{
      exchangeAnalysis()
    })

    async function exchangeAnalysis() {
      const res = await getExchangeAnalysis()
      let i = 0
      for (const item of res) {
        options.series[0].color[i] = item.color
        options.series[0].data[i] = {
          value:item.point,
          name: item.cname
        }
        i++
      }
      setOptions(options)
    }

</script>
