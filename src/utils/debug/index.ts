import { localStorage } from '~utils/storage';

// enable with localStorage.setItem('KONTUR_DEBUG', 'true')
export const KONTUR_DEBUG = !!localStorage.getItem('KONTUR_DEBUG');

// enable with localStorage.setItem('KONTUR_METRICS_DEBUG', 'true')
export const KONTUR_METRICS_DEBUG = !!localStorage.getItem('KONTUR_METRICS_DEBUG');

// enable with localStorage.setItem('KONTUR_WARN', 'true')
// will add stacktrace
export const KONTUR_WARN = !!localStorage.getItem('KONTUR_WARN');

// trace specific action
// enable with localStorage.setItem('KONTUR_TRACE_ERROR', '_error')
export const KONTUR_TRACE_TYPE = localStorage.getItem('KONTUR_TRACE_TYPE');

// dump patch calls with extended info and stacktrace, it's noisy
export const KONTUR_TRACE_PATCH = !!localStorage.getItem('KONTUR_TRACE_PATCH');
