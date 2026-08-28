(function () {
  "use strict";

  var form = document.getElementById("field-challenge-form");
  var active = document.getElementById("field-challenge-active");
  if (!form || !active) return;

  var route = document.getElementById("field-challenge-route");
  var direction = document.getElementById("field-challenge-direction");
  var activeTitle = document.getElementById("field-challenge-active-title");
  var feedback = document.getElementById("field-challenge-feedback");
  var referral = document.getElementById("field-challenge-referral");
  var status = document.getElementById("field-challenge-status");
  var time = document.getElementById("field-challenge-time");
  var meter = document.getElementById("field-challenge-meter");
  var meterWrap = meter && meter.parentElement;
  var reset = document.getElementById("field-challenge-reset");
  var params = new URLSearchParams(window.location.search || "");
  var storageKey = "splashlens-field-challenge";
  var maxRestoreAge = 30 * 60 * 1000;
  var timerId = 0;
  var state = null;

  var modes = {
    code: {
      label: "Open code lookup",
      direction: "Use one real code from the equipment in front of you.",
      url: "https://app.splashlens.com/?tab=errors",
      path: "lookup"
    },
    part: {
      label: "Open PartSnap",
      direction: "Use one real part, label, or visible clue from the stop.",
      url: "https://app.splashlens.com/?tab=scan&mode=parts",
      path: "partsnap"
    },
    equipment: {
      label: "Open equipment lookup",
      direction: "Use one real brand, model, symptom, or equipment family.",
      url: "https://app.splashlens.com/?tab=errors",
      path: "lookup"
    },
    proof: {
      label: "Open visit proof",
      direction: "Use one real closing note, repair handoff, customer explanation, or photo trail.",
      url: "https://app.splashlens.com/?tab=report&workflow=closing",
      path: "service_proof"
    }
  };

  function safe(value, length) {
    return String(value || "").replace(/[^a-zA-Z0-9_.-]/g, "_").slice(0, length || 100);
  }

  function bounded(value, length) {
    return String(value || "").slice(0, length || 100);
  }

  function challengeId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return "fc_" + window.crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    }
    return "fc_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  function inbound() {
    return {
      referral_audience: bounded(params.get("referral_audience"), 40),
      referral_id: bounded(params.get("referral_id"), 80),
      audience: bounded(params.get("audience"), 60),
      partner: bounded(params.get("partner"), 100),
      participant: bounded(params.get("participant_id") || params.get("participant"), 100),
      pilot: bounded(params.get("pilot_id") || params.get("pilot"), 100),
      ref: bounded(params.get("ref"), 100)
    };
  }

  function track(name, properties) {
    if (!window.SplashLensGa4 || typeof window.SplashLensGa4.event !== "function") return;
    window.SplashLensGa4.event(name, Object.assign({
      challenge_id: state ? state.id : "",
      challenge_type: state ? state.type : "",
      referral_audience: inbound().referral_audience,
      referral_id: inbound().referral_id,
      participant: inbound().participant,
      pilot: inbound().pilot,
      participant_id: inbound().participant,
      pilot_id: inbound().pilot,
      ref: inbound().ref,
      source: "campaign_field_challenge"
    }, properties || {}));
  }

  function saveState() {
    try { sessionStorage.setItem(storageKey, JSON.stringify(state)); } catch (error) {}
  }

  function clearState() {
    try { sessionStorage.removeItem(storageKey); } catch (error) {}
  }

  function readState() {
    try {
      var stored = JSON.parse(sessionStorage.getItem(storageKey) || "null");
      if (!stored || !modes[stored.type] || !stored.startedAt) return null;
      if (Date.now() - Number(stored.startedAt) > maxRestoreAge) return null;
      return stored;
    } catch (error) {
      return null;
    }
  }

  function routeUrl() {
    var mode = modes[state.type];
    var url = new URL(mode.url);
    var attribution = window.SplashLensGa4 && typeof window.SplashLensGa4.attribution === "function"
      ? window.SplashLensGa4.attribution()
      : {};
    Object.keys(attribution).forEach(function (key) {
      if (attribution[key]) url.searchParams.set(key, attribution[key]);
    });
    ["audience", "partner", "participant", "participant_id", "pilot", "pilot_id", "ref"].forEach(function (key) {
      var value = params.get(key);
      if (value) url.searchParams.set(key, value.slice(0, 160));
    });
    url.searchParams.set("challenge", "field60");
    url.searchParams.set("challenge_path", mode.path);
    url.searchParams.set("challenge_id", state.id);
    url.searchParams.set("challenge_type", state.type);
    if (inbound().referral_audience) url.searchParams.set("referral_audience", inbound().referral_audience);
    if (inbound().referral_id) url.searchParams.set("referral_id", inbound().referral_id);
    return url.toString();
  }

  function standardizeCampaignAppLinks() {
    var attribution = window.SplashLensGa4 && typeof window.SplashLensGa4.attribution === "function"
      ? window.SplashLensGa4.attribution()
      : {};
    document.querySelectorAll('a[href*="app.splashlens.com"]').forEach(function (link) {
      if (link === route && state) return;
      try {
        var url = new URL(link.href, window.location.href);
        var isPartSnap = url.searchParams.get("tab") === "scan" || url.searchParams.get("mode") === "parts";
        url.searchParams.set("challenge", "field60");
        url.searchParams.set("challenge_path", isPartSnap ? "partsnap" : "lookup");
        Object.keys(attribution).forEach(function (key) {
          if (attribution[key]) url.searchParams.set(key, attribution[key]);
        });
        ["participant", "participant_id", "pilot", "pilot_id", "ref"].forEach(function (key) {
          var value = params.get(key);
          if (value) url.searchParams.set(key, value.slice(0, 160));
        });
        link.href = url.toString();
      } catch (error) {}
    });
  }

  function updateRoute() {
    var mode = modes[state.type];
    route.textContent = mode.label;
    route.href = routeUrl();
    direction.textContent = mode.direction;
    activeTitle.textContent = state.type === "part" ? "Run PartSnap" : state.type === "proof" ? "Build visit proof" : "Run the lookup";
    if (window.SplashLensGa4 && typeof window.SplashLensGa4.decorateAppLinks === "function") {
      window.SplashLensGa4.decorateAppLinks();
    }
  }

  function revealFeedback(message) {
    feedback.hidden = false;
    if (message) status.textContent = message;
  }

  function updateTimer() {
    if (!state) return;
    var remainingMs = Math.max(0, Number(state.endsAt) - Date.now());
    var remaining = Math.ceil(remainingMs / 1000);
    var percent = Math.max(0, Math.min(100, remainingMs / 60000 * 100));
    time.textContent = String(remaining);
    meter.style.transform = "scaleX(" + (percent / 100) + ")";
    meterWrap.setAttribute("aria-valuenow", String(remaining));
    if (!remainingMs) {
      window.clearInterval(timerId);
      timerId = 0;
      if (!state.feedback) {
        revealFeedback(state.routedAt ? "Time. Did the workflow help?" : "Time. Open the workflow, then give us the honest result.");
      }
    }
  }

  function startTimer() {
    window.clearInterval(timerId);
    updateTimer();
    if (state && Date.now() < Number(state.endsAt)) timerId = window.setInterval(updateTimer, 250);
  }

  function showActive(shouldFocus) {
    form.hidden = true;
    active.hidden = false;
    updateRoute();
    if (state.routedAt || Date.now() >= Number(state.endsAt)) feedback.hidden = false;
    if (state.feedback) {
      feedback.hidden = false;
      referral.hidden = false;
      document.querySelectorAll("[data-challenge-feedback]").forEach(function (button) {
        button.setAttribute("aria-pressed", button.getAttribute("data-challenge-feedback") === state.feedback ? "true" : "false");
        button.disabled = true;
      });
      status.textContent = "Feedback saved. Share a fresh, attributed test if it could help someone else.";
    }
    startTimer();
    if (shouldFocus) active.focus();
  }

  function startChallenge(event) {
    event.preventDefault();
    var selected = form.querySelector('input[name="challenge-type"]:checked');
    var now = Date.now();
    state = {
      id: challengeId(),
      type: selected && modes[selected.value] ? selected.value : "code",
      startedAt: now,
      endsAt: now + 60000,
      routedAt: 0,
      feedback: ""
    };
    saveState();
    track("field_challenge_started", { timer_seconds: 60, challenge_path: modes[state.type].path });
    showActive(true);
  }

  function routeChallenge() {
    if (!state) return;
    if (!state.routedAt) {
      state.routedAt = Date.now();
      saveState();
      track("field_challenge_routed", {
        challenge_path: modes[state.type].path,
        elapsed_seconds: Math.max(0, Math.round((state.routedAt - state.startedAt) / 1000))
      });
    }
    revealFeedback("Try the workflow, then come back for one quick answer.");
  }

  function feedbackChallenge(button) {
    if (!state || state.feedback) return;
    state.feedback = safe(button.getAttribute("data-challenge-feedback"), 40);
    state.feedbackAt = Date.now();
    saveState();
    document.querySelectorAll("[data-challenge-feedback]").forEach(function (item) {
      item.setAttribute("aria-pressed", item === button ? "true" : "false");
      item.disabled = true;
    });
    track("field_challenge_feedback", {
      feedback: state.feedback,
      routed: Boolean(state.routedAt),
      timer_expired: state.feedbackAt >= Number(state.endsAt),
      seconds_to_feedback: Math.max(0, Math.round((state.feedbackAt - state.startedAt) / 1000))
    });
    referral.hidden = false;
    status.textContent = "Feedback saved. Who should pressure-test it next?";
    referral.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
  }

  function shareUrl(role) {
    var url = new URL("https://splashlens.com/campaign.html");
    var original = window.SplashLensGa4 && typeof window.SplashLensGa4.attribution === "function"
      ? window.SplashLensGa4.attribution()
      : {};
    url.searchParams.set("utm_source", "field_challenge_referral");
    url.searchParams.set("utm_medium", "referral");
    url.searchParams.set("utm_campaign", "field_challenge");
    url.searchParams.set("utm_content", role);
    url.searchParams.set("referral_audience", role);
    url.searchParams.set("referral_id", state.id);
    url.searchParams.set("challenge_type", state.type);
    if (original.utm_campaign) url.searchParams.set("origin_campaign", safe(original.utm_campaign, 100));
    if (inbound().partner) url.searchParams.set("partner", inbound().partner);
    if (inbound().participant) url.searchParams.set("participant_id", inbound().participant);
    if (inbound().pilot) url.searchParams.set("pilot_id", inbound().pilot);
    if (inbound().ref) url.searchParams.set("ref", inbound().ref);
    return url.toString();
  }

  function shareCopy(role, url) {
    var messages = {
      another_tech: "Try SplashLens with one real code, part, or equipment family. The 60-second field challenge and core app are free: ",
      senior_tech: "Could you pressure-test this SplashLens field-reference workflow with one real service stop? ",
      parts_counter: "Could this SplashLens proof workflow help get cleaner model and part clues before an order? "
    };
    return (messages[role] || messages.another_tech) + url;
  }

  function copyText(value) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      return navigator.clipboard.writeText(value).then(function () { return "clipboard"; });
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = value;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        if (!document.execCommand("copy")) throw new Error("copy_failed");
        resolve("clipboard_fallback");
      } catch (error) {
        reject(error);
      } finally {
        area.remove();
      }
    });
  }

  function shareChallenge(button) {
    if (!state) return;
    var role = safe(button.getAttribute("data-challenge-share"), 40);
    var url = shareUrl(role);
    var copy = shareCopy(role, url);
    var completed = function (method) {
      track("referral_share", {
        share_audience: role,
        share_method: method,
        feedback: state.feedback || ""
      });
      status.textContent = method === "native" ? "Share ready." : "Attributed invite copied.";
    };
    if (navigator.share) {
      navigator.share({ title: "SplashLens 60-second field challenge", text: copy.replace(url, "").trim(), url: url })
        .then(function () { completed("native"); })
        .catch(function (error) {
          if (error && error.name === "AbortError") return;
          copyText(copy).then(completed).catch(function () { status.textContent = "Could not copy the invite on this device."; });
        });
      return;
    }
    copyText(copy).then(completed).catch(function () { status.textContent = "Could not copy the invite on this device."; });
  }

  function resetChallenge() {
    window.clearInterval(timerId);
    timerId = 0;
    clearState();
    state = null;
    active.hidden = true;
    form.hidden = false;
    feedback.hidden = true;
    referral.hidden = true;
    status.textContent = "";
    time.textContent = "60";
    meter.style.transform = "scaleX(1)";
    meterWrap.setAttribute("aria-valuenow", "60");
    document.querySelectorAll("[data-challenge-feedback]").forEach(function (button) {
      button.disabled = false;
      button.removeAttribute("aria-pressed");
    });
    form.querySelector('input[name="challenge-type"]:checked').focus();
  }

  form.addEventListener("submit", startChallenge);
  route.addEventListener("click", routeChallenge);
  document.querySelectorAll("[data-challenge-feedback]").forEach(function (button) {
    button.addEventListener("click", function () { feedbackChallenge(button); });
  });
  document.querySelectorAll("[data-challenge-share]").forEach(function (button) {
    button.addEventListener("click", function () { shareChallenge(button); });
  });
  reset.addEventListener("click", resetChallenge);
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && state && state.routedAt && !state.feedback) {
      revealFeedback("Back at the challenge? Give us the honest result.");
    }
  });

  state = readState();
  if (state) showActive(false);
  standardizeCampaignAppLinks();
  window.addEventListener("load", standardizeCampaignAppLinks, { once: true });
})();
