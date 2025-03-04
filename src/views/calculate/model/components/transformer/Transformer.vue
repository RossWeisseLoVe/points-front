<template>
    <div :ref="drop" class="provider-container">
      <img src="@/assets/icons/arrow.svg" alt="" class="arrow-svg up-to-down">    
      <img src="@/assets/icons/arrow.svg" alt="" class="arrow-svg left-to-right">
      <TransformerDrag 
      v-for="item in transformerList" 
      :key="item.id" 
      :provider="item" 
      :id="item.id" 
      :findCard="findCard" 
      :moveCard="moveCard"
      :insertCard="insertCard"
      @hoverIndex="getHoverIndex"
      @deleteItem="deleteItem"
      />
    </div>
</template>
<script lang="ts" setup>
import { Avatar } from "ant-design-vue"
import { useDrop } from 'vue3-dnd'
import { ref,onMounted } from "vue"
import {ItemTypes} from "../../data.ts"
import TransformerDrag from "./TransformerDrag.vue"
import { useCalculateStore } from "@/store/modules/calculate"

const transformerList = ref([])
const calculateStore = useCalculateStore()

const [collectedProps, drop] = useDrop(() => ({
	accept: [ItemTypes.BOX,ItemTypes.CONVERT],
  drop: dropFunc
}))

const nowHoverIndex = ref(0)

function getHoverIndex(index){
  nowHoverIndex.value = index
}

function dropFunc(obj){
  insertCard(obj,obj.id,nowHoverIndex.value)
  console.log(obj)
  nowHoverIndex.value = transformerList.value.length
  calculateStore.callMethod("deleteItem-provider",obj.id)
  calculateStore.callMethod("deleteItem-reciver",obj.id)
}

function deleteItem(id: string){
  const { index } = findCard(id)
  if(index<0){
    return
  }
  transformerList.value.splice(index, 1)
}

function findCard(id: string){
  const card = transformerList.value.filter(c => `${c.id}` === id)[0]
  return {
    card,
    index: transformerList.value.indexOf(card),
  }
}

function moveCard(id: string, atIndex: number){
  const { card, index } = findCard(id)
  transformerList.value.splice(index, 1)
  transformerList.value.splice(atIndex, 0, card)
  calculateStore.callMethod("deleteItem-provider",id)
  calculateStore.callMethod("deleteItem-reciver",id)
}

function insertCard(card,id,atIndex){
  const res = findCard(id)
  if(res.index=== -1){
    // 如果没有这个卡片说明是第一移入，直接插到当前位置
    transformerList.value.splice(atIndex, 0, card)
    // 为rules新增一个对象
  }else{
    // 如果不是第一次插入，就要把之前插入的删掉，再重新插入，才会有移动的视觉效果，也不会出现错误
    transformerList.value.splice(res.index, 1)
    transformerList.value.splice(atIndex, 0, card)
    calculateStore.callMethod("deleteItem-provider",id)
    calculateStore.callMethod("deleteItem-reciver",id)
  }
}
onMounted(() => {
  calculateStore.registerMethod('deleteItem-transformer', deleteItem);
});

</script>
<style scoped lang="less">
.arrow-svg{
    width: 60px;
    height: 60px;
}
.provider-container{
  color: #8c8c8c;
  display: flex;
  flex-wrap: wrap;
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 8px;
  overflow-y: auto;
  transition: box-shadow 0.3s;
  .up-to-down{
      position: absolute;
      z-index: 9999;
      top: -40px;
      left: 37.5%;
      transform: translateX(-50%);
  }
  .left-to-right{
      position: absolute;
      z-index: 999;
      top: 50%;
      right: 25%;
      transform: translateY(-50%) translateX(50%) rotate(-90deg);
  }
 }


</style>