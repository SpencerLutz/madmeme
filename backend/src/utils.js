//const axios = require('axios')
const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname, '.env') })

let meme_ids = null
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
    response = await fetch('https://api.imgflip.com/caption_image', {
        method: 'POST',
        body: {
            template_id: template,
            username: process.env.IF_USERNAME,
            password: process.env.IF_PASSWORD,
            text0: top,
            text1: bottom
        }
    })
    return response.data
}

function replaceText(text) {
    tags = ['noun', 'verb']
}

async function generateRandomMemes(top, bottom, count) {
    images = await getMemeIds()
    use = images.sort(() => 0.5 - Math.random()).slice(0, count)
    

}

module.exports = {generateRandomMemes}