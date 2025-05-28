const urlParams = new URLSearchParams(window.location.search);
const box = urlParams.get("box");
let alatList = [];

window.onload = async function () {
  if (!box) return alert("Box tidak ditemukan di URL.");

  try {
    const res = await fetch(
      `https://script.google.com/macros/s/AKfycbwj1Oqvvbl_sMv7Iu52jtPI1_falBlIVkBZihcOzFA-bhFlQdfUCnRZtOvk7btdtIhqCQ/exec?action=getAlat&box=${box}`
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

  const filtered = alatList.filter(alat => {
    const keyword = document.getElementById("searchInput").value.toLowerCase();
    const kondisiFilter = document.getElementById("kondisiFilter").value;
    return (
      alat.nama.toLowerCase().includes(keyword) &&
      (kondisiFilter === "" || alat.kondisi === kondisiFilter)
    );
  });

  filtered.forEach((alat, index) => {
    const div = document.createElement("div");
    div.className = "tool-item";

    div.innerHTML = `
      <div class="tool-grid">
        <div class="form-group">
          <label>Nama</label>
          <input type="text" value="${alat.nama}" onchange="updateField(${index}, 'nama', this.value)" />
        </div>
        <div class="form-group">
          <label>Jumlah</label>
          <input type="number" value="${alat.jumlah}" onchange="updateField(${index}, 'jumlah', this.value)" />
        </div>
        <div class="form-group">
          <label>Kondisi</label>
          <select onchange="updateField(${index}, 'kondisi', this.value)">
            <option value="Baik" ${alat.kondisi === "Baik" ? "selected" : ""}>Baik</option>
            <option value="Rusak" ${alat.kondisi === "Rusak" ? "selected" : ""}>Rusak</option>
          </select>
        </div>
        <div class="form-group">
          <label>Merk</label>
          <input type="text" value="${alat.merk}" onchange="updateField(${index}, 'merk', this.value)" />
        </div>
        <div class="form-group">
          <label>Tipe</label>
          <input type="text" value="${alat.tipe}" onchange="updateField(${index}, 'tipe', this.value)" />
        </div>
        <div class="form-group">
          <label>Status</label>
          <input type="text" value="${alat.status}" onchange="updateField(${index}, 'status', this.value)" />
        </div>
      </div>
      <button class="delete-btn" onclick="hapusAlat(${index})">x</button>
    `;
    container.appendChild(div);
  });
}

function updateField(index, key, value) {
  alatList[index][key] = value;
}

function hapusAlat(index) {
  if (confirm("Yakin ingin menghapus alat ini?")) {
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
  });
  renderList();
}

async function simpanPerubahan() {
  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbwj1Oqvvbl_sMv7Iu52jtPI1_falBlIVkBZihcOzFA-bhFlQdfUCnRZtOvk7btdtIhqCQ/exec", {
      method: "POST",
      body: JSON.stringify({ box, alatList }),
    });
    const result = await res.json();
    if (result.success) {
      alert("Data berhasil disimpan.");
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
