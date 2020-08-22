<template>
  <form class="flex-row flex-wrap" @submit.prevent="searchURL">
    <input type="text" class="w-4/5 border p-2" placeholder="検索URL" v-model="keyword" />
    <button type="submit" class="p-2 bg-blue-400 text-white rounded-md">検索</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
    }
  },
  mounted() {
    const query = this.getQueryJSON()
    if (query.keyword) {
      this.keyword = decodeURIComponent(query.keyword)
    }
  },
  methods: {
    /**
     * 検索実行
     */
    searchURL() {
      window.location.href = `/?keyword=${encodeURIComponent(this.keyword)}`
    },

    /**
     * URLクエリをJSON形式で取得
     */
    getQueryJSON() {
      return window.location.search
        .slice(1)
        .split('&')
        .map(p => p.split('='))
        .reduce((obj, [key, value]) => ({ ...obj, [key]: decodeURI(value) }), {})
    }
  }
}
</script>