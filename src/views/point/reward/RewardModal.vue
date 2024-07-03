<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" >
        <template #rangePicker="data">
          <RangePicker v-model:value="data.model.time" show-time/>
        </template>
    </BasicForm>
  </BasicModal>
  <contextHolder />
</template>
<script lang="ts" setup>
  import { RangePicker } from 'ant-design-vue'
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, Rule, useForm } from '@/components/Form';
  import { formSchema } from './reward.data';
  import { add,updateReward } from '@/api/point/reward';
  import dayjs from 'dayjs'
  import { NotificationPlacement, notification } from 'ant-design-vue';

      const isUpdate = ref(true);
      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 100,
        schemas: formSchema,
        showActionButtonGroup: false,
      });
      const emit = defineEmits(['success','register'])
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        await resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        let typeName
        if(data.record.startTime!==null){
          data.record.time = [dayjs(data.record.startTime),dayjs(data.record.endTime)]
        }
        for (const item of data.typeList) {
          if(data.record.type === item.id)
          typeName = item.cname
          console.log('fuck',item)
        }
        setFieldsValue({
          ...data.record,
          typeName
        });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '修改'));

      async function handleSubmit() {
        const values = await validate();
        try {
          setModalProps({ confirmLoading: true });
          if(values.time){
            values.startTime = values.time[0]
            values.endTime = values.time[1]
          }
          delete values.time
          delete values.typeName
            if(isUpdate.value){
              await updateReward(values)
            }else{
              await add(values)
              openNotification('topRight',values.startTime,values.name)
            }
            closeModal();
            emit('success');
        } finally {
          setModalProps({ confirmLoading: false });
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

</script>