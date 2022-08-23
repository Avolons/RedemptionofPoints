<template>
  <div class="scrollTable-box">
    <div class="search">
      <a-input-search
        v-model:value="keywords"
        style="width: 300px; margin-right: 10px"
        enter-button="搜索"
        @search="getList"
        placeholder="请输入事件名称/topic名称"
      />
      <a-button type="primary" @click="add">新增</a-button>
    </div>

    <div class="content">
      <a-table
        :columns="columnsList"
        :data-source="data"
        rowKey="id"
        :scroll="{ x: 1400 }"
        ref="table"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a @click="add(record)">修改</a>
            <a-divider type="vertical" />
            <a-popconfirm
              title="确认删除?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="deleteData(record.id)"
            >
              <a>删除</a>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </div>
    <a-modal
      title="添加/编辑"
      v-model:visible="visible"
      ok-text="保存"
      cancel-text="取消"
      @ok="onSave"
      @cancel="onCancel"
    >
      <a-form
        ref="formRef"
        :model="form"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 14 }"
      >
        <a-form-item
          label="事件名称"
          prop="event"
          :rules="{
            required: true,
            message: '请输入事件名称',
            trigger: 'change',
          }"
        >
          <a-input
            v-model:value="form.event"
            placeholder="请输入事件名称"
          ></a-input>
        </a-form-item>
        <a-form-item
          label="topic"
          prop="topic"
          :rules="{
            required: true,
            message: '请输入topic',
            trigger: 'change',
          }"
        >
          <a-input
            v-model:value="form.topic"
            placeholder="请输入topic"
          ></a-input>
        </a-form-item>
        <a-form-item
          label="状态"
          prop="status"
          :rules="{
            required: true,
            message: '请选择状态',
            trigger: 'change',
          }"
        >
          <a-radio-group v-model:value="form.status">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="备注"
          prop="remark"
          :rules="{
            required: true,
            message: '请输入备注',
            trigger: 'change',
          }"
        >
          <a-textarea
            v-model:value="form.remark"
            placeholder="请输入备注"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { columns } from "./columns";
import { onMounted, ref, reactive  ,onBeforeMount} from "vue";
import type { FormInstance } from "ant-design-vue";
import { addObj, getLists, editObj, deleteObj } from "./services";
interface Order {
  columnKey: string;
  order: string;
}
interface FormState {
  username: string;
  nickname: string;
  checkNick: boolean;
}
export default defineComponent({
  name: "Home",
  components: {},
  setup() {
    const columnsList: any = columns;

    const formRef = ref<FormInstance>();

    let data: any = ref([]);

    let keywords: any = ref("");

    const getList = async (paginations: any = {}, load = true) => {
      const res: any = await getLists({
        keywords: keywords.value,
        // ...this.searchData,
      });

      data.value = res;

      // if (this.data.length === 0 && this.pagination.current !== 1) {
      //   this.getList({ current: 1 });
      // }
    };

    const deleteData = (id: string) => {
      deleteObj({ id }).then((res: any) => {
        getList();
      });
    };

    // 初始化数据
    onMounted(() => {
      visible.value=false;
      getList();
    });

    const form:any = ref({
      event: "",
      topic: "",
      status: 1,
      remark: "",
      id:null
    });

    const add = (
      record: any = {
        event: "",
        topic: "",
        status: 1,
        remark: "",
        id:null
      }
    ) => {
      form.value ={...record};
      visible.value = true;
    };

    let visible = ref(true);

    const onSave = async () => {
      const values = await (formRef as any).value.validateFields();
      if (form.value.id) {
        await editObj({...values,id:form.value.id});
        getList()
      }else{
        await  addObj(values);
        getList()
      }
      

      // const { schoolName, id, schoolCode, areaCode } = this.form;
      // const res = await (id ? editSchool : addSchool)({
      //   schoolName,
      //   schoolId:id,
      //   schoolCode,
      //   location: {
      //     provinceCode: areaCode[0].substring(0,2),
      //     cityCode: areaCode[1].substring(0,4),
      //     countyCode: areaCode[2],
      //   },
      // });
      (formRef as any).value.resetFields();
      visible.value = false;
    };

    const onCancel = () => {};

    return {
      add,
      formRef,
      data,
      columnsList,
      deleteData,
      getList,
      keywords,
      form,
      visible,
      onSave,
      onCancel,
    };
  },
});
</script>

<style lang="less">
.scrollTable-box {
  box-sizing: border-box;
  padding: 30px;
}
.search {
  margin-bottom: 20px;
}

.content {
  background: #f3f3f3;
  box-sizing: border-box;
  padding: 15px;
  border-radius: 5px;
}
</style>
