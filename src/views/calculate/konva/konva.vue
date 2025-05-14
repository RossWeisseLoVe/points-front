<template>
  <div :ref="drop" style="width: 100%; height: 100%;  border: 1px dashed #ccc;">
    <div ref="dropContainer" class="dropContainer">
      <v-stage ref="stageRef"  :config="stageConfig">
      <v-layer>
        <v-arrow
          v-for="connector in connectors"
          :key="connector.id"
          :config="getArrowConfig(connector)"
        />
        <v-circle
          v-for="target in targets"
          :key="target.id"
          :config="getCircleConfig(target)"
          @dragmove="handleDragMove"
        />
      </v-layer>
    </v-stage>
    </div>
  </div>
  </template>
  
  <script setup>
import { ref, onMounted,watch } from 'vue';
  import { useDrop } from 'vue3-dnd'
  import { ItemTypes } from '../model/data'

  const stageRef = ref()
  const dropContainer = ref()

  const stageConfig = ref({
    width: 1200,  // 初始值设为 0，后续通过 ResizeObserver 更新
    height: 1200,
  });
  
  const observer = new ResizeObserver((entries) => {
  const { width, height } = entries[0].contentRect;
    stageConfig.value = { width, height }; // 更新 stage 尺寸
  });


  const [collectedProps, drop] = useDrop(() => ({
    accept: [ItemTypes.BOX,ItemTypes.AGGREGATORS,ItemTypes.OTHERMODEL],
    drop: dropFunc
  }))


  function dropFunc(obj,monitor){
    console.log("fucking1",obj)
    console.log("fucking2",obj)
    const clientOffset = monitor.getClientOffset();
    if (!clientOffset || !stageRef.value) return;
    const stage = stageRef.value.getStage();
    const stageRect = stage.container().getBoundingClientRect();
    // 转换坐标（考虑画布缩放）
    const scale = stage.scaleX();
    const x = (clientOffset.x - stageRect.left) / scale;
    const y = (clientOffset.y - stageRect.top) / scale;
    console.log("精确释放位置:", { x, y })
  }


  // Generate initial targets
  const generateTargets = () => {
    const number = 10;
    const result = [];
    while (result.length < number) {
      result.push({
        id: 'target-' + result.length,
        x: window.innerWidth * Math.random(),
        y: window.innerHeight * Math.random(),
        radius: 20 + Math.random() * 20,
        fill: '#' + Math.floor(Math.random()*16777215).toString(16),
      });
    }
    return result;
  };
  
  // Generate connectors between targets
  const generateConnectors = (targets) => {
    const number = 10;
    const result = [];
    while (result.length < number) {
      const from = 'target-' + Math.floor(Math.random() * targets.length);
      const to = 'target-' + Math.floor(Math.random() * targets.length);
      if (from === to) {
        continue;
      }
      result.push({
        id: 'connector-' + result.length,
        from,
        to,
      });
    }
    return result;
  };
  
  const targets = ref([]);
  const connectors = ref([]);
  
  onMounted(() => {
    if (dropContainer.value) {
      observer.observe(dropContainer.value); // 开始监听
    }
    const initialTargets = generateTargets();
    targets.value = initialTargets;
    connectors.value = generateConnectors(initialTargets);
  });
  
  const getConnectorPoints = (from, to) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    let angle = Math.atan2(-dy, dx);
  
    const radius = 50;
  
    return [
      from.x + -radius * Math.cos(angle + Math.PI),
      from.y + radius * Math.sin(angle + Math.PI),
      to.x + -radius * Math.cos(angle),
      to.y + radius * Math.sin(angle),
    ];
  };
  
  const getArrowConfig = (connector) => {
    const fromNode = targets.value.find((t) => t.id === connector.from);
    const toNode = targets.value.find((t) => t.id === connector.to);
    if (!fromNode || !toNode) return { points: [0, 0, 0, 0] };
  
    return {
      id: connector.id,
      points: getConnectorPoints(fromNode, toNode),
      fill: 'black',
      stroke: 'black',
    };
  };
  
  const getCircleConfig = (target) => ({
    id: target.id,
    x: target.x,
    y: target.y,
    radius: target.radius,
    fill: target.fill,
    shadowBlur: 10,
    draggable: true,
  });
  
  const handleDragMove = (e) => {
    const id = e.target.id();
    targets.value = targets.value.map((target) =>
      target.id === id
        ? { ...target, x: e.target.x(), y: e.target.y() }
        : target
    );
  };
  </script> 
  
  <style lang="less" scoped>
    .dropContainer{
      width: 100%;
      height: 100%;
    }
  </style>