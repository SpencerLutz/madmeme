const qs = require('querystring')
const path = require('path')

let meme_ids = null
const words = {
    'noun': ['ball', 'dog', 'fart'],
    'verb': ['smell', 'whisper', 'find']
}


const word_types = ["noun", "verb", "adjective", "adverb"];


async function getWord(type) {
    // Get a word, given type
    if (!word_types.includes(type)) {
        throw new Error(`Unknown word type: ${type}`);
    }

    resp = await fetch(
        'https://api.api-ninjas.com/v1/randomword?type=verb',
        {headers: {"X-Api-Key": process.env.API_NINJAS_KEY}, },
    )

    return await resp.json()
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
    for (img of use) {
        console.log(await getMeme(replaceText(top), replaceText(bottom), img))
    }

}

module.exports = {generateRandomMemes, getWord}