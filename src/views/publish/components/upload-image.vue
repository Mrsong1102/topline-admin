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
      <span>这是一段信息</span>
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
      dialogVisible: false
    }
  },
  methods: {
    handleShowMediaBox () {
      // 1.显示弹框
      this.dialogVisible = true
      // 2.在弹框中展示图片素材
      // 3.用户可以点击切换图片的选中状态
      // 4.用户点击确定，我们拿到所选的图片链接，将数据给谁？
    }
  }
}
</script>

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
