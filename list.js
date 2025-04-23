let tools = [];
let storageKey = "alatKerja_default";

const urlParams = new URLSearchParams(window.location.search);
const boxId = urlParams.get("box") || "default";
storageKey = `alatKerja_box${boxId}`;

function loadToolsFromStorage() {
  const saved = localStorage.getItem(storageKey);
  tools = saved ? JSON.parse(saved) : [];
  renderTools();
}

function saveToolsToStorage() {
  localStorage.setItem(storageKey, JSON.stringify(tools));
  alert("Data alat berhasil disimpan!");
}

function renderTools(filtered = tools) {
  const toolsList = document.querySelector('.tools-list');
  toolsList.innerHTML = '';

  filtered.forEach((tool, index) => {
    const toolItem = document.createElement('div');
    toolItem.className = 'tool-item';

    toolItem.innerHTML = `
      <div class="tool-grid">
        <div class="form-group">
          <label>Nama</label>
          <input type="text" value="${tool.nama}" data-index="${index}" data-field="nama" />
        </div>
        <div class="form-group">
          <label>Jumlah</label>
          <select data-index="${index}" data-field="jumlah">
            ${[1,2,3,4,5].map(j => `<option value="${j}" ${tool.jumlah == j ? 'selected' : ''}>${j}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Kondisi</label>
          <select data-index="${index}" data-field="kondisi">
            <option value="Baik" ${tool.kondisi === 'Baik' ? 'selected' : ''}>Baik</option>
            <option value="Rusak" ${tool.kondisi === 'Rusak' ? 'selected' : ''}>Rusak</option>
          </select>
        </div>
        <div class="form-group">
          <label>Merk</label>
          <input type="text" value="${tool.merk}" data-index="${index}" data-field="merk" />
        </div>
        <div class="form-group">
          <label>Tipe</label>
          <input type="text" value="${tool.tipe}" data-index="${index}" data-field="tipe" />
        </div>
        <div class="form-group full-width">
          <button class="delete-btn" title="Hapus" data-index="${index}">&times;</button>
        </div>
      </div>
    `;
    toolsList.appendChild(toolItem);
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const index = parseInt(this.getAttribute('data-index'));
      deleteTool(index);
    });
  });
}

function tambahAlat() {
  tools.push({
    nama: '',
    jumlah: '1',
    kondisi: 'Baik',
    merk: '',
    tipe: ''
  });
  renderTools();
}

function deleteTool(index) {
  if (confirm("Yakin ingin menghapus alat ini?")) {
    tools.splice(index, 1);
    renderTools();
    saveToolsToStorage();
  }
}

function simpanPerubahan() {
  const items = document.querySelectorAll('.tool-item');
  tools = [];

  items.forEach((item) => {
    const nama = item.querySelector('[data-field="nama"]').value;
    const jumlah = item.querySelector('[data-field="jumlah"]').value;
    const kondisi = item.querySelector('[data-field="kondisi"]').value;
    const merk = item.querySelector('[data-field="merk"]').value;
    const tipe = item.querySelector('[data-field="tipe"]').value;

    tools.push({ nama, jumlah, kondisi, merk, tipe });
  });

  saveToolsToStorage();
}

function filterAlat() {
  const search = document.getElementById("searchInput")?.value.toLowerCase() || "";
  const kondisi = document.getElementById("kondisiFilter")?.value || "";

  const filtered = tools.filter(tool => {
    const cocokNama = tool.nama.toLowerCase().includes(search);
    const cocokKondisi = !kondisi || tool.kondisi === kondisi;
    return cocokNama && cocokKondisi;
  });

  renderTools(filtered);
}

// Agar HTML bisa pakai nama lama di onclick
function addTool() { tambahAlat(); }
function saveEditedData() { simpanPerubahan(); }

window.onload = loadToolsFromStorage;
