export function checkLogin() {
    const token = localStorage.getItem("token");
    if (!token) {
        return false;
    }
    return true;
}