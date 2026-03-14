import { API_URL } from '@/config';

/**
 * Ensures a product image URL is valid and prefixed with the API URL if necessary.
 * @param path The image path from the database.
 * @returns A safe image URL or a placeholder.
 */
export function getSafeImageUrl(path: string | null | undefined): string {
    if (!path) return '🚗'; // Return fallback emoji or you could return a path to a placeholder image

    // If it's already a full URL or a data URI, return as-is
    if (path.startsWith('http') || path.startsWith('data:')) {
        return path;
    }

    // Determine the base API URL (remove trailing slash if present)
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;

    // Handle paths starting with /uploads or /api/uploads
    if (path.startsWith('/uploads/')) {
        return `${baseUrl}${path}`;
    }

    if (path.startsWith('/api/uploads/')) {
        // If the API_URL already ends with /api, we don't want to double it
        if (baseUrl.endsWith('/api')) {
            return `${baseUrl.replace(/\/api$/, '')}${path}`;
        }
        return `${baseUrl}${path}`;
    }

    // Default case: if it starts with /, assume it needs the base URL
    if (path.startsWith('/')) {
        return `${baseUrl}${path}`;
    }

    // If it doesn't start with /, add a slash then the base URL
    return `${baseUrl}/${path}`;
}
