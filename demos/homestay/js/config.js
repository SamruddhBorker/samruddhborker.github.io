/**
 * SITE CONFIG: fictional demo data for "Casa Mangueira".
 * Copied from business-website-template. See its README for how this works.
 */
window.SITE = {
  name: "Casa Mangueira",
  tagline: "A quiet family home under the old mango tree",
  description:
    "A three-room family homestay in an old Goan house in Loutolim, with home-cooked breakfast and a shady balcão.",
  url: "https://samruddhborker.github.io/demos/homestay/",
  businessType: "BedAndBreakfast",
  priceRange: "₹₹",

  phone: "+91 00000 00000",
  phoneE164: "+910000000000",
  whatsapp: "910000000000",
  whatsappMessage: "Hi Casa Mangueira! I'd like to check availability.",

  address: {
    street: "Sample Lane, Loutolim",
    city: "Salcete",
    region: "Goa",
    postalCode: "403718",
    country: "IN",
  },
  geo: { lat: 15.3365, lng: 73.9943 },
  mapQuery: "Loutolim, Goa",

  timeZone: "Asia/Kolkata",
  hours: [], // a homestay has check-in times, not opening hours

  social: {},

  form: {
    mode: "whatsapp",
    submitLabel: "Send my dates on WhatsApp",
  },
};
