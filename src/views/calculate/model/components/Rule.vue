<template>
    <div :ref="dragSource" class="tech-card">
        <div class="card-header">
            <h3 class="card-title">{{getClassName(item)}}</h3>
        </div>
        <p class="card-desc">{{ item.description }}</p>
        <div class="card-line"></div>
    </div>
</template>
<script lang="ts" setup>
import { useDrag } from 'vue3-dnd'

const props = defineProps({
    item: Object
})

function getClassName(item){
  const list = item.className.split(".")
  return list[list.length - 1]
}

const [collectedProps, dragSource, dragPreview] = useDrag(() => ({
	type: 'BOX',
	item: { id: '1' },
}))


</script>
<style scoped lang="less">



</style>