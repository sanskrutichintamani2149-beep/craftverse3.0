/**
 * Resolves API URL for both Web (relative) and Native Android Capacitor (live backend).
 * When running inside native Android / Capacitor, window.Capacitor is defined, or window.location.protocol is 'capacitor:' or origin is 'http://localhost' on Android.
 */
export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (typeof window !== 'undefined') {
    const isCapacitor =
      Boolean((window as any)?.Capacitor?.isNativePlatform?.()) ||
      Boolean((window as any)?.Capacitor) ||
      window.location.protocol === 'capacitor:';

    if (isCapacitor) {
      return `https://craftverse30-vercel.vercel.app${cleanEndpoint}`;
    }
  }

  // Web environment: use relative path or optional VITE_API_BASE_URL
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  return `${baseUrl}${cleanEndpoint}`;
}
