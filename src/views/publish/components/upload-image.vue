<template>
  <div>
    <div class="box-wrap" @click="handleShowMediaBox">
      <p>点击选择图片</p>
      <i
        style="margin-top: 20px;
        font-size: 90px; color: #eee;"
        class="iconfont icon-image_upload"
      ></i>
      <img width="120" src="http://toutiao.meiduo.site/FvGUrO7Ru_T2ToQwn_OznfwKnjoL">
    </div>

    <!-- 对话框 -->
    <el-dialog
      title="素材"
      :visible.sync="dialogVisible"
      width="30%">
      <el-tabs value="first">
        <el-tab-pane label="上传图片" name="first">
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :headers="{ Authorization: `Bearer ${$store.state.user.token}` }"
            name="image"
            :on-success="handleUploadSuccess"
            :show-file-list="false">
            <!-- 上传成功，要预览的图片 -->
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="媒体库" name="second">媒体库</el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- /对话框 -->
  </div>
</template>

<script>
export default {
  name: 'UploadImage',
  data () {
    return {
      dialogVisible: false,
      imageUrl: null
    }
  },
  methods: {
    handleShowMediaBox () {
      // 1.显示弹框
      this.dialogVisible = true
      // 2.在弹框中展示图片素材
      // 3.用户可以点击切换图片的选中状态
      // 4.用户点击确定，我们拿到所选的图片链接，将数据给谁？
    },
    
    handleUploadSuccess (res) {
      this.imageUrl = res.data.url
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<style lang="less" scoped>
.box-wrap {
  width: 200px;
  height: 200px;
  border: 1px solid #eee;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
