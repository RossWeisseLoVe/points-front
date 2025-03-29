<template>
    <PageWrapper dense contentFullHeight fixedHeight contentClass="flex" class="designer-container">
        <div class="w-1/6 left-card">
            <Collapse ghost v-model:activeKey="activeKey">
                <CollapsePanel key="1">
                    <template #header>
                        <Tag color="#2db7f5">自定义计算规则</Tag>
                    </template>
                  <Rule  v-for="item in ruleList" :key="item.id" :item="item"/>
                </CollapsePanel>
                <CollapsePanel key="2">
                    <template #header>
                        <Tag color="#87d068">预定义计算器</Tag>
                    </template>
                  <PredefinedCalculators  v-for="item in predefinedCalList" :key="item.id" :item="item"/>
                </CollapsePanel>
                <CollapsePanel key="3">
                    <template #header>
                        <Tag color="#f56a00">预定义聚合器</Tag>
                    </template>
                  <Aggregators  v-for="item in predefinedCalList" :key="item.id" :item="item"/>
                </CollapsePanel>
            </Collapse>
        </div>
        <div class="w-5/6 drop-container">
            <div class="h-1/2 upper">
                <Provider class="h-full"/>
                <div class="toolBar">
                    <Button type="primary" @click="openInfoModal('save')" class="tool-button">保存</Button>
                    <Button type="primary"  class="tool-button">检查</Button>
                    <Button type="primary"  class="tool-button" @click="openInfoModal('info')">信息</Button>
                    <Button type="primary"  class="tool-button">流程</Button>
                </div>
            </div>
            <div class="w-2/2 h-1/2 bottom">
              <Transformer class="w-3/4 h-2/2" />  
              <Reciver class="w-1/4 h-2/2" />
            </div>
        </div>
        <InfoModal @register="registerModal" />
    </PageWrapper>
</template>
<script lang="ts" setup>
import { PageWrapper } from '@/components/Page';
import { Card,Collapse,CollapsePanel,Tag,Button } from "ant-design-vue" 
import { getAllRulesWithProperty,saveModel } from "@/api/calculate/calculate"
import { onMounted, ref } from 'vue';
import Rule from './components/Rule.vue';
import Provider from "./components/provide/Provider.vue"
import Transformer from "./components/transformer/Transformer.vue"
import Aggregators from "./components/Aggregators.vue"
import { useRoute } from 'vue-router' 
import Reciver from "./components/recive/Reciver.vue"
import PredefinedCalculators from "./components/PredefinedCalculators.vue"
import { predefinedCalList } from "../calculate.data"
import { useCalculateStore } from "@/store/modules/calculate"
import { onBeforeMount } from 'vue';
import InfoModal from "./components/InfoModal.vue"
import { useModal } from '@/components/Modal';

const [registerModal, { openModal, setModalProps }] = useModal();
const calculateStore = useCalculateStore()
const route = useRoute()
const activeKey = ref(["1","2"])
const ruleList = ref([])
onMounted(async ()=>{
   await calculateStore.initState(route.query.mid)
   const res = await getAllRulesWithProperty()
   ruleList.value = res
})

onBeforeMount(()=>{
    calculateStore.resetState()  //清除state
})

function getClassName(item){
  const list = item.className.split(".")
  return list[list.length - 1]
}


function openInfoModal(type){
    if(type==="info"){
        setModalProps({
            title: "模型信息",
            okText: "保存"
        });
    }else if(type==="save"){
        setModalProps({
            title: "模型信息",
            okText: "提交"
        }); 
    }
    openModal(true, {
        type
    });
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
        .upper{
            display: flex;
            justify-content: right;
            .toolBar{
                width: 80px;
                .tool-button{
                    margin-left: 10px;
                    margin-bottom: 20px;
                }
            }
        }
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