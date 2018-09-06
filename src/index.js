const chalk = require('chalk');
const puppeteer = require('puppeteer');
const { imagesPath } = require('./config');
const src2img = require('./src2img');


(async() => {
  let data = ['age', 'word', 'number'];
  // let root = 'https://image.baidu.com/'
  let root = 'http://dict.cn/'

  let {browser, page} = await init(root)
  for (let i = 0; i < data.length; i++) {
    console.log(data[i])
    await getWord(page, data[i])
  }
  // await browser.close()

})()

async function init(root) {
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()
  await page.goto(root, { waitUntil: 'networkidle2' })
  console.log(chalk.green('page go to ' + root + '   ......'))
  return { browser, page }
}

// 获取图片
async function getImg(page, target) {
    // 重置窗口大小
    // await page.setViewport({
    //   width: 1920,
    //   height: 1080
    // })
    // console.log(chalk.green('reset viewport'))

    await page.focus('#q')
    await page.keyboard.sendCharacter(target)
    await page.click('#search')
    console.log(chalk.green('go to search list'))
  
    page.on('load', async () => {
      console.log(chalk.green('page loading done, start fetch...'))
      const imgsCounts = await page.$$eval('img.main_img', imgs => imgs.map(i => i.src))
      console.log('获取完成')
      imgsCounts.forEach( async src => {
        await src2img(src, imagesPath)
      })
    })
}
function sleep() {
  return new Promise(resolve => {
    setTimeout(() => {resolve()}, 1000)
  })
}
// 获取近义词
async function getWord(page, target) {
  await sleep()
  await page.focus('#q')
  await page.keyboard.type(target, {delay: 100})
  await page.click('#search')
  console.log(chalk.green('go to search list'))

  page.on('load', async () => {
    console.log(chalk.green('page loading done, start fetch...'))
    const wordsCounts = await page.$$eval('.rel .nfo li a', words => words.map(i => i.text.trim()))
    console.log(wordsCounts)
    await page.keyboard.press('Backspace')
  })
}