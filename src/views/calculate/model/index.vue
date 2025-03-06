<template>
    <PageWrapper dense contentFullHeight fixedHeight contentClass="flex" class="designer-container">
        <div class="w-1/6 left-card">
            <Collapse ghost>
                <CollapsePanel>
                    <template #header>
                        <Tag color="#2db7f5">自定义计算规则</Tag>
                    </template>
                  <Rule  v-for="item in ruleList" :key="item.id" :item="item"/>
                </CollapsePanel>
                <CollapsePanel>
                    <template #header>
                        <Tag color="#87d068">计算器</Tag>
                    </template>
                  <PredefinedCalculators  v-for="item in predefinedCalList" :key="item.id" :item="item"/>
                </CollapsePanel>
            </Collapse>
        </div>
        <div class="w-5/6 drop-container">
            <Provider class="h-1/2" />
            <div class="w-2/2 h-1/2 bottom">
              <Transformer class="w-3/4 h-2/2" />  
              <Reciver class="w-1/4 h-2/2" />
            </div>
        </div>
    </PageWrapper>
</template>
<script lang="ts" setup>
import { PageWrapper } from '@/components/Page';
import { Card,Collapse,CollapsePanel,Tag } from "ant-design-vue" 
import { getAllRulesWithProperty,getPropertiesById } from "@/api/calculate/calculate"
import { onMounted, ref } from 'vue';
import Rule from './components/Rule.vue';
import Provider from "./components/provide/Provider.vue"
import Transformer from "./components/transformer/Transformer.vue"
import Reciver from "./components/recive/Reciver.vue"
import PredefinedCalculators from "./components/PredefinedCalculators.vue"
import { predefinedCalList } from "../calculate.data"

const ruleList = ref([])
onMounted(async ()=>{
   const res = await getAllRulesWithProperty()
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
    .left-card{
        padding: 0px!important;
        color: #8c8c8c;
        background: #ffffff;
        border: 1px solid #f0f0f0;
        border-radius: 8px;
        overflow-y: auto;
        transition: box-shadow 0.3s;
    }
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