<template>
  <div class="containeres">
    <div class="display_flex between header_title padding_20 m-b-20">
      <div class>新增读者</div>
      <div class="display_flex">
        <el-button-group>
          <el-button type="primary" plain class="add m-r-20" icon='el-icon-printer' @click="prant">打印</el-button>
          <el-button type="primary" plain class="add m-r-20" icon='el-icon-collection' @click="save('form')">保存
          </el-button>
          <el-button type="primary" plain icon="el-icon-back" @click="back">返回</el-button>
        </el-button-group>
      </div>
    </div>
    <div class="padding_20">
      <div class="title_text m-b-20">
        <span>读者照片</span>
        <!-- <span style="margin-left: 535px;">读者指纹</span> -->
      </div>
      <div class="m-b-80 display_flex start" style="width: 500px;" v-if="this.form.status !== 'LOGOUT'">
        <div class="display_flex start m-r-20">
          <div>上传图片：</div>
          <up-load @getImg="getImg" :headImg="photo" class='userPhoto'></up-load>
        </div>
        <div class="display_flex start">
          <div>拍照：</div>
          <el-button type="primary" @click="usePhoto">打开摄像机</el-button>
        </div>
      </div>
      <div class="m-b-80 display_flex start" v-else>
        <img style="width: 180px;height: 180px;object-fit: cover" :src="photo">
      </div>
        <!-- 指纹功能页面start -->
      <!-- <div class="m-b-80 display_flex start"
        v-if="this.form.isUploadFingerprint == false || this.form.isUploadFingerprint == undefined"
        style="margin-left: 600px;transform: translateY(-260px);">
        <div class="display_flex start m-r-20">
          <div>指纹采集：</div>
          <img src="../../../../../src/assets/img/nothave_fingerprint.png" style="height: 202px;"></img>
        </div>
        <div class="display_flex start">
          <el-button type="primary" @click="getFingerprint">指纹采集</el-button>
        </div>
      </div>
      <div class="m-b-80 display_flex start" v-else style="margin-left: 600px;transform: translateY(-260px);">
        <div class="display_flex start m-r-20">
          <div>指纹采集：</div>
          <img src="../../../../../src/assets/img/have_fingerprint.png" style="height: 180px;"></img>
        </div>
        <div class="display_flex start">
          <el-button type="primary" @click="getFingerprint" disabled>指纹采集</el-button>
        </div>
      </div> -->
      <!-- <div class="title_text m-b-30" style="transform: translateY(-260px);">读者信息</div>
      <view-form ref="form" :row="3" :list="titleList" :rule="rules" class=" m-b-80" :model='model' @getForm='getForm'
        style="transform: translateY(-260px);"></view-form> -->
        
    <!-- 指纹功能页面end -->
    <div class="title_text m-b-30" >读者信息</div>
      <view-form ref="form" :row="3" :list="titleList" :rule="rules" class=" m-b-80" :model='model' @getForm='getForm'></view-form>
    </div>

    <!-- 弹框 -->
    <el-dialog title="读者打印" :visible.sync="Model" width="30%" :close-on-click-modal='false' @close='close'>
      <el-checkbox-group v-model="prantList" :max="3">
        <el-checkbox class="w-25 m-b-10" v-for="item of printList" :key='item.id' :label="item.id">{{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Model = false">取 消</el-button>
        <el-button type="primary" @click="jump">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 弹框 -->
    <el-dialog v-loading="loadingZhiWen" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)" title="指纹采集" :visible.sync="zhiwenModerl" width="40%"
      :close-on-click-modal='false' @close='closezhiwen()'>
      <div>
        <span style="margin-left: 65px">第一次录入</span>
        <span style="margin-left: 145px">第二次录入</span>
        <span style="margin-left: 150px">第三次录入</span>
      </div>
      <img v-if="this.fingerprintImage0 != ''" :src="fingerprintImage0" style="width: 200px;"></img>
      <img v-else src="../../../../../src/assets/img/collected.png" style="width: 200px;"></img>
      &nbsp;&nbsp;&nbsp;
      <img v-if="this.fingerprintImage1 != ''" :src="fingerprintImage1" style="width: 200px;"></img>
      <img v-else src="../../../../../src/assets/img/collected.png" style="width: 200px;"></img>
      &nbsp;&nbsp;&nbsp;
      <img v-if="this.fingerprintImage2 != ''" :src="fingerprintImage2" style="width: 200px;"></img>
      <img v-else src="../../../../../src/assets/img/collected.png" style="width: 200px;"></img>
      <div v-if="this.errorReminder == true">
        <i class="el-icon-warning" style="color: brown;"></i> 请按同一根手指三次
      </div>
      <div v-if="this.successReminder == true">
        <i class="el-icon-success" style="color:darkgreen;"></i> 录入成功，点击确认保存
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closezhiwen()">取 消</el-button>
        <el-button v-if="this.whetherSuccessful == false" type="primary" disabled>确 定</el-button>
        <el-button v-else type="primary" @click="updateFingerprint()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 弹框 -->
    <el-dialog title="拍照" :visible.sync="photoModel" width="340px" :close-on-click-modal='false' :show-close="false"
      :modal="false" @close='close'>
      <div id="video" class="video-box" v-loading="ploadings">
        <video ref="cam" id="inputVideo" autoplay muted playsinline :width="videoWidth" style="object-fit: cover"
          v-if="videoShow" :height="videoHeight" />
        <canvas id="my-overlay"
          style="width:300px;height:300px;position: absolute;top:85px;left: 20px;z-index: 2;object-fit: cover" />
        <canvas style="display: none" :width="videoWidth" :height="videoHeight" />
        <!--          <div v-if="photoShow" class="img_bg_camera">-->
        <!--            <img :src="photo" alt="" class="tx_img">-->
        <!--          </div>-->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="photoOff">取 消</el-button>
        <el-button type="primary" @click="setImage">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import upLoad from '../../upLoad';
import viewForm from '../../../view/form';
import * as faceapi from 'face-api.js';
import listInfoVue from '../finance/listInfo.vue';
import { PredictAllFaceExpressionsTask } from 'face-api.js/build/commonjs/globalApi/PredictFaceExpressionsTask';

export default {
  components: {
    upLoad,
    viewForm
  },
  data() {
    return {
      bus: this.bus(this),
      form: {},
      ploadings: false,
      videoShow: true,
      photoShow: false,
      videoWidth: 300,
      videoHeight: 300,
      videoEl: null,
      canvasEl: null,
      cam: null,
      timeout: 0,
      faceapiOptions: null,
      photoModel: false,
      zhiwenModerl: false,
      mediaStreamTrack: null,
      Model: false,
      prantList: ['number', 'certificateType', 'readerTypeId'],
      rfId: '',
      photo: '',
      show: true,
      rules: {
        number: [{ required: true, message: '请输入', trigger: 'blur' }],
        readerTypeId: [{ required: true, message: '请选择', trigger: 'change' }],
        // certificateType: [{ required: true, message: '请选择', trigger: 'change' }],
        status: [{ required: true, message: '请选择', trigger: 'change' }],
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        start: [{ required: true, message: '请选择', trigger: 'change' }],
        end: [{ required: true, message: '请选择', trigger: 'change' }],
        password: [{ required: true, message: '请输入', trigger: 'blur' }],
      },
      printList: [],
      titleList: [
        { name: '读者证号', id: 'number' },
        { name: '证件类型', id: 'certificateType', type: 'select', options: [] },
        { name: '历史违章次数', id: 'historicalViolation', placeholder: true, disable: true },

        { name: '读者类型', id: 'readerTypeId', relation: 'readerTypeName', type: 'select', options: [] },
        { name: '读者证件证号', id: 'certificateNumber', max: '18', type: 'certificateNumber' },
        { name: '当前违章次数', id: 'currentViolation', placeholder: true, disable: true },

        { name: '状态', id: 'status', type: 'select', options: [] },
        { name: 'IC卡号', id: 'rfId', placeholder: true, disable: true },
        { name: '借阅次数', id: 'borrowNumber', placeholder: true, disable: true },


        { name: '读者姓名', id: 'name' },
        { name: '出生日期', id: 'birthday', type: 'times' },
        { name: '预约次数', id: 'documentAppointmentNumber', placeholder: true, disable: true },

        { name: '启用日期', id: 'start', type: 'times' },
        { name: '单位名称', id: 'readerUnitNameTree', type: 'selectTree', options: [] },
        { name: '欠款', id: 'arrears', disable: true, placeholder: true, },

        { name: '截止日期', id: 'end', type: 'times' },
        { name: '邮箱', id: 'mailbox' },
        { name: '押金', id: 'deposit', disable: true, placeholder: true, },

        { name: '密码', id: 'password', type: 'password' },
        { name: '性别', id: 'gender', type: 'select', options: [] },
        { name: '续借次数', id: 'renewNumber', disable: true, placeholder: true, },

        { name: '手机', id: 'phone' },
        { name: '联系地址', id: 'address' },
        { name: '读者所属馆', id: 'libraryName', disable: true, placeholder: true, },

        { name: '电话', id: 'telephone' },

        { name: '备注', id: 'note' },

        { name: '办证日期', id: 'createTime', type: 'times', disable: true },
      ],
      model: {},
      noDisableList: [],
      noTilteList: [],
      websocket: null,
      loadingZhiWen: false,
      fingerprintImage0: "",
      fingerprintImage1: "",
      fingerprintImage2: "",
      errorReminder: false,
      successReminder: false,
      whetherSuccessful: false,
      fingerprintServicesUrl: "127.0.0.1:8155"
    };
  },
  created() {
    //指纹链接wb   start
    // this.setupWebSocket()
    //指纹链接wb   end
    this.noTilteList = this.titleList.filter(it => !it.disable);  //过滤出来非默认禁用的
    this.getInfo()
    this.metaList()
    if (this.$route.query.id) {
      this.getRead(this.$route.query.id)
    }
    this.faceapiOptions = new faceapi.SsdMobilenetv1Options({ minConfidenceFace: 0.5 });

    // configure face API
    faceapi.env.monkeyPatch({
      Canvas: HTMLCanvasElement,
      Image: HTMLImageElement,
      ImageData: ImageData,
      Video: HTMLVideoElement,
      createCanvasElement: () => document.createElement('canvas'),
      createImageElement: () => document.createElement('img')
    });
  },
  mounted() {
    faceapi.nets.ssdMobilenetv1.load('/data').then(() => {
      faceapi.loadFaceExpressionModel('/data').then()

    })
  },
  beforeDestroy() {
    try {
      window.BlueWhale.close();
    } catch (error) {

    }
    // this.$blue.closeReader()
    // this.$blue.closeReaderCard()
  },
  methods: {
    setupWebSocket() {
      this.websocket = new WebSocket("ws://" + this.fingerprintServicesUrl + "/websocket"); // 创建WebSocket连接
      this.websocket.onopen = this.onWebSocketOpen; // WebSocket连接打开时的处理函数
      this.websocket.onmessage = this.onWebSocketMessage; // 收到WebSocket消息时的处理函数
      this.websocket.onclose = this.onWebSocketClose; // WebSocket连接关闭时的处理函数
    },
    onWebSocketOpen() {
      console.log("链接成功");
    },
    closeWebSocket() {
      if (this.websocket) {
        this.websocket.close(); // 关闭WebSocket连接
      }
    },
    onWebSocketMessage(event) {
      const message = event.data;
      // 处理从服务器接收的消息
      console.log('ws接受到的消息:', message);
      if (message == "fingerprint0") {
        this.fingerprintImage0 = "http://" + this.fingerprintServicesUrl + "/finger/fingerprint0.bmp"
      }
      if (message == "fingerprint1") {
        this.fingerprintImage1 = "http://" + this.fingerprintServicesUrl + "/finger/fingerprint1.bmp?" + Math.random()
      }
      if (message == "fingerprint2") {
        this.fingerprintImage2 = "http://" + this.fingerprintServicesUrl + "/finger/fingerprint2.bmp?" + Math.random()
        this.successReminder = true
        this.whetherSuccessful = true
        this.errorReminder = false
      }
      if (message == "请按同一个手指三次报名") {
        this.errorReminder = true
        this.successReminder = false
      }
    },
    async detectExpressions() {
      const result = await faceapi.detectSingleFace(this.cam, this.faceapiOptions)
        .withFaceExpressions()
      const canvas = document.getElementById('my-overlay')
      if (result) {
        const dims = faceapi.matchDimensions(canvas, this.cam, true)
        const resizedResult = faceapi.resizeResults(result, dims)
        faceapi.draw.drawDetections(canvas, resizedResult)
      } else {
        canvas
          .getContext("2d")
          .clearRect(0, 0, canvas.width, canvas.height);
      }
      this.timeout = setTimeout(() => this.detectExpressions());
    },
    usePhoto() {
      // this.photoShow = false;

      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        this.$message.error('请到浏览器设置中手动打开摄像头权限')
      } else {
        this.ploadings = true;
        navigator.mediaDevices.enumerateDevices().then(data => {
          this.$nextTick(() => {
            let list = data.filter((it) => {
              return it.kind == "videoinput"
            });
            if (!list || !list.length) {
              this.$message.error("未找到摄像头");
              this.ploadings = false;
              return;
            }
            this.photoModel = true;
            navigator.mediaDevices
              .getUserMedia({
                // video: {
                //   deviceId: {
                //     exact: list[0].deviceId,
                //   },
                // },
                video: true
              }).then((stream) => {
                this.videoShow = true;
                let video = document.querySelector("#video video");
                video.srcObject = stream;
                this.ploadings = false
                this.mediaStreamTrack = stream;
                new Promise((resolve) => {
                  this.$refs.cam.onloadedmetadata = () => {
                    resolve(video)
                  }
                }).then(video => {
                  this.cam = video;
                  setTimeout(this.detectExpressions, 1000)
                })
              }).catch(err => {
                this.$message.error('请到浏览器设置中手动打开摄像头权限')
                this.ploadings = false
              })
          })
        })
      }
    },

    getFingerprint() {
      this.zhiwenModerl = true;
      this.loadingZhiWen = true
      setTimeout(function () {
        this.loadingZhiWen = false
      }, 5000);
      this.ax.get("http://" + this.fingerprintServicesUrl + "/zk/fingerInit")
        .then(res => {
          console.log("打开指纹设备成功")
          this.ax.get("http://" + this.fingerprintServicesUrl + "/zk/enroll?platformId=" + JSON.parse(localStorage.getItem("user")).platform.id + '&readerId=' + this.form.id)
            .then(res => {
              console.log("注册指纹成功")
              this.loadingZhiWen = false
            }).catch(err => {
              this.$message.error('注册指纹失败')
              this.loadingZhiWen = false
            })
        }).catch(err => {
          this.$message.error('打开指纹设备失败，请刷新重试')
          this.loadingZhiWen = false
          this.ax.get("http://" + this.fingerprintServicesUrl + "/zk/close")
            .then(res => {
              console.log("关闭指纹设备成功")
            }).catch(err => {
              this.$message.error('关闭指纹设备失败')
              this.loadingZhiWen = false
            })
        })

    },
    closezhiwen() {
      this.zhiwenModerl = false
      this.ax.get("http://" + this.fingerprintServicesUrl + "/zk/close")
        .then(res => {
          console.log("关闭指纹设备成功")
        }).catch(err => {
          this.$message.error('关闭指纹设备失败')
        })
      this.fingerprintImage0 = ""
      this.fingerprintImage1 = ""
      this.fingerprintImage2 = ""
      this.successReminder = false
      this.whetherSuccessful = false
      this.errorReminder = false
    },
    updateFingerprint() {
      this.form.isUploadFingerprint = true
      this.zhiwenModerl = false
      this.successReminder = false
      this.whetherSuccessful = false
      this.errorReminder = false
      this.ax.get("http://" + this.fingerprintServicesUrl + "/zk/close")
        .then(res => {
          console.log("关闭指纹设备成功")
        }).catch(err => {
          this.$message.error('关闭指纹设备失败')
        })
      this.fingerprintImage0 = ""
      this.fingerprintImage1 = ""
      this.fingerprintImage2 = ""
    },
    dataURLtoFile(dataurl, filename) { //将base64转换为文件
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    pictrue() {
      let canvas = document.getElementsByTagName("canvas")[1];
      let video = document.getElementsByTagName("video")[0];

      let v = document.getElementById("video");
      let vInfo = v.getBoundingClientRect();
      canvas.width = this.videoWidth;
      canvas.height = this.videoHeight;
      canvas.style.objectFit = "cover";
      let context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, this.videoWidth, this.videoHeight);
      clearInterval(this.interval);
      let file = this.dataURLtoFile(canvas.toDataURL("image/png"), 'jpg')
      this.upload(file);

    },
    setImage() {
      this.pictrue()
      clearTimeout(this.timeout);
      this.mediaStreamTrack.getTracks()[0].stop();
    },
    // usePhoto(){
    //
    //   try {
    //     this.photoModel = true;
    //   // window.BlueWhale.takePicture(res=>{
    //   //           let data = 'data:image/png;base64,'+res
    //   //
    //   //           let file = this.dataURLtoFile(data,'jpg')
    //   //           //  // console.log(file)
    //   //           this.upload(file)
    //   //           this.$message.success('拍照成功');
    //   //       })
    //    } catch (error) {
    //         this.$message.error('请在图书馆程序内使用');
    //    }
    // },
    photoOff() {
      this.photoModel = false
      clearTimeout(this.timeout);
      this.mediaStreamTrack && this.mediaStreamTrack.getTracks()[0].stop();
    },


    upload(res) {
      let param = new FormData(); //创建form对象
      param.append('file', res, res.name);//通过append向form对象添加数据
      param.append('type', 1);//添加form表单中其他数据

      let config = {
        headers: { 'Content-Type': 'multipart/form-data', accessToken: JSON.parse(localStorage.getItem("user")).token },
      };
      this.ax.post('/other/uploadFile', param, config)
        .then(res => {
          this.photo = res;
          this.photoModel = false;
          this.$message.success('拍照成功')

        }).catch(err => {
          this.$message.error('拍照失败')
        })
    },
    jump() {
      if (this.prantList.length != 3) {
        return this.$message.error('请选择3条参数');
      }
      this.$router.push({
        path: 'prantUser',
        query: {
          info: JSON.stringify([this.form]),
          check: JSON.stringify(this.prantList),
          data: JSON.stringify(this.printList)
        }
      })
    },

    close() {
    },

    getReadId() {
      window.BlueWhale.readPatron((cardId) => {
        if (this.show) {
          this.show = false
          setTimeout(() => {
            this.show = true
          }, 3000);
          if (this.form.rfId == undefined || this.form.rfId == '') {
            this.form.rfId = cardId
            this.$message.success('读取成功');
            // console.log(this.form)
          } else if (this.form.rfId != cardId) {
            //  this.$message.warning('当前读者已经绑定过卡');
          }

        }


        // this.rfId = cardId
        // this.$message.success('读取成功');
        // if(this.form.rfId==undefined){
        //          this.form.rfId = cardId
        //          this.$message.success('读取成功');
        // }else if(this.show){
        //     this.show=false
        //      this.$message.warning('当前读者已经绑定过卡');
        //      setTimeout(res=>{
        //           this.show=true
        //      },3000)
        // }
      });
    },
    getImg(val) {
      console.log(val);
      this.photo = val;
    },
    getRead(id) {
      this.ax.get('/manage/unit/circulation/readerManagement/readerDetail', { params: { id } })
        .then(res => {

          if (res.status === 'LOGOUT') {
            this.noTilteList.map(it => {
              if (it.id !== 'status') {
                it.disable = true;
              }
            })
          }
          this.noDisableList = this.noTilteList;

          this.model = res
          this.form = res
          this.photo = res.photo
          this.getReadId()
        })
    },
    // 读者类型
    getInfo() {
      this.ax.get('/manage/unit/circulation/readerManagement/doCertificateForInsertReader')
        .then(res => {
          if (!this.$route.query.id) {
            res.reader.start = new Date().getTime()
            res.reader.readerTypeId = res.readerTypes[0].id
            this.getReaderType(res.readerTypes[0].name)
            this.model = res.reader
            this.form = res.reader
          }


          this.titleList[3].options = res.readerTypes;
          this.titleList[13].options = res.readerUnits.map(it => {
            return { name: it.name, id: it.name }
          })
          // this.titleList[]

        })
    },
    getReaderType(name) {
      let params = {
        platformId: JSON.parse(localStorage.getItem("user")).platform.id,
        page: 0,
        size: 999,
        name
      }
      this.ax.get('/manage/unit/circulation/circulationParameters/readerType', { params }).then(res => {
        if (res.content[0].effectiveDay) {
          this.model.end = new Date().getTime() + (res.content[0].effectiveDay * 86400000)
          this.form.end = new Date().getTime() + (res.content[0].effectiveDay * 86400000)
        }
      })
    },
    getForm(val) {
      this.getReaderType(val.readerTypeName)
      this.form = val
      if (this.form.readerTypeId) {
        this.titleList[3].options.forEach(it => {
          if (it.id == this.form.readerTypeId) {
            this.form.deposit = it.deposit;
          }
        });
      }


      (this.$route.query.id ? this.noDisableList : this.noTilteList).map(it => {
        if (it.id !== 'status') {
          if (val.status !== 'LOGOUT') {
            it.disable = false;
          } else {
            it.disable = true;
          }
        }
      })
      if (val.certificateType === 'ID_CARD' && val.certificateNumber) {
        if (!this.$filters.checkIdCard(val.certificateNumber)) {
          this.$message.error('输入的身份证号不正确')
        } else {
          let num = parseInt(val.certificateNumber.substr(-2, 1));
          this.form.gender = num % 2 === 0 ? "FEMALE" : "MALE"
        }
      }
    },
    //查询读者借还记录
    async searchReaders() {
      let params = {
        readerNumber: this.$route.query.readerNumber,
        barCode: '',
        platformId: JSON.parse(localStorage.getItem("user")).platform.id,
        borrowingInquiry: true
      }
      return await this.ax
        .get('/manage/unit/circulation/circulationManagement/literatureReader', { params })
    },
    //查询读者超期记录
    async getOver() {
      let params = {
        platformId: JSON.parse(localStorage.getItem("user")).platform.id,
        page: 0,
        size: 1,
        readerNumber: this.$route.query.readerNumber
      }
      return await this.ax.get('manage/unit/circulation/circulationManagement/borrowingInformation', { params })
    },
    //查询是否有未交的罚款
    async searchFine() {
      let params = {
        number: this.$route.query.readerNumber,
        page: 0,
        size: 1,
        chargeStatus: 'UNPAID',
        platformId: JSON.parse(localStorage.getItem("user")).platform.id,
      }
      return await this.ax
        .get('/manage/unit/circulation/financeManagement/finance', { params })
    },
    // 新增保存
    async save(formName) {
      console.log(this.$route.query.readerNumber, '--this.$route.query.readerNumber');
      let result = this.$route.query.readerNumber && await this.searchReaders();
      if (this.$route.query.readerNumber && result.borrowingInformationList.length != 0 && this.model.number != this.$route.query.readerNumber) {
        return this.$message.error('当前读者有图书未归还，不能修改读者证号！')
      }
      let overRes = this.$route.query.readerNumber && await this.getOver();
      if (this.$route.query.readerNumber && overRes.content.length != 0 && this.model.number != this.$route.query.readerNumber) {
        return this.$message.error('当前读者有图书已超期，不能修改读者证号！')
      }

      let fires = this.$route.query.readerNumber && await this.searchFine()
      if (this.$route.query.readerNumber && fires.content.length != 0 && this.model.number != this.$route.query.readerNumber) {
        return this.$message.error('当前读者有未支付的罚款，不能修改读者证号！')
      }

      if (this.form.phone && !this.$filters.checkPhone(this.form.phone)) {
        return this.$message.error('输入的手机号码格式不正确')
      }
      this.loading();
      // this.ruleForm.roles = this.mapList();
      // this.form.permissions = this.pushSelect()
      this.form.platformId = JSON.parse(localStorage.getItem('user')).platform.id;
      this.form.photo = this.photo
      this.form.presenceStatus = 1
      let user =JSON.parse(localStorage.getItem('user'))
      this.form.managerName = user.info.name
      this.form.managerId = user.info.id
      // if(this.form.rfId==''){
      //     this.form.rfId = this.rfId
      // }else{

      // }
      // console.log(this.form)
      
      this.form.readerUnitName = this.form.fatherName
      this.$refs[formName].$refs[formName].validate(valid => {
        if (valid) {
          this.sloading();
          this.ax
            .post('/manage/unit/circulation/readerManagement/reader', this.form)
            .then(res => {
              this.sloading();
              this.bus.$emit(`flash_/manage/unit/circulation/readerManagement/reader`, res);
              this.$message.success('保存成功');
              this.$router.push("/circulation/reader/index");
            })
            .catch(res => {
              this.sloading();
            });
        } else {
          this.sloading();
          this.$message.error('请根据提示输入');
          return false;
        }

      });
    },
    // 获取meta
    metaList() {
      this.ax.get('/manage/meta', { params: { path: 'com.cq1080.library.cluster.bean.entity.Reader' } }).then(res => {
        res.insertable = false
        res.subs.map(it => {
          if (it.key == 'certificateType') {
            this.titleList[1].options = it.searchOption.map(it => {
              return { id: it.key, name: it.name }
            })
          }
          if (it.key == 'status') {
            this.titleList[6].options = it.searchOption.map(it => {
              return { id: it.key, name: it.name }
            })
          }
          if (it.key == 'gender') {
            this.titleList[19].options = it.searchOption.map(it => {
              return { id: it.key, name: it.name }
            })
          }
        });
        // console.log(res);
        // this.meta = res;
      });
    },

    // 打印
    prant() {
      this.Model = true
      let names = ['历史违章次数', '当前违章次数', '借阅次数', '预约次数', '欠款', '押金', '密码', '续借次数', '读者所属馆']
      this.printList = this.titleList.filter(item => {
        return names.indexOf(item.name) == -1
      })
    },
  }
};
</script>

<style scoped>
.title_text {
  height: 22px;
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
  color: rgba(0, 0, 0, 1);
}
</style>
