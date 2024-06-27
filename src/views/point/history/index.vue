<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <BasicTable @register="registerTable" class="error-handle-table">
      <template #toolbar>
        <Authority :value="'Client:'+PerEnum.QUERY" >
          <RadioGroup v-model:value="sortType" button-style="solid">
            <RadioButton :value="1">时间升序</RadioButton>
            <RadioButton :value="2">时间降序</RadioButton>
          </RadioGroup>
        </Authority>
      </template>

      <template #oName="{record}">
        {{ getOrderName(record) }}
      </template>
      <template #adType="{record}">
        <Tag :color="getOrderColor(record)">{{ getOrderType(record) }}</Tag>
      </template>
      <template #oType="{record}">
        <Tag :color="getType(record)?.color">{{ getType(record)?.name }}</Tag>
      </template>
      <template #cancelFlag="{record}">
        <Tag :bordered="false" color="processing" v-if="record.cancelFlag === 0">正常</Tag>
        <Tag :bordered="false" color="error" v-else>取消</Tag>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts" setup>
import { Tag } from 'ant-design-vue'
import { PageWrapper } from '@/components/Page';
import { BasicTable, useTable, TableAction } from '@/components/Table';
import { columns,searchFormSchema,goodsTypeList } from './data'
import { getHistoryPage} from "@/api/point/orders"
import { useRoute } from 'vue-router' 
import { PerEnum } from '@/enums/perEnum';
import { onMounted,ref,watch } from 'vue'
import { dictionaryItemPageList } from '@/api/base/dictionary';
import { RadioGroup,RadioButton } from 'ant-design-vue'

const sortType = ref(1)
const route = useRoute()
const [registerTable, { reload }] = useTable({
    title: '列表',
    api: getHistoryPage,
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
    searchInfo:{
        cid: route.query.cid,
        sortType: sortType.value
    },
    bordered: true,
    showIndexColumn: false,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
    },
  });
  const typeList = ref([])

  watch(()=>sortType.value,(val)=>{
    reload({
      searchInfo:{
        cid: route.query.cid,
        sortType: val
      }
    })
  })

  onMounted(async ()=>{
    const res = await dictionaryItemPageList({
     pageNum: 1,
     pageSize: 100000,
      mainId: "01b78d610662800b6af6f8b8d04d73ee"
    })
    typeList.value = res.rows
  })

  function getOrderName(record){
    switch (record.orderType) {
      case 1:
        return record.activityName
      case 2:
        return record.goodsName
      case 3:
        return "积分清空"
      default:
        break;
    }
  }

  function getOrderType(record){
    for (const item of typeList.value) {
      if(item.id === record.activityType){
        return item.cname
      }      
    }
  }

  function getOrderColor(record){
    for (const item of typeList.value) {
      if(item.id === record.activityType){
        return item.color
      }      
    }
  }

  function getType(record){
    for (const item of goodsTypeList) {
      if(item.type =record.orderType){
        return item
      }
    }
  }

</script>