let showLoaderFn: ((message?: string) => void) | null = null;
let hideLoaderFn: (() => void) | null = null;

let showTime = 0;
const MIN_DURATION = 1500;

let hideTimer: ReturnType<typeof setTimeout> | null = null;

export function registerLoader(show: (message?: string) => void, hide: () => void) {
  showLoaderFn = show;
  hideLoaderFn = hide;
}

export function showLoader(message?: string) {
  showTime = Date.now();
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
  showLoaderFn?.(message);
}

export function hideLoader() {
  const elapsed = Date.now() - showTime;
  const remaining = MIN_DURATION - elapsed;

  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }

  if (remaining > 0) {
    hideTimer = setTimeout(() => {
      hideLoaderFn?.();
      hideTimer = null;
    }, remaining);
  } else {
    hideLoaderFn?.();
  }
}

// ✅ NUEVO: para back/home/popstate (no espera 1.5s)
export function forceHideLoader() {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
  hideLoaderFn?.();
}
