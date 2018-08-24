const chalk = require('chalk');
const puppeteer = require('puppeteer');
const { imagesPath } = require('./config');
const src2img = require('./src2img');
(async() => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('http://image.baidu.com/', { waitUntil: 'networkidle2' })
  console.log(chalk.green('page go to http://image.baidu.com/'))

  // 重置窗口大小
  await page.setViewport({
    width: 1920,
    height: 1080
  })
  console.log(chalk.green('reset viewport'))

  // 聚焦
  await page.focus('#kw')
  // 输入
  await page.keyboard.sendCharacter('环境')
  // 点击
  await page.click('.s_search')
  console.log(chalk.green('go to search list'))

  page.on('load', async () => {
    console.log(chalk.green('page loading done, start fetch...'))
    const imgsCounts = await page.$$eval('img.main_img', imgs => imgs.map(i => i.src))
    console.log('获取完成')
    // 保存图片
    imgsCounts.forEach( async src => {
      await src2img(src, imagesPath)
    })
    await browser.close()
  })

})()