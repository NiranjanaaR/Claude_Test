// Hentmat — Pollen restaurant data
// Sourced from pollen_menus_1.json (assembled 2026-06-10).
// Norwegian descriptions kept verbatim from source; prices in NOK.
// For Hong Kong we use the printed takeaway price where it differs from dine-in.

const RESTAURANTS = [
  {
    id: "marco-polo",
    name: "Marco Polo",
    cuisine: "Kinesisk · Thai",
    address: "Pollen, Arendal",
    rating: 4.5,
    prepMins: 18,
    color: "#8b1a1a",
    emoji: "🥢",
    open: true,
    blurb: "Klassisk asiatisk i Pollen — chopsuey, szechuan og thairetter.",
    allergenLegend: "SY=soya · EG=egg · NØ=nøtter · G=gluten · FK=fisk · SD · BD · SEM=sesam · MK=melk",
    menu: [
      {
        category: "Forretter",
        items: [
          { id: "mp-1", number: "1", name: "Beijing suppe", desc: "Fyldig, syrlig og skarp suppe med kyllingkraft, kyllingkjøtt og grønnsaker.", price: 59, allergens: "SY, EG" },
          { id: "mp-4", number: "4", name: "Tom Yum Kung", desc: "Sterk og syrlig thaisuppe med kongereker, kaffir-limeblad, sitrongress, galangal, limesaft, fiskesaus og kokosmelk.", price: 69, allergens: "SY, MK, FK" },
          { id: "mp-5", number: "5", name: "Tom Yum Kai", desc: "Kyllingsuppe på thailandsk vis med oppskåret kyllingbryst, kokosmelk, kaffir-limeblad og sitrongress.", price: 69, allergens: "SY, MK, FK" },
          { id: "mp-6", number: "6", name: "Stekt vårrull", desc: "Fylt med oksekjøtt og strimlet grønnsaker. Servert med salat og søt chilisaus.", price: 59, allergens: "G, SY" },
          { id: "mp-7", number: "7", name: "Stekte mini-vårruller (vegetar)", desc: "Fylt med strimlet grønnsaker, servert med salat og søt chilisaus.", price: 59, allergens: "G, SY" }
        ]
      },
      {
        category: "Hovedretter",
        items: [
          { id: "mp-39", number: "39", name: "Chopsuey — Kylling", desc: "Marinert kjøtt woket med løk, vannkastanjer, gulrot, babymais, kinakål og bambusskudd.", price: 149, allergens: "SY, EG" },
          { id: "mp-34", number: "34", name: "Chopsuey — Svinefilet", desc: "Marinert kjøtt woket med løk, vannkastanjer, gulrot, babymais, kinakål og bambusskudd.", price: 149, allergens: "SY, EG" },
          { id: "mp-23", number: "23", name: "Chopsuey — Biff", desc: "Marinert kjøtt woket med løk, vannkastanjer, gulrot, babymais, kinakål og bambusskudd.", price: 149, allergens: "SY, EG" },
          { id: "mp-31", number: "31", name: "Chopsuey — Kongereker, okse, svin, kylling", desc: "Husets miks — alle fire proteinene i samme wok.", price: 159, allergens: "SY, EG" },
          { id: "mp-44", number: "44", name: "Szechuan med hvitløk — Kylling", desc: "Marinert kjøtt woket med grønnsaker, mørk soyasaus og hvitløk.", price: 149, allergens: "SY, EG" },
          { id: "mp-37", number: "37", name: "Szechuan med hvitløk — Svinefilet", desc: "Marinert kjøtt woket med grønnsaker, mørk soyasaus og hvitløk.", price: 149, allergens: "SY, EG" },
          { id: "mp-29", number: "29", name: "Szechuan med hvitløk — Biff", desc: "Marinert kjøtt woket med grønnsaker, mørk soyasaus og hvitløk.", price: 149, allergens: "SY, EG" },
          { id: "mp-49", number: "49", name: "Szechuan med hvitløk — And", desc: "Marinert and woket med grønnsaker, mørk soyasaus og hvitløk.", price: 189, allergens: "SY, EG" },
          { id: "mp-41", number: "41", name: "Woket cashewnøtter — Kylling", desc: "Kjøttet wokes med løk, brokkoli, gulrot, bambusskudd, babymais og chili-bønnesaus. Toppes med cashewnøtter.", price: 149, allergens: "SY, EG, NØ" },
          { id: "mp-35", number: "35", name: "Woket cashewnøtter — Svinefilet", desc: "Wokes med løk, brokkoli, gulrot, bambusskudd, babymais og chili-bønnesaus. Toppes med cashewnøtter.", price: 149, allergens: "SY, EG, NØ" },
          { id: "mp-57", number: "57", name: "Woket cashewnøtter — Kongereker", desc: "Wokes med løk, brokkoli, gulrot, bambusskudd, babymais og chili-bønnesaus. Toppes med cashewnøtter.", price: 149, allergens: "SY, EG, NØ" },
          { id: "mp-47", number: "47", name: "Kaeng Phet Kai — kylling i rød karri", desc: "Kylling i rød karripasta, bambusskudd, brekkbønner, babymais, kaffirlimeblad og kokosmelk.", price: 159, allergens: "SY, EG, MK, FK" },
          { id: "mp-60", number: "60", name: "Kaeng Phet Kung — scampi i rød karri", desc: "Scampi i rød karripasta med bambusskudd, brekkbønner, babymais, kaffirlimeblad og kokosmelk.", price: 159, allergens: "SY, EG, MK, FK" },
          { id: "mp-43", number: "43", name: "Frityrstekt i søtsur saus — Kylling", desc: "Sesampanert og frityrstekt. Søtsursaus, gulrot, ananas, vannkastanjer og babymais.", price: 149, allergens: "SY, SD, SEM" },
          { id: "mp-36", number: "36", name: "Frityrstekt i søtsur saus — Svinefilet", desc: "Sesampanert og frityrstekt. Søtsursaus, gulrot, ananas, vannkastanjer og babymais.", price: 149, allergens: "SY, SD, SEM" },
          { id: "mp-58", number: "58", name: "Frityrstekt i søtsur saus — Kongereker", desc: "Sesampanert og frityrstekt. Søtsursaus, gulrot, ananas, vannkastanjer og babymais.", price: 149, allergens: "SY, SD, SEM" },
          { id: "mp-27", number: "27", name: "Kinesisk strimlet pepperbiff med løk", desc: "Woket med grovmalt pepper, biff, løk og gulrot.", price: 189, allergens: "SY, EG" },
          { id: "mp-33", number: "33", name: "Gong Cio Ao Jo Si", desc: "Szechuan-spesialitet. Finstrimlet okseytrefilet, tørrstekt med løk, paprika, gulrot og klassisk szechuan eddiksaus.", price: 189, allergens: "G, SY, EG" },
          { id: "mp-40", number: "40", name: "Kylling i karri saus", desc: "Wokes med løk, brokkoli, gulrot, bambusskudd, babymais og vannkastanjer i karri.", price: 149, allergens: "SY, EG" },
          { id: "mp-45", number: "45", name: "Kylling i Gong Bao saus (søtsur og sterk)", desc: "Chili- og søtsur-saus, vannkastanjer, ananas, gulrot, løk, paprika, babymais. Toppes med cashewnøtter.", price: 149, allergens: "SY, EG, NØ" },
          { id: "mp-51", number: "51", name: "Kylling satay", desc: "Saftige kyllingspyd, salat og peanøttsaus.", price: 149, allergens: "G, SY, EG, SEM, NØ" },
          { id: "mp-66", number: "66", name: "Biffsnadder", desc: "Indrefilet av okse, pommes frites, salat og bearnaisesaus.", price: 209, allergens: "G" },
          { id: "mp-79", number: "79", name: "Indrefilet på kinesisk vis — honningpepper", desc: "Marinert okseindrefilet wokstekt på kantonesisk vis. Paprika, aspargesbønner, løk, babymais i honning- og svartpeppersaus.", price: 209, allergens: "SY, EG, MK, SEM" },
          { id: "mp-90", number: "90", name: "Stekt ris Asian style", desc: "Stekt ris med egg, reker, kylling, skinke og grønnsaker.", price: 149, allergens: "EG, SD" },
          { id: "mp-92", number: "92", name: "Stekte nudler med biff og grønnsaker", desc: "Stekte nudler med biffkjøtt og grønnsaker.", price: 189, allergens: "SY, EG" },
          { id: "mp-94", number: "94", name: "Stekte nudler med kylling og grønnsaker", desc: "Stekte nudler med kylling og grønnsaker.", price: 149, allergens: "SY, EG" }
        ]
      },
      {
        category: "Kombinasjonsmeny (per person, min. 2)",
        items: [
          { id: "mp-A", number: "A", name: "Klassisk kombinasjon", desc: "Vårrull · kongereker med chilibønnesaus og cashewnøtter · sesampanert kylling i søtsur saus · biff med brokkoli · frityrstekt banan med is · kaffe/te.", price: 190, allergens: "SY, EG, NØ, G, FK, SD, BD, SEM, MK" },
          { id: "mp-B", number: "B", name: "Den nyanserte", desc: "Vårrull · innbakt svinefilet i søtsur saus · Kaeng Phet Gai (kylling, rød karri, sterk) · biff szechuan med hvitløk · brownies/Oreo med sorbet · kaffe/te.", price: 190, allergens: "SY, EG, NØ, G, FK, SD, BD, SEM, MK" }
        ]
      },
      {
        category: "Barnemeny",
        items: [
          { id: "mp-043", number: "043", name: "Frityrstekt kylling i søtsur saus", desc: "Kylling sesampanert og frityrstekt med søtsursaus, gulrot, ananas, vannkastanjer og babymais.", price: 69, allergens: "SY, EG, G, SEM" },
          { id: "mp-72", number: "72", name: "Kyllingnuggets med pommes frites", desc: "", price: 59, allergens: "G" },
          { id: "mp-77", number: "77", name: "Pommes frites", desc: "", price: 49, allergens: "G" }
        ]
      }
    ]
  },

  {
    id: "hong-kong",
    name: "Hong Kong Restaurant",
    cuisine: "Kinesisk · Thai",
    address: "Pollen, Arendal",
    rating: 4.6,
    prepMins: 20,
    color: "#c2410c",
    emoji: "🥡",
    open: true,
    blurb: "Stor klassisk meny — egne take-away-priser.",
    allergenLegend: "Tallkoder 1–12 viser til allergenoversikt på restaurantens nettside.",
    menu: [
      {
        category: "Biffretter",
        items: [
          { id: "hk-11", number: "11", name: "Chop seuy a-la Hong Kong", desc: "Biff, kylling og kongereker i soyasaus med grønnsaker.", price: 230, allergens: "5, 6, 8, 9" },
          { id: "hk-12", number: "12", name: "Barbecue a-la Kina", desc: "Biff, svin og kylling i barbecuesaus med grønnsaker.", price: 230, allergens: "5, 6, 7, 8, 9, 12" },
          { id: "hk-14", number: "14", name: "Kinesisk indrefilet med peppersaus", desc: "Serveres med grønnsaker.", price: 320, allergens: "5, 6, 9" },
          { id: "hk-15", number: "15", name: "Chillibiff i szechuansaus (sterk)", desc: "Serveres med grønnsaker.", price: 200, allergens: "5, 6, 9" },
          { id: "hk-16", number: "16", name: "Biff chop seuy", desc: "Serveres med grønnsaker.", price: 200, allergens: "5, 6, 9" },
          { id: "hk-17", number: "17", name: "Biff i karrisaus", desc: "Serveres med grønnsaker.", price: 200, allergens: null },
          { id: "hk-18", number: "18", name: "Biff med bambus, sjampinjong, gulrot, løk og purre", desc: "", price: 200, allergens: "5, 6, 9" },
          { id: "hk-19", number: "19", name: "Biff med løk, gulrot og purre", desc: "", price: 200, allergens: "5, 6, 9" },
          { id: "hk-20", number: "20", name: "Biff med brokkoli, løk og gulrot", desc: "", price: 200, allergens: "5, 6, 9" },
          { id: "hk-20A", number: "20A", name: "Pepperbiff med grønnsaker", desc: "", price: 200, allergens: "5, 6, 9" }
        ]
      },
      {
        category: "Thairetter (Mild / Medium / Thaisterk · glutenfrie)",
        items: [
          { id: "hk-6A", number: "6A", name: "Tom Ka Gai", desc: "Tradisjonell thailandsk kokossuppe, smakfull og velkrydret.", price: 140, allergens: null },
          { id: "hk-6B", number: "6B", name: "Tom Yang Kung", desc: "Sur og sterk thaisuppe med kongereker og grønnsaker.", price: 140, allergens: "8" },
          { id: "hk-11A", number: "11A", name: "Kaeng Phet Gai — kylling i rød karri", desc: "Kyllingfilet og ferske grønnsaker woket i rød karri og kokosmelk.", price: 240, allergens: null },
          { id: "hk-11B", number: "11B", name: "Kaeng Khiao Wan Gai — kylling i grønn karri", desc: "Kyllingfilet og ferske grønnsaker woket i grønn karri og kokosmelk.", price: 240, allergens: null },
          { id: "hk-12A", number: "12A", name: "Kaeng Phet Nuea — biff i rød karri", desc: "Marinert oksekjøtt og grønnsaker i rød karri og kokosmelk.", price: 240, allergens: null },
          { id: "hk-12B", number: "12B", name: "Kaeng Khiao Wan Nuea — biff i grønn karri", desc: "Marinert oksekjøtt og grønnsaker i grønn karri og kokosmelk.", price: 240, allergens: null },
          { id: "hk-13A", number: "13A", name: "Kaeng Phet Gong — kongereker i rød karri", desc: "Marinerte kongereker og grønnsaker i rød karri og kokosmelk.", price: 240, allergens: "8" },
          { id: "hk-13B", number: "13B", name: "Kaeng Khiao Wan Gong — kongereker i grønn karri", desc: "Marinerte kongereker og grønnsaker i grønn karri og kokosmelk.", price: 240, allergens: "8" }
        ]
      },
      {
        category: "Norske retter",
        items: [
          { id: "hk-39", number: "39", name: "Biffsnadder av indrefilet", desc: "Med bearnaisesaus, salat og pommes frites.", price: 320, allergens: "10, 11" },
          { id: "hk-40", number: "40", name: "1/2 Kylling", desc: "Serveres med pommes frites og salat.", price: 200, allergens: "10, 11" },
          { id: "hk-41", number: "41", name: "Wienerschnitzel", desc: "Med pommes frites og salat.", price: 200, allergens: "6, 10, 11" },
          { id: "hk-43", number: "43", name: "Karbonader", desc: "Med grønnsaker, brun saus, tyttebær og poteter.", price: 200, allergens: "1, 10" }
        ]
      },
      {
        category: "Fiskeretter",
        items: [
          { id: "hk-29", number: "29", name: "Kongereker chop seuy", desc: "Med grønnsaker.", price: 230, allergens: "5, 6, 8, 9" },
          { id: "hk-30", number: "30", name: "Kongereker i karrisaus", desc: "Med grønnsaker.", price: 230, allergens: "8" },
          { id: "hk-31", number: "31", name: "Innbakte kongereker med søtsur saus", desc: "", price: 230, allergens: "2, 6, 7, 8" },
          { id: "hk-32", number: "32", name: "Tempura scampi med søtsur saus", desc: "", price: 230, allergens: "5, 6, 8, 9" },
          { id: "hk-33", number: "33", name: "Innbakt fisk med søtsur saus", desc: "", price: 200, allergens: "6, 7" },
          { id: "hk-34", number: "34", name: "Innbakt blekksprut med søtsur saus", desc: "", price: 200, allergens: "2, 6, 7, 9" }
        ]
      },
      {
        category: "Kylling, and og svin",
        items: [
          { id: "hk-21", number: "21", name: "Kylling chop seuy", desc: "Med grønnsaker.", price: 200, allergens: "5, 6, 9" },
          { id: "hk-22", number: "22", name: "Kylling i karrisaus", desc: "Med grønnsaker.", price: 200, allergens: null },
          { id: "hk-23", number: "23", name: "Kylling i szechuansaus", desc: "Med grønnsaker.", price: 200, allergens: "5, 6, 9" },
          { id: "hk-23A", number: "23A", name: "Kylling i peppersaus", desc: "Med grønnsaker.", price: 200, allergens: "5, 6, 9" },
          { id: "hk-24", number: "24", name: "Frityrstekt kylling i søtsur saus", desc: "Med potetmel.", price: 200, allergens: "6, 7" },
          { id: "hk-24A", number: "24A", name: "Innbakt kyllingfilet med søtsur saus", desc: "I hvetemel.", price: 200, allergens: "6, 7" },
          { id: "hk-24B", number: "24B", name: "Frityrstekt kylling lårfilet med sesam i søtsur saus", desc: "", price: 200, allergens: "6, 7" },
          { id: "hk-25", number: "25", name: "Innbakt and med søtsur saus", desc: "", price: 280, allergens: "6, 7" },
          { id: "hk-26", number: "26", name: "Peking-and i soyasaus", desc: "Med grønnsaker.", price: 280, allergens: "5, 6, 9" },
          { id: "hk-26A", number: "26A", name: "Peking-and i szechuansaus (sterk)", desc: "Med grønnsaker.", price: 280, allergens: "5, 6, 9" },
          { id: "hk-27", number: "27", name: "Sprøstekt svinefilet i søtsur saus", desc: "Med vannkastanjer, gulrot og grønnsaker.", price: 200, allergens: "7" }
        ]
      },
      {
        category: "Annet",
        items: [
          { id: "hk-36", number: "36", name: "Stekt ris med kylling, egg og grønnsaker", desc: "", price: 200, allergens: "2, 8" },
          { id: "hk-36B", number: "36B", name: "Kinesiske nudler med biff, kylling, egg og grønnsaker", desc: "", price: 200, allergens: "2, 5, 6, 9" }
        ]
      }
    ]
  },

  {
    id: "happy-time",
    name: "Happy Time",
    cuisine: "Kebab · Pizza · Burger",
    address: "Tollbodgaten 5, Arendal",
    rating: 4.3,
    prepMins: 12,
    color: "#1f7a3a",
    emoji: "🥙",
    open: true,
    blurb: "Kebab, pizza og burgere — rask take-away rett ved Pollen.",
    menu: [
      {
        category: "Kebab",
        items: [
          { id: "ht-1", number: "1", name: "Kebab i pita brød", desc: "Salat, løk, tomat, mais, agurk og kebabsaus.", price: 171, allergens: null },
          { id: "ht-2", number: "2", name: "Kebab i rull", desc: "Salat, løk, tomat, mais, agurk og kebabsaus.", price: 171, allergens: null },
          { id: "ht-3", number: "3", name: "Super kebab i rull", desc: "Alle grønnsaker, pommes frites, bacon, ost, kebabkjøtt og kebabsaus.", price: 229, allergens: null },
          { id: "ht-4", number: "4", name: "Kebab tallerken", desc: "Pommes frites, salat, løk, tomat, agurk, kebabsaus og brød.", price: 194, allergens: null },
          { id: "ht-5", number: "5", name: "Kebab salat", desc: "Salat, mais, løk, tomat, agurk og kebabsaus.", price: 171, allergens: null },
          { id: "ht-6", number: "6", name: "Kylling i pita brød", desc: "Salat, løk, tomat, mais, agurk og kebabsaus.", price: 183, allergens: null },
          { id: "ht-7", number: "7", name: "Kylling i rull", desc: "Salat, løk, tomat, mais, agurk og kebabsaus.", price: 183, allergens: null },
          { id: "ht-8", number: "8", name: "Kylling tallerken", desc: "Pommes frites, salat, løk, tomat, mais, agurk, kebabsaus og brød.", price: 194, allergens: null },
          { id: "ht-9", number: "9", name: "Super kebab tallerken", desc: "Kebabkjøtt, bacon og ost i lefsebrød, pommes frites, salat og hvitløksdressing.", price: 240, allergens: null },
          { id: "ht-10", number: "10", name: "Mexicano kebab i rull", desc: "Kebabkjøtt, pommes frites, jalapeños og sterk kebabsaus.", price: 190, allergens: null },
          { id: "ht-11", number: "11", name: "Kebab i rull med fetaost", desc: "Alle salater, kebabkjøtt, fetaost og kebabsaus.", price: 190, allergens: null },
          { id: "ht-12", number: "12", name: "Cheesy bacon kebab", desc: "Pommes frites, kebabkjøtt, cheese saus, bacon og kebabsaus.", price: 229, allergens: null },
          { id: "ht-13", number: "13", name: "Cheesy skinke kebab", desc: "Pommes frites, kebabkjøtt, cheese saus, skinke og kebabsaus.", price: 217, allergens: null }
        ]
      },
      {
        category: "Pizza",
        items: [
          { id: "ht-14", number: "14", name: "Margherita", desc: "Tomatsaus og ost.", price: 171, allergens: null },
          { id: "ht-15", number: "15", name: "Skinke pizza", desc: "Tomatsaus, ost og skinke.", price: 183, allergens: null },
          { id: "ht-16", number: "16", name: "Capricciosa", desc: "Tomatsaus, ost, skinke og sjampinjong.", price: 183, allergens: null },
          { id: "ht-17", number: "17", name: "Pepperoni Pizza", desc: "Tomatsaus, ost, pepperoni og løk.", price: 194, allergens: null },
          { id: "ht-18", number: "18", name: "Hawaii Pizza", desc: "Tomatsaus, ost, skinke og ananas.", price: 183, allergens: null },
          { id: "ht-19", number: "19", name: "Norge Spesial", desc: "Tomatsaus, ost, pommes frites, kebabkjøtt og kebabsaus.", price: 217, allergens: null },
          { id: "ht-20", number: "20", name: "Kebab Pizza", desc: "Tomatsaus, ost, kebabkjøtt og kebabsaus.", price: 206, allergens: null },
          { id: "ht-21", number: "21", name: "Trippel Pizza", desc: "Tomatsaus, ost, pepperoni, skinke, bacon, løk og sjampinjong.", price: 229, allergens: null },
          { id: "ht-22", number: "22", name: "Biff Pizza", desc: "Tomatsaus, ost, biffkjøtt, paprika, løk, sjampinjong og bearnaisesaus.", price: 217, allergens: null },
          { id: "ht-23", number: "23", name: "Mamma Mia Spesial", desc: "Tomatsaus, ost, kylling, biffkjøtt, paprika, løk, sjampinjong, jalapeños og hvitløksdressing.", price: 229, allergens: null },
          { id: "ht-24", number: "24", name: "Kylling Pizza", desc: "Tomatsaus, ost, kylling, paprika, løk, sjampinjong og hvitløksdressing.", price: 217, allergens: null },
          { id: "ht-25", number: "25", name: "Favoritt Pizza", desc: "Tomatsaus, ost, pepperoni, skinke, ananas og sjampinjong.", price: 194, allergens: null },
          { id: "ht-26", number: "26", name: "Bacon Pizza", desc: "Tomatsaus, ost, skinke, bacon og løk.", price: 194, allergens: null },
          { id: "ht-27", number: "27", name: "Taco Pizza", desc: "Tomatsaus, ost, tacokrydder, nachos, biff, paprika, løk, jalapeños og hvitløksdressing.", price: 229, allergens: null },
          { id: "ht-28", number: "28", name: "Spicy Chicken Pizza", desc: "Tomatsaus, ost, kylling, jalapeños, chiliflakes og løk.", price: 217, allergens: null },
          { id: "ht-29", number: "29", name: "Fifty Fifty Pizza", desc: "Halv kylling, halv kebab, tomatsaus og ost. Med kebabdressing.", price: 217, allergens: null },
          { id: "ht-30", number: "30", name: "Vegetar Pizza", desc: "Tomatsaus, ost, paprika, løk, sjampinjong, tomat, mais og ananas.", price: 183, allergens: null }
        ]
      },
      {
        category: "Innbakt pizza",
        items: [
          { id: "ht-32", number: "32", name: "Calzone", desc: "Tomatsaus, ost og skinke.", price: 171, allergens: null },
          { id: "ht-33", number: "33", name: "Romana", desc: "Tomatsaus, ost, skinke og sjampinjong.", price: 194, allergens: null },
          { id: "ht-34", number: "34", name: "Spesial calzone", desc: "Tomatsaus, ost, kebabkjøtt og kebabsaus på siden.", price: 206, allergens: null }
        ]
      },
      {
        category: "Hamburger",
        items: [
          { id: "ht-43", number: "43", name: "Classic burger", desc: "Burgerkjøtt, salat, løk, tomat og burgerdressing.", price: 125, allergens: null },
          { id: "ht-44", number: "44", name: "Cheese burger", desc: "Burgerkjøtt, cheddarost, salat, løk, tomat og dressing.", price: 137, allergens: null },
          { id: "ht-45", number: "45", name: "Hamburger tallerken", desc: "Serveres med pommes frites.", price: 160, allergens: null },
          { id: "ht-46", number: "46", name: "OMG burger", desc: "Bacon, cheddar, salat, løk, chipotle, burgerdressing, sriracha og jalapeños.", price: 178, allergens: null },
          { id: "ht-47", number: "47", name: "Chicken burger", desc: "Crispy chicken, cheddar, salat, tomat, løk, chipotle og burgerdressing.", price: 160, allergens: null }
        ]
      },
      {
        category: "Andre retter",
        items: [
          { id: "ht-40", number: "40", name: "Lovbiff steak", desc: "Pommes frites, salat, løk, mais, tomat, agurk, bearnaisesaus og brød.", price: 194, allergens: null },
          { id: "ht-41", number: "41", name: "Biff snadder tallerken", desc: "Pommes frites, biffkjøtt, paprika, løk, sjampinjong, bearnaisesaus og brød.", price: 217, allergens: null },
          { id: "ht-42", number: "42", name: "Kylling snadder tallerken", desc: "Pommes frites, kyllingkjøtt, paprika, løk, sjampinjong, bearnaisesaus og brød.", price: 229, allergens: null }
        ]
      },
      {
        category: "Barnemeny",
        items: [
          { id: "ht-35", number: "35", name: "Margarita pizza", desc: "Tomatsaus og ost.", price: 125, allergens: null },
          { id: "ht-36", number: "36", name: "Skinke pizza", desc: "Tomatsaus, ost og skinke.", price: 137, allergens: null },
          { id: "ht-37", number: "37", name: "Pepperoni pizza", desc: "Tomatsaus og pepperoni.", price: 137, allergens: null },
          { id: "ht-38", number: "38", name: "Hamburger", desc: "Pommes frites, salat og burgerdressing.", price: 137, allergens: null },
          { id: "ht-39", number: "39", name: "Nuggets og fries", desc: "Pommes frites og 5 stk nuggets.", price: 148, allergens: null }
        ]
      },
      {
        category: "Tilbehør og drikke",
        items: [
          { id: "ht-fries", number: null, name: "Pommes frites", desc: "Velg størrelse.", price: 68, allergens: null },
          { id: "ht-ccfries", number: null, name: "Chili cheese fries", desc: "", price: 102, allergens: null },
          { id: "ht-coke", number: null, name: "Coca-Cola 0,5 l", desc: "", price: 45, allergens: null },
          { id: "ht-cokezero", number: null, name: "Coca-Cola Zero 0,5 l", desc: "", price: 45, allergens: null },
          { id: "ht-pepsi", number: null, name: "Pepsi Max 0,5 l", desc: "", price: 45, allergens: null },
          { id: "ht-sprite", number: null, name: "Sprite 0,5 l", desc: "", price: 45, allergens: null },
          { id: "ht-fanta", number: null, name: "Fanta Appelsin 0,5 l", desc: "", price: 45, allergens: null },
          { id: "ht-urge", number: null, name: "Urge 0,5 l", desc: "", price: 45, allergens: null }
        ]
      }
    ]
  },

  {
    id: "monsj",
    name: "Mønsj",
    cuisine: "Sandwich · Kafé",
    address: "Pollen, Arendal",
    rating: 4.7,
    prepMins: 8,
    color: "#5a3a22",
    emoji: "🥪",
    open: true,
    blurb: "Open sandwiches på godt brød. Kan bestilles glutenfritt.",
    menu: [
      {
        category: "Open sandwich",
        items: [
          { id: "mj-1", number: null, name: "Contadino", desc: "Husets italienske klassiker.", price: 159, allergens: null },
          { id: "mj-2", number: null, name: "BLT Sandwich", desc: "Bacon, salat, tomat.", price: 169, allergens: null },
          { id: "mj-3", number: null, name: "Rekesandwich", desc: "Klassisk reke-smørbrød.", price: 179, allergens: null },
          { id: "mj-4", number: null, name: "Brie & Bacon Sandwich", desc: "Smeltet brie og sprøstekt bacon.", price: 169, allergens: null },
          { id: "mj-5", number: null, name: "Nuvolari E Parma", desc: "Med parmaskinke.", price: 169, allergens: null }
        ]
      }
    ]
  },

  // Coming soon — menus not yet confirmed.
  {
    id: "streetfood",
    name: "Streetfood Arendal",
    cuisine: "Markedshall · flere kjøkken",
    address: "Pollen, Arendal",
    rating: 4.4,
    prepMins: 15,
    color: "#2d3748",
    emoji: "🍴",
    open: false,
    blurb: "Flere kjøkken under samme tak — meny varierer per sesong.",
    menu: []
  },
  {
    id: "madam-reiersen",
    name: "Madam Reiersen",
    cuisine: "Nordisk · Sjømat",
    address: "Nedre Tyholmsvei 3, Arendal",
    rating: 4.7,
    prepMins: 20,
    color: "#0f4c5c",
    emoji: "🦐",
    open: false,
    blurb: "Sesongmeny — egen take-away kommer.",
    menu: []
  },
  {
    id: "cafe-victor",
    name: "Café Victor",
    cuisine: "Lunsj · Tapas",
    address: "Pollen, Arendal",
    rating: 4.3,
    prepMins: 10,
    color: "#7a3b00",
    emoji: "☕",
    open: false,
    blurb: "Lunsjmeny under oppdatering.",
    menu: []
  }
];
