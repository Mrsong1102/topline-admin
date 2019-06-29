<template>
  <el-card class="publish-card">
    <div slot="header" class="hander">
      <span>发布文章</span>
      <div>
        <el-button type="success" @click="handlePublish(false)">发表</el-button>
        <el-button type="" @click="handlePublish(true)">存入草稿</el-button>
      </div>
    </div>
    <el-form>
      <el-form-item label="标题">
        <el-input type="text" v-model="articleForm.title"></el-input>
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item label="内容">
        <el-input type="textarea" v-model="articleForm.content"></el-input>
      </el-form-item>
      <el-form-item label="封面">
      </el-form-item>
      <el-form-item label="频道">
        <!--
          组建通信：
          父传子：Props Down
          子传父：Events Up
         -->
        <!-- <article-channel
          :value="articleForm.channel_id"
          @input="articleForm.channel_id = $event"
        ></article-channel> -->

        <!-- 
          v-model 就是：
          :value="articleForm.channel_id"
          @input="articleForm.channel_id = $event"
          简写
         -->
        <article-channel
          v-model="articleForm.channel_id"
        ></article-channel>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import ArticleChannel from '@/components/article-channel'
export default {
  name: 'AppPublish',
  components: {
    ArticleChannel
  },
  data () {
    return {
      articleForm: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: { // 封面
          type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: [] // 图片链接
        },
        channel_id: 4 // 文章所属频道 id
      }
    }
  },

  methods: {
    handlePublish (draft = false) {
      this.$http({
        method: 'POST',
        url: '/articles',
        data: this.articleForm,
        params: {
          draft
        }
      }).then(data => {
        this.$message({
          type: 'success',
          message: '发表成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('发表失败')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .publish-card {
    .hander {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
