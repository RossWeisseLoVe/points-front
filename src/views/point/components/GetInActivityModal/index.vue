<template>
  <BasicModal v-bind="$attrs" @register="registerModal">
    <Steps :current="current" :items="items"></Steps>
    <div class="table-container" v-if="current===0">
      <TypeList class="w-1/4 xl:w-1/6" @select="handleSelect" title="活动分类" mainId="01b78d610662800b6af6f8b8d04d73ee" />
      <BasicTable @register="registerTable" class="w-3/4 xl:w-5/6">
        <template #type="{record}">
          <Tag :color="getColor(record)">{{ getType(record) }}</Tag>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <TableAction
              :actions="[
                {
                  tooltip: '选择活动',
                  icon: 'ant-design:plus-outlined',
                  onClick: handleSelectPerson.bind(null, record),
                  auth: 'Activity:'+PerEnum.UPDATE,
                }
              ]"
            />
          </template>
        </template>
      </BasicTable>
    </div>
    <template #footer>
      <Button v-if="cancelButtonVisible" @click="handlePre">上一步</Button>
      <Button type="primary" @click="handleNext">{{ okButtonText }}</Button>
    </template>
  </BasicModal>
  <contextHolder />
</template>
<script lang="ts" setup>
import { ref, computed, unref,reactive,onMounted } from 'vue';
import { BasicModal, useModalInner } from '@/components/Modal';
import TypeList from '@/views/components/leftTree/TypeList.vue';
import { BasicTable, useTable, TableAction } from '@/components/Table';
import { PerEnum } from '@/enums/perEnum';
import { getActivityPage } from "@/api/point/activity"
import { dictionaryItemPageList } from '@/api/base/dictionary';
import { columns,searchFormSchema } from './data'
import {  notification,Steps, Button,Tag } from 'ant-design-vue';
const [registerTable, { reload }] = useTable({
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
    bordered: true,
    scroll: { y: 360 },
    showIndexColumn: false,
    actionColumn: {
      width: 50,
      title: '操作',
      dataIndex: 'action',
      fixed: false,
    },
  });

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
const emit = defineEmits(['success','register'])
const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
  setModalProps({ 
    confirmLoading: false,
  });
});
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
    cancelButtonVisible.value = true
    current.value = 1
  }else if(current.value ===1){
    current.value = 2
    okButtonText.value = '提交'
  }else{
    
  }
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
const openNotification = (placement,time,name) => {
  api.info({
    message: `上架提醒： ${name}`,
    description:
      '您已设定开始售卖时间为：'+time+'届时将自动上架该物品',
    placement,
  });
};
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
}
</style>