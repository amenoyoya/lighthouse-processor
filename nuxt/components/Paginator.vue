<template>
  <div class="flex flex-row justify-center">
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
</template>

<script>
import querystring from 'querystring'

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
      const query = this.getQueryJSON()
      delete query['']
      query.page = page
      window.location.href = this.baseURL + '?' + querystring.stringify(query)
    },

    /**
     * URLクエリをJSON形式で取得
     */
    getQueryJSON() {
      return window.location.search
        .slice(1)
        .split('&')
        .map(p => p.split('='))
        .reduce((obj, [key, value]) => ({ ...obj, [key]: decodeURIComponent(value) }), {})
    }
  }
}
</script>