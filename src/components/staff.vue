<template>
    <div>
      <div class="btn">
          <a-button type="primary" @click="addEmployees">添加员工信息</a-button>
          <!-- 添加员工信息模态框 -->
          <a-modal v-model="addEmployeesVisible" title="Basic Modal" @ok="addEmployeesHandleOk">
            <!-- 模态框内容 -->
            <a-form-model :model="formData" :label-col="{ span: 5 }" :rules="rules" ref="ruleForm" :wrapper-col="{ span: 16 }">
              <a-form-model-item label="id">
                <a-input disabled v-model="formData.id" />
              </a-form-model-item>
              <a-form-model-item prop="staffCode" required label="员工编号">
                <a-input v-model="formData.staffCode" />
              </a-form-model-item>
              <a-form-model-item prop="name" required label="姓名">
                <a-input v-model="formData.name" />
              </a-form-model-item>
              <a-form-model-item prop="name"  required label="身份证号码">
                <a-input v-model="formData.userCars" />
              </a-form-model-item>
              <a-form-model-item prop="name"  required label="工作时限(合同期)">
                <a-input v-model="formData.workScheduleTolerance" />
              </a-form-model-item>
              <a-form-model-item prop="mobile" required label="手机号码">
                <a-input v-model="formData.mobile" />
              </a-form-model-item>
              <a-form-model-item prop="name"  required label="家庭住址">
                <a-input v-model="formData.address" />
              </a-form-model-item>
              <a-form-model-item prop="name"  required label="性别">
                <a-radio-group v-model="formData.sex">
                  <a-radio value="男">
                    男
                  </a-radio>
                  <a-radio value="女">
                    女
                  </a-radio>
                </a-radio-group>
              </a-form-model-item>
              <a-form-model-item prop="name"  required label="出生日期">
                <a-input v-model="formData.birthday" />
              </a-form-model-item>
              <a-form-model-item prop="name"  required label="在职状态">
                <a-select v-model="formData.positionStatus" placeholder="please select your zone">
                  <a-select-option value="在职">
                    在职
                  </a-select-option>
                  <a-select-option value="离职">
                    离职
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item prop="name"  required label="银行">
                <a-input v-model="formData.bank " />
              </a-form-model-item>
              <a-form-model-item prop="name"  required label="银行卡号">
                <a-input v-model="formData.bankCard" />
              </a-form-model-item>
              <a-form-model-item prop="name"  required label="部门">
                <a-select v-model="formData.department" placeholder="please select your zone">
                  <a-select-option value="技术">
                    技术
                  </a-select-option>
                  <a-select-option value="销售">
                    销售
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item prop="name"  required label="入职日期">
                <a-input v-model="formData.entryTime" />
              </a-form-model-item>
              <a-form-model-item prop="name"  required label="岗位">
                <a-input v-model="formData.station" />
              </a-form-model-item>
              <a-form-model-item label="合同开始时间">
                <a-input v-model="formData.contractStartDate" />
              </a-form-model-item>
              <a-form-model-item label="合同结束时间">
                <a-input v-model="formData.contractEndDate" />
              </a-form-model-item>
              <!-- <a-form-item label="Instant delivery">
                <a-switch v-model="form.delivery" />
              </a-form-item> -->
              <!-- <a-form-item label="Activity type">
                <a-checkbox-group v-model="form.type">
                  <a-checkbox value="1" name="type">
                    Online
                  </a-checkbox>
                  <a-checkbox value="2" name="type">
                    Promotion
                  </a-checkbox>
                  <a-checkbox value="3" name="type">
                    Offline
                  </a-checkbox>
                </a-checkbox-group>
              </a-form-item> -->
              <a-form-model-item label="合同备注">
                <a-input v-model="formData.contractRemarks" type="textarea" />
              </a-form-model-item>
              <a-form-model-item label="离职日期">
                <a-input v-model="formData.departure" />
              </a-form-model-item>
              <a-form-model-item label="学历信息">
                <a-select v-model="formData.education" placeholder="please select your zone">
                  <a-select-option value="初中">
                    初中
                  </a-select-option>
                  <a-select-option value="高中">
                    高中
                  </a-select-option>
                  <a-select-option value="大专">
                    大专
                  </a-select-option>
                  <a-select-option value="本科">
                    本科
                  </a-select-option>
                  <a-select-option value="硕士">
                    硕士
                  </a-select-option>
                  <a-select-option value="博士">
                    博士
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="专业">
                <a-input v-model="formData.major" />
              </a-form-model-item>
              
              <a-form-model-item label="毕业院校">
                <a-input v-model="formData.univesity" />
              </a-form-model-item>
              <!-- <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" @click="onSubmit">
                  Create
                </a-button>
                <a-button style="margin-left: 10px;">
                  Cancel
                </a-button>
              </a-form-model-item> -->
            </a-form-model>
          </a-modal>
      </div>
      <a-table :customRow="rowClick" :columns="columns" :rowKey="record=>record.id"  :data-source="staffTable" :loading="tableLoading">
        <!-- <a slot="action" slot-scope="" href="javascript:;">Delete</a> -->
        <p slot="expandedRowRender" slot-scope="record"  style="margin: 0">
          <!-- 专业：{{ record.major }} | 在职状态：{{ record.positionStatus
          }}<br />毕业院校：{{ record.univesity }}<br /> -->
          <a-descriptions title="详细信息">
        <a-descriptions-item label="出生日期">
          {{ record.birthday }}
        </a-descriptions-item>
        <a-descriptions-item label="身份证号">
          {{ record.userCard }}
        </a-descriptions-item>
        <a-descriptions-item label="学历">
          {{ record.education }}
        </a-descriptions-item>
        <a-descriptions-item label="毕业院校">
          {{ record.univesity }}
        </a-descriptions-item>
        <a-descriptions-item label="专业">
          {{ record.major }}
        </a-descriptions-item>
        <a-descriptions-item label="入职时间">
          {{ record.entryTime }}
        </a-descriptions-item>
        <a-descriptions-item label="工作时限/(合同期)">
          {{ record.workScheduleTolerance }}年
        </a-descriptions-item>
        <a-descriptions-item label="开户银行">
          {{ record.bank }}
        </a-descriptions-item>
        <a-descriptions-item label="银行卡号">
          {{ record.bankCard }}
        </a-descriptions-item>
        <a-descriptions-item label="家庭住址">
          {{ record.address }}
        </a-descriptions-item>
        <a-descriptions-item label="合同开始时间">
          {{ record.contractStartDate }}
        </a-descriptions-item>
        <a-descriptions-item label="合同结束时间">
          {{ record.contractEndDate }}
        </a-descriptions-item>
        <a-descriptions-item label="合同备注">
          {{ record.contractRemarks == null ||record.contractRemarks == '' ? "暂无":record.contractRemarks }}
        </a-descriptions-item>
        <a-descriptions-item label="离职日期">
          {{ record.departure == null || record.departure =='' ? "暂无":record.departure }}
        </a-descriptions-item>
          </a-descriptions>
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
 * 2020年12月30日     Bai           v1.0.0              新建<br>
 * 2020年12月31日     Bai           v1.1.0              修改template中表格展开部分内容，使用 Descriptions 描述列表 (版本: 1.5.0+) 描述列表 替换原有字符串<br>
 */
import axios from "axios";
import {validateMobile , validateIdCard} from "@/assets/js/vaildate.js";
// 引入系统模块'qs'
import qs from 'qs';
// 手机验证规则
var validatorMobile = (rule,value,callback) =>{
  if(!value) {
    return callback(new Error('手机号码不能为空'))
  } else {
    if(validateMobile(value)) {
      callback()
    } else {
      return callback(new Error('手机号码格式不正确'))
    }
  }
};
/* 本页属性 表格列头*/
const columns = [
  // { title: "ID", dataIndex: "id", key: "id" },
  { title: "员工编号", dataIndex: "staffCode", key: "staffCode" },
  { title: "姓名", dataIndex: "name", key: "name" },
  { title: "性别", dataIndex: "sex", key: "sex" },
  { title: "岗位", dataIndex: "station", key: "station" },
  { title: "部门", dataIndex: "department", key: "department" },
  { title: "移动电话", dataIndex: "mobile", key: "mobile" },
  { title: "在职状态", dataIndex: "positionStatus", key: "positionStatus"},
];
/* 本页属性 表格数据源*/
var staffTable = [];

/**
 *
 * @Function: staff.vue
 * @Description: 对外暴露数据
 *
 * @return：name,data(),created()
 * @throws：异常描述
 *
 * @version: v1.0.0
 * @author: Bai
 * @date: 2020年12月30日 上午10:28:46
 *
 * Modification History:<br>
 * Date              Author          Version            Description
 *----------------------------------------------------------------*<br>
 * 2020年12月30日       Bai          v1.0.0           新建<br>
 * 2021年1月21日10:05     qcc        v1.1.0          添加员工信息模块完成
 */
export default {
  /**
   * name:组件名称
   */
  name: "staff",
  data() {
    return {
      //表格数据源
      staffTable,
      //列头基础信息
      columns,
      //表格加载状态动画
      tableLoading: true,
      //logog图片地址
      imgUrl: require("@/assets/logo.png"),
      // 模态框显示控制
      addEmployeesVisible: false,
      // 模态框表格数据
      formData: {
        address:'',   // 家庭住址
        bank:'',       // 银行 
        bankCard:'',       // 银行卡号
        birthday:'',       // 出生日期 
        contractEndDate:'',       // 合同结束时间 
        contractRemarks:'',       // 合同备注 
        contractStartDate:'',       // 合同开始时间 
        department :'',       // 部门
        departure:'',       // 离职日期
        education:'',       //  学历信息
        entryTime :'',       // 入职时间
        major:'',       // 专业
        mobile:'',         // 电话
        name :'',         // 姓名
        positionStatus:'',      // 在职状态
        sex :'',      // 性别
        staffCode :'',      // 员工编号
        station :'',      // 岗位
        univesity:'',      // 毕业院校
        userCard :'',      // 身份证号码
        workScheduleTolerance  :'',      // 工作时限(合同期)
      },
       // 表单数据验证
        ruleForm:{
          mobile:"",     // 手机号码
          name:'',       // 姓名
          userCard:'',     // 身份证号码
          birthday:'',     // 出生日期
          department:'',      //部门
          entryTime:'',      //入职时间
          positionStatus:'',     //在职状态
          sex:'',        // 性别
          staffCode:'',     //员工编号
          station:'',     // 岗位
          workScheduleTolerance:'',    // 工作年限
        },
        // 验证规则(对应a-form-model上的rules)
        rules:{
          mobile:[{validator: validatorMobile,trigger:"blur"}],
          name:[ { required: true, message: "姓名不能为空", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }],
          userCard:[ { required: true, message: "身份证不能为空", trigger: "blur" },
          { min: 18, max: 18, message: "长度在18个字符", trigger: "blur" }],
          birthday:[{ required: true, message: "出生日期不能为空", trigger: "blur" }],
          department:[{ required: true, message: "部门不能为空", trigger: "blur" }],
          entryTime:[{ required: true, message: "入职时间不能为空", trigger: "blur" }],
          positionStatus:[{ required: true, message: "在职状态不能为空", trigger: "blur" }],
          sex:[{ required: true, message: "性别不能为空", trigger: "blur" }],
          staffCode:[{ required: true, message: "员工编号不能为空", trigger: "blur" }],
          station:[{ required: true, message: "岗位不能为空", trigger: "blur" }],
          workScheduleTolerance:[{ required: true, message: "工作时限不能为空", trigger: "blur" }],
        }
    };
  },
  created() {
    //设置vue对象
    // var then = this;
    // //异步访问staff数据
    // /** 利用反向代理访问地址 **/
    // axios
    //   .get("/api/findAll")
    //   .then(function (response) {
    //     //获取响应结果
    //     var res = response.data;
    //     /* 响应正常，数据正常/数据异常 */
    //     if (response.status == 200) {
    //       //更改装载动画状态
    //       then.tableLoading = false;
    //     }
    //     //更新数据
    //     then.staffTable = res;
    //   })
    //   .catch(function (err) {
    //     //响应异常处理方式
    //     then.tableLoading = false;
    //   });
    this.GetFindAll()
  },
  methods:{
    // 点击表格某一行，拿到某一行的数据
    rowClick(record, index){
      return {
        on: {
          click: () => {
            console.log(record,index)
            //指定跳转地址
            this.$router.push({path:'/employeeMessage',query:{staffCode :record.staffCode }})
          }
        }
      }
    },
    // 获取员工数据
    GetFindAll() {
      var then = this;
      axios
      .get("/api/findAll")
      .then(function (response) {
        //获取响应结果
        var res = response.data;
        /* 响应正常，数据正常/数据异常 */
        if (response.status == 200) {
          //更改装载动画状态
          then.tableLoading = false;
        }
        //更新数据
        then.staffTable = res;
      })
      .catch(function (err) {
        //响应异常处理方式
        then.tableLoading = false;
      });
    },
    // 添加员工信息
    addEmployees() {
        this.addEmployeesVisible = true
    },
    // 模态框点击确定按钮
    addEmployeesHandleOk(e) {
        // console.log(e);
        // 验证是否通过
        console.log(this.$refs);
        this.$refs['ruleForm'].validate(valid=>{
          if(!valid) {
            return
          } else {
            // 模态框关闭
            this.addEmployeesVisible = false
            // 添加员工信息 设置请求头，使用fs进行数据转换
            axios.post('/api/addStaff',qs.stringify(this.formData))
            .then(res=>{
              console.log(res);
              // 请求成功重新加载请求数据
              this.GetFindAll()
            }).catch(err=>{
              console.log(err);
            })
          }
        })
        
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* 按钮相关 */
.btn {
  height: 50px;
  background-color: #fff;
}
/* 添加人员按钮 */
.btn .ant-btn {
  float:left;
}
</style>