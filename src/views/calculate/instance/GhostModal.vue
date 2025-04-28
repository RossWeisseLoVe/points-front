<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="123" @ok="handleSubmit" >
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { message } from "ant-design-vue"
  import { BasicModal, useModalInner } from '@/components/Modal';

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {

  });

  const emits = defineEmits(['success'])


  


  async function handleSubmit() {

    closeModal()
  }


</script>