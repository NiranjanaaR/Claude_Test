/* ============================================================
   SURAM — product & customised-gift data
   Edit prices, names and image filenames here.
   Drop your real photos into the images/ folder and update
   the "img" field to match (e.g. "images/diya-teal.jpg").
   ============================================================ */

const PRODUCTS = [
  {
    id: "diya-teal-3",
    name: "Decorative Diyas — Colorful Hand-Painted Clay Lamps (Pack of 3)",
    tagline: "Eco-friendly · Diwali, puja & festive gifting",
    price: 157,
    mrp: 599,
    img: "images/diya-teal.svg",
    badge: "Bestseller"
  },
  {
    id: "diya-terracotta-3",
    name: "Handmade Decorative Clay Diyas — Terracotta Earthen Lamps (Pack of 3)",
    tagline: "Traditional hand-painted · Diwali puja & décor",
    price: 155,
    mrp: 599,
    img: "images/diya-terracotta.svg",
    badge: null
  },
  {
    id: "diya-green-2",
    name: "Handmade Decorative Clay Diyas — Hand-Painted (Pack of 2)",
    tagline: "Festive gifting · Home decoration",
    price: 154,
    mrp: 599,
    img: "images/diya-green.svg",
    badge: null
  },
  {
    id: "crochet-backpack",
    name: "Handmade Crochet Drawstring Backpack for Women",
    tagline: "Knitted yarn shoulder bag · lightweight potli for daily use",
    price: 998,
    mrp: 1499,
    img: "images/crochet-bag.svg",
    badge: "Only a few left"
  }
];

/* The customised-gifts corner — these are made-to-order enquiries,
   not fixed-price cart items. */
const CUSTOM_GIFTS = [
  {
    icon: "🎁",
    title: "Surprise Explosion Gift Box",
    desc: "A cardboard box that bursts open into layers of photos, notes and little gifts. The ultimate 'wow' reveal."
  },
  {
    icon: "💌",
    title: "Personalised Greeting Cards",
    desc: "Hand-lettered cards in your words — birthdays, anniversaries, thank-yous and festive wishes."
  },
  {
    icon: "🎬",
    title: "Craft Video Keepsakes",
    desc: "A short, lovingly-made craft video message — perfect for loved ones who live far away."
  },
  {
    icon: "📜",
    title: "Paper Craft Creations",
    desc: "Quilling, scrapbooks, pop-up art and bespoke paper décor for any occasion."
  }
];
