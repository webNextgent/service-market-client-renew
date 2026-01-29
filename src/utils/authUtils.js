export const getToken = () => {
    return localStorage.getItem("access-token");
};

export const isAuthenticated = () => {
    const token = getToken();
    return !!token;
};

export const isAuthenticatedAdmin = () => {
    if (!isAuthenticated) {
        return
    }
}