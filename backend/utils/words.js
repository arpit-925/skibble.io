const WORD_BANK = {
  general: [
    "astronaut",
    "backpack",
    "balloon",
    "camera",
    "castle",
    "compass",
    "dragon",
    "fireworks",
    "guitar",
    "helicopter",
    "island",
    "jellyfish",
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
    "waterfall"
  ],
  animals: [
    "alligator",
    "butterfly",
    "camel",
    "dolphin",
    "flamingo",
    "giraffe",
    "hedgehog",
    "kangaroo",
    "lobster",
    "peacock",
    "raccoon",
    "shark",
    "tiger",
    "whale"
  ],
  food: [
    "burrito",
    "cupcake",
    "donut",
    "hamburger",
    "noodles",
    "pancake",
    "pizza",
    "popcorn",
    "sandwich",
    "spaghetti",
    "sushi",
    "taco"
  ]
};

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function getWordOptions(category = "general", count = 3) {
  const normalizedCategory = String(category || "general").trim().toLowerCase();
  const pool = WORD_BANK[normalizedCategory] || WORD_BANK.general;
  return shuffle(pool).slice(0, count);
}

function listCategories() {
  return Object.keys(WORD_BANK);
}

module.exports = {
  WORD_BANK,
  getWordOptions,
  listCategories,
};
