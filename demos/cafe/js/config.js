/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIG — edit this file first when reusing the template.
 *  Everything here is fictional demo data for "Coastal Café, Goa".
 * ─────────────────────────────────────────────────────────────
 *  Values here are injected into every element marked with
 *  data-site="key" in index.html, the opening-hours table, the
 *  WhatsApp/phone/email links, the map and the JSON-LD block.
 *  (Static <head> meta tags — title, description, Open Graph —
 *  are read by crawlers without JavaScript, so update those in
 *  index.html by hand. See README → "Reuse for a new client".)
 */
window.SITE = {
  name: "Coastal Café",
  tagline: "Slow mornings, sea breeze & Goan coffee",
  description:
    "A relaxed beachside café in Goa serving specialty coffee, Goan breakfasts and fresh bakes.",
  url: "https://samruddhborker.github.io/demos/cafe/", // live site URL (used in JSON-LD)
  businessType: "CafeOrCoffeeShop", // any schema.org LocalBusiness subtype
  priceRange: "₹₹",

  phone: "+91 00000 00000", // shown on the page
  phoneE164: "+910000000000", // used in tel: links + JSON-LD
  whatsapp: "910000000000", // country code + number, digits only
  whatsappMessage: "Hi Coastal Café! I'd like to book a table.",
  email: "hello@example.com",

  address: {
    street: "123 Beach Road, Candolim",
    city: "Bardez",
    region: "Goa",
    postalCode: "403515",
    country: "IN",
  },
  geo: { lat: 15.5182, lng: 73.7626 },
  // Search text for the Google Maps embed (no API key needed).
  mapQuery: "Candolim Beach, Goa",

  // Used for the "Open now / Closed" badge, whatever the visitor's clock says.
  timeZone: "Asia/Kolkata",
  // 24-hour times. Use null for closed days.
  hours: [
    { day: "Monday", open: "08:00", close: "22:00" },
    { day: "Tuesday", open: "08:00", close: "22:00" },
    { day: "Wednesday", open: null, close: null },
    { day: "Thursday", open: "08:00", close: "22:00" },
    { day: "Friday", open: "08:00", close: "23:00" },
    { day: "Saturday", open: "07:30", close: "23:00" },
    { day: "Sunday", open: "07:30", close: "22:00" },
  ],

  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
  },

  form: {
    // "whatsapp": the form opens the visitor's WhatsApp with the enquiry
    // written out, ready to send. Needs no server or form account, so it
    // works on any host. Remove this line to use `endpoint` below instead.
    mode: "whatsapp",
    // Optional: button text in WhatsApp mode.
    // submitLabel: "Send on WhatsApp",

    // When mode isn't "whatsapp": "contact.php" for PHP hosting (Hostinger,
    // cPanel, …), or a Formspree endpoint like
    // "https://formspree.io/f/abcdwxyz" for static hosting.
    endpoint: "contact.php",
    // On these hosts PHP can't run, so if endpoint is still
    // "contact.php" the form runs in demo mode (validates, doesn't send).
    staticHosts: ["github.io"],
  },
};
