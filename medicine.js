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
    <td><input type="checkbox" class="manual-checkbox" ${selectedMedicines.includes(medicine.serialNumber) ? 'checked' : ''} data-serial="${medicine.serialNumber}" onclick="event.stopPropagation();"></td>
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
        const [medicineRow, detailsRow] = createMedicineRow(medicine, savedSelection);
        medicineTableBody.appendChild(medicineRow);
        medicineTableBody.appendChild(detailsRow);
      });
    })
    .catch(error => console.error('發生錯誤：', error));
} else {
  document.getElementById('patientIdDisplay').innerText = '未指定病人ID';
  document.getElementById('patientNameDisplay').innerText = '未指定病人姓名';
  document.getElementById('patientRoomDisplay').innerText = '未指定病房號碼';
  document.getElementById('admissionDateDisplay').innerText = '未指定住院日期';
}

function saveSelection() {
  const manualCheckboxes = document.querySelectorAll('.manual-checkbox');
  const selectedMedicines = Array.from(manualCheckboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.dataset.serial);

  // 保存選中的藥品序號到本地存儲，使用病人ID作為前綴
  localStorage.setItem(`selectedMedicines-${patientId}`, JSON.stringify(selectedMedicines));

  alert(`已選中的藥品序號：${selectedMedicines.join(', ')}`);
}

function goBack() {
  window.location.href = 'patients.html';
}