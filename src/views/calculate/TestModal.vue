<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="123" @ok="handleSubmit">
    <Form :model="formData" layout="vertical">
      <FormItem
        v-for="field in fields"
        :key="field.id"
        :label="field.formItemName"
        :name="field.propertyName"
      >
        <!-- 动态组件渲染 -->
        <component
          :is="getComponentType(field.formItem)"
          v-model:value="formData[field.propertyName]"
          :placeholder="field.placeholder || undefined"
          :disabled="field.inputOrOutput === 'output'"
          v-bind="getComponentProps(field)"
        />
      </FormItem>
    </Form>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { defineComponent, ref, computed, unref,reactive } from 'vue';
  import { Form,FormItem,Input,InputNumber,Select } from "ant-design-vue"
  import { getResult } from '@/api/calculate/calculate'
  import { BasicModal, useModalInner } from '@/components/Modal';
      const fields = ref({})
      const typeName = ref("")
      const formData = ref({})
      const componentMap = {
        'Input': Input,
        'InputNumber': InputNumber,
        'Select': Select,
      };
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false });
        fields.value = data.data
        typeName.value = data.typeName
        data.data.forEach(field => {
          if (!(field.propertyName in formData.value)) {
            formData.value[field.propertyName] = getDefaultValue(field.propertyType);
          }
        });
      });

      const getComponentType = (formItem) => {
        return componentMap[formItem] || Input;
      };

      const getDefaultValue = (type) => {
        switch (type) {
          case 'Double':
            return 0
          case 'Integer':
            return 0;
          case 'Boolean':
            return false;
          case 'Date':
            return null;
          default:
            return '';
        }
      };

      const getComponentProps = (field) => {
        const props = {};
        
        // 处理数值类型组件
        if (field.formItem === 'InputNumber') {
          props.min = field.min ?? undefined;
          props.max = field.max ?? undefined;
          props.precision = field.decimalPoint ?? undefined;
        }

        // 处理选择器
        if (field.formItem === 'Select' && field.options) {
          props.options = field.options;
        }

        return props;
      };

      async function handleSubmit() {
        const res = await getResult({
          param: formData.value,
          typeName:typeName.value
        })
        formData.value = res
        console.log("ffffffffffff",res)
      }


</script>