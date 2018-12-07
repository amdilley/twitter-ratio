const puppeteer = require('puppeteer');
const PushBullet = require('pushbullet');
const { URL } = require('url');

const {
    PUSHBULLET_API_KEY,
    PUSHBULLET_DEVICE_ID,
} = require('./pushbullet');

const REPLY_SELECTOR = '.js-actionReply > .ProfileTweet-actionCount > .ProfileTweet-actionCountForPresentation';
const RETWEET_SELECTOR = '.js-actionRetweet > .ProfileTweet-actionCount > .ProfileTweet-actionCountForPresentation';
const FAVORITE_SELECTOR = '.js-actionFavorite > .ProfileTweet-actionCount > .ProfileTweet-actionCountForPresentation';

const pusher = new PushBullet(PUSHBULLET_API_KEY);

const sleep = ms => new Promise(res => setTimeout(res, ms));

const getCount = (page, selector) =>
    page.$eval(selector, el => 
        Number(el.innerHTML) || Number(el.parentNode.getAttribute('data-tweet-stat-count'))
    );

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

    const textBody = [
        `REPLIES:   ${replies}`,
        `RETWEETS:  ${retweets}`,
        `FAVORITES: ${favorites}`,
        `RATIO:     ${ratio}`,
    ].join('\n');

    console.log(textBody);

    // PushBullet notification for iPhone
    if (process.argv[3] === 'push') {
        pusher.note(
            PUSHBULLET_DEVICE_ID,
            `💬${replies} 🔁${retweets} ❤️${favorites} ÷${ratio}`,
            `Tweet metrics for ${url}`,
        );
    }

    browser.close();
})();
