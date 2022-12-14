const qs = require('querystring')
const path = require('path')

let meme_ids = null

const word_types = ["noun", "verb", "adjective", "adverb"];

async function getWord(type) {
    // Get a word, given type
    if (!word_types.includes(type)) {
        throw new Error(`Unknown word type: ${type}`);
    };

    resp = await fetch(
        'https://api.api-ninjas.com/v1/randomword?type=verb',
        {headers: {"X-Api-Key": process.env.API_NINJAS_KEY}, },
    );

    jsdata = await resp.json();

    return jsdata.word;
}


async function getWords(types) {
    // Get words, given types
    if (!types.every(type => word_types.includes(type))) {
        throw new Error(`Unknown word type: ${types}`);
    }

    requests = types.map(type => fetch(
        `https://api.api-ninjas.com/v1/randomword?type=${type}`,
        {headers: {"X-Api-Key": process.env.API_NINJAS_KEY}, },
    ));

    resps = await Promise.all(requests);

    jsdata = await Promise.all(resps.map(resp => resp.json()));

    return jsdata.map(jsd => jsd.word);
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

async function replaceText(text) {
    const all_types2 = [...text.matchAll(/\[([a-z]+)\]/g)].map(res => res[1]);
    const words = await getWords(all_types2);
    while (/\[[a-z]+\]/g.test(text)) {
        text = text.replace(/\[[a-z]+\]/, words.pop());
    }
    return text
}

async function generateRandomMemes(top, bottom, count) {
    images = await getMemeIds()
    use = randomChoice(images, count)
    urls = []
    for (img of use) {
        url = await getMeme(await replaceText(top), await replaceText(bottom), img)
        urls.push(url)
    }
    return urls
}

function generateId() {
    const length = 6
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
    var id = ''
    for (var i = 0; i < length; i++)
        id += chars[Math.floor(Math.random()*chars.length)]
    return id
}

module.exports = {generateRandomMemes, generateId}