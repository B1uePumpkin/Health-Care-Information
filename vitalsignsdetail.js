const urlParams = new URLSearchParams(window.location.search);
const patientId = urlParams.get('id');
const jsonFilePath = `patients_json/patient${patientId}.json`;
fetch(jsonFilePath)
  .then(response => response.json())
  .then(vitalsignsdetail =>{
    document.getElementById('patientNameDisplay').innerHTML = `${vitalsignsdetail.name}`
    document.getElementById('patientIdDisplay').innerHTML =`${vitalsignsdetail.id}`
    document.getElementById('patientRoomDisplay').innerHTML = `${vitalsignsdetail.room}`
    document.getElementById('admissionDateDisplay').innerHTML = `${vitalsignsdetail.admissionDate}`
    document.getElementById('name').innerHTML = `${vitalsignsdetail.name}`
    document.getElementById('BT').innerHTML = `${vitalsignsdetail.BT}`
    document.getElementById('BP').innerHTML = `${vitalsignsdetail.BP}`
    document.getElementById('HR').innerHTML = `${vitalsignsdetail.HR}`
  })