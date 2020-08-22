<template>
  <div class="flex flex-col h-screen md:w-4/5 sm:w-screen m-auto">
    <header class="flex justify-between p-4 border-b items-center">
      <h1 class="font-semibold text-xl leading-tight">Lighthouseスコア計測君</h1>
    </header>
    <div class="border-b p-4">
      <form class="flex-row flex-wrap" @submit.prevent="searchURL">
        <input type="text" class="w-4/5 border p-2" placeholder="検索URL" v-model="keyword" />
        <button type="submit" class="p-2 bg-blue-400 text-white rounded-md">検索</button>
      </form>
      <form class="flex-row flex-wrap mt-4" @submit.prevent="appendURL">
        <input type="text" class="w-3/5 border p-2" placeholder="追加URL" v-model="url" />
        <button type="submit" class="p-2 bg-green-400 text-white rounded-md">追加</button>
        <label class="inline-block p-2 bg-purple-400 text-white rounded-md cursor-pointer">
          URLリストアップロード
          <input type="file" class="hidden" @change.prevent="onChangeFile" />
        </label>
      </form>
    </div>
    <table class="table-auto">
      <thead>
        <tr class="border bg-teal-200">
          <th>ID</th><th>URL</th><th>SP</th><th>PC</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border text-center even:bg-gray-200" v-for="data of list" :key="data.id">
          <td>{{ data.id }}</td>
          <td class="pl-4 pr-4 text-left">{{ data.url }}</td>
          <td>{{ data.sp }}</td>
          <td>{{ data.pc }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
      url: '',
      list: [
        {id: 1, url: 'https://www.google.com', sp: true, pc: true},
        {id: 2, url: 'https://yahoo.co.jp', sp: true, pc: true},
        {id: 3, url: 'https://github.com', sp: true, pc: false},
        {id: 4, url: 'https://twitter.com', sp: false, pc: false},
      ],
    }
  },
  methods: {
    searchURL() {
      console.log(this.keyword)
    },
    appendURL() {
      console.log(this.url)
    },
    onChangeFile(e) {
      const files = e.target.files || e.dataTransfer.files
      if (files.length > 0) {
        const reader = new FileReader();
        reader.onload = e => {
          console.log(e.target.result)
        }
        reader.readAsDataURL(files[0])
      }
    },
  }
}
</script>
