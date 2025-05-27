const baseURL = 'https://script.google.com/macros/s/AKfycby2ADrR4wVODQPbjapXyTCqiOKf0yFFc5U7pLX4X0yaJ9FSkdyxBU8ouMSLcZDY2_LSyw/exec';
const username = 'guest';

const urlParams = new URLSearchParams(window.location.search);
const box = urlParams.get('box') || 'boxdefault';

const alatListEl = document.getElementById("alatList");
const searchInput = document.getElementById("searchInput");
const kondisiFilter = document.getElementById("kondisiFilter");

let dataAlat = [];

function buatBarisAlat(alat, index) {
  const div = document.createElement("div");
  div.className = "tool-item";

  div.innerHTML = `
    <button class="delete-btn" onclick="hapusAlat(${index})">&times;</button>
    <div class="tool-grid">
      ${buatInput("Nama", "nama", alat.nama)}
      ${buatInput("Jumlah", "jumlah", alat.jumlah, "number")}
      ${buatSelect("Kondisi", "kondisi", alat.kondisi)}
      ${buatInput("Merk", "merk", alat.merk)}
      ${buatInput("Tipe", "tipe", alat.tipe)}
      ${buatInput("Status", "status", alat.status)}
    </div>
  `;

  alatListEl.appendChild(div);
}

function buatInput(label, name, value = "", type = "text") {
  return `
    <div class="form-group">
      <label>${label}</label>
      <input type="${type}" name="${name}" value="${value || ''}" />
    </div>
  `;
}

function buatSelect(label, name, value = "") {
  return `
    <div class="form-group">
      <label>${label}</label>
      <select name="${name}">
        <option value="">-- Pilih --</option>
        <option value="Baik" ${value === "Baik" ? "selected" : ""}>Baik</option>
        <option value="Rusak" ${value === "Rusak" ? "selected" : ""}>Rusak</option>
      </select>
    </div>
  `;
}

async function loadToolsFromServer() {
  try {
    const response = await fetch(`${baseURL}?username=${username}&box=${box}`);
    const result = await response.json();

    if (result.success) {
      dataAlat = result.alatList || [];
      renderAlatList();
    } else {
      console.error("Gagal memuat data:", result.error);
    }
  } catch (error) {
    console.error("Gagal fetch:", error);
  }
}

function renderAlatList() {
  alatListEl.innerHTML = "";
  const keyword = searchInput.value.toLowerCase();
  const kondisi = kondisiFilter.value;

  dataAlat.forEach((alat, index) => {
    const cocokCari = alat.nama?.toLowerCase().includes(keyword);
    const cocokKondisi = !kondisi || alat.kondisi === kondisi;

    if (cocokCari && cocokKondisi) {
      buatBarisAlat(alat, index);
    }
  });
}

function tambahAlat() {
  dataAlat.push({ nama: "", jumlah: "", kondisi: "", merk: "", tipe: "", status: "" });
  renderAlatList();
}

function hapusAlat(index) {
  dataAlat.splice(index, 1);
  renderAlatList();
}

function simpanPerubahan() {
  const itemEls = document.querySelectorAll(".tool-item");
  const alatListBaru = [];

  itemEls.forEach(item => {
    const inputs = item.querySelectorAll("input, select");
    const alat = {};
    inputs.forEach(input => {
      alat[input.name] = input.value.trim();
    });
    alatListBaru.push(alat);
  });

  const data = {
    username,
    box,
    alatList: alatListBaru
  };

  fetch(baseURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        alert("✅ Data berhasil disimpan!");
        dataAlat = alatListBaru;
        renderAlatList();
      } else {
        alert("❌ Gagal menyimpan data: " + result.error);
      }
    })
    .catch(err => {
      console.error("Error saat menyimpan:", err);
      alert("❌ Terjadi kesalahan saat menyimpan.");
    });
}

function filterAlat() {
  renderAlatList();
}

// Event listeners
searchInput.addEventListener("input", filterAlat);
kondisiFilter.addEventListener("change", filterAlat);

// Load awal
loadToolsFromServer();
