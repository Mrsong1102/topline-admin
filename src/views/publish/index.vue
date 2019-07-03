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
        <el-radio-group v-model="articleForm.cover.type">
          <el-radio :label="1">单图</el-radio>
          <el-radio :label="3">三图</el-radio>
          <el-radio :label="0">无图</el-radio>
          <el-radio :label="-1">自动</el-radio>
        </el-radio-group>
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

/**
 * 如果是更新，则在第一次更新数据之后开启监视
 * 如果是添加，则一上来就开启监视
 * 如果是从更新页面导航到发布页面，则清空表单数据
 * 如果是从发布页面导航发布页面，则重新加载编辑页面的数据
 */

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

  watch: {
    $route (to, from) {
      // 如果你是从更新页面来的
      if (from.name === 'publish-edit') {
        this.articleForm = {
          title: '', // 标题
          content: '', // 内容
          cover: { // 封面
            type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
            images: [] // 图片链接
          },
          channel_id: '' // 频道
        }
      }
    }
  },

  /**
   * 监视器，我们可以监视组件实例的成员
   * 当成员发生改变的时候，监视函数会被调用
   * 注意：这里配置的监视无法取消，会重复监视
   *      如果需要有一个可以取消的监视，则需要通过 this.$watch 的方式进行监视
   */
  // watch: {
  //   articleForm: {
  //     handler () { // 当被监视数据发生改变的时候会被调用
  //       // 如果是第一次编辑更新导致数据的改变，不要让 this.formDirty 为 true
  //       if (this.firstEditData) {
  //         this.formDirty = false
  //       } else { // 否则都是用户操作表单导致的数据修改
  //         this.formDirty = true
  //       }
  //     },
  //     deep: true // 对象、数组类型需要配置深度监视，如果是普通数据不需要
  //     // immediate: false // 默认只有当被监视成员发生改变的时候才会调用监视函数，如果希望初始的时候就调用一次，则可以配置该值为 true
  //   }
  // },

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

    // 如果是发布页面，则直接开启监视
    if (this.$route.name === 'publish') {
      // 开启监视
      this.watchForm()
    }
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
        // 编辑页面,修改表单数据,动态加载表单内容
        // 这个数据的修改也会触发对表单数据的监视
        // 这个数据非用户修改的数据,所以不要让其变脏
        this.articleForm = data

        this.editLoading = false

        // 如果你此时其操作上面数据驱动视图的更新，此时拿到的 DOM 是更新之前的
        // 如果你需要在数据驱动改变影响视图更新之后做一些 DOM 操作，可以把代码写到 this.$nextForm()

        // 数据的修改并不是立即出发视图的更新的
        // 这个监视器的监视咸鱼正正的数据修改执行
        // 这种代码的执行，即便上面先修改数据，后面去监视也会监视到
        // this.watchForm()

        // Vue 提供了这样的一个 API，简单理解就是延时调用
        this.$nextTick(() => {
          // 更新数据加载好以后，开启监视
          this.watchForm()
        })
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
    },

    watchForm () {
      const unWatch = this.$watch('articleForm', function () {
        console.log('watchForm')
        this.formDirty = true
        // 关闭监视器
        unWatch()
      }, {
        deep: true
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
