export const apiBaseUrl = process.env.BACKEND_API_URL
    ?.replace(/(https?:\/{2}[^/]+)/, `${process.env.PORT ? `$1:${process.env.PORT}` : '$1'}`)
    ?? 'https://localhost:3001/api';
