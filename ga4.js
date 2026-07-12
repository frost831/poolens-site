(function () {
 var measurementId = "G-9BGE6WFF23";
 if (!measurementId || window.__splashlensGa4Loaded) return;
 window.__splashlensGa4Loaded = true;
 window.dataLayer = window.dataLayer || [];
 window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };
 function readAttribution() {
  var params = new URLSearchParams(window.location.search || "");
  var keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "gbraid", "wbraid"];
  var values = {};
  keys.forEach(function (key) {
   var value = params.get(key);
   if (value) values[key] = value.slice(0, 160);
  });
  return values;
 }
 function normalizeEventName(name) {
  var map = {
   app_store_download_click: "select_app_store",
   google_play_download_click: "select_google_play",
   checkout_click: "begin_checkout",
   open_app_click: "open_app",
   partsnap_click: "select_partsnap",
   team_deployment_click: "generate_lead",
   route_ready_notify_submit: "generate_lead"
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
 function mirrorOwnerEvent(name, props) {
  var eventName = name || "site_event";
  if (!/^(app_store_download_click|google_play_download_click|checkout_click|open_app_click|partsnap_click|team_deployment_click|route_ready_notify_submit|persona_fork_click)$/.test(eventName)) return;
  var body = JSON.stringify({
   event: eventName,
   source: "site",
   path: window.location.pathname + window.location.search,
   props: Object.assign({
    client_id: clientId(),
    page_location: window.location.href,
    attribution_referrer: document.referrer || "",
    attribution_source: "site",
    attribution_campaign: (new URLSearchParams(window.location.search || "")).get("utm_campaign") || ""
   }, readAttribution(), props || {})
  });
  try {
   var endpoint = "https://app.splashlens.com/api/events";
   if (navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, new Blob([body], { type: "text/plain" }));
    return;
   }
   fetch(endpoint, { method: "POST", headers: { "Content-Type": "text/plain" }, body: body, keepalive: true, mode: "cors" }).catch(function () {});
  } catch (err) {}
 }
 window.SplashLensGa4 = {
  id: measurementId,
  attribution: readAttribution,
  event: function (name, props) {
   var eventName = normalizeEventName(name);
   var dedupeKey = name + "|" + JSON.stringify(props || {});
   var now = Date.now();
   if (window.__splashlensLastTracked && window.__splashlensLastTracked.key === dedupeKey && now - window.__splashlensLastTracked.at < 750) return;
   window.__splashlensLastTracked = { key: dedupeKey, at: now };
   var payload = Object.assign({
    event_category: "splashlens_growth",
    page_path: window.location.pathname,
    page_location: window.location.href
   }, readAttribution(), props || {});
   window.gtag("event", eventName, payload);
   mirrorOwnerEvent(name, props || {});
  }
 };
 window.gtag("js", new Date());
 window.gtag("config", measurementId, {
  send_page_view: true,
  page_path: window.location.pathname + window.location.search,
  page_location: window.location.href
 });
 var script = document.createElement("script");
 script.async = true;
 script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
 document.head.appendChild(script);
 document.addEventListener("click", function (event) {
  var link = event.target.closest && event.target.closest("[data-track]");
  if (!link || !window.SplashLensGa4 || typeof window.SplashLensGa4.event !== "function") return;
  window.SplashLensGa4.event(link.getAttribute("data-track"), {
   plan: link.getAttribute("data-plan") || "",
   source: link.getAttribute("data-source") || "",
   href: link.href || ""
  });
 });
})();
