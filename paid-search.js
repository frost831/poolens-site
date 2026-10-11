(function () {
 var endpoint = "/api/event";
 function track(eventName, props) {
  if (window.SplashLensGa4 && typeof window.SplashLensGa4.event === "function") {
   window.SplashLensGa4.event(eventName, props || {});
  }
  var body = JSON.stringify({
   event: eventName,
   source: "paid_landing",
   path: window.location.pathname + window.location.search,
   props: props || {}
  });
  try {
   if (navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
    return;
   }
   fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: body, keepalive: true }).catch(function () {});
  } catch (err) {}
 }
 track("paid_landing_view", {
  title: document.title,
  intent: document.body.getAttribute("data-intent") || ""
 });
})();
