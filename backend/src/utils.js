const qs = require('querystring')
const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname, '.env') })

let meme_ids = null
const words = {
    'noun': ['ball', 'dog', 'fart'],
    'verb': ['smell', 'whisper', 'find']
}

async function getMemeIds(boxes=2) {
    if (meme_ids === null)
        console.log('fetching')
        response = await fetch('https://api.imgflip.com/get_memes')
        data = await response.json()
        memes = data.data.memes.filter(meme => meme.box_count === boxes)
        meme_ids = memes.map((meme) => meme.id)
    return meme_ids
}

async function getMeme(top, bottom, template) {
    body = {
        template_id: template,
        username: process.env.IF_USERNAME,
        password: process.env.IF_PASSWORD,
        text0: top,
        text1: bottom
    }

    response = await fetch('https://api.imgflip.com/caption_image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;'
        },
        body: qs.stringify(body)
    })

    data = await response.json()
    return data.data.url
}

function randomChoice(arr, n) {
    return arr.sort(() => 0.5 - Math.random()).slice(0, n)
}

function replaceText(text) {
    for (part in words) {
        while (text.includes(`[${part}]`)) {
            replacement = randomChoice(words[part], 1)[0]
            text = text.replace(`[${part}]`, replacement)
        }
    }
    return text
}

async function generateRandomMemes(top, bottom, count) {
    images = await getMemeIds()
    use = randomChoice(images, count)
    urls = []
    for (img of use) {
        url = await getMeme(replaceText(top), replaceText(bottom), img)
        urls.push(url)
    }
    return urls
}

module.exports = {generateRandomMemes}