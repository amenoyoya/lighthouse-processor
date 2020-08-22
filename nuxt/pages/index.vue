<template>
  <div class="flex flex-col h-screen md:w-4/5 sm:w-screen m-auto">
    <header class="flex justify-between p-4 border-b items-center">
      <h1 class="font-semibold text-xl leading-tight">Lighthouseスコア計測君</h1>
    </header>
    <div class="border-b p-4">
      <UrlSearcher />
      <UrlUploader />
    </div>
    <UrlList />
  </div>
</template>
