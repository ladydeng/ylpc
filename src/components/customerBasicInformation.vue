<template>
    <div>
        <!-- 表格 -->
        <a-table :columns="columns" :data-source="data">
            <!-- <a slot="action" href="javascript:;">Delete</a> -->
            <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
                <!-- {{ record.description }} -->
                <a-tabs default-active-key="1" @change="callback">
                    <a-tab-pane key="1" tab="客户信息详情">
                        {{ record.description }}
                        <a-descriptions title="客户信息详情">
                            <a-descriptions-item label="客户编号"></a-descriptions-item>
                            <a-descriptions-item label="咨询师姓名"></a-descriptions-item>
                            <a-descriptions-item label="咨询师编号"></a-descriptions-item>
                            <a-descriptions-item label="电销员工姓名"></a-descriptions-item>
                            <a-descriptions-item label="电销员工编号"></a-descriptions-item>
                        </a-descriptions>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="签订单子详情" force-render>
                        <a-descriptions title="客户信息详情">
                            <a-descriptions-item label="客户编号"></a-descriptions-item>
                            <a-descriptions-item label="咨询师姓名"></a-descriptions-item>
                            <a-descriptions-item label="咨询师编号"></a-descriptions-item>
                            <a-descriptions-item label="电销员工姓名"></a-descriptions-item>
                            <a-descriptions-item label="电销员工编号"></a-descriptions-item>
                        </a-descriptions>
                    </a-tab-pane>
                    <a-tab-pane key="3" tab="电销应邀详情">
                        <a-descriptions title="电销应邀详情">
                            <a-descriptions-item label="数据编号"></a-descriptions-item>
                            <a-descriptions-item label="客户编号"></a-descriptions-item>
                            <a-descriptions-item label="客户姓名"></a-descriptions-item>
                            <a-descriptions-item label="上门应邀时间"></a-descriptions-item>
                            <a-descriptions-item label="应邀结果"></a-descriptions-item>
                            <a-descriptions-item label="电销员工姓名"></a-descriptions-item>
                            <a-descriptions-item label="电销员工编号"></a-descriptions-item>
                        </a-descriptions>
                    </a-tab-pane>
                    <a-tab-pane key="4" tab="咨单详情">
                        <a-descriptions title="客户信息详情">
                            <a-descriptions-item label="数据编号"></a-descriptions-item>
                            <a-descriptions-item label="客户编号"></a-descriptions-item>
                            <a-descriptions-item label="客户姓名"></a-descriptions-item>
                            <a-descriptions-item label="咨询师姓名"></a-descriptions-item>
                            <a-descriptions-item label="咨询师编号"></a-descriptions-item>
                            <a-descriptions-item label="咨询结果"></a-descriptions-item>
                            <a-descriptions-item label="咨询时间"></a-descriptions-item>
                        </a-descriptions>
                    </a-tab-pane>
                </a-tabs>
            </p>
        </a-table>


    </div>
</template>



<script>
/**
 * Copyright: Copyright (c) 2020 云邻信息科技
 *
 * @templateName: staff.vue
 * @Description: 员工基本信息可展开表格(数据完整无状态)
 *
 * @version: v1.1.0
 * @author: Bai
 * @date: 2020年12月30日 上午9:45:17
 *
 * Modification History:<br>
 * Date             Author          Version            Description
 *---------------------------------------------------------*<br>
 * 2021年03月02日     qcc           v1.0.0               新建页面CRM管理页面
 */
const columns = [
  { title: '客户编号', dataIndex: 'staffCode', key: 'staffCode' },
  { title: '手机号', dataIndex: 'phone', key: 'phone' },
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '年龄', dataIndex: 'age', key: 'age' },
  { title: '学历', dataIndex: 'xl', key: 'xl' },
  { title: '婚姻', dataIndex: 'hy', key: 'hy' },
  { title: '专业', dataIndex: 'zy', key: 'zy' },
//   { title: 'Action', dataIndex: '', key: 'x', scopedSlots: { customRender: 'action' }},
];

const data = [
  {
    key: 1,
    name: 'John Brown',
    staffCode:'001',
    age: 32,
    phone:175836583264823,
    xl:'本科',
    hy:'未婚',
    zy:'计算机科学与技术',
    address: 'New York No. 1 Lake Park',
    description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
  }
];

export default {
  data() {
    return {
      data,
      columns,
    };
  },
};
</script>