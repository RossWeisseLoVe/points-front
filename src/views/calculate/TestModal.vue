<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="123" @ok="handleSubmit" >
    <Form :model="formData" layout="vertical">
      <div v-for="field in fields" :key="field.id">
        <FormItem
          v-show="getDisplayed(field)"
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
      </div>
    </Form>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { defineComponent, ref, computed, unref,reactive } from 'vue';
  import { Form,FormItem,Input,InputNumber,Radio ,Select } from "ant-design-vue"
  import { getResult } from '@/api/calculate/calculate'
  import { BasicModal, useModalInner } from '@/components/Modal';
      const RadioGroup = Radio.Group
      const fields = ref({})
      const typeName = ref("")
      const formData = ref({})
      const componentMap = {
        'Input': Input,
        'InputNumber': InputNumber,
        'Select': Select,
        'Radio': RadioGroup ,
      };
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false });
        typeName.value = data.typeName
        for (const field of data.data) {
          if (!(field.propertyName in formData.value)) {
            formData.value[field.propertyName] = getDefaultValue(field.propertyType);
          }
          if(field.formItem === "Radio"){
              if(field.options===""|| field.options===undefined || field.options ===null){
                continue
              }
              formData.value[field.propertyName] = 1
              field.optionType = "button"
              const option:any = [] 
              const opList = field.options.split("\n")
              for (const item of opList) {
                const valList = item.split("=")
                if(['Integer','Double','Long'].includes(field.propertyType)){
                  option.push({
                    label: valList[1],
                    value: parseInt(valList[0])
                  })
                }else{
                  option.push({
                    label: valList[1],
                    value: valList[0]
                  })
                }
              }
              field.options = option
            }
        }
        fields.value = data.data
      });

      function getDisplayed(field){
        if(field.displayBy ==="" || field.displayBy===undefined || field.displayBy ===null){
          return true
        }
        const list = field.displayBy.split("=")
        if(['Integer','Double','Long'].includes(field.propertyType)){
          return formData.value[list[0]] === parseInt(list[1])
        }else{
          return formData.value[list[0]] === list[1]
        }
      }

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
        if (field.formItem === 'Radio' && field.options) {
          props.options = field.options;
          props.optionType = field.optionType
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