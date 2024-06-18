<template>
  <Drawer
    title="新建客户"
    :width="720"
    :open="open"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <Form ref="formRef" :model="form" :rules="rules" layout="vertical">
      <Row :gutter="16">
        <Col :span="12">
          <FormItem label="姓名" name="name">
            <Input v-model:value="form.name" placeholder="请输入姓名" />
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem label="手机" name="mobile">
            <Input
              v-model:value="form.mobile"
              placeholder="请输入手机号"
            />
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col :span="12">
          <FormItem label="类型" name="type">
            <Select v-model:value="form.type" placeholder="请选择类型">
              <SelectOption v-for="item in typeList" :key="item.id" :value="item.id">{{ item.cname }}</SelectOption>
            </Select>
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem label="客户联系人" name="representativeName">
            <Input v-model:value="form.representativeName" placeholder="请输入姓名" @click="openPreModal"/>
          </FormItem>
          <FormItem label="客户联系人" name="representative" v-show="false">
            <Input v-model:value="form.representative" placeholder="请输入姓名" @click="openPreModal"/>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col :span="12">
          <FormItem label="邮箱" name="email">
            <Input v-model:value="form.email" placeholder="请输入邮件地址" />
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem label="地址" name="address">
            <Input v-model:value="form.address" placeholder="请输入地址" />
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col :span="12">
          <FormItem label="公司" name="company">
            <Input v-model:value="form.company" placeholder="请输入公司" />
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem label="行业" name="industry">
            <Input v-model:value="form.industry" placeholder="请输入地址" />
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col :span="24">
          <FormItem label="备注" name="remarks">
            <Textarea v-model:value="form.remarks" />
          </FormItem>
        </Col>
      </Row>
    </Form>
    <template #extra>
      <Space>
        <Button @click="onClose">取消</Button>
        <Button type="primary" @click="submit">提交</Button>
      </Space>
    </template>
  </Drawer>
  <RepresentativeModal @register="registerModal" @success="handleSelectRepresentative"/>
</template>
<script lang="ts" setup>
import { Drawer,Form,FormItem,Space,Input,Button,Row,Col,Select,SelectOption,Textarea,message } from "ant-design-vue"
import { useModal } from '@/components/Modal';
import { reactive, ref } from 'vue';
import { rules } from "./client.data"
import RepresentativeModal from './RepresentativeModal.vue';
import { add,update } from "@/api/point/client"

const emit = defineEmits(['handleSuccess'])
const [registerModal, { openModal, setModalProps }] = useModal();
const form = reactive({
  name: '',
  mobile: '',
  representative: '',
  representativeName: '',
  type: '',
  address: '',
  industry: '',
  email: '',
  company: '',
  remarks: ''
});
const typeList = ref([])
const open = ref<boolean>(false);
const formRef = ref()
const isUpdate = ref(false)
const showDrawer = async (data) => {
  typeList.value = data.typeList
  isUpdate.value = data.isUpdate
  if(data.record){
    form.id = data.record.id
    form.representative = data.record.representative
    form.name=data.record.name
    form.mobile=data.record.mobile
    form.representativeName=data.record.representativeName
    form.type=data.record.type
    form.address=data.record.address
    form.industry=data.record.industry
    form.email=data.record.email
    form.company=data.record.company
    form.remarks=data.record.remarks
  }
  open.value = true;
};

defineExpose({
  showDrawer
})

function submit(){
  formRef.value
    .validate()
    .then(async () => {
      if(!isUpdate.value){
        await add({
          name: form.name,
          mobile: form.mobile,
          address: form.address,
          representative: form.representative,
          type: form.type,
          industry: form.industry,
          company: form.company,
          remarks: form.remarks,
          email: form.email,
        })
        message.success("添加成功")
      }else{
        await update({
          name: form.name,
          mobile: form.mobile,
          address: form.address,
          representative: form.representative,
          type: form.type,
          industry: form.industry,
          company: form.company,
          remarks: form.remarks,
          email: form.email,
          id: form.id
        })
        message.success("更新成功")
      }
      onClose()
      emit('handleSuccess')
    })
    .catch(error => {
      console.log('error', error);
    });
}

const onClose = () => {
  open.value = false;
  form.name=''
  form.mobile=''
  form.representative=''
  form.representativeName=''
  form.type=''
  form.address=''
  form.industry=''
  form.email=''
  form.company=''
  form.remarks=''
};

function openPreModal(){
  setModalProps({
    width: '800px'
  })
  openModal(true,{
    representative: {
      id: form.representative
    }
  })
}

function handleSelectRepresentative(data){
  form.representative = data.id
  form.representativeName = data.realName
}

</script>

