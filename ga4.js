(function () {
 var measurementId = "G-9BGE6WFF23";
 if (!measurementId || window.__splashlensGa4Loaded) return;
 window.__splashlensGa4Loaded = true;
 window.dataLayer = window.dataLayer || [];
 window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };
 var attributionKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "role", "audience", "persona"];
 var eventKeys = ["plan", "source", "publication", "content_type", "content_id", "placement", "store", "client_reference_id", "destination", "challenge_path", "challenge_id", "challenge_type", "field_challenge", "attribution_campaign", "feature", "mode", "role", "audience", "persona", "client_id", "session_id", "test", "demo", "synthetic"];
 function safeUrl(value) {
  try {
   var url = new URL(value, window.location.href);
   return /^https?:$/.test(url.protocol) && !/@|%40/i.test(url.pathname) ? url.origin + url.pathname : "";
  } catch (err) { return ""; }
 }
 function safeProps(props) {
  var values = {};
  eventKeys.forEach(function (key) {
   var value = props && props[key];
   if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") return;
   var text = String(value).slice(0, 160);
   if (/@|\+\d{7,}|\b\d{3}[-. ]\d{3}[-. ]\d{4}\b/.test(text)) return;
   if (key === "client_reference_id" && !/^sl_checkout_[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(text)) return;
   if (!/^[a-z0-9_ .:/-]+$/i.test(text)) return;
   values[key] = value;
  });
  if (props && props.href) values.href = safeUrl(props.href);
  return values;
 }
 function prepareCheckoutLink(link) {
  if (!link || link.getAttribute("data-track") !== "checkout_click") return "";
  try {
   var url = new URL(link.href, window.location.href);
   var plan = link.getAttribute("data-plan");
   var placement = link.getAttribute("data-checkout-placement") || "";
   if (url.origin !== "https://app.splashlens.com" || url.pathname !== "/" || ["monthly", "yearly"].indexOf(plan) < 0 || url.searchParams.get("upgrade") !== plan || !/^site_[a-z0-9_]{1,60}$/.test(placement)) return "";
   var bytes = new Uint8Array(16);
   window.crypto.getRandomValues(bytes);
   bytes[6] = (bytes[6] & 15) | 64;
   bytes[8] = (bytes[8] & 63) | 128;
   var hex = Array.from(bytes, function (value) { return value.toString(16).padStart(2, "0"); }).join("");
   var reference = "sl_checkout_" + [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join("-");
   url.searchParams.set("source", "site");
   url.searchParams.set("placement", placement);
   url.searchParams.set("store", "web");
   url.searchParams.set("utm_source", url.searchParams.get("utm_source") || "site");
   url.searchParams.set("client_reference_id", reference);
   link.href = url.href;
   return reference;
  } catch (err) { return ""; }
 }
 function trackCheckoutHandoff(link) {
  var reference = prepareCheckoutLink(link);
  if (!reference) return;
  window.SplashLensGa4.event("checkout_click", {
   plan: link.getAttribute("data-plan"),
   source: "site",
   placement: link.getAttribute("data-checkout-placement"),
   store: "web",
   client_reference_id: reference,
   href: link.href
  });
 }
 function readAttribution() {
  var params = new URLSearchParams(window.location.search || "");
  var values = {};
  attributionKeys.forEach(function (key) {
   var value = params.get(key);
   if (value && /^[a-z0-9_ .-]{1,120}$/i.test(value)) values[key] = value;
  });
  if (Object.keys(values).length) {
   try { sessionStorage.setItem("splashlens-site-attribution", JSON.stringify(values)); } catch (err) {}
   return values;
  }
  try {
   var stored = JSON.parse(sessionStorage.getItem("splashlens-site-attribution") || "{}");
   attributionKeys.forEach(function (key) {
    if (stored && typeof stored[key] === "string" && /^[a-z0-9_ .-]{1,120}$/i.test(stored[key])) values[key] = stored[key];
   });
  } catch (err) {}
  return values;
 }
 function decorateAppLink(link, attribution) {
  if (!link || !link.href) return;
  try {
   var url = new URL(link.href, window.location.href);
   if (url.hostname !== "app.splashlens.com") return;
   Object.keys(attribution).forEach(function (key) {
    if (!url.searchParams.has(key)) url.searchParams.set(key, attribution[key]);
   });
   link.href = url.toString();
  } catch (err) {}
 }
 function decorateAppLinks() {
  var attribution = readAttribution();
  document.querySelectorAll('a[href*="app.splashlens.com"]').forEach(function (link) {
   decorateAppLink(link, attribution);
  });
 }
 function normalizeEventName(name) {
  var map = {
   app_store_download_click: "select_app_store",
   google_play_download_click: "select_google_play",
   checkout_click: "begin_checkout",
   open_app_click: "open_app",
   partsnap_click: "select_partsnap",
  press_coverage_click: "select_content",
  industry_intel_click: "select_content",
   team_deployment_click: "generate_lead",
   route_ready_notify_submit: "generate_lead",
   field_tester_lead: "generate_lead",
   partner_lead: "generate_lead"
  };
  return map[name] || name || "site_event";
 }
 function clientId() {
  try {
   var key = "splashlens-site-client-id";
   var id = localStorage.getItem(key);
   if (!id) {
    id = "site_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(key, id);
   }
   return id;
  } catch (err) {
   return "";
  }
 }
 function sessionId() {
  try {
   var key = "splashlens-site-session-id";
   var id = sessionStorage.getItem(key);
   if (!id) {
    id = "site_session_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(key, id);
   }
   return id;
  } catch (err) {
   return "";
  }
 }
 function mirrorOwnerEvent(name, props) {
  var eventName = name || "site_event";
  if (!/^(app_store_download_click|google_play_download_click|checkout_click|open_app_click|partsnap_click|press_coverage_click|industry_intel_click|team_deployment_click|route_ready_notify_submit|persona_fork_click|media_landing_view|campaign_landing_view|field_tester_lead|partner_lead|field_challenge_started|field_challenge_routed|field_challenge_feedback|referral_share)$/.test(eventName)) return;
  var body = JSON.stringify({
   event: eventName,
   source: "site",
   path: window.location.pathname,
   props: Object.assign({
    client_id: clientId(),
    session_id: sessionId(),
    attribution_source: "site",
    attribution_campaign: readAttribution().utm_campaign || ""
   }, readAttribution(), safeProps(props || {}))
  });
  try {
   var endpoint = name === "checkout_click" ? "/api/event" : "https://app.splashlens.com/api/events";
   if (navigator.sendBeacon) {
    try {
     if (navigator.sendBeacon(endpoint, new Blob([body], { type: "text/plain" }))) return;
    } catch (err) {}
   }
   fetch(endpoint, { method: "POST", headers: { "Content-Type": "text/plain" }, body: body, keepalive: true, mode: "cors" }).catch(function () {});
  } catch (err) {}
 }
 window.SplashLensGa4 = {
  id: measurementId,
  attribution: readAttribution,
  decorateAppLinks: decorateAppLinks,
  event: function (name, props) {
   var eventName = normalizeEventName(name);
   var dedupeKey = name + "|" + JSON.stringify(props || {});
   var now = Date.now();
   if (window.__splashlensLastTracked && window.__splashlensLastTracked.key === dedupeKey && now - window.__splashlensLastTracked.at < 750) return;
   window.__splashlensLastTracked = { key: dedupeKey, at: now };
   var payload = Object.assign({
    event_category: "splashlens_growth",
    page_path: window.location.pathname,
    page_location: safeUrl(window.location.href)
   }, readAttribution(), safeProps(props || {}));
   window.gtag("event", eventName, payload);
   mirrorOwnerEvent(name, safeProps(props || {}));
  }
 };
 window.gtag("js", new Date());
 window.gtag("config", measurementId, {
  send_page_view: true,
  page_path: window.location.pathname,
  page_location: safeUrl(window.location.href)
 });
 decorateAppLinks();
 if (document.body && document.body.hasAttribute("data-media-landing")) {
  window.SplashLensGa4.event("media_landing_view", {
   source: document.body.getAttribute("data-media-landing") || "paid_media"
  });
 }
 var script = document.createElement("script");
 script.async = true;
 script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
 document.head.appendChild(script);
 document.addEventListener("click", function (event) {
  var link = event.target.closest && event.target.closest("[data-track]");
  if (!link || !window.SplashLensGa4 || typeof window.SplashLensGa4.event !== "function") return;
  decorateAppLink(link, readAttribution());
  if (link.getAttribute("data-track") === "checkout_click") {
   trackCheckoutHandoff(link);
   return;
  }
  window.SplashLensGa4.event(link.getAttribute("data-track"), {
   plan: link.getAttribute("data-plan") || "",
   source: link.getAttribute("data-source") || "",
   publication: link.getAttribute("data-publication") || "",
   content_type: link.getAttribute("data-publication") ? "industry_coverage" : "",
   content_id: link.getAttribute("data-publication") || "",
   href: safeUrl(link.href || "")
  });
 });
})();
