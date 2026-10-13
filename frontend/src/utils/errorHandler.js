/**
 * Formats errors into friendly, professional English messages.
 * Prevents technical browser/server details like "Failed to fetch",
 * database errors, or network stack traces from ever leaking to the user.
 *
 * @param {Error|string|any} err - Caught error or raw error message
 * @param {string} [fallback] - Context-specific fallback in English
 * @returns {string} User-friendly error message in English
 */
export const formatErrorMessage = (err, fallback = 'Unable to complete your request. Please try again later.') => {
    if (!err) return fallback;

    const rawMessage = typeof err === 'string' ? err : (err.message || String(err));
    const normalized = rawMessage.toLowerCase().trim();

    // Browser network failures (Failed to fetch, network drops, CORS / server down)
    if (
        normalized.includes('failed to fetch') ||
        normalized.includes('fail to fetch') ||
        normalized.includes('networkerror') ||
        normalized.includes('network error') ||
        normalized.includes('load failed') ||
        normalized.includes('connection refused') ||
        normalized.includes('net::') ||
        normalized.includes('fetch error')
    ) {
        return 'Unable to connect to the server. Please check your internet connection and try again.';
    }

    // Database or internal server plumbing errors
    if (
        normalized.includes('mongo') ||
        normalized.includes('database') ||
        normalized.includes('econnrefused') ||
        normalized.includes('internal server error') ||
        normalized.includes('topology') ||
        normalized.includes('server selection') ||
        normalized.includes('query failed')
    ) {
        return 'The service is temporarily unavailable. Please try again shortly.';
    }

    // Clean any residual "failed to..." raw phrases
    if (normalized.startsWith('failed to fetch')) {
        return rawMessage.replace(/failed to fetch/i, 'Unable to load');
    }

    return rawMessage || fallback;
};

export default formatErrorMessage;
