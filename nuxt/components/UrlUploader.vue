<template>
  <form class="flex-row flex-wrap mt-4" @submit.prevent="uploadURL">
    <input type="text" class="w-3/5 border p-2 mb-4" placeholder="追加URL" v-model="url" />
    <button type="submit" class="p-2 mb-4 bg-green-400 text-white rounded-md">追加</button>
    <label class="inline-block p-2 mb-4 bg-purple-400 text-white rounded-md cursor-pointer">
      URLリストアップロード
      <input type="file" class="hidden" @change.prevent="onChangeFile" />
    </label>
  </form>
</template>

<script>
export default {
  data() {
    return {
      url: '',
    }
  },
  mounted() {
    // MongoDB REST API Server 接続
    this.$initializeMongoDB({
      url: 'http://127.0.0.1:8080',
    })
  },
  methods: {
    /**
     * onSubmit => URL追加
     */
    async uploadURL() {
      if (this.url.length === 0) {
        alert('URLを指定してください')
      }
      await this.uploadURLs([this.url])
    },

    /**
     * onChangeFile => URLリストのファイルをアップロード
     */
    onChangeFile(e) {
      const files = e.target.files || e.dataTransfer.files
      if (files.length > 0) {
        const reader = new FileReader();
        reader.onload = e => {
          if (typeof e.target.result === 'string') {
            this.uploadURLs(e.target.result.split(/\r\n|\n/))
          } else {
            alert('ファイルの内容が不正です')
          }
        }
        reader.readAsText(files[0])
      }
    },

    /**
     * URLをデータベースに登録
     * @param {string[]} urls
     */
    async uploadURLs(urls) {
      const res = await this.$mongodb().ref('lighthouse')
        .push(this.convertURLs(urls))
      alert('URLが追加されました')
    },

    /**
     * URLリストをJSON形式に変換
     * @param {string[]} urls
     * @return {object{url, sp, pc}[]}
     */
    convertURLs(urls) {
      const list = []
      for (const url of urls) {
        if (url.length === 0) {
          continue
        }
        list.push({
          url, sp: false, pc: false
        })
      }
      return list
    },
  }
}
</script>