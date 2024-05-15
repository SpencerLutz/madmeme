const qs = require("querystring");
const path = require("path");

let meme_ids = null;

const word_types = ["noun", "verb", "adjective", "adverb"];

async function getWords(types) {
  // Get words, given types
  if (!types.every((type) => word_types.includes(type))) {
    throw new Error(`Unknown word type: ${types}`);
  }

  requests = types.map((type) =>
    fetch(`https://api.api-ninjas.com/v1/randomword?type=${type}`, {
      headers: { "X-Api-Key": process.env.API_NINJAS_KEY },
    })
  );

  resps = await Promise.all(requests);

  jsdata = await Promise.all(resps.map((resp) => resp.json()));

  return jsdata.map((jsd) => jsd.word);
}

async function getMemeIds(boxes = 2) {
  if (meme_ids === null) console.log("fetching");
  response = await fetch("https://api.imgflip.com/get_memes");
  data = await response.json();
  memes = data.data.memes.filter((meme) => meme.box_count === boxes);
  meme_ids = memes.map((meme) => meme.id);
  return meme_ids;
}

async function getMeme(top, bottom, template) {
  body = {
    template_id: template,
    username: process.env.IF_USERNAME,
    password: process.env.IF_PASSWORD,
    text0: top,
    text1: bottom,
  };

  response = await fetch("https://api.imgflip.com/caption_image", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;",
    },
    body: qs.stringify(body),
  });

  data = await response.json();
  return data.data.url;
}

function randomChoice(arr, n) {
  return arr.sort(() => 0.5 - Math.random()).slice(0, n);
}

async function generateWords(text) {
  const all_types2 = [...text.matchAll(/\[([a-z]+)\]/g)].map((res) => res[1]);
  return await getWords(all_types2);
}

function substituteWords(text, words) {
  while (/\[[a-z]+\]/g.test(text)) {
    text = text.replace(/\[[a-z]+\]/, words.shift());
  }
  return text;
}

async function generateRandomMemes(top, bottom, count) {
  images = await getMemeIds();
  // Build promise lists to parallelize all word API calls
  allTopWordsPromises = [];
  allBottomWordsPromises = [];
  for (i = 0; i < count; i++) {
    allTopWordsPromises.push(generateWords(top));
    allBottomWordsPromises.push(generateWords(bottom));
  }
  [allTopWords, allBottomWords] = await Promise.all([
    Promise.all(allTopWordsPromises),
    Promise.all(allBottomWordsPromises),
  ]);
  // Generate the images
  use = randomChoice(images, count);
  memePromises = use.map((img) =>
    getMeme(
      substituteWords(top, allTopWords.pop()),
      substituteWords(bottom, allBottomWords.pop()),
      img
    )
  );
  return await Promise.all(memePromises);
}

function generateId() {
  const length = 6;
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  var id = "";
  for (var i = 0; i < length; i++)
    id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

module.exports = { generateRandomMemes, generateId };
