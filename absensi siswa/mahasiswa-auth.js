const nimLogin = sessionStorage.getItem("mahasiswaLogin");

if (!nimLogin) {
    window.location.replace("mahasiswa-login.html");
}

function logoutMahasiswa() {
    sessionStorage.removeItem("mahasiswaLogin");
    window.location.replace("mahasiswa-login.html");
}