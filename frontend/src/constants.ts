export const apiBaseUrl = process.env.REACT_APP_BACKEND_API_URL
    ?.replace(/(https?:\/{2}[^/]+)/, `${process.env.REACT_APP_BACKEND_SERVER_PORT ? `$1:${process.env.REACT_APP_BACKEND_SERVER_PORT}` : '$1'}`);
