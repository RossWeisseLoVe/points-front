<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="123" @ok="handleSubmit" >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { message } from "ant-design-vue"
  import { BasicForm, useForm } from '@/components/Form';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { formSchema } from "../data"
  import { useCalculateStore } from "@/store/modules/calculate"

  const calculateStore = useCalculateStore()
  const type = ref("")
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: false });
    type.value = data.type
    setFieldsValue({
      id:calculateStore.modelId,
      name: calculateStore.modelName,
      description: calculateStore.description
    })
  });

  const [registerForm, { resetFields, updateSchema, setFieldsValue, validate,clearValidate,getFieldsValue }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    showActionButtonGroup: false,
  });

  


  async function handleSubmit() {
    const model = getFieldsValue()    
    calculateStore.modelId = model.id
    calculateStore.modelName = model.name
    calculateStore.description = model.description
    if(type.value==="save"){
      const values = await validate();
      await calculateStore.saveCalculateModel()
      message.success("保存成功")
    }
    clearValidate()
    closeModal()
  }


</script>