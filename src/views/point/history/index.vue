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
      <template #num="{record}">
        <Tag :bordered="false" color="processing">{{ record.num }}</Tag>
      </template>
      <template #point="{record}">
        <Tag :color="getType(record)?.color" :bordered="false">{{ ([1,4].includes(record.orderType)? "+": "-") + record.point}}</Tag>
      </template>
      <template #cancelFlag="{record}">
        <Tag :bordered="false" color="processing" v-if="record.cancelFlag === 0">正常</Tag>
        <Tag :bordered="false" color="error" v-else>取消</Tag>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts" setup>
import { Tag,RadioGroup,RadioButton  } from 'ant-design-vue'
import { PageWrapper } from '@/components/Page';
import { BasicTable, useTable, TableAction } from '@/components/Table';
import { columns,searchFormSchema,goodsTypeList } from './data'
import { getHistoryPage} from "@/api/point/orders"
import { useRoute } from 'vue-router' 
import { PerEnum } from '@/enums/perEnum';
import { onMounted,ref,watch } from 'vue'
import { dictionaryItemPageList } from '@/api/base/dictionary';
import { useTabs } from '@/hooks/web/useTabs';

const {setTitle } = useTabs();
const searchInfo = ref({})
const sortType = ref(1)
const route = useRoute()
const [registerTable, { reload }] = useTable({
    title: '列表',
    api: getHistoryPage,
    immediate: false,
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
    searchInfo: searchInfo.value,
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
  const typeGoodsList = ref([])
  watch(()=>sortType.value,(val)=>{
    reload({
      searchInfo:{
        ...searchInfo.value,
        sortType: val
      }
    })
  })

  onMounted(async ()=>{
    setTitle(route.query.title+'-积分历史')
    const res = await dictionaryItemPageList({
     pageNum: 1,
     pageSize: 100000,
      mainId: "01b78d610662800b6af6f8b8d04d73ee"
    })
    typeList.value = res.rows
    const resGoods = await dictionaryItemPageList({
     pageNum: 1,
     pageSize: 100000,
      mainId: "6df56d101d9f08d00d0c269ecd14959f"
    })
    typeGoodsList.value = resGoods.rows
    if(route.query.cid){
      searchInfo.value.cid = route.query.cid
    }else if(route.query.rid){
      searchInfo.value.decreaseType = route.query.rid
    }else if(route.query.aid){
      searchInfo.value.addType = route.query.aid
    }
    reload({
      searchInfo: {
        ...searchInfo.value,
        sortType: sortType.value,
      }
    })
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
    if(record.orderType === 1){
      for (const item of typeList.value) {
        if(item.id === record.activityType){
          return item.cname
        }      
      }
    }else if(record.orderType === 2){
      for (const item of typeGoodsList.value) {
        if(item.id === record.goodsType){
          return item.cname
        }      
      }
    }

  }

  function getOrderColor(record){
    if(record.orderType === 1){
      for (const item of typeList.value) {
        if(item.id === record.activityType){
          return item.color
        }      
      }
    }else if(record.orderType === 2){
      for (const item of typeGoodsList.value) {
        if(item.id === record.goodsType){
          return item.color
        }      
      }
    }
  }

  function getType(record){
    for (const item of goodsTypeList) {
      if(item.type ===record.orderType){
        return item
      }
    }
  }

</script>