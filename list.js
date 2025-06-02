const urlParams = new URLSearchParams(window.location.search);
const box = urlParams.get("box");
let alatList = [];

window.onload = async function () {
  if (!box) return alert("Box tidak ditemukan di URL.");
  try {
    const res = await fetch(
      `https://script.google.com/macros/s/AKfycbwYldFDEU2dT18xb2_43mxcxKCk2HOD9a5CNkyJWCy9kXqb7HW48iXjDXXcKIfKq3Wl2Q/exec?action=getAlat&box=${box}`
    );
    const data = await res.json();
    if (data.success) {
      alatList = data.alatList;
      renderList();
    } else {
      alert("Gagal mengambil data alat.");
    }
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat mengambil data.");
  }
};

function renderList() {
  const container = document.getElementById("alatList");
  container.innerHTML = "";

  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const kondisiFilter = document.getElementById("kondisiFilter").value;

  const filtered = alatList
    .map((alat, i) => ({ ...alat, originalIndex: i }))
    .filter(alat =>
      alat.nama.toLowerCase().includes(keyword) &&
      (kondisiFilter === "" || alat.kondisi === kondisiFilter)
    );

  filtered.forEach((alat) => {
    const div = document.createElement("div");
    div.className = "tool-item";

    div.innerHTML = `
      <div class="tool-grid">
        <div class="form-group">
          <label>Nama</label>
          <input type="text" value="${alat.nama}" onchange="updateField(${alat.originalIndex}, 'nama', this.value)" />
        </div>
        <div class="form-group">
          <label>Jumlah</label>
          <input type="number" value="${alat.jumlah}" onchange="updateField(${alat.originalIndex}, 'jumlah', this.value)" />
        </div>
        <div class="form-group">
          <label>Kondisi</label>
          <select onchange="updateField(${alat.originalIndex}, 'kondisi', this.value)">
            <option value="Baik" ${alat.kondisi === "Baik" ? "selected" : ""}>Baik</option>
            <option value="Rusak" ${alat.kondisi === "Rusak" ? "selected" : ""}>Rusak</option>
          </select>
        </div>
        <div class="form-group">
          <label>Merk</label>
          <input type="text" value="${alat.merk}" onchange="updateField(${alat.originalIndex}, 'merk', this.value)" />
        </div>
        <div class="form-group">
          <label>Tipe</label>
          <input type="text" value="${alat.tipe}" onchange="updateField(${alat.originalIndex}, 'tipe', this.value)" />
        </div>
        <div class="form-group">
          <label>Status</label>
          <input type="text" value="${alat.status}" onchange="updateField(${alat.originalIndex}, 'status', this.value)" />
        </div>
      </div>
      <button class="delete-btn" onclick="hapusAlat(${alat.originalIndex})">x</button>
    `;

    container.appendChild(div);
  });
}

function updateField(index, key, value) {
  alatList[index][key] = value;
}

async function hapusAlat(index) {
  const alat = alatList[index];

  if (confirm("Yakin ingin menghapus alat ini?")) {
    try {
      const params = new URLSearchParams({
        action: "hapusAlat",
        box: alat.box || box,
        nama: alat.nama,
        jumlah: alat.jumlah,
        kondisi: alat.kondisi,
        merk: alat.merk,
        tipe: alat.tipe,
        status: alat.status,
      });

      const res = await fetch(`https://script.google.com/macros/s/AKfycbwYldFDEU2dT18xb2_43mxcxKCk2HOD9a5CNkyJWCy9kXqb7HW48iXjDXXcKIfKq3Wl2Q/exec?${params}`);
      const result = await res.json();

      if (!result.success) {
        alert("Gagal menghapus dari spreadsheet: " + result.error);
        return;
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menghapus.");
      return;
    }

    alatList.splice(index, 1);
    renderList();
  }
}

function tambahAlat() {
  alatList.push({
    nama: "",
    jumlah: "",
    kondisi: "Baik",
    merk: "",
    tipe: "",
    status: "",
    isBaru: true
  });
  renderList();
}

async function simpanPerubahan() {
  try {
    const dataBaru = alatList
      .filter(alat => alat.isBaru)
      .filter(alat =>
        alat.nama || alat.jumlah || alat.kondisi || alat.merk || alat.tipe || alat.status
      );

    if (dataBaru.length === 0) {
      alert("Tidak ada data baru yang valid untuk disimpan.");
      return;
    }

    const res = await fetch("https://script.google.com/macros/s/AKfycbwN54G1AqiIszXGwmdzkgZXcz2Qoc4MDjAZ_sH5Ou-Mok4pfCHsb8n7a1A3gCvjQShkmQ/exec", {
      method: "POST",
      body: JSON.stringify({ box, alatList: dataBaru }),
    });

    const result = await res.json();
    if (result.success) {
      alert("Data baru berhasil disimpan.");
      alatList.forEach(alat => {
        if (alat.isBaru) delete alat.isBaru;
      });
      renderList();
    } else {
      alert("Gagal menyimpan data: " + result.error);
    }
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat menyimpan.");
  }
}


function filterAlat() {
  renderList();
}
