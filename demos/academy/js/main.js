/* Coastal Café template — vanilla JS, no dependencies. Reads window.SITE from js/config.js. */
(function () {
  "use strict";

  var S = window.SITE || {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ── 1. Business info from config ── */
  var a = S.address || {};
  var addressLine = [a.street, a.city, [a.region, a.postalCode].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  var text = {
    name: S.name,
    tagline: S.tagline,
    phone: S.phone,
    email: S.email,
    addressLine: addressLine,
  };
  $$("[data-site]").forEach(function (el) {
    var v = text[el.getAttribute("data-site")];
    if (v) el.textContent = v;
  });

  var links = {
    tel: S.phoneE164 && "tel:" + S.phoneE164,
    mailto: S.email && "mailto:" + S.email,
    whatsapp: S.whatsapp && "https://wa.me/" + S.whatsapp + (S.whatsappMessage ? "?text=" + encodeURIComponent(S.whatsappMessage) : ""),
    instagram: S.social && S.social.instagram,
    facebook: S.social && S.social.facebook,
  };
  $$("[data-site-href]").forEach(function (el) {
    var key = el.getAttribute("data-site-href");
    if (links[key]) el.href = links[key];
    else if (key in links && el.closest("li")) el.closest("li").hidden = true;
  });

  var map = $("#map");
  if (map && S.mapQuery) {
    var src = "https://www.google.com/maps?q=" + encodeURIComponent(S.mapQuery) + "&output=embed";
    if (map.getAttribute("src") !== src) map.src = src;
    map.title = "Map showing " + (S.name || "our") + " location";
  }

  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ── 2. Opening hours table + open-now badge ── */
  function fmt(t) {
    var p = t.split(":"), h = +p[0], m = p[1];
    var suffix = h >= 12 ? "pm" : "am";
    h = h % 12 || 12;
    return h + ":" + m + " " + suffix;
  }
  function toMin(t) { var p = t.split(":"); return +p[0] * 60 + +p[1]; }

  var hours = S.hours || [];
  var tbody = $("#hours-body");
  // Current day/time in the business's time zone, not the visitor's.
  var now = new Date();
  var parts = {};
  try {
    new Intl.DateTimeFormat("en-GB", { timeZone: S.timeZone || undefined, weekday: "long", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(now).forEach(function (p) { parts[p.type] = p.value; });
  } catch (e) {
    parts = { weekday: now.toLocaleDateString("en-GB", { weekday: "long" }), hour: String(now.getHours()), minute: String(now.getMinutes()) };
  }
  var nowMin = +parts.hour * 60 + +parts.minute;

  if (tbody && hours.length) {
    tbody.innerHTML = "";
    hours.forEach(function (h) {
      var tr = document.createElement("tr");
      var th = document.createElement("th");
      var td = document.createElement("td");
      th.scope = "row";
      th.textContent = h.day;
      td.textContent = h.open ? fmt(h.open) + " – " + fmt(h.close) : "Closed";
      if (h.day === parts.weekday) {
        tr.className = "is-today";
        th.textContent += " (today)";
      }
      tr.appendChild(th);
      tr.appendChild(td);
      tbody.appendChild(tr);
    });
  }

  var status = $("#open-status");
  var today = hours.filter(function (h) { return h.day === parts.weekday; })[0];
  if (status && today) {
    var open = today.open && nowMin >= toMin(today.open) && nowMin < toMin(today.close);
    status.textContent = open ? "● Open now, until " + fmt(today.close) : "● Closed right now";
    status.className = "open-status " + (open ? "is-open" : "is-closed");
  }

  /* ── 3. JSON-LD kept in sync with config ── */
  var ld = $("#jsonld");
  if (ld && S.name) {
    var dayGroups = {};
    hours.forEach(function (h) {
      if (!h.open) return;
      var k = h.open + "-" + h.close;
      (dayGroups[k] = dayGroups[k] || { open: h.open, close: h.close, days: [] }).days.push(h.day);
    });
    var data = {
      "@context": "https://schema.org",
      "@type": S.businessType || "LocalBusiness",
      name: S.name,
      description: S.description,
      url: S.url,
      telephone: S.phoneE164,
      email: S.email,
      priceRange: S.priceRange,
      address: {
        "@type": "PostalAddress",
        streetAddress: a.street,
        addressLocality: a.city,
        addressRegion: a.region,
        postalCode: a.postalCode,
        addressCountry: a.country,
      },
    };
    var hourSpecs = Object.keys(dayGroups).map(function (k) {
      var g = dayGroups[k];
      return { "@type": "OpeningHoursSpecification", dayOfWeek: g.days, opens: g.open, closes: g.close };
    });
    if (hourSpecs.length) data.openingHoursSpecification = hourSpecs;
    try { data.image = JSON.parse(ld.textContent).image; } catch (e) { /* keep going */ }
    if (S.geo) data.geo = { "@type": "GeoCoordinates", latitude: S.geo.lat, longitude: S.geo.lng };
    var sameAs = S.social ? Object.keys(S.social).map(function (k) { return S.social[k]; }).filter(Boolean) : [];
    if (sameAs.length) data.sameAs = sameAs;
    ld.textContent = JSON.stringify(data, null, 2);
  }

  /* ── 4. Mobile nav ── */
  var toggle = $(".nav-toggle");
  var nav = $("#site-nav");
  function setNav(open) {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () { setNav(toggle.getAttribute("aria-expanded") !== "true"); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setNav(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setNav(false); toggle.focus(); }
    });
  }

  /* ── 5. Contact form ── */
  var form = $("#contact-form");
  if (!form) return;

  var cfg = S.form || {};
  // WhatsApp mode needs no server: the visitor's own chat carries the enquiry.
  var whatsappMode = cfg.mode === "whatsapp" && !!S.whatsapp;
  var endpoint = cfg.endpoint || form.getAttribute("action");
  var isStaticHost = (cfg.staticHosts || []).some(function (h) { return location.hostname.slice(-h.length) === h; });
  var demoMode = endpoint === "contact.php" && (isStaticHost || location.protocol === "file:");
  form.action = endpoint;

  var statusEl = $("#form-status");
  var ts = $("#f-ts");
  if (ts) ts.value = String(Math.floor(Date.now() / 1000));

  var rules = {
    name: function (v) {
      if (!v) return "Please enter your name.";
      if (v.length < 2) return "Name looks too short.";
    },
    email: function (v) {
      if (!v) return "Please enter your email address.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Please enter a valid email, like name@example.com.";
    },
    phone: function (v) {
      if (v && !/^[0-9+()\s-]{7,20}$/.test(v)) return "Use digits, spaces, + or - (7–20 characters).";
    },
    message: function (v, input) {
      if (!v) return input.required ? "Please write a message." : "";
      if (v.length < input.minLength) return "Message should be at least " + input.minLength + " characters.";
      if (v.length > 2000) return "Message should be under 2000 characters.";
    },
  };

  if (whatsappMode) {
    // The chat already identifies the visitor, so don't ask for email or phone.
    ["email", "phone"].forEach(function (name) {
      var input = form.elements[name];
      delete rules[name];
      if (input) input.closest(".field").hidden = true;
    });
    $("[type=submit]", form).textContent = cfg.submitLabel || "Send on WhatsApp";
  }

  // Any other required field (dates, dropdowns) just has to be filled in.
  $$("input[required], select[required], textarea[required]", form).forEach(function (input) {
    if (!rules[input.name] && !input.closest("[hidden]")) {
      rules[input.name] = function (v) { if (!v) return "Please fill this in."; };
    }
  });

  function validateField(input) {
    var rule = rules[input.name];
    if (!rule) return true;
    var msg = rule(input.value.trim(), input);
    var err = document.getElementById(input.id + "-err");
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    if (err) err.textContent = msg || "";
    return !msg;
  }

  Object.keys(rules).forEach(function (name) {
    var input = form.elements[name];
    input.addEventListener("blur", function () { if (input.value) validateField(input); });
    input.addEventListener("input", function () { if (input.getAttribute("aria-invalid") === "true") validateField(input); });
  });

  function setStatus(msg, kind) {
    statusEl.textContent = msg;
    statusEl.className = "form-status" + (kind ? " is-" + kind : "");
  }

  function niceDate(v) {
    var d = new Date(v + "T00:00:00");
    return isNaN(d) ? v : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  // One "Label: value" line per filled-in field, so new fields need no code.
  function enquiryText() {
    var lines = [S.whatsappMessage || "Hi " + S.name + ", I have an enquiry.", ""];
    $$("input, select, textarea", form).forEach(function (el) {
      var v = el.value.trim();
      if (!v || !el.name || el.type === "hidden" || el.closest(".hp, [hidden]")) return;
      var label = el.id && $('label[for="' + el.id + '"]', form);
      var title = label ? label.firstChild.textContent.trim().replace(/[?:]+$/, "") : el.name;
      lines.push(title + ": " + (el.type === "date" ? niceDate(v) : v));
    });
    return lines.join("\n");
  }

  function openWhatsApp() {
    var url = "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(enquiryText());
    // wa.me only fills in the chat, so tell people the last step is theirs.
    setStatus("WhatsApp is opening with your enquiry. Press send there to finish.", "success");
    var fallback = document.createElement("a");
    fallback.href = url;
    fallback.target = "_blank";
    fallback.rel = "noopener";
    fallback.textContent = "Not opening? Tap here.";
    statusEl.appendChild(document.createTextNode(" "));
    statusEl.appendChild(fallback);
    window.open(url, "_blank", "noopener");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var firstBad = null;
    Object.keys(rules).forEach(function (name) {
      var input = form.elements[name];
      if (!validateField(input) && !firstBad) firstBad = input;
    });
    if (firstBad) {
      setStatus("Please fix the highlighted fields.", "error");
      firstBad.focus();
      return;
    }
    // Honeypot filled → silently pretend success.
    if (form.elements.website.value) {
      setStatus("Thanks! Your message has been sent.", "success");
      form.reset();
      return;
    }
    if (whatsappMode) {
      openWhatsApp();
      return;
    }
    if (demoMode) {
      setStatus("Demo mode: your message looks good, but nothing was sent. Set form.endpoint in js/config.js to go live.", "success");
      return;
    }

    var btn = form.querySelector("[type=submit]");
    btn.disabled = true;
    setStatus("Sending…");

    fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (body) { return { ok: res.ok, body: body }; });
      })
      .then(function (r) {
        if (r.ok) {
          setStatus((r.body && r.body.message) || "Thanks! Your message has been sent. We'll reply soon.", "success");
          form.reset();
          if (ts) ts.value = String(Math.floor(Date.now() / 1000));
        } else {
          var errs = (r.body && r.body.errors) || {};
          // contact.php returns { errors: { field: msg } }; Formspree returns { errors: [ {field, message} ] }.
          if (Array.isArray(errs)) errs = errs.reduce(function (o, x) { o[x.field || "_"] = x.message; return o; }, {});
          Object.keys(errs).forEach(function (f) {
            var input = form.elements[f];
            var err = input && document.getElementById(input.id + "-err");
            if (err) { err.textContent = errs[f]; input.setAttribute("aria-invalid", "true"); }
          });
          setStatus((r.body && (r.body.message || r.body.error)) || "Sorry, something went wrong. Please try WhatsApp or call us.", "error");
        }
      })
      .catch(function () {
        setStatus("Network error. Please try again, or message us on WhatsApp.", "error");
      })
      .then(function () { btn.disabled = false; });
  });
})();
