<template>
  <div class="scrollTable-box">
    <div class="search">
      <a-input-search
        v-model:value="keywords"
        style="width: 300px; margin-right: 10px"
        enter-button="搜索"
        @search="getUserScore"
        placeholder="请输入手机号"
      />
    </div>
    <!-- 显示用户姓名和积分详情 -->
    <a-card v-if="userInfo.phone">
      <a-form ref="formRef" layout="inline">
        <a-form-item label="手机号" style="margin-right: 30px">
          {{ userInfo.phone }}
        </a-form-item>
        <a-form-item label="总积分">
          {{ userInfo.score }}
        </a-form-item>
        <a-button
          type="primary"
          @click="deleteScore(record)"
          style="margin: 0 30px"
          >积分兑换</a-button
        >
      </a-form>
     
    </a-card>
    <a-form style="margin-top:20px" ref="formRef" layout="inline" :model="form">
        <a-form-item
          label="种类"
          name="typeName"
          :rules="{
            required: true,
            message: '请选择种类',
            trigger: 'change',
          }"
        >
          <!-- 种类下拉选择 -->
          <a-select
            v-model:value="form.typeName"
            @change="typeChange"
            placeholder="请选择种类"
            style="width: 200px"
          >
            <a-select-option
              v-for="(item, index) in typeList"
              :key="index"
              :value="item.typeName"
              >{{ item.typeName }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item
          label="重量"
          name="weight"
          :rules="{
            required: true,
            message: '请输入重量',
            trigger: 'change',
          }"
        >
          <!-- 只能输入大于0 的数字 -->
          <a-input-number
            style="width: 100%"
            v-model:value="form.weight"
            placeholder="请输入重量"
            :min="0"
          />
        </a-form-item>
        <a-form-item label="单价"> {{ form.singlePrice }} </a-form-item>
        <a-form-item label="总金额">
          {{ new BigNumber(form.singlePrice).multipliedBy(form.weight) }}
        </a-form-item>
        <a-form-item label="总积分">
          {{ new BigNumber(form.singlePrice).multipliedBy(form.weight) }}
        </a-form-item>
        <a-button type="primary" v-if="userInfo.phone" @click="onSave(record)">新增积分</a-button>
      </a-form>
    <div class="content">
      <a-table
        :columns="columnsList"
        :data-source="data"
        :pagination="pagination"
        @change="pageChange"
        rowKey="id"
        :scroll="{ x: 1400 }"
        ref="table"
      >
      </a-table>
    </div>

    <a-modal
      title="积分兑换"
      v-model:visible="recordVisible"
      ok-text="保存"
      cancel-text="取消"
      @ok="deleteSave"
      @cancel="onCancel"
    >
      <a-form
        ref="formDeleteRef"
        :model="formDelete"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 14 }"
      >
        <a-form-item label="总积分">
          {{ userInfo.score }}
        </a-form-item>
        <a-form-item
          label="兑换积分"
          name="reduceScore"
          :rules="{
            required: true,
            message: '请输入需要兑换的积分',
            trigger: 'change',
          }"
        >
          <!-- 只能输入大于0 的数字 -->
          <a-input-number
            style="width: 100%"
            v-model:value="formDelete.reduceScore"
            placeholder="请输入需要兑换的积分"
            :min="0"
            :max="userInfo.score"
          />
        </a-form-item>
        <a-form-item label="剩余积分">
          {{ new BigNumber(userInfo.score).minus(formDelete.reduceScore) }}
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
// import BigNumberBigNumber from "bignumber.js";
import { defineComponent } from "vue";
import { columns } from "./columns";
import { onMounted, ref, reactive, onBeforeMount } from "vue";
import type { FormInstance } from "ant-design-vue";
import {
  getIntegral,
  addIntegral,
  deleteIntegral,
  getIntegralLog,
  getGoodsList,
} from "./services";
interface Order {
  columnKey: string;
  order: string;
}
interface FormState {
  userId: number;
  singlePrice: number;
  typeName: string;
  totalPrice: number;
  weight: number;
}
export default defineComponent({
  name: "Home",
  components: {},
  setup() {
    const columnsList: any = columns;

    const BigNumber = require("bignumber.js");
    // 积分兑换显示框
    const recordVisible: any = ref(false);

    const pagination: any = ref({
      current: 1,
      pageSize: 10,
      showTotal(total: number) {
        return `共 ${total} 条`;
      },
      total: 0,
    });

    let visible = ref(false);

    const formRef = ref<FormInstance>();

    const formDeleteRef = ref<FormInstance>();

    let form = ref<FormState>({
      userId: 0,
      singlePrice: 0,
      typeName: "",
      totalPrice: 0,
      weight: 0,
    });

    // 消耗积分form
    let formDelete = ref<any>({
      userId: void 0,
      reduceScore: 0,
    });

    let data: any = ref([]);

    let userInfo: any = ref({});

    let keywords: any = ref("");

    let typeList: any = ref([]);

    // 查询用户积分
    const getUserScore = async () => {
      const res: any = await getIntegral({ phone: keywords.value });
      userInfo.value = res || {};
      // addScore()
      getList();
    };

    const typeChange = (value: any) => {
      const type = typeList.value.find((item: any) => item.typeName === value);
      form.value.singlePrice = type.typePrice;
      form.value.typeName = type.typeName;
    };

    const getTypeList = async () => {
      const res: any = await getGoodsList();
      typeList.value = res;
    };

    const getList = async () => {
      const res: any = await getIntegralLog({
        userId: userInfo.value.id,
        key: 667788,
        page: pagination.value.current,
        limit: pagination.value.pageSize,
      });
      data.value = res.list;
      pagination.value.total = res.total;
    };

    const pageChange = (pg: any) => {
      pagination.value.current = pg.current;
      pagination.value.pageSize = pg.pageSize;
      getList();
    };

    const deleteData = (id: string) => {
      deleteIntegral({ id }).then((res: any) => {
        getList();
      });
    };

    // 初始化数据
    onMounted(() => {
      visible.value = false;
      getTypeList();
      // getList();
    });

    const addScore = (
      record: any = {
        userId: userInfo.value.id,
        singlePrice: typeList.value[0].typePrice,
        typeName: typeList.value[0].typeName,
        totalPrice: 0,
        weight: 0,
      }
    ) => {
      form.value = { ...record };
      visible.value = true;
    };

    const deleteScore = (
      record: any = {
        userId: userInfo.value.id,
        reduceScore: 0,
      }
    ) => {
      formDelete.value = { ...record };
      recordVisible.value = true;
    };

    const onSave = async () => {
      const values = await (formRef as any).value.validateFields();
      await addIntegral({
        ...form.value,
        ...values,
        userId: userInfo.value.id,
        totalPrice: new BigNumber(form.value.singlePrice).multipliedBy(
          form.value.weight
        ),
      });
      getUserScore();
      (formRef as any).value.resetFields();
      visible.value = false;
    };

    const deleteSave = async () => {
      const values = await (formDeleteRef as any).value.validateFields();
      await deleteIntegral({
        ...formDelete.value,
        ...values,
      });
      getUserScore();
      (formDeleteRef as any).value.resetFields();
      recordVisible.value = false;
    };

    const onCancel = () => {};

    return {
      pagination,
      pageChange,
      deleteSave,
      addScore,
      deleteScore,
      formRef,
      formDeleteRef,
      data,
      columnsList,
      deleteData,
      getList,
      userInfo,
      typeList,
      getUserScore,
      keywords,
      form,
      formDelete,
      visible,
      recordVisible,
      onSave,
      onCancel,
      BigNumber,
      typeChange,
    };
  },
});
</script>

<style lang="less">
.ant-form-item{
  font-size: 25px !important;
  margin-bottom: 15px  !important;
  .ant-select{
    font-size: 20px !important;
  }
  margin-right: 30px !important;
}
.ant-form-item-label{
  >label{
    font-size: 25px !important;
  }
  font-size: 25px !important;
}
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
