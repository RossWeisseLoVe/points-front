<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="选择客户联系人" @ok="handleSubmit">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Alert v-if="getDisplay()" message="未选择" type="info" show-icon />
        <Alert v-else :message="getRealName()" type="success" show-icon />
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                tooltip: '选为客户联系人',
                icon: 'ant-design:usergroup-add',
                onClick: handleSelect.bind(null, record),
              },
            ]"
          />
        </template>
        <!-- <template v-if="column.key === 'image'" >
          <Avatar :src="record.image" @click="previewImageHandle(record.image)">
            <template #icon>
              <UserOutlined />
            </template>
          </Avatar>
        </template> -->
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script lang="ts" setup>
  import {  ref, computed, unref } from 'vue';
  import { Alert, message } from 'ant-design-vue'
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { getAccountPageList,getOne } from '@/api/privilege/account';
  import {  searchFormSchema } from '@/views/privilege/account/account.data';
  import { accountColumns } from "./client.data"

  const representative = ref({
  })

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    console.log('fuck',data)
    if(data.representative.id!==''&&data.representative.id!==undefined){
      const res = await getOne({
        id: data.representative.id
      })
      representative.value = res
    }
  });
  const emit = defineEmits(['success'])
  const [registerTable, { reload }] = useTable({
        title: '列表',
        api: getAccountPageList,
        columns: accountColumns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          showAdvancedButton: false,
          showResetButton: false,
          autoSubmitOnEnter: true,
        },
        size: "small",
        canColDrag: true,
        maxHeight: 400,
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 160,
          title: '操作',
          dataIndex: 'action',
          fixed: false,
        },
      });

      function handleSubmit(){
        if(representative.value.id===undefined||representative.value.id===''){
          return message.info("请选择客户联系人")
        }
        emit('success',representative.value)
        closeModal()
      }

      function handleSelect(data){
        representative.value = data
      }

      function getDisplay(){
        if(representative.value===null) return false
        return representative.value.id===undefined||representative.value.id===''
      }

      function getRealName(){
        if(representative.value){
          return representative.value.realName
        }
      }
</script>