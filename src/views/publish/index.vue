<template>
  <el-card class="publish-card">
    <div slot="header" class="hander">
      <span>{{ isEdit ? '编辑文章' : '发布文章' }}</span>
      <div>
        <el-button
        type="success"
        @click="handlePublish(false)"
        :loading="publishLoading"
        >{{ isEdit ? '更新' : '发表' }}</el-button>
        <el-button
        type=""
        @click="handlePublish(true)"
        :loading="publishLoading"
        >存入草稿</el-button>
      </div>
    </div>
    <el-form v-loading="isEdit && editLoading">
      <el-form-item>
        <el-input type="text" v-model="articleForm.title" placeholder="标题"></el-input>
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item>
        <!-- bidirectional data binding（双向数据绑定） -->
          <quill-editor v-model="articleForm.content"
            ref="myQuillEditor"
            :options="editorOption">
          </quill-editor>

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
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'AppPublish',

  components: {
    ArticleChannel,
    quillEditor
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
        channel_id: '' // 文章所属频道 id
      },
      editorOption: {}, // 富文本编辑器相关参数选项
      editLoading: false,
      publishLoading: false,
      formDirty: false
    }
  },

  /**
   * 监视器，我们可以监视组件实例的成员
   * 当成员发生改变的时候，监视函数会被调用
   * 注意：这里配置的监视无法取消，会重复监视
   *      如果需要有一个可以取消的监视，则需要通过 this.$watch 的方式进行监视
   */
  watch: {
    articleForm: {
      handler () { // 当被监视数据发生改变的时候会被调用
        this.formDirty = true
      },
      deep: true // 对象、数组类型需要配置深度监视，如果是普通数据不需要
      // immediate: false // 默认只有当被监视成员发生改变的时候才会调用监视函数，如果希望初始的时候就调用一次，则可以配置该值为 true
    }
  },

  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    },
    isEdit () {
      return this.$route.name === 'publish-edit'
    },
    articleId () {
      return this.$route.params.id
    }
  },

  created () {
    this.isEdit && this.loadArticle()
  },

  mounted () {
    console.log('this is current quill instance object', this.editor)
  },

  methods: {
    loadArticle () {
      this.editLoading = true
      this.$http({
        method: 'GET',
        url: `/articles/${this.articleId}`
      }).then(data => {
        this.articleForm = data
        this.editLoading = false
      }).catch(err => {
        console.log(err)
        this.$message.error('加载文章详情失败')
      })
    },

    handlePublish (draft = false) {
      this.publishLoading = true // 禁用按钮的点击状态
      if (this.isEdit) {
        // 执行编辑操作
        this.submitEdit(draft).then(() => {
          this.publishLoading = false
        })
      } else {
        // 执行添加操作
        this.submitAdd(draft).then(() => {
          this.publishLoading = false
        })
      }
    },

    submitEdit (draft) {
      return this.$http({
        method: 'PUT',
        url: `/articles/${this.articleId}`,
        data: this.articleForm, // 请求体参数
        params: { // 查询字符串参数
          draft
        }
      }).then(data => {
        this.$message({
          type: 'success',
          message: '更新成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('更新失败')
      })
    },

    submitAdd (draft) {
      return this.$http({
        method: 'POST',
        url: '/articles',
        data: this.articleForm, // 请求体参数
        params: { // 查询字符串参数
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
  },

  /**
   * 当要从当前导航到另一个路由的时候被触发
   * 我们可以在这里控制路由离开的行为
   * 例如当前页面如果有未保存的数据，我们就提示用户
   * to 要去哪里
   * from 来自哪里
   * next 就是允许通过的方法
   */

  beforeRouteLeave (to, from, next) {
    // 如果表单没有被用户修改过，则让导航直接通过
    if (!this.formDirty) {
      return next()
    }

    const answer = window.confirm('当前有未保存的数据，确认离开么？')
    if (answer) {
      // 正常往后进行导航
      next()
    } else {
      // 取消当前导航
      next(false)
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
