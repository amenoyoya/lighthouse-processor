<template>
  <form class="flex-row flex-wrap" @submit.prevent="searchURL">
    <input type="text" class="w-4/5 border p-2" placeholder="検索URL" v-model="keyword" />
    <button type="submit" class="p-2 bg-blue-400 text-white rounded-md">検索</button>
  </form>
</template>

<script>
import querystring from 'querystring'

export default {
  data() {
    return {
      keyword: '',
    }
  },
  mounted() {
    const query = querystring.parse(window.location.search.slice(1))
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
  }
}
</script>