// Extract the image regions supplied in the reference mockups. No UI is flattened into the app.
import sharp from "sharp";
const root = "/home/patt509/Downloads/ChatGPT Image Oct 19, 2026, 06_09_";
const sources = {
  home: root + "17 PM-1.png",
  catalog: root + "19 PM-2.png",
  product: root + "22 PM-3.png",
  cart: root + "23 PM-4.png",
};
const assets = [
  ["logo", "home", 57, 32, 147, 42],
  ["logo-footer", "home", 58, 1442, 143, 43],
  ["rope", "home", 78, 529, 110, 73],
  ["remote", "product", 144, 196, 311, 215],
  ["pulley", "cart", 86, 768, 98, 92],
  ["limit", "cart", 466, 769, 66, 87],
  ["motor", "home", 797, 523, 105, 78],
  ["panel", "home", 665, 526, 104, 78],
  ["pulley-yellow", "home", 378, 520, 84, 84],
  ["switch", "home", 521, 530, 94, 67],
  ["receiver", "catalog", 436, 474, 126, 80],
  ["battery", "catalog", 624, 477, 116, 76],
  ["charger", "catalog", 793, 475, 130, 78],
  ["remote-hbc", "catalog", 257, 715, 128, 75],
  ["receiver-hbc", "catalog", 440, 715, 119, 75],
  ["belt", "catalog", 790, 707, 136, 83],
  ["remote-autec", "catalog", 256, 957, 126, 73],
  ["receiver-autec", "catalog", 469, 956, 71, 73],
  ["battery-autec", "catalog", 628, 957, 110, 73],
  ["antenna", "catalog", 789, 953, 137, 70],
  ["case", "product", 118, 1050, 110, 73],
  ["gearbox", "cart", 608, 770, 127, 85],
  ["detail-remote", "product", 144, 196, 311, 215],
  ["detail-side", "product", 72, 192, 54, 50],
  ["detail-controls", "product", 73, 324, 52, 51],
  ["detail-case", "product", 73, 389, 52, 51],
  ["support", "home", 475, 1049, 502, 158],
  ["brands", "home", 100, 1368, 750, 37],
];
for (const [name, source, left, top, width, height] of assets)
  await sharp(sources[source])
    .extract({ left, top, width, height })
    .webp({ quality: 92 })
    .toFile(`public/images/${name}.webp`);
