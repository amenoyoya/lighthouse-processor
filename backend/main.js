const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const fs = require('fs')
const nedb = require('nedb-promises')
const cron = require('node-schedule')

// create NeDB datastore
const db = new nedb({filename: '../db/lighthouse.db',  autoload: true})

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
    return err
  }
}

/**
 * NeDBから未処理のURLをLighthouseで測定 => DB保存
 * @param {boolean} mode true: SP, false: PC
 */
const processDatabaseURL = async mode => {
  const data = await db.find({
    [mode? 'sp': 'pc']: false
  })
    .limit(1)
    .sort({created: 1})
  // 未処理のデータがない場合は終了
  if (data.length === 0) {
    console.log(`未処理の ${mode? 'SP': 'PC'} データがありません`)
    return false
  }
  // Lighthouse測定実行
  const report = await reportLighthouse(
    data[0].url,
    mode? 'mobile': 'desktop',
    `../nuxt/static/html/${data[0]._id}_${mode? 'sp': 'pc'}.html`)
  console.log(data[0].url, report)
  // データベース更新
  return await db.update(
    {_id: data[0]._id},
    {
      $set: {[mode? 'sp': 'pc']: report}
    }
  )
}

// 1分ごとに処理実行
cron.scheduleJob('* * * * *', async () => {
  await processDatabaseURL(false) // 未測定のPCスコア測定
  await processDatabaseURL(true) // 未測定のSPスコア測定
})
