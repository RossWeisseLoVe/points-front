<template>
  <BasicModal v-bind="$attrs" @register="registerModal">
    <div :style="{display:'flex',justifyContent:'center'}" class="mb-5">
      <Steps :current="current" :items="items" :style="{width:'70%'}"></Steps>
    </div>
    <div class="table-container" v-show="current===0">
      <TypeList class="w-1/4 xl:w-1/6" @select="handleSelect" title="活动分类" mainId="01b78d610662800b6af6f8b8d04d73ee" />
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
        <DescriptionsItem label="活动名称"><Tag :color="getColor({type:formData.selectedType})">{{ formData.selectedName }}</Tag></DescriptionsItem>
        <DescriptionsItem label="活动类型" ><Tag :color="getColor({type:formData.selectedType})">{{ getType({type:formData.selectedType}) }}</Tag></DescriptionsItem>
        <DescriptionsItem label="积分数额" :span="3">
          <Badge status="processing" :text="formData.selectedPoint" />
        </DescriptionsItem>
        <DescriptionsItem label="当前积分">
          <Badge status="processing" :text="record.point" />
        </DescriptionsItem>
        <DescriptionsItem label="活动后积分">
          <Badge status="processing" :text="record.point + formData.selectedPoint" />
        </DescriptionsItem>
        <DescriptionsItem label="已参与次数">{{ timeAlready }}</DescriptionsItem>
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
import {  notification,Steps, Button,Tag,message,Form,FormItem,Input,Descriptions,DescriptionsItem,Badge } from 'ant-design-vue';
import { ref, computed, unref,reactive,onMounted, h,nextTick } from 'vue';
import { BasicModal, useModalInner } from '@/components/Modal';
import TypeList from '@/views/components/leftTree/TypeList.vue';
import { BasicTable, useTable, TableAction } from '@/components/Table';
import { PerEnum } from '@/enums/perEnum';
import { getActivityPage } from "@/api/point/activity"
import { dictionaryItemPageList } from '@/api/base/dictionary';
import { columns,searchFormSchema,rules } from './data'
import { save,getTimesRemain } from '@/api/point/orders'

const TextArea = Input.TextArea
const labelCol = { span: 7 };
const wrapperCol = { span: 13 };
const [registerTable, { reload,setProps }] = useTable({
    title: '列表',
    api: getActivityPage,
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
  max: undefined
})
const timeAlready = ref(0)
const okButtonText = ref('下一步')
const cancelButtonVisible = ref(false)
const typeList = ref([])
const items = [{
  key:1,
  title:'选择活动'
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
}

onMounted(async ()=>{
    const res = await dictionaryItemPageList({
     pageNum: 1,
     pageSize: 100000,
      mainId: "01b78d610662800b6af6f8b8d04d73ee"
    })
    typeList.value = res.rows
  })
async function handleNext() {
  if(current.value ===0){
    if(formData.selectedId===''){
      return message.warning("请先选择一个活动")
    }
    const res = await getTimesRemain({
      cid: record.value.id,
      addType: formData.selectedId
    })
    timeAlready.value = res
    if(formData.max > res){
      cancelButtonVisible.value = true
      current.value = 1
    }else{
      return message.warning(`用户${record.value.name}参与该活动次数已达上限，无法继续参与`)
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
    await save({
      cid: record.value.id,
      addType: formData.selectedId,
      instructions: formData.instructions
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
      '用户'+record.value.name + '成功参与活动：'+formData.selectedName +'，获得'+ formData.selectedPoint+ '积分',
    btn: () =>
      h(
        Button,
        {
          type: 'primary',
          size: 'small',
          onClick: () => {
            notification.close(key)
            emit('pushTo')
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