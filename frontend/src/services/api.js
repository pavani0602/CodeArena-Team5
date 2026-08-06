// Centralized API wrapper to automatically attach JWT token

export const fetchApi = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(endpoint, config);
        
        // If unauthorized, token might be expired. Handle gracefully.
        if (response.status === 401 || response.status === 403) {
            console.warn("Unauthorized API call:", endpoint);
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userEmail');
            window.location.href = '/login';
        }

        return response;
    } catch (error) {
        console.error("API Fetch Error:", error);
        throw error;
    }
};
