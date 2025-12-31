let showLoaderFn: ((message?: string) => void) | null = null;
let hideLoaderFn: (() => void) | null = null;

let showTime = 0;
const MIN_DURATION = 500; // 👈 1.5 segundos

export function registerLoader(
  show: (message?: string) => void,
  hide: () => void
) {
  showLoaderFn = show;
  hideLoaderFn = hide;
}

export function showLoader(message?: string) {
  showTime = Date.now();
  showLoaderFn?.(message);
}

export function hideLoader() {
  const elapsed = Date.now() - showTime;
  const remaining = MIN_DURATION - elapsed;

  if (remaining > 0) {
    setTimeout(() => {
      hideLoaderFn?.();
    }, remaining);
  } else {
    hideLoaderFn?.();
  }
}
