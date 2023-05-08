<template>
  <div class="editor" style="border: 1px solid #ccc">
    <Toolbar
      style="height: 80px; border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="height: 300px"
      v-model="content"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
    />
  </div>
</template>
<script lang="ts">
import http from "@/request/index";
import { ImageElement } from "@/type/broadcast";
import { DomEditor, IEditorConfig } from "@wangeditor/editor";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { ElMessage } from "element-plus";
import { defineComponent, reactive, ref, shallowRef, toRefs } from "vue";
export default defineComponent({
  name: "wangEditor",
  components: { Editor, Toolbar },
  setup(props) {

    const content = ref("");

    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef();

    const toolbarConfig: any = {
      excludeKeys: [
        "code", //代码
        "codeBlock", // 代码块
        "todo", // 代办
        "bgColor", // 背景色
        "group-video", // 上传视频
        "fullScreen", //全屏
        "insertImage", //网络图片
      ],
    };

    const editorConfig: Partial<IEditorConfig> = {
      placeholder: "请输入发布消息的内容...",
      MENU_CONF: {},
    };

    const token = ref("");

    const user = localStorage.getItem("user");
    if (user) {
      const obj = JSON.parse(user);
      if (obj.access_token) {
        token.value = "Bearer " + obj.access_token;
      }
    }

    // 自定义校验链接
    function customCheckLinkFn(text: string, url: string): boolean {
      if (!url || url.trim() === "") {
        ElMessage.warning({
          message: "请输入连接的url!!!",
          duration: 2000,
          center: true,
        });
        return false;
      }
      return true;
    }

    // 自定义转换链接 url
    function customParseLinkUrl(url: string): string {
      if (url && url.indexOf("http") !== 0) {
        return `http://${url}`;
      }
      return url;
    }

    // 自定义校验图片
    function customCheckImageFn(
      src: string,
      alt: string,
      url: string
    ): boolean {
      if (!src || src === "") {
        ElMessage.warning({
          message: "请输入图片的url!!!",
          duration: 2000,
          center: true,
        });
        return false;
      }
      return true;
    }

    // 转换图片链接
    function customParseImageSrc(src: string): string {
      if (src && src.indexOf("http") !== 0) {
        return `http://${src}`;
      }
      return src;
    }

    if (editorConfig.MENU_CONF) {
      // 插入链接
      editorConfig.MENU_CONF["insertLink"] = {
        checkLink: customCheckLinkFn, // 也支持 async 函数
        parseLinkUrl: customParseLinkUrl, // 也支持 async 函数
      };

      // 更新链接
      editorConfig.MENU_CONF["editLink"] = {
        checkLink: customCheckLinkFn, // 也支持 async 函数
        parseLinkUrl: customParseLinkUrl, // 也支持 async 函数
      };

      // 编辑图片
      editorConfig.MENU_CONF["editImage"] = {
        onUpdatedImage(imageNode: ImageElement | null) {
          if (imageNode == null) return;
          // const { src, alt, url } = imageNode;
          // console.log("updated image", src, alt, url);
        },
        checkImage: customCheckImageFn, // 也支持 async 函数
        parseImageSrc: customParseImageSrc, // 也支持 async 函数
      };

      //上传图片
      editorConfig.MENU_CONF["uploadImage"] = {
        server: http.defaults.baseURL + "/gcs-third-party/oss/file",

        // form-data fieldName ，默认值 'wangeditor-uploaded-image'
        fieldName: "file",

        // 单个文件的最大体积限制，默认为 2M
        maxFileSize: 2 * 1024 * 1024,

        // 最多可上传几个文件，默认为 100
        maxNumberOfFiles: 5,

        // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
        allowedFileTypes: ["image/jpg", "image/jpeg", "image/png"],

        // 自定义增加 http  header token
        headers: {
          Authorization: token.value,
        },

        // 跨域是否传递 cookie ，默认为 false
        withCredentials: false,

        // 超时时间，默认为 10 秒
        timeout: 5 * 1000, // 5 秒

        // 单个文件上传成功之后
        onSuccess(file: File, res: any) {
          // console.log(`${file.name} 上传成功`, res);
          ElMessage.success({
            message: `上传图片${file.name}成功!`,
            duration: 2000,
            center: true,
          });
        },

        // 单个文件上传失败
        onFailed(file: File, res: any) {
          // console.log(`${file.name} 上传失败`, res);
          let msg: string = res.message;
          msg = msg.substring(msg.lastIndexOf("]") + 1);
          ElMessage.error({
            message: `上传图片${file.name}失败, ${msg}!!!`,
            duration: 2000,
            center: true,
          });
        },

        // 上传错误，或者触发 timeout 超时
        onError(file: File, err: any, res: any) {
          // console.log(`${file.name} 上传出错`, err, res);
          let msg: string = res.message;
          msg = msg.substring(msg.lastIndexOf("]") + 1);
          ElMessage.error({
            message: `上传图片${file.name}失败, ${msg}!!!`,
            duration: 2000,
            center: true,
          });
        },
      };
    }

    const handleCreated = (editor: any) => {
      editorRef.value = editor; // 记录 editor 实例，重要!
      // setTimeout(() => {
      //   const toolbar = DomEditor.getToolbar(editor);
      //   if (toolbar) {
      //     const curToolbarConfig = toolbar.getConfig();
      //     console.log(curToolbarConfig.toolbarKeys); // 当前菜单排序和分组
      //   }
      // }, 1000);

      // console.log(editor.getMenuConfig("uploadImage")); // 获取 uploadImage 的当前配置
    };

    function isEditorEmpty() {
      return editorRef.value.getText().trim() === "";
    }

    function getContent() {
      return editorRef.value.getHtml(); 
    }

    function setContent(p: string) {
      editorRef.value.setHtml(p);
    }

    return {
      content,
      token,
      editorRef,
      toolbarConfig,
      editorConfig,
      mode: "default", // 或 'simple'
      handleCreated,
      isEditorEmpty,
      getContent,
      setContent,
    };
  },
  beforeUnmount() {
    // 组件销毁时，也及时销毁编辑器
    const editor = this.editorRef.value;
    if (editor == null) return;
    editor.destroy();
  },
});
</script>
<style lang="less" scoped>
</style>