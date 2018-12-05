const puppeteer = require('puppeteer');
const { URL } = require('url');

const REPLY_SELECTOR = '.js-actionReply > .ProfileTweet-actionCount > .ProfileTweet-actionCountForPresentation';
const RETWEET_SELECTOR = '.js-actionRetweet > .ProfileTweet-actionCount > .ProfileTweet-actionCountForPresentation';
const FAVORITE_SELECTOR = '.js-actionFavorite > .ProfileTweet-actionCount > .ProfileTweet-actionCountForPresentation';

const sleep = ms => new Promise(res => setTimeout(res, ms));

const getCount = async (page, selector) =>
    await page.$eval(selector, el => Number(el.innerHTML));

(async (url = process.argv[2]) => {
    const tweetURL = new URL(url);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 800 }); 

    await page.goto(tweetURL.href);
    await page.waitForSelector(REPLY_SELECTOR);
    await page.waitForSelector(RETWEET_SELECTOR);
    await page.waitForSelector(FAVORITE_SELECTOR);

    // buffer for reply calculation
    await sleep(1000);

    const replies = await getCount(page, REPLY_SELECTOR);
    const retweets = await getCount(page, RETWEET_SELECTOR);
    const favorites = await getCount(page, FAVORITE_SELECTOR);
    
    const ratio = parseFloat(replies/favorites).toFixed(2);

    console.log(`REPLIES:   ${replies}`);
    console.log(`RETWEETS:  ${retweets}`);
    console.log(`FAVORITES: ${favorites}`);
    console.log(`RATIO:     ${ratio}`);

    browser.close();
})();
