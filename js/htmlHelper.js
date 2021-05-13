const getVentCardString = (ventCard) => {
  //<!-- Vent Card -->
    const newVent = `<div data-item="${ventCard.controlName}" data-deviceType="vent" class="device-card">
      <div class="device-card-header">
        <div class="vent-icon-wrapper">
          <i class="fab fa-elementor"></i>
        </div>
        <h2>${ventCard.controlName}</h2>
        <div class="triple-dot-wrapper" data-item="${ventCard.controlName}" data-deviceType="vent">
          <i class="fas fa-ellipsis-v"></i>  
        </div> 
      </div>
      <p>${ventCard.currentSetPosition}%</p>      
    </div>`;

    return newVent;
  }

  const getThermoCardString = (thermoObject) => {
    // <!-- Thermometer Card -->
    const newThermoDevice = `<div class="device-card" data-item="${thermoObject.deviceLocation}" data-deviceType="temperature">
      <div class="device-card-header">
        <div class="thermometer-icon-wrapper">
          <i class="fas fa-thermometer-half"></i>
        </div>
        <h2>${thermoObject.deviceLocation}</h2>  
        <div class="triple-dot-wrapper" data-item="${thermoObject.deviceLocation}" data-deviceType="temperature">
          <i class="fas fa-ellipsis-v"></i>  
        </div> 
      </div>
      <p>${thermoObject.currentTemp.toFixed(1)} &#8457</p>
    </div>`   
    return newThermoDevice; 
  }

  const getThermoModalString = (thermoObject) => {
  /*{"
  {"id":60,
  "macAddress":"60:1:94:b:95:68",
  "ipAddress":"192.168.0.33",
  "deviceType":0,
  "deviceLocation":"Office",
  "timeStamp":"2019-12-08T16:49:30.483Z",
  "tempSlopeCalibration":1.1059999465942383,"tempOffsetCalibration":-7.642000198364258,
  "softwareVersion":"4.3.1",
  "controlCode":1,
  "roomRoomId":2,
  "currentTemp":68.76,
  "currentHumidity":null,
  "pressure":99262,
  "batteryVoltage":3.29,
  "batteryCalibrationOffset":0.15},
  }
  */


    const modalDialog = `<div class="full-site-modal device-modal page-block" data-location="${thermoObject.deviceLocation}" data-deviceType="temperature" data-animation="zoomInOut">      
    <div class="modal">
      <div class="modal-header">
        <div class="thermometer-icon-wrapper">
          <i class="fas fa-thermometer-half"></i>
        </div>
        <h2>Temperature Sensor</h2>
        <div class="starWrapper" data-item="${thermoObject.deviceLocation}" data-deviceType="temperature"><i class="fas fa-star"></i></div>
        <div class="close-dialog-wrapper" data-item="${thermoObject.deviceLocation}" data-devicetype="temperature"><i class="fas fa-times"></i></div>
      </div>
      <div class="modal-dialog-line"><span>Room:</span><span>${thermoObject.deviceLocation}</span></div>
      <div class="modal-dialog-line"><span>Mac Address:</span> <span>${thermoObject.macAddress}</span></div>
      <div class="modal-dialog-line"><span>Ip Address:</span> <span>${thermoObject.ipAddress}</span></div>
      <div class="modal-dialog-line"><span>Device Type:</span> <span>Temperature sensor</span></div>
      <div class="modal-dialog-line"><span>Software Version:</span> <span>${thermoObject.softwareVersion}</span></div>
      <div class="modal-dialog-line"><span>Temperature:</span> <span>${thermoObject.currentTemp} &#8457</span></div> 
      <div class="modal-dialog-line"><span>Humidity:</span> <span>${thermoObject.currentHumidity || 0}%</span></div> 
      <div class="modal-dialog-line"><span>Voltage:</span> <span>${thermoObject.batteryVoltage} V</span></div> 
    </div>
  </div>`

  return modalDialog;
}

const getVentCardModal = (ventObject) =>{
  /*
  {
  "id":8,
  "controlName":"Master bedroom 1",
  "macAddress":"5c:cf:7f:23:95:4b",
  "closedPosition":25,
  "openPosition":150,
  "currentSetPosition":100,
  "timeStamp":"2019-12-08T16:49:55.483Z",
  "roomRoomId":4,
  "softwareVersion":"4.0.1",
  "controlCode":1,
  "ipAddress":"192.168.0.27",
  "posChanged":0,
  "pressure":99622,
  "temperature":61.89,
  "tempSlopeCalibration":1.047,
  "tempOffsetCalibration":-4.599},
  */
  
  const modalDialog = `<div class="full-site-modal device-modal page-block" data-item="${ventObject.controlName}" data-deviceType="vent" data-animation="zoomInOut">      
    <div class="modal">      
      <div class="modal-header">
        <div class="vent-icon-wrapper">
          <i class="fab fa-elementor"></i>          
        </div>
        <h2>Vent</h2>
        <div class="starWrapper" data-item="${ventObject.deviceLocation}" data-deviceType="vent"><i class="fas fa-star"></i></div>
        <div class="close-dialog-wrapper" data-item="${ventObject.controlName}" data-deviceType="vent">
          <i class="fas fa-times"></i>
        </div>
      </div>
      <div class="modal-dialog-line"><span>Room:</span><span>${ventObject.controlName}</span></div>
      <div class="modal-dialog-line"><span>Mac Address:</span> <span>${ventObject.macAddress}</span></div>
      <div class="modal-dialog-line"><span>Ip Address:</span> <span>${ventObject.ipAddress}</span></div>
      <div class="modal-dialog-line"><span>Current Position:</span> <span>${ventObject.currentSetPosition} %</span></div>
      <div class="modal-dialog-line"><span>Software Version:</span> <span>${ventObject.temperature}/span></div>
      <div class="modal-dialog-line"><span>Control Code:</span> <span>${ventObject.controlCode}</span></div> 
    </div>
  </div>`

  return modalDialog;
};





export {getVentCardString, getThermoCardString, getThermoModalString, getVentCardModal};