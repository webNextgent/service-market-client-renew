export const handleLogout = async () => {
    localStorage.removeItem("access-token");
    window.location.href = "/";
};