// Demo data — fictional Arendal restaurants. Prices in NOK.
const RESTAURANTS = [
  {
    id: "madam-reiersen",
    name: "Madam Reiersen",
    cuisine: "Nordic · Seafood",
    rating: 4.7,
    prepMins: 20,
    color: "#0f4c5c",
    emoji: "🦐",
    blurb: "Harbourside classic. Fresh shrimp sandwiches and fish soup.",
    menu: [
      { id: "m1", name: "Rekesmørbrød", desc: "Open-faced shrimp sandwich, lemon, dill", price: 195 },
      { id: "m2", name: "Fish soup", desc: "Creamy, with cod and root vegetables", price: 175 },
      { id: "m3", name: "Fish & chips", desc: "Battered cod, hand-cut fries, remoulade", price: 219 },
      { id: "m4", name: "Cheesecake", desc: "Cloudberry compote", price: 95 }
    ]
  },
  {
    id: "pollen-pizza",
    name: "Pollen Pizza",
    cuisine: "Italian · Pizza",
    rating: 4.6,
    prepMins: 15,
    color: "#c14600",
    emoji: "🍕",
    blurb: "Wood-fired pizzas in Pollen. Locally famous margherita.",
    menu: [
      { id: "p1", name: "Margherita", desc: "San Marzano, mozzarella, basil", price: 169 },
      { id: "p2", name: "Diavola", desc: "Spicy salami, chili, mozzarella", price: 199 },
      { id: "p3", name: "Quattro Formaggi", desc: "Four cheeses, honey drizzle", price: 215 },
      { id: "p4", name: "Tiramisu", desc: "House-made", price: 85 }
    ]
  },
  {
    id: "tyholmen-burger",
    name: "Tyholmen Burger Co",
    cuisine: "Burgers · Casual",
    rating: 4.5,
    prepMins: 12,
    color: "#7a3b00",
    emoji: "🍔",
    blurb: "Smash burgers and crisp fries. Made fast, eaten faster.",
    menu: [
      { id: "b1", name: "Classic Smash", desc: "Double patty, cheddar, pickles, house sauce", price: 159 },
      { id: "b2", name: "Bacon Smash", desc: "Double smash with crispy bacon", price: 179 },
      { id: "b3", name: "Veggie Smash", desc: "Bean patty, smoked cheddar, slaw", price: 155 },
      { id: "b4", name: "Loaded fries", desc: "Cheddar, bacon, jalapeño", price: 95 }
    ]
  },
  {
    id: "barbu-sushi",
    name: "Barbu Sushi",
    cuisine: "Japanese · Sushi",
    rating: 4.8,
    prepMins: 18,
    color: "#1a1a2e",
    emoji: "🍣",
    blurb: "Fresh nigiri and maki. Pickup-only — no seating.",
    menu: [
      { id: "s1", name: "Salmon nigiri (6 pcs)", desc: "Norwegian salmon, sushi rice", price: 159 },
      { id: "s2", name: "Rainbow roll (8 pcs)", desc: "Tuna, salmon, avocado, prawn", price: 215 },
      { id: "s3", name: "Veggie maki (8 pcs)", desc: "Avocado, cucumber, sesame", price: 139 },
      { id: "s4", name: "Edamame", desc: "Sea salt", price: 65 }
    ]
  },
  {
    id: "kafe-no19",
    name: "Kafé No. 19",
    cuisine: "Café · Bakery",
    rating: 4.4,
    prepMins: 8,
    color: "#5a3a22",
    emoji: "🥐",
    blurb: "Sourdough, cardamom buns and good coffee on Torvet.",
    menu: [
      { id: "c1", name: "Cardamom bun", desc: "Warm, buttery", price: 55 },
      { id: "c2", name: "Avocado toast", desc: "Sourdough, chili, lime", price: 135 },
      { id: "c3", name: "Flat white", desc: "Local roast", price: 49 },
      { id: "c4", name: "Cinnamon roll", desc: "Pearl sugar", price: 55 }
    ]
  },
  {
    id: "fjellheim-grill",
    name: "Fjellheim Grill",
    cuisine: "Kebab · Grill",
    rating: 4.3,
    prepMins: 10,
    color: "#2e5d2e",
    emoji: "🥙",
    blurb: "Late-night kebab and durum. Open till midnight in summer.",
    menu: [
      { id: "g1", name: "Lamb durum", desc: "Wrapped flatbread, garlic sauce", price: 145 },
      { id: "g2", name: "Chicken kebab plate", desc: "Rice, salad, sauces", price: 165 },
      { id: "g3", name: "Falafel wrap", desc: "Hummus, pickles, tahini", price: 135 },
      { id: "g4", name: "Baklava", desc: "Pistachio", price: 45 }
    ]
  }
];
