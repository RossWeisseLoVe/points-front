<template>
    <PageWrapper dense contentFullHeight fixedHeight contentClass="flex" class="designer-container">
        <Card class="w-1/6">
          <Rule  v-for="item in ruleList" :key="item.id" :item="item"/>
        </Card>
        <div class="w-5/6 drop-container">
            <Card class="h-1/2">

            </Card>
            <div class="w-2/2 h-1/2 bottom">
                <Card class="w-3/4 h-2/2">
                    <img src="@/assets/icons/arrow.svg" alt="" class="arrow-svg up-to-down">    
                    <img src="@/assets/icons/arrow.svg" alt="" class="arrow-svg left-to-right">    
                </Card>
                <Card class="w-1/4 h-2/2 ">
                    <img src="@/assets/icons/arrow.svg" alt="" class="arrow-svg up-to-down">    
                </Card>
            </div>
        </div>
    </PageWrapper>
</template>
<script lang="ts" setup>
import { PageWrapper } from '@/components/Page';
import { Card } from "ant-design-vue" 
import { getAllRules,getPropertiesById } from "@/api/calculate/calculate"
import { onMounted, ref } from 'vue';
import Rule from './components/Rule.vue';

const ruleList = ref([])
onMounted(async ()=>{
   const res = await getAllRules()
   ruleList.value = res
})

function getClassName(item){
  const list = item.className.split(".")
  return list[list.length - 1]
}



</script>
<style scoped lang="less">
.arrow-svg{
    width: 60px;
    height: 60px;
}
.designer-container{
    padding: 16px;
    .drop-container{
        padding-left: 16px;
        .bottom{
            display: flex;
            position: relative;
            margin-top: 16px;
            justify-content: left;
            gap: 16px;
            .up-to-down{
                position: absolute;
                top: -40px;
                left: 50%;
                transform: translateX(-50%);
            }
            .left-to-right{
                position: absolute;
                z-index: 999;
                top: 50%;
                right: -40px;
                transform: translateY(-50%) rotate(-90deg);
            }
        }
    }
}

</style>