import axios from "axios";

const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

http.interceptors.request.use(
    (config) => {
        // 2. Check if we are in the browser (localStorage doesn't exist on server)
        if (typeof window !== "undefined") {
            const tokenData = localStorage.getItem("token");
            
            if (tokenData) {
                try {
                    // 3. Since your Vue/Next login saves a stringified object: 
                    // {"access_token": "ey...", "expired_in": ...}
                    const parsed = JSON.parse(tokenData);
                    const token = parsed.access_token; 

                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                } catch (error) {
                    console.error("Could not parse auth token", error);
                }
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export { http };