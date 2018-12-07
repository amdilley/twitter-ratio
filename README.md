# Twitter Ratio

## Getting started
```
npm install
```

## Use
From within the directory, run
```
node index.js <tweet_url>
```

You should see the relevant metrics in the terminal
```
REPLIES:   1499
RETWEETS:  4956
FAVORITES: 9360
RATIO:     0.16
```

### Pushbullet integration
It's also possible to configure the script to send the metrics via [Pushbullet](https://www.pushbullet.com/). You'll need to create `pushbullet.js` where you will export the `PUSHBULLET_API_KEY` as well as the specific `PUSHBULLET_DEVICE_ID`

```javascript
const PUSHBULLET_API_KEY = 'o.zyxwvutsrqponml';
const PUSHBULLET_DEVICE_ID = 'abcdefghijk1234';

module.exports = {
    PUSHBULLET_API_KEY,
    PUSHBULLET_DEVICE_ID,
};
```

To simultaneously send via Pushbullet, append `push` to the end of the terminal command
```
node index.js <tweet_url> push
```

If the device is an iPhone, you will see the something like this

![ios_pushbullet](https://imgur.com/Sr2ykCG.png)
