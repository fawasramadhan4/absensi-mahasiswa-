document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("mahasiswaLoginForm");

    const inputNim = document.getElementById("nim");
    const inputPassword = document.getElementById("password");

    // Kosongkan kolom saat halaman dibuka
    inputNim.value = "";
    inputPassword.value = "";

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const nim = inputNim.value.trim();
        const password = inputPassword.value;

        const pesan = document.getElementById("pesanLogin");

        const mahasiswa = JSON.parse(
            localStorage.getItem("mahasiswa")
        ) || [];

        const akun = mahasiswa.find(m =>
            m.nim === nim && m.password === password
        );

        if (akun) {
            sessionStorage.setItem("mahasiswaLogin", nim);
            window.location.href = "mahasiswa.html";

            window.location.href = "mahasiswa.html";
        } else {
            pesan.textContent = "NIM atau password salah!";
            pesan.style.color = "red";
        }
    });

});