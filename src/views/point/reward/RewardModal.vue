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
  import { RangePicker } from 'ant-design-vue'
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, Rule, useForm } from '@/components/Form';
  import { formSchema } from './reward.data';
  import { add,updateReward } from '@/api/point/reward';

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
          delete values.typeName
            if(isUpdate.value){
              await updateReward(values)
            }else{
              await add(values)
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