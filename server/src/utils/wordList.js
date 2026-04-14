const mongoose = require("mongoose");
const Word = require("../models/Word");

const defaultWordsByCategory = {
  general: [
    "apple",
    "astronaut",
    "backpack",
    "balloon",
    "banana",
    "bicycle",
    "camera",
    "castle",
    "dragon",
    "elephant",
    "fireworks",
    "guitar",
    "hamburger",
    "helicopter",
    "island",
    "jellyfish",
    "kangaroo",
    "lighthouse",
    "mountain",
    "octopus",
    "penguin",
    "pyramid",
    "rainbow",
    "robot",
    "sailboat",
    "snowman",
    "spaceship",
    "tornado",
    "umbrella",
    "volcano",
    "waterfall",
    "zebra",
  ],
  animals: [
    "alligator",
    "butterfly",
    "camel",
    "dolphin",
    "flamingo",
    "giraffe",
    "hedgehog",
    "koala",
    "lobster",
    "peacock",
    "raccoon",
    "shark",
    "tiger",
    "whale",
  ],
  food: [
    "burrito",
    "cupcake",
    "donut",
    "noodles",
    "pancake",
    "pizza",
    "popcorn",
    "sandwich",
    "spaghetti",
    "sushi",
  ],
};

const defaultWordDocuments = Object.entries(defaultWordsByCategory).flatMap(([category, words]) =>
  words.map((text) => ({
    text,
    category,
    difficulty: "normal",
  })),
);

let cachedWordsByCategory = { ...defaultWordsByCategory };

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function dedupeWords(words) {
  return [...new Set(words.map((word) => String(word || "").trim().toLowerCase()).filter(Boolean))];
}

function normalizeWordMap(words) {
  const grouped = words.reduce((accumulator, word) => {
    const category = String(word.category || "general").trim().toLowerCase() || "general";
    if (!accumulator[category]) accumulator[category] = [];
    accumulator[category].push(String(word.text || "").trim());
    return accumulator;
  }, {});

  return Object.fromEntries(
    Object.entries(grouped).map(([category, list]) => [category, dedupeWords(list)]),
  );
}

function getFallbackWords(count = 3, category = "general") {
  const normalizedCategory = String(category || "general").trim().toLowerCase();
  const pool = cachedWordsByCategory[normalizedCategory] || cachedWordsByCategory.general || [];
  return shuffle(pool).slice(0, count);
}

async function seedWordsIfNeeded() {
  if (mongoose.connection.readyState !== 1) return 0;

  const existingCount = await Word.estimatedDocumentCount();
  if (existingCount > 0) {
    await refreshWordCache();
    return existingCount;
  }

  await Word.insertMany(defaultWordDocuments, { ordered: false });
  await refreshWordCache();
  return defaultWordDocuments.length;
}

async function refreshWordCache() {
  if (mongoose.connection.readyState !== 1) {
    cachedWordsByCategory = { ...defaultWordsByCategory };
    return cachedWordsByCategory;
  }

  const words = await Word.find({}, { text: 1, category: 1, _id: 0 }).lean();
  const normalized = normalizeWordMap(words);
  cachedWordsByCategory = Object.keys(normalized).length > 0 ? normalized : { ...defaultWordsByCategory };
  return cachedWordsByCategory;
}

async function getRandomWords(count = 3, category = "general") {
  if (mongoose.connection.readyState !== 1) {
    return getFallbackWords(count, category);
  }

  const normalizedCategory = String(category || "general").trim().toLowerCase();
  const words = cachedWordsByCategory[normalizedCategory] || cachedWordsByCategory.general;

  if (words?.length) {
    return shuffle(words).slice(0, count);
  }

  await refreshWordCache();
  return getFallbackWords(count, normalizedCategory);
}

function listWordCategories() {
  return Object.keys(cachedWordsByCategory).sort();
}

module.exports = {
  defaultWordsByCategory,
  getRandomWords,
  listWordCategories,
  refreshWordCache,
  seedWordsIfNeeded,
};
