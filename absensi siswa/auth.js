// Memeriksa status login admin
if (sessionStorage.getItem("adminLogin") !== "true") {
    window.location.replace("login.html");
}

// Fungsi logout
function logout() {
    sessionStorage.removeItem("adminLogin");
    window.location.replace("login.html");
}