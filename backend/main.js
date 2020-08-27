const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const fs = require('fs')
const axios = require('axios')
const cron = require('node-schedule')

// NeDB REST API endpoint
const endpoint = 'http://localhost:8080/api/lighthouse'

/**
 * Lighthouse実行
 * @param {string} url
 * @param {*} options
 * @param {*} config
 */
const executeLighthouse = async (
  url,
  options = {chromeFlags: ['--headless'], enableExtensions: false},
  config = null
) => {
  const chrome = await chromeLauncher.launch(options)
  options.port = chrome.port
  try {
    const result = await lighthouse(url, options, config)
    await chrome.kill()

    const score = Object.entries(result.lhr.categories).reduce((prev, [key, value]) => Object.assign({}, prev, {
      [value.title]: value.score ? parseInt(value.score * 100, 10) : 0
    }), {})

    return {
      url: result.lhr.finalUrl,
      score: score,
      report: result.report
    }
  } catch (error) {
    await chrome.kill()
    throw new Error(error)
  }
}

/**
 * Lighthouse実行結果まとめ
 * @param {string} url
 * @param {string} emulation 'desktop'|'mobile'
 * @param {string} outputFilename
 * @return {object{score, acc, bp, seo, pwa}}
 */
const reportLighthouse = async (url, emulation, outputFilename) => {
  try {
    const res = await executeLighthouse(
      url,
      {output: 'html', chromeFlags: ['--headless']},
      {
        extends: 'lighthouse:default',
        settings: {
          maxWaitForLoad: 35 * 1000,
          emulatedFormFactor: emulation,
          throttling: {
            rttMs: 40,
            throughputKbps: 10 * 1024,
            cpuSlowdownMultiplier: 1
          }
        }
      }
    )
    fs.writeFileSync(outputFilename, res.report)
    return {
      score: res.score.Performance,
      acc: res.score.Accessibility,
      bp: res.score['Best Practices'],
      seo: res.score.SEO,
      pwa: res.score['Progressive Web App']
    }
  } catch (err) {
    // 失敗したときはエラー文を返す
    return err.toString()
  }
}

/**
 * NeDBから未処理のURLをLighthouseで測定 => DB保存
 * @param {boolean} mode true: SP, false: PC
 */
const processDatabaseURL = async mode => {
  try {
    const data = (await axios.get(`${endpoint}/?$filter=${mode? 'sp': 'pc'} $eq false&$limit=1&$orderby=created`)).data
    // 未処理のデータがない場合は終了
    if (data.length === 0) {
      console.log(`未処理の ${mode? 'SP': 'PC'} データがありません`)
      return false
    }
    // 該当データに「実行中」フラグ（true）を設定
    await axios.put(`${endpoint}/${data[0]._id}`, {
      $set: {[mode? 'sp': 'pc']: true}
    })
    // Lighthouse測定実行
    const report = await reportLighthouse(
      data[0].url,
      mode? 'mobile': 'desktop',
      `../nuxt/static/html/${data[0]._id}_${mode? 'sp': 'pc'}.html`)
    console.log(mode? 'SP': 'PC', data[0].url, report)
    // データベース更新
    return await axios.put(`${endpoint}/${data[0]._id}`, {
      $set: {[mode? 'sp': 'pc']: report}
    })
  } catch (e) {
    console.log(e)
  }
}

// 3秒ごとに処理実行
cron.scheduleJob('*/3 * * * * *', async () => {
  await processDatabaseURL(false) // 未測定のPCスコア測定
  await processDatabaseURL(true) // 未測定のSPスコア測定
})
