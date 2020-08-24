const nedb = require('nedb-promises')
const fs = require('fs')
const {randomBytes} = require('crypto')

/**
 * generate random string
 * @param {number} length
 * @return {string} 
 */
const randstr = length => {
  return randomBytes(length).reduce((p, i) => p + (i % 36).toString(36), '')
}

/**
 * generate random integer
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
const randint = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max + 1)
  return min + Math.floor(Math.random() * (max - min))
}

/**
 * measure process time
 * @param {function} callback
 * @return {number[]} [seconds, nanoseconds]
 */
const measure = async callback => {
  const hrstart = process.hrtime()
  await callback()
  return process.hrtime(hrstart)
}

// measure time to insert 1,000,000 data
// => 241s 768693000ms (CPU: Core i7 2.60GHz, Memory: 32GB)
const insert = async () => {
  // 古いDBファイル削除
  try {
    if (fs.lstatSync('test.db').isFile()) {
      fs.unlinkSync('test.db')
    }
  } catch (e) {
    console.log(e)
  }
  // DBファイル作成
  const db = new nedb({
    filename: 'test.db',
    autoload: true,
  })  
  const hrend = await measure(async () => {
    for (let i = 0; i < 1000000; ++i) {
      await db.insert({
        token: randstr(16),
        status: randint(0, 2)
      })
    }
  })
  console.log(`Execution time: ${hrend[0]}s ${hrend[1]}ms`)
}

// measure time to load database with 1,000,000 data
// Execution time: 13s 449062800ms (CPU: Core i7 2.60GHz, Memory: 32GB)
const load = async () => {
  const hrend = await measure(async () => {
    const db = new nedb({
      filename: 'test.db',
      autoload: true,
    })
    await db.load()
  })
  console.log(`Execution time: ${hrend[0]}s ${hrend[1]}ms`)
}

// measure time to search from 1,000,000 data
// Execution time: 15s 957714500ms (CPU: Core i7 2.60GHz, Memory: 32GB)
const search = async () => {
  const db = new nedb({
    filename: 'test.db',
    autoload: true,
  })
  const hrend = await measure(async () => {
    // status: 0 のデータを取得
    const data = await db.find({status: 0})
    console.log(`count of data: status = 0: ${data.length}`)
  })
  console.log(`Execution time: ${hrend[0]}s ${hrend[1]}ms`)
}

// measure time to update from X / 1,000,000 data (X: 333,932)
// Execution time: 18s 640372900ms (CPU: Core i7 2.60GHz, Memory: 32GB)
const update = async () => {
  const db = new nedb({
    filename: 'test.db',
    autoload: true,
  })
  const hrend = await measure(async () => {
    // status: 0 のデータを更新 => status: 3
    const count = await db.update({status: 0}, {$set: {status: 3}}, {multi: true})
    console.log(`count of updated data: ${count}`)
  })
  console.log(`Execution time: ${hrend[0]}s ${hrend[1]}ms`)
}

if (process.argv.length > 2 && process.argv[2] === 'load') {
  load()
} else if (process.argv.length > 2 && process.argv[2] === 'search') {
  search()
} else if (process.argv.length > 2 && process.argv[2] === 'update') {
  update()
} else {
  insert()
}