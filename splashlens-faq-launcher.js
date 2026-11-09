import './splashlens-faq-chat.js';

const GAP = 12;
const DRAG_THRESHOLD = 7;
const PANEL_WIDTH = 392;
const arrows = new Map([
  ['ArrowLeft', [-1, 0]], ['ArrowRight', [1, 0]], ['ArrowUp', [0, -1]], ['ArrowDown', [0, 1]],
]);

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function mountLauncher(window, launcher, dialog, close) {
  let drag = null;
  let skipPointerClick = false;

  function bounds() {
    const visual = window.visualViewport;
    const left = visual?.offsetLeft ?? 0;
    const top = visual?.offsetTop ?? 0;
    const width = visual?.width ?? window.innerWidth;
    const height = visual?.height ?? window.innerHeight;
    return { left, top, width, height, right: left + width, bottom: top + height };
  }

  function placeLauncher(x, y) {
    const view = bounds();
    const { width, height } = launcher.getBoundingClientRect();
    launcher.style.left = `${clamp(x, view.left + GAP, view.right - width - GAP)}px`;
    launcher.style.top = `${clamp(y, view.top + GAP, view.bottom - height - GAP)}px`;
    launcher.style.right = 'auto';
    launcher.style.bottom = 'auto';
  }

  function placeDialog() {
    if (!dialog.open) return;
    const view = bounds();
    const anchor = launcher.getBoundingClientRect();
    dialog.style.width = `${Math.max(1, Math.min(PANEL_WIDTH, view.width - GAP * 2))}px`;
    dialog.style.maxHeight = `${Math.max(1, view.height - GAP * 2)}px`;
    const { width, height } = dialog.getBoundingClientRect();
    const above = anchor.top - height - GAP;
    const below = anchor.bottom + GAP;
    const y = above >= view.top + GAP ? above : below;
    dialog.style.left = `${clamp(anchor.right - width, view.left + GAP, view.right - width - GAP)}px`;
    dialog.style.top = `${clamp(y, view.top + GAP, view.bottom - height - GAP)}px`;
  }

  function reposition() {
    const { left, top } = launcher.getBoundingClientRect();
    placeLauncher(left, top);
    placeDialog();
  }

  function openDialog() {
    if (dialog.open) return;
    dialog.showModal();
    launcher.setAttribute('aria-expanded', 'true');
    placeDialog();
  }

  launcher.hidden = false;
  launcher.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0 || drag) return;
    const { left, top } = launcher.getBoundingClientRect();
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, left, top, moved: false };
    skipPointerClick = false;
    launcher.setPointerCapture(event.pointerId);
  });
  launcher.addEventListener('pointermove', event => {
    if (drag?.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    drag.moved = true;
    launcher.classList.add('is-dragging');
    placeLauncher(drag.left + dx, drag.top + dy);
  });
  function endDrag(event) {
    if (drag?.id !== event.pointerId) return;
    skipPointerClick = drag.moved;
    drag = null;
    launcher.classList.remove('is-dragging');
    // Pointer capture and touch-action can suppress the compatibility click.
    if (event.type === 'pointerup' && event.pointerType === 'touch' && !skipPointerClick) openDialog();
  }
  for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    launcher.addEventListener(event, endDrag);
  }
  launcher.addEventListener('keydown', event => {
    const direction = arrows.get(event.key);
    if (!direction) return;
    event.preventDefault();
    const { left, top } = launcher.getBoundingClientRect();
    const step = event.shiftKey ? 48 : 24;
    placeLauncher(left + direction[0] * step, top + direction[1] * step);
  });
  launcher.addEventListener('click', event => {
    if (skipPointerClick && event.detail > 0) {
      skipPointerClick = false;
      return;
    }
    openDialog();
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    launcher.setAttribute('aria-expanded', 'false');
    launcher.focus({ preventScroll: true });
  });
  window.addEventListener('resize', reposition);
  window.visualViewport?.addEventListener('resize', reposition);
  window.visualViewport?.addEventListener('scroll', reposition);
  // An answer or wrapped control can resize the open dialog after placement.
  if (typeof window.ResizeObserver === 'function') {
    const sizeObserver = new window.ResizeObserver(placeDialog);
    sizeObserver.observe(dialog);
  }
}

export function initFaqLauncher(document, window) {
  const launcher = document.getElementById('sl-faq-launcher');
  const dialog = document.getElementById('sl-faq-dialog');
  const close = document.getElementById('sl-faq-close');
  if (!launcher || !close || !dialog?.querySelector('#ask-splashlens') || typeof dialog.showModal !== 'function') return;
  mountLauncher(window, launcher, dialog, close);
}

if (typeof document !== 'undefined') initFaqLauncher(document, window);
