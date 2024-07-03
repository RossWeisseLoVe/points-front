<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" >
        <template #rangePicker="data">
          <RangePicker v-model:value="data.model.time" show-time/>
        </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, Rule, useForm } from '@/components/Form';
  import { formSchema } from './activity.data';
  import { addActivity,updateActivity } from '@/api/point/activity';
  import { RangePicker } from 'ant-design-vue'
  import dayjs from 'dayjs'

  export default defineComponent({
    name: 'JobGradeModal',
    components: { BasicModal, BasicForm,RangePicker },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 100,
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        await resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        if(data.record.startTime!==null){
          data.record.time = [dayjs(data.record.startTime),dayjs(data.record.endTime)]
        }
        let typeName
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
          }else{
            values.startTime = null
            values.endTime = null
          }
          delete values.time
          delete values.typeName
            if(isUpdate.value){
              await updateActivity(values)
            }else{
              await addActivity(values)
            }
            closeModal();
            emit('success');
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit };
    },
  });
</script>