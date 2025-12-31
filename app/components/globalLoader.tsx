let showLoaderFn: ((message?: string) => void) | null = null;
let hideLoaderFn: (() => void) | null = null;

export function registerLoader(
  show: (message?: string) => void,
  hide: () => void
) {
  showLoaderFn = show;
  hideLoaderFn = hide;
}

export function showLoader(message?: string) {
  showLoaderFn?.(message);
}

export function hideLoader() {
  hideLoaderFn?.();
}
