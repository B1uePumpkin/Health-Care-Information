window.onload = function() {
  // 從本地存儲中獲取 radio 的狀態
  const radioStatus = JSON.parse(localStorage.getItem(`confirmedMedicines-${patientId}`) || '{}');

  // 使用 radio 的狀態來設定每個 radio 的選中狀態
  for (let id in radioStatus) {
    const radio = document.getElementById(id);
    if (radio) {
      radio.checked = radioStatus[id];
    }
  }
};

function toggleDetails(event) {
  // 尋找目標行的下一行作為詳細資料行
  var detailRow = event.currentTarget.nextElementSibling;
  // 切換詳細資料行的顯示與隱藏
  detailRow.style.display = detailRow.style.display === 'table-row' ? 'none' : 'table-row';

  // 將選中的藥品行添加或移除選中的 CSS 類
  event.currentTarget.classList.toggle('selected-row');
}

function createMedicineRow(medicine, selectedMedicines) {
  const tr = document.createElement('tr');
  tr.className = 'medicine-item';
  tr.onclick = function(event) { toggleDetails(event); };

  
  tr.innerHTML = `
    <td>${medicine.serialNumber}</td>
    <td>${medicine.name}</td>
    <td>${medicine.dosageForm}</td>
    <td>${medicine.usage}</td>
    <td>${medicine.administrationTime}</td>
    <td>
      <input type="radio" name="medicineOption${medicine.serialNumber}" class="manual-radio" id="unmarked${medicine.serialNumber}" data-serial="${medicine.serialNumber}" onclick="event.stopPropagation();">
      <label for="unmarked${medicine.serialNumber}">不給藥</label>
      <input type="radio" name="medicineOption${medicine.serialNumber}" class="manual-radio" id="confirm${medicine.serialNumber}" ${selectedMedicines.includes(medicine.serialNumber) ? 'checked' : ''} data-serial="${medicine.serialNumber}" onclick="event.stopPropagation();">
      <label for="confirm${medicine.serialNumber}">已給藥</label>
      <input type="radio" name="medicineOption${medicine.serialNumber}" class="manual-radio" id="delay${medicine.serialNumber}" ${selectedMedicines.includes(medicine.serialNumber) ? 'checked' : ''} data-serial="${medicine.serialNumber}" onclick="event.stopPropagation();">
      <label for="delay${medicine.serialNumber}">暫時不給藥</label>
    </td>
  `;

  const detailsRow = document.createElement('tr');
  detailsRow.className = 'medicine-details';
  detailsRow.innerHTML = `
    <td colspan="6">
      <div>
        <label>藥品序號:</label>
        <span id="medicineSerial">${medicine.serialNumber}</span>
      </div>
      <div>
        <label>藥品名稱:</label>
        <span id="medicineName">${medicine.name}</span>
      </div>
      <div>
        <label>劑型/劑量:</label>
        <span id="medicineDosage">${medicine.dosageForm}</span>
      </div>
      <div>
        <label>用法用量:</label>
        <span id="medicineUsage">${medicine.usage}</span>
      </div>
      <div>
        <label>給藥時間:</label>
        <span id="medicineTime">${medicine.administrationTime}</span>
      </div>
      <div>
        <label>警告:</label>
        <span id="medicineWarning">${medicine.warning}</span>
      </div>
      <div>
        <label>藥品圖片:</label>
        <img src="medicineA.jpg" alt="${medicine.name}" width="500" height="400">
      </div>
    </td>
  `;

  return [tr, detailsRow];
}

const urlParams = new URLSearchParams(window.location.search);
const patientId = urlParams.get('id');

// 加載保存的選擇
const savedSelection = JSON.parse(localStorage.getItem(`selectedMedicines-${patientId}`)) || [];

if (patientId) {
  // 構建 JSON 檔案路徑
  const jsonFilePath = `patients_json/patient${patientId}.json`;

  // 使用 fetch 來異步載入 JSON 資料
  fetch(jsonFilePath)
    .then(response => response.json())
    .then(patientData => {
      document.getElementById('patientIdDisplay').innerText = `${patientData.id}`;
      document.getElementById('patientNameDisplay').innerText = `${patientData.name}`;
      document.getElementById('patientRoomDisplay').innerText = `${patientData.room}`;
      document.getElementById('admissionDateDisplay').innerText = `${patientData.admissionDate}`;

      // 處理藥品資料
      const medicineTableBody = document.getElementById('medicineTableBody');
      medicineTableBody.innerHTML = ''; // 清空先前的內容

      patientData.medicines.forEach(medicine => {
        // 根據體溫是否高於36度，動態修改警告
        if (medicine.name === 'Aliskiren' && parseFloat(patientData.BP_low) < 85) {
          medicine.warning = "脈搏<50 bpm或低血壓收縮壓<85 mmHg停止使用";
          const [medicineRow, detailsRow] = createMedicineRow(medicine, savedSelection);
          medicineRow.style.backgroundColor = 'red';
          medicineRow.style.color = 'white';
          medicineTableBody.appendChild(medicineRow);
          medicineTableBody.appendChild(detailsRow);
        } else {
          const [medicineRow, detailsRow] = createMedicineRow(medicine, savedSelection);
          medicineTableBody.appendChild(medicineRow);
          medicineTableBody.appendChild(detailsRow);
        }
      });
    })
    .catch(error => console.error('發生錯誤：', error));
} else {
  // ...
}

function saveSelection() {
  const manualRadios = document.querySelectorAll('.manual-radio');
  const radioStatus = {};
  const selectedMedicines = Array.from(manualRadios)
  .filter(radio => radio.checked && radio.id.includes('confirm'))
  .map(radio => radio.dataset.serial);
  

  manualRadios.forEach(radio => {
    radioStatus[radio.id] = radio.checked;
  });

  // 保存 radio 的狀態到本地存儲，使用病人ID作為前綴
  localStorage.setItem(`confirmedMedicines-${patientId}`, JSON.stringify(selectedMedicines));

  const currentTime = new Date();
  const formattedTime = `${currentTime.getFullYear()}/${currentTime.getMonth() + 1}/${currentTime.getDate()}---${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;
  alert(`已選中且已給藥的藥品序號：${selectedMedicines.join(', ')}\n護理師 : abc 護理師\n最後儲存時間：${formattedTime}`);
  window.location.href = 'patients.html';
}