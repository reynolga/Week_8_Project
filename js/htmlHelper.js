

const getVentCardString = (ventCard) => {
  //<!-- Vent Card -->
    const newVent = `<div data-item="${ventCard.controlName}" data-deviceType="vent" class="device-card">
      <div class="device-card-header">
        <div class="vent-icon-wrapper">
          <i class="fab fa-elementor"></i>
        </div>
        <h2>${ventCard.controlName}</h2>
      </div>
      <p>${ventCard.currentSetPosition}%</p>      
    </div>`;

    return newVent;
  }

  const getThermoCardString = (thermoCard) => {
    // <!-- Thermometer Card -->
    const newThermoDevice = `<div data-item="${thermoCard.deviceLocation}" data-deviceType="temperature" class="device-card">
      <div class="device-card-header">
        <div class="thermometer-icon-wrapper">
          <i class="fas fa-thermometer-half"></i>
        </div>
        <h2>${thermoCard.deviceLocation}</h2>  
        <div class="triple-dot-wrapper">
          <i class="fas fa-ellipsis-v"></i>  
        </div> 
      </div>
      <p>${thermoCard.currentTemp.toFixed(1)} &#8457</p>
    </div>`   
    return newThermoDevice; 
  }

  export {getVentCardString, getThermoCardString};