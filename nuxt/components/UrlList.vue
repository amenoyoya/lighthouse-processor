<template>
  <div class="mt-4">
    <Paginator baseURL="/" :pager="list" />
    <table class="mt-4 w-full table-fixed break-words">
      <thead>
        <tr class="border bg-teal-200">
          <th class="w-1/2">URL</th><th>SP</th><th>PC</th><th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border text-center even:bg-gray-200" v-for="data of list.items" :key="data._id">
          <td class="pl-4 pr-4 text-left">{{ data.url }}</td>
          <td>
            <a class="text-blue-500" :href="`/html/${data._id}_sp.html`"
              v-if="typeof data.sp === 'object' && data.sp.score !== undefined">
              {{ data.sp.score }}
            </a>
            <span v-else-if="data.sp === false">－</span>
            <span v-else-if="data.sp === true">計測中</span>
            <span v-else>失敗</span>
          </td>
          <td>
            <a class="text-blue-500" :href="`/html/${data._id}_pc.html`"
              v-if="typeof data.pc === 'object' && data.pc.score !== undefined">
              {{ data.pc.score }}
            </a>
            <span v-else-if="data.pc === false">－</span>
            <span v-else-if="data.pc === true">計測中</span>
            <span v-else>失敗</span>
          </td>
          <td>
            <button class="p-2 bg-red-500 text-white rounded-md" @click.prevent="deleteData(data)">削除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mt-4 mb-4">
      <Paginator baseURL="/" :pager="list" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import querystring from 'querystring'

export default {
  data() {
    return {
      list: {}
    }
  },
  async mounted() {
    // DB から URLデータリスト取得
    this.list = await this.getDataList()
  },
  methods: {
    /**
     * URLデータリスト取得
     * @return {object{items: [], count, start, end}}
     */
    async getDataList() {
      const query = querystring.parse(window.location.search.slice(1))
      // データリスト
      const list = {
        // データ総数
        count: (await axios.get('http://localhost:8080/api/lighthouse?$count')).data
      }
      // カレントページのデータリスト
      list.items = (await axios.get(
        `http://localhost:8080/api/lighthouse?$skip=${query.page > 0? (query.page - 1) * 50: 0}&$limit=50&$orderby=created${
          query.keyword && query.keyword.length > 0? '&$filter=url $regex "' + query.keyword + '"': ''
        }`)
      ).data
      // カレントページのデータ取得位置
      list.page = query.page? parseInt(query.page): 1
      list.start = list.items.length === 0? 0: (query.page > 0? (query.page - 1) * 50 + 1: 1)
      // カレントページのデータリスト最後の位置
      list.end = list.items.length === 0? 0: list.start + list.items.length - 1
      return list
    },

    /**
     * URLデータ削除
     * @param {object} data
     */
    async deleteData(data) {
      try {
        await axios.delete(`http://localhost:8080/api/lighthouse/${data._id}`)
        window.location.href = '/' + window.location.search // ページリロード
      } catch (err) {
        console.log(err.response.data)
        alert('データを削除できませんでした')
      }
    },
  }
}
</script>