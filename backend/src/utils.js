const axios = require('axios')
const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname, '.env') })

async function getImages() {
    response = await axios.get('https://api.imgflip.com/get_memes')
    return response.data
}

async function getMeme(top, bottom, template) {
    response = await axios.post('https://api.imgflip.com/caption_image', {
        template_id: template,
        username: process.env.IF_USERNAME,
        password: process.env.IF_PASSWORD,
        text0: top,
        text1: bottom
    })
    return response.data
}

module.exports = {getImages}