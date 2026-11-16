const form = document.getElementById("loginForm");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Akun admin untuk demonstrasi
    const adminUsername = "admin";
    const adminPassword = "admin123";

    if (
        username === adminUsername &&
        password === adminPassword
    ) {
        sessionStorage.setItem("adminLogin", "true");

        window.location.href = "index.html";
    } else {
        document.getElementById("pesanLogin").textContent =
            "Username atau password salah!";

        document.getElementById("pesanLogin").style.color =
            "red";
    }
});