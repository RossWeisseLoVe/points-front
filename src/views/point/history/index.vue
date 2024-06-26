<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <BasicTable @register="registerTable" class="error-handle-table">

    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts" setup>
import { PageWrapper } from '@/components/Page';
import { BasicTable, useTable, TableAction } from '@/components/Table';
import { columns,searchFormSchema } from './data'
import { getHistoryPage} from "@/api/point/orders"
import { useRoute } from 'vue-router' 

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
        cid: route.query.cid
    },
    bordered: true,
    showIndexColumn: false,
    actionColumn: {
      width: 160,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
    },
  });
</script>