<template>
  <div class="p-4">
    <Row>
      <Col :span="10">
        <GrowCard  class="enter-y" />
        <!-- <SiteAnalysis class="!my-4 !mr-4 enter-y" :loading="loading" /> -->
        <TodoList class="!my-4 !mr-4 enter-y"/>
      </Col>
      <Col :span="14">
        <MyCustomer/>
      </Col>
    </Row>
    <div class="md:flex enter-y">
      <UserRanking class="md:w-1/3 w-full"  />
      <ExchangeAnalysis class="md:w-1/3 !md:mx-4 !md:my-0 !my-4 w-full"  />
      <SalesProductPie class="md:w-1/3 w-full"  />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import TodoList from './components/TodoList.vue'
  import GrowCard from './components/GrowCard.vue';
  import SiteAnalysis from './components/SiteAnalysis.vue';
  import ExchangeAnalysis from './components/ExchangeAnalysis.vue';
  import UserRanking from './components/UserRanking.vue';
  import SalesProductPie from './components/SalesProductPie.vue';
  import { Row,Col } from 'ant-design-vue'
  import MyCustomer from "./components/MyCustomer.vue"


</script>

<style scoped lang="less">

</style>
