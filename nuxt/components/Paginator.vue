<template>
  <div class="flex flex-row justify-between">
    <div class="flex justify-evenly pt-2">
      <p>{{ pager.start }} - {{ pager.end }} / {{ pager.count }} 件</p>
      <div class="ml-6">
        <a class="mr-4 p-2 border rounded-md text-blue-400 cursor-pointer"
          @click.prevent="paginate(pager.page - 1)" v-if="pager.page > 1">
          前のページへ
        </a>
        <span class="mr-4 p-2 border rounded-md bg-gray-100 text-gray-500" v-else>前のページへ</span>
        <a class="p-2 border rounded-md text-blue-400 cursor-pointer"
          @click.prevent="paginate(pager.page + 1)" v-if="pager.end < pager.count">
          次のページへ
        </a>
        <span class="p-2 border rounded-md bg-gray-100 text-gray-500" v-else>次のページへ</span>
      </div>
    </div>
    <div class="flex justify-evenly">
      <button class="p-2 border rounded-md bg-blue-600 text-white" @click.prevent="downloadCsv">CSVダウンロード</button>
      <button class="ml-4 p-2 border rounded-md bg-red-500 text-white" @click.prevent="deleteList">処理済み一括削除</button>
    </div>
  </div>
</template>

<script>
import querystring from 'querystring'
import axios from 'axios'

export default {
  props: {
    pager: Object,
    baseURL: String,
  },
  methods: {
    /**
     * ページ遷移
     * @param {number} page
     */
    paginate(page) {
      const query = querystring.parse(window.location.search.slice(1))
      delete query['']
      query.page = page
      window.location.href = this.baseURL + '?' + querystring.stringify(query)
    },

    /**
     * URLリストダウンロード
     */
    downloadCsv() {
      // BOM付きUTF-8 csv
      let csv = '\ufeff' + 'URL,sp_score,sp_acc,sp_bp,sp_seo,sp_pwa,pc_score,pc_acc,pc_bp,pc_seo,pc_pwa\n'
      // 処理済みのURLリストをCSV化
      for (const data of this.pager.items) {

        if (typeof data.sp === 'boolean' || typeof data.pc === 'boolean') {
          continue
        }
        const d = this.shapeData(data)
        csv += `"${d.url.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}",${d.sp.score},${d.sp.acc},${d.sp.bp},${d.sp.seo},${d.sp.pwa},${d.pc.score},${d.pc.acc},${d.pc.bp},${d.pc.seo},${d.pc.pwa}\n`
      }
      const blob = new Blob([csv], { type: 'text/csv' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = `list${Date.now()}.csv`
      link.click()
    },

    /**
     * URLリストデータ整形
     * @param {object{url,sp,pc}} data
     * @return {object{url,sp,pc}} data.sp => {score,acc,bp,seo,pwa}, data.pc => {score,acc,bp,seo,pwa}
     */
    shapeData(data) {
      const data2 = JSON.parse(JSON.stringify(data))
      if (data2.sp.score === undefined) {
        data2.sp = {
          score: '失敗', acc: '失敗', bp: '失敗', seo: '失敗', pwa: '失敗',
        }
      }
      if (data2.pc.score === undefined) {
        data2.pc = {
          score: '失敗', acc: '失敗', bp: '失敗', seo: '失敗', pwa: '失敗',
        }
      }
      return data2
    },

    /**
     * 処理済みリストデータを一括削除
     */
    async deleteList() {
      if (window.confirm('処理済みのリストデータを削除しますか？')) {
        // 処理済みのURLリストを取得
        const targets = this.pager.items.filter(data => typeof data.sp !== 'boolean' && typeof data.pc !== 'boolean')
        try {
          for (const data of targets) {
            await axios.delete(`http://localhost:8080/api/lighthouse/${data._id}`)
          }
          window.location.href = '/' + window.location.search // ページリロード
        } catch (err) {
          console.log(err.response.data)
          alert('データを削除できませんでした')
        }
      }
    },
  }
}
</script>