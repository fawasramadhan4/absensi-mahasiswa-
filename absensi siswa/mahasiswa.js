// Mengambil data mahasiswa dari localStorage
const daftarMahasiswa =
    JSON.parse(localStorage.getItem("mahasiswa")) || [];

// Mengambil NIM mahasiswa yang sedang login
const nimLogin = sessionStorage.getItem("mahasiswaLogin");

// Mencari data mahasiswa berdasarkan NIM
const dataSaya = daftarMahasiswa.find(
    mhs => mhs.nim === nimLogin
);

// Menampilkan profil mahasiswa
if (dataSaya) {
    document.getElementById("namaMhs").textContent =
        dataSaya.nama;

    document.getElementById("nimMhs").textContent =
        dataSaya.nim;

    document.getElementById("prodiMhs").textContent =
        dataSaya.prodi;
} else {
    alert("Data mahasiswa tidak ditemukan!");
}

// Membuat QR Code mahasiswa
function buatQRCode() {
    const tempatQR = document.getElementById("qrCode");
    const statusQR = document.getElementById("statusQR");

    if (!tempatQR) return;

    tempatQR.innerHTML = "";

    if (typeof QRCode === "undefined") {
        statusQR.textContent = "Library QR Code belum dimuat.";
        return;
    }

    if (!dataSaya || !dataSaya.nim) {
        statusQR.textContent = "Data mahasiswa tidak ditemukan.";
        return;
    }

    const kodeQR = "MAHASISWA:" + dataSaya.nim;

    new QRCode(tempatQR, {
        text: kodeQR,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    statusQR.textContent =
        "QR Code berhasil dibuat. NIM: " + dataSaya.nim;
}

// Jalankan pembuat QR Code
buatQRCode();