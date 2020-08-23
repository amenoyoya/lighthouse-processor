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
import axios from 'axios'

export default {
  data() {
    return {
      url: '',
    }
  },
  methods: {
    /**
     * onSubmit => URL追加
     */
    async uploadURL() {
      if (this.url.length === 0) {
        alert('URLを指定してください')
        return false
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
      try {
        await axios.post(
          'http://localhost:8080/api/lighthouse',
          this.convertURLs(urls)
        )
        window.location.href = '/' + window.location.search // ページリロード
      } catch (err) {
        console.log('データベースへの登録に失敗しました')
      }
    },

    /**
     * URLリストをJSON形式に変換
     * @param {string[]} urls
     * @return {object{url, sp, pc, created}[]}
     */
    convertURLs(urls) {
      const list = []
      for (const [index, url] of urls.entries()) {
        if (url.length === 0) {
          continue
        }
        list.push({
          url, sp: false, pc: false, created: Date.now() + index
        })
      }
      return list
    },
  }
}
</script>