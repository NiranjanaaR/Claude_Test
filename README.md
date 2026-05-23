# Hentmat — pickup-only food ordering, Arendal

A static demo MVP exploring a Wolt-style ordering app focused on **pickup**
rather than delivery. Built to help local Arendal restaurants smooth out
the summer rush by letting customers reserve a pickup slot in advance.

## Run it

No build step — just open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
# then open http://localhost:8000
```

## What's in the demo

- `index.html` — restaurant list (6 fictional Arendal restaurants)
- `restaurant.html` — menu, cart, and pickup-time slot picker
- `confirm.html` — order confirmation with a four-character pickup code
- `data.js` — fake restaurant + menu data
- `app.js` — client-side flow; cart persisted in `localStorage`
- `styles.css` — Nordic-styled UI

## The flow

1. Browse restaurants on the home page
2. Pick a restaurant → add items to the cart
3. Choose a pickup time slot (15-min intervals, starting after the kitchen's prep time)
4. "Reserve pickup" → get a pickup code to show at the counter

## Not included (would need a real backend)

- Payments, restaurant dashboard / order printer, real menus, accounts,
  push notifications when the order is ready, capacity limits per slot.
