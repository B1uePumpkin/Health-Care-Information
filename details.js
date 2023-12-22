// 等待網頁的DOMContentLoaded事件
document.addEventListener('DOMContentLoaded', function () {
    // 這裡的程式碼將在HTML結構完全載入後執行
    // 使用 JavaScript 動態填入病人的生命徵象資料
    document.getElementById("patientNameDisplay").textContent = patientData[0].name;
    document.getElementById("patientIdDisplay").textContent = patientData[0].id;
    document.getElementById("patientRoomDisplay").textContent = patientData[0].room;
    document.getElementById("admissionDateDisplay").textContent = patientData[0].admissionDate;

});


