<template>
    <div :ref="drop" class="provider-container">
      <div class="provider-box" v-for="provider in providerList" :key="provider.id">
        <div class="provider-header">
          <h2>{{ provider.info.description }}</h2>
          <div class="provider-actions">
            <button @click="removeProvider(provider.id)">Remove</button>
          </div>  
        </div>
      </div>
    </div>
</template>
<script lang="ts" setup>
import { useDrop } from 'vue3-dnd'
import { ref } from "vue"


const providerList = ref([])

const [collectedProps, drop] = useDrop(() => ({
	accept: ['BOX'],
  drop: dropFunc
}))

function dropFunc(obj){
  providerList.value.push(obj)
  console.log(obj)
}


</script>
<style scoped lang="less">
.provider-container{
  display: flex;
  flex-wrap: wrap;
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 8px;
  overflow-y: auto;
  transition: box-shadow 0.3s;
  .provider-box{
    width: 160px;
    height: 240px;
    margin-right: 8px;
    margin-bottom: 8px;
    overflow-y: auto;
    padding: 16px;
    border-radius: 8px;
    background: #f9f9f9;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.16);
    cursor: pointer;
    transition: background 0.3s;
    &:hover{
      background: #f2f2f2;
    }
    &:active{
      box-shadow: 0 0 16px rgba(0, 0, 0, 0.2);
    }

    .provider-header{
       display: flex;
       justify-content: space-between;
       align-items: center;
       border-bottom: 1px solid #f0f0f0;
       padding-bottom: 8px;
       h2{
         font-size: 18px;
         margin: 0;
       }
       .provider-actions{
         display: flex;
         justify-content: flex-end;
       }
     }
    }
 
  }


</style>