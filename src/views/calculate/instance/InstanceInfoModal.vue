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
  import { formSchema } from "./instance.data"
  import { updateInstance,newInstance } from "@/api/calculate/calculate"

  const type = ref("")
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: false });
    type.value = data.type
    setFieldsValue({
      id:data.id,
      modelId:data.modelId,
      name: data.name,
      description: data.description
    })
  });

  const emits = defineEmits(['success'])

  const [registerForm, { resetFields, updateSchema, setFieldsValue, validate,clearValidate,getFieldsValue }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    showActionButtonGroup: false,
  });

  


  async function handleSubmit() {
    const values = await validate();
    if(type.value==="insert"){
      await newInstance(values)
    }else{
      await updateInstance(values)
    }
    emits('success')
    clearValidate()
    closeModal()
  }


</script>