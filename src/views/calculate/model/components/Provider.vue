<template>
    <div :ref="drop" class="provider-container">
      <div class="provider-box" v-for="provider in providerList" :key="provider.id">
        <div class="provider-header">
          <Avatar style="background-color: #87d068" size="small" class="class-avatar">
            {{ getAvatar(provider) }}
          </Avatar>
          <div>{{ provider.info.description }}</div>
          <!-- <div class="provider-actions">
            <button @click="removeProvider(provider.id)">Remove</button>
          </div>   -->
        </div>
        <div>
          <ProviderItem v-for="item in getProviderItemList(provider)" :key="item.id" :item="item"/>
        </div>
      </div>
    </div>
</template>
<script lang="ts" setup>
import { Avatar } from "ant-design-vue"
import { useDrop } from 'vue3-dnd'
import { ref } from "vue"
import ProviderItem from "./ProviderItem.vue"

const providerList = ref([])

function getAvatar(item){
  const list = item.info.className.split(".")
  const str = list[list.length-1]
  const result = str.slice(0, 2).replace(/^(.)(.)?/, (_, c1, c2) => 
    c1.toUpperCase() + (c2 ? c2.toLowerCase() : '')
  );
  return result
}

const [collectedProps, drop] = useDrop(() => ({
	accept: ['BOX'],
  drop: dropFunc
}))

function dropFunc(obj){
  providerList.value.push(obj)
  console.log(obj)
}

function getProviderItemList(item){
  const list = item.info.properties.filter(x=>{
    return x.inputOrOutput === "output"
  })
  return list
}



</script>
<style scoped lang="less">
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
  .provider-box{
    width: 160px;
    height: 240px;
    margin-right: 8px;
    margin-bottom: 8px;
    overflow-y: auto;
    padding: 8px;
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
       justify-content: left;
       gap: 4px;
       align-items: center;
       border-bottom: 1px solid #f0f0f0;
       padding-bottom: 8px;
       div{
         font-size: 14px;
       }
        .class-avatar{
        }

     }
    }
 
  }


</style>