<template>
  <BasicModal v-bind="$attrs" @register="registerModal">
    <div :style="{display:'flex',justifyContent:'center'}" class="mb-5">
      <Steps :current="current" :items="items" :style="{width:'70%'}"></Steps>
    </div>
    <div class="table-container" v-show="current===0">
      <TypeList class="w-1/4 xl:w-1/6" @select="handleSelect" title="奖品分类" mainId="6df56d101d9f08d00d0c269ecd14959f" />
      <BasicTable @register="registerTable" class="w-3/4 xl:w-5/6" @selection-change="selectionChange">
        <template #toolbar>
          <div v-if="formData.selectedId!==''">
            已选中：<Tag :color="getColor({type:formData.selectedType})">{{ formData.selectedName }}</Tag>
          </div>
      </template>
      <template #maxPerHead="{record}">
        <Tag color="green">最多{{ record.max }}次</Tag>
      </template>
        <template #type="{record}">
          <Tag :color="getColor(record)">{{ getType(record) }}</Tag>
        </template>
        <template #range="{record}">
          <Tag color="blue" class="!mr-2">最少{{ record.min }}次</Tag>
          <Tag color="blue">最多{{ record.max }}次</Tag>
        </template>
      </BasicTable>
    </div>
    <div class="form-container" v-if="current===1">
      <Form
        class = "mt-8"
        ref="formRef"
        :model="formData"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :style="{width:'100%'}"
      >
        <FormItem ref="num" label="兑换数量" name="num"  :wrapperCol="{ span : 1}">
          <InputNumber v-model:value="formData.num" :min="formData.minPerDay" :max="formData.maxPerDay"/>
        </FormItem>
        <FormItem ref="instructions" label="积分获取说明" name="instructions">
          <TextArea v-model:value="formData.instructions" showCount :autosize="{minRows:6}" />
        </FormItem>
      </Form>
    </div>
    <div class="form-container" v-if="current===2">
      <Descriptions title="参与活动详情" bordered class="mt-10" :style="{maxWidth: '85%'}" >
        <DescriptionsItem label="客户名称" ><Tag :color="tagInfo.color">{{ record.name }}</Tag></DescriptionsItem>
        <DescriptionsItem label="客户类型"><Tag :color="tagInfo.color">{{ tagInfo.type }}</Tag></DescriptionsItem>
        <DescriptionsItem label="联系方式">{{ record.mobile }}</DescriptionsItem>
        <DescriptionsItem label="奖品名称"><Tag :color="getColor({type:formData.selectedType})">{{ formData.selectedName }}</Tag></DescriptionsItem>
        <DescriptionsItem label="奖品类型" ><Tag :color="getColor({type:formData.selectedType})">{{ getType({type:formData.selectedType}) }}</Tag></DescriptionsItem>
        <DescriptionsItem label="积分数额" >
          <Badge status="processing" :text="formData.selectedPoint" />
        </DescriptionsItem>
        <DescriptionsItem label="兑换数量"  :span="1">
          <Badge status="processing" :text="formData.num" />
        </DescriptionsItem>
        <DescriptionsItem label="共消耗"  :span="2">
          <Badge status="processing" :text="formData.num*formData.selectedPoint" />
        </DescriptionsItem>
        <DescriptionsItem label="当前积分">
          <Badge status="processing" :text="record.point" />
        </DescriptionsItem>
        <DescriptionsItem label="活动后积分">
          <Badge status="processing" :text="record.point - formData.num*formData.selectedPoint" />
        </DescriptionsItem>
        <DescriptionsItem label="已参与次数">
          <Badge status="processing" :text="timeAlready" />
        </DescriptionsItem>
        <DescriptionsItem label="情况说明">
          <div :style="{maxWidth: '800px'}">
            {{ formData.instructions }}
          </div>
        </DescriptionsItem>
      </Descriptions>
    </div>
    <template #footer>
      <Button v-if="cancelButtonVisible" @click="handlePre">上一步</Button>
      <Button type="primary" @click="handleNext" >{{ okButtonText }}</Button>
    </template>
  </BasicModal>
  <contextHolder />
</template>
<script lang="ts" setup>
import {  notification,Steps, Button,Tag,message,Form,FormItem,Input,Descriptions,DescriptionsItem,Badge,InputNumber } from 'ant-design-vue';
import { ref, computed, unref,reactive,onMounted, h,nextTick } from 'vue';
import { getRewardPage,deleteRewardByIds,updateReward } from "@/api/point/reward"
import { BasicModal, useModalInner } from '@/components/Modal';
import TypeList from '@/views/components/leftTree/TypeList.vue';
import { BasicTable, useTable, TableAction } from '@/components/Table';
import { PerEnum } from '@/enums/perEnum';
import { getActivityPage } from "@/api/point/activity"
import { dictionaryItemPageList } from '@/api/base/dictionary';
import { columns,searchFormSchema,rules } from './data'
import { exchange,getRewardsTimesRemain } from '@/api/point/orders'

const TextArea = Input.TextArea
const labelCol = { span: 7 };
const wrapperCol = { span: 13 };
const [registerTable, { reload,setProps }] = useTable({
    title: '列表',
    api: getRewardPage,
    immediate: true,
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      showAdvancedButton: false,
      showResetButton: false,
      autoSubmitOnEnter: true,
    },
    canColDrag: true,
    useSearchForm: true,
    clickToRowSelect:true,
    rowSelection: {
      type: 'radio',
    },
    bordered: true,
    scroll: { y: 340 },
    showIndexColumn: false,
  });
  const formRef = ref()
const formData = reactive({
  selectedName: '',
  selectedId: '',
  selectedType: '',
  selectedPoint: '',
  name: '',
  instructions: '',
  num: 1,
  minPerDay: 0,
  maxPerDay: 0,
  max: undefined
})
const timeAlready = ref(0)
const okButtonText = ref('下一步')
const cancelButtonVisible = ref(false)
const typeList = ref([])
const items = [{
  key:1,
  title:'选择奖品'
},{
  key:2,
  title:'填写信息'
},{
  key:3,
  title:'确认信息'
}]
const current = ref(0);
const record = ref({})
const tagInfo = reactive({
  color: '',
  type: ''
})
const emit = defineEmits(['success','register','pushTo'])
const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
  init()
  record.value = data.record
  tagInfo.color = data.tagColor
  tagInfo.type = data.type
  setModalProps({ 
    confirmLoading: false,
  });
});

function selectionChange({keys,rows}){
  if(rows[0]===undefined){
    formData.selectedId = ''
    formData.selectedType = ''
    formData.selectedName = ''
    formData.selectedPoint = ''
    formData.max = undefined
    return
  }
  console.log('funckRows',rows)
  formData.selectedId = rows[0].id
  formData.selectedType = rows[0].type
  formData.selectedName = rows[0].name
  formData.selectedPoint = rows[0].point
  formData.max = rows[0].max
  formData.minPerDay = rows[0].min
  formData.maxPerDay = rows[0].max
  formData.num = rows[0].min
}

onMounted(async ()=>{
    const res = await dictionaryItemPageList({
     pageNum: 1,
     pageSize: 100000,
      mainId: "6df56d101d9f08d00d0c269ecd14959f"
    })
    typeList.value = res.rows
  })
async function handleNext() {
  if(current.value ===0){
    if(formData.selectedId===''){
      return message.warning("请先选择一个奖品")
    }
    const res = await getRewardsTimesRemain({
      cid: record.value.id,
      decreaseType: formData.selectedId
    })
    timeAlready.value = res
    if(formData.max > res){
      cancelButtonVisible.value = true
      current.value = 1
    }else{
      return message.warning(`用户${record.value.name}兑换该奖品次数已达上限，无法继续兑换`)
    }
  }else if(current.value ===1){
    formRef.value
    .validate()
    .then(() => {
      console.log('values', formData);
      current.value = 2
      okButtonText.value = '提交'
    })
    .catch(error => {
      console.log('error', error);
    });
  }else{
    await exchange({
      cid: record.value.id,
      decreaseType: formData.selectedId,
      instructions: formData.instructions,
      num: formData.num
    })
    emit('success')
    closeModal()
    openNotification()
    init()
  }
}
function openNotification(){
  const key = `open${Date.now()}`;
  notification.open({
    message: '积分已增加',
    duration: 8,
    description:
      '用户'+record.value.name + '成功兑换：'+formData.selectedName +'，消耗'+ formData.selectedPoint+ '积分',
    btn: () =>
      h(
        Button,
        {
          type: 'primary',
          size: 'small',
          onClick: () => {
            notification.close(key)
            emit('pushTo',record.value.id)
          },
        },
        { default: () => '查看积分记录' },
      ),
    key,
    onClose: close,
  });
};
function init(){
    current.value = 0
    formData.selectedId = ''
    formData.selectedType = ''
    formData.selectedName = ''
    formData.selectedPoint = ''
    formData.minPerDay = 0
    formData.maxPerDay = 0
    formData.max = undefined
    formData.instructions = ''
    formRef.value = 0
    okButtonText.value = '下一步'
}
function handleSelect(key){
  let searchInfo = {
      type: key,
      keyword:''};
    reload({ searchInfo });
}
function handlePre(){
  if(current.value ===2){
    current.value = 1
    okButtonText.value = '下一步'
  }else if(current.value ===1){
    current.value = 0
    cancelButtonVisible.value = false
  }
}
const [api, contextHolder] = notification.useNotification();
function getType(row){
    for (const item of typeList.value) {
      if(item.id === row.type){
        return item.cname
      }      
    }
  }

  function getColor(row){
    for (const item of typeList.value) {
      if(item.id === row.type){
        return item.color
      }      
    }
  }
  function handleSelectPerson(record){

  }
</script>

<style scoped>
.table-container{
  display: flex;
  background-color:  #f5f5f5;
  height: 580px;
}
.form-container{
  display: flex;
  justify-content: center;
  background-color:  #ffffff;
  height: 580px;
}
</style>