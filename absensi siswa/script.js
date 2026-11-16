let mahasiswa = JSON.parse(
    localStorage.getItem("mahasiswa")
) || [];

let absensi = JSON.parse(
    localStorage.getItem("absensi")
) || [];

let scanner = null;
let sedangScan = false;

// Menyimpan data
function simpanData() {
    localStorage.setItem(
        "mahasiswa",
        JSON.stringify(mahasiswa)
    );

    localStorage.setItem(
        "absensi",
        JSON.stringify(absensi)
    );
}

// Tambah mahasiswa
function tambahMahasiswa() {
    const nama = document.getElementById("nama").value.trim();
    const nim = document.getElementById("nim").value.trim();
    const prodi = document.getElementById("prodi").value.trim();
    const password = document.getElementById("passwordMahasiswa").value;

    // Validasi data
    if (!nama || !nim || !prodi || !password) {
        alert("Semua data harus diisi!");
        return;
    }

    // Periksa NIM ganda
    if (mahasiswa.some(m => m.nim === nim)) {
        alert("NIM sudah terdaftar!");
        return;
    }

    // Simpan mahasiswa
    mahasiswa.push({
        nama: nama,
        nim: nim,
        prodi: prodi,
        password: password
    });

    // Simpan ke LocalStorage
    simpanData();

    // Kosongkan input
    document.getElementById("nama").value = "";
    document.getElementById("nim").value = "";
    document.getElementById("prodi").value = "";
    document.getElementById("passwordMahasiswa").value = "";

    // Perbarui tampilan
    tampilkanMahasiswa();

    alert("Mahasiswa berhasil ditambahkan!");
}

// Hubungkan tombol dengan fungsi
document.getElementById("tambahBtn").addEventListener(
    "click",
    tambahMahasiswa
);

// Menampilkan mahasiswa
function tampilkanMahasiswa() {
    const tabel = document.getElementById("daftarMahasiswa");
    tabel.innerHTML = "";

    mahasiswa.forEach((m, index) => {
        const tr = document.createElement("tr");

        const nama = document.createElement("td");
        nama.textContent = m.nama;

        const nim = document.createElement("td");
        nim.textContent = m.nim;

        const prodi = document.createElement("td");
        prodi.textContent = m.prodi;

        const qr = document.createElement("td");
        const qrBox = document.createElement("div");
        qrBox.className = "qr-container";
        qrBox.id = "qr-" + index;
        qr.appendChild(qrBox);

        tr.append(nama, nim, prodi, qr);
        tabel.appendChild(tr);

        new QRCode(qrBox, {
            text: "MAHASISWA:" + m.nim,
            width: 100,
            height: 100
        });
    });

    document.getElementById("totalMahasiswa").textContent =
        mahasiswa.length;

    tampilkanAbsensi();
}

// Memulai scanner

async function mulaiScan() {
    try {
        if (scanner) {
            await scanner.stop().catch(() => { });
            await scanner.clear().catch(() => { });
        }

        scanner = new Html5Qrcode("reader");

        // Mencari kamera yang tersedia
        const cameras = await Html5Qrcode.getCameras();

        if (!cameras || cameras.length === 0) {
            alert("Kamera tidak ditemukan!");
            return;
        }

        // Pilih kamera belakang jika tersedia,
        // jika tidak gunakan kamera pertama
        const kameraBelakang = cameras.find(
            cam => /back|rear|environment/i.test(cam.label)
        );

        const kameraDipilih = kameraBelakang || cameras[0];

        await scanner.start(
            kameraDipilih.id,
            {
                fps: 10,
                qrbox: 250
            },
            (decodedText) => {
                prosesScan(decodedText);
            }
        );

        sedangScan = true;

        console.log("Kamera berhasil diaktifkan!");

    } catch (error) {
        console.error("Kesalahan kamera:", error);
        alert("Kamera gagal dibuka. Periksa izin kamera laptop.");
    }
}

// Memproses hasil scan
function prosesScan(kode) {
    if (!kode.startsWith("MAHASISWA:")) {
        document.getElementById("hasilScan").textContent =
            "QR Code tidak valid!";
        return;
    }

    const nim = kode.replace("MAHASISWA:", "");

    const m = mahasiswa.find(x => x.nim === nim);

    if (!m) {
        document.getElementById("hasilScan").textContent =
            "Mahasiswa tidak ditemukan!";
        return;
    }

    const sekarang = new Date();

    const tanggal = sekarang.toLocaleDateString("id-ID");
    const jam = sekarang.toLocaleTimeString("id-ID");

    const sudahHadir = absensi.some(a =>
        a.nim === nim && a.tanggal === tanggal
    );

    if (sudahHadir) {
        document.getElementById("hasilScan").textContent =
            m.nama + " sudah melakukan absensi hari ini!";
        return;
    }

    absensi.push({
        nama: m.nama,
        nim: m.nim,
        tanggal: tanggal,
        jam: jam,
        status: "Hadir"
    });

    simpanData();
    tampilkanAbsensi();

    document.getElementById("hasilScan").textContent =
        "Berhasil! " + m.nama + " tercatat HADIR.";

}

// Menghentikan scanner
async function berhentiScan() {
    if (scanner) {
        try {
            if (sedangScan) {
                await scanner.stop();
            }

            await scanner.clear();

            console.log("Scanner berhasil dihentikan.");

        } catch (error) {
            console.error("Gagal menghentikan scanner:", error);

        } finally {
            scanner = null;
            sedangScan = false;
        }
    }

    document.getElementById("hasilScan").textContent =
        "Scanner dihentikan.";
}

// Menampilkan riwayat absensi
function tampilkanAbsensi() {
    const tabel = document.getElementById("riwayatAbsensi");
    tabel.innerHTML = "";

    const hariIni = new Date().toLocaleDateString("id-ID");

    absensi.forEach(a => {
        const tr = document.createElement("tr");

        [
            a.nama,
            a.nim,
            a.tanggal,
            a.jam,
            a.status
        ].forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            tr.appendChild(td);
        });

        tabel.appendChild(tr);
    });

    const jumlahHadir = absensi.filter(
        a => a.tanggal === hariIni
    ).length;

    document.getElementById("totalHadir").textContent =
        jumlahHadir;
}

// Download laporan CSV
function exportCSV() {
    if (absensi.length === 0) {
        alert("Belum ada data absensi!");
        return;
    }

    const header = ["Nama", "NIM", "Tanggal", "Jam", "Status"];

    const rows = absensi.map(a => [
        a.nama, a.nim, a.tanggal, a.jam, a.status
    ]);

    const csv = [header, ...rows]
        .map(row => row.map(value =>
            '"' + String(value).replace(/"/g, '""') + '"'
        ).join(";"))
        .join("\n");

    const blob = new Blob(
        ["\uFEFF" + csv],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "laporan_absensi.csv";
    link.click();

    URL.revokeObjectURL(url);
}

// Menjalankan tampilan awal
tampilkanMahasiswa();