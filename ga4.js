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
 window.SplashLensGa4 = {
  id: measurementId,
  attribution: readAttribution,
  event: function (name, props) {
   var eventName = normalizeEventName(name);
   var payload = Object.assign({
    event_category: "splashlens_growth",
    page_path: window.location.pathname,
    page_location: window.location.href
   }, readAttribution(), props || {});
   window.gtag("event", eventName, payload);
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
})();
