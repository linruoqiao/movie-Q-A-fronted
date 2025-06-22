<template>
  <div class="graph-wrapper">
    <div id="graph"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import { GraphChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'

echarts.use([TitleComponent, TooltipComponent, LegendComponent, GraphChart, CanvasRenderer])

let chart: echarts.ECharts | null = null

onMounted(async () => {
  chart = echarts.init(document.getElementById('graph')!)
  const res = await axios.get('http://localhost:8082/graph')

  const option = {
    title: {
      text: 'Neo4j 知识图谱可视化'
    },
    tooltip: {},
    legend: [{
      data: ['Entity']
    }],
    series: [
      {
        type: 'graph',
        layout: 'force',
        roam: true,
        label: {
          show: true,
          position: 'right',
          formatter: '{b}'
        },
        force: {
          repulsion: 300,
          edgeLength: 100
        },
        data: res.data.nodes,
        links: res.data.links,
        categories: [
          { name: 'Entity' }
        ]
      }
    ]
  }

  chart.setOption(option)

  // 可选：窗口大小改变时自动 resize 图表
  window.addEventListener('resize', () => {
    chart && chart.resize()
  })
})

onBeforeUnmount(() => {
  chart && chart.dispose()
})
</script>

<style scoped>
.graph-wrapper {
  /* width: 100vw; */
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#graph {
  width: 90%;
  height: 90%;
}
</style>
