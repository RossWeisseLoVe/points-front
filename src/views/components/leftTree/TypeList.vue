<template>
  <div class="bg-white m-4 mr-0 overflow-hidden" v-loading="treeLoading">
    <BasicTree
      :title="title"
      toolbar
      search
      :clickRowToExpand="false"
      :treeData="treeData"
      :fieldNames ="{ key: 'id', title: 'cname' }"
      @select="handleSelect"
      ref="basicTreeRef"
    >
    <template #title="data">
      <Tag :color="data.color">{{ data.cname }}</Tag>
    </template>
  </BasicTree>
  </div>
</template>
<script lang="ts" setup>
  import {  onMounted, ref, unref, nextTick } from 'vue';
  import { dictionaryItemPageList } from '@/api/base/dictionary';
  import {Spin,Tag} from "ant-design-vue";
  import { BasicTree, TreeActionType, TreeItem } from '@/components/Tree';
      const treeData = ref<TreeItem[]>([]);
      const treeLoading = ref<boolean>(false);
      const basicTreeRef = ref<Nullable<TreeActionType>>(null);
      const emit = defineEmits(['select'])
      const props = defineProps(['title','mainId'])
      async function fetch() {
        treeLoading.value = true;
        const res = await dictionaryItemPageList({
          pageNum: 1,
          pageSize: 100000,
          mainId: props.mainId
        })
        treeData.value = res.rows
        treeLoading.value = false;
        nextTick(() => {
            // 加载后展开节层级
            if(unref(treeData).length < 10){
              unref(basicTreeRef)?.filterByLevel(1);
            }
          });
      }

      function handleSelect(keys: string) {
        emit('select', keys[0]);
      }

      onMounted(() => {
        fetch();
      });

</script>
