import {getRemoteServoDevices, getRemoteTemperatureDevices} from './jsonFile.js';

const appendToCardList = (htmlString) => {
  const cardList = document.getElementById('device-card-flexbox');  
  cardList.innerHTML += htmlString; 
}

const createThermoCard = (thermoCard) => {
  // <!-- Thermometer Card -->
  const newThermoDevice = `<div data-item="${thermoCard.deviceLocation}" class="device-card">
    <div class="device-card-header">
      <h2>${thermoCard.deviceLocation}</h2>
      <div class="thermometer-icon-wrapper">
        <i class="fas fa-thermometer-half"></i>
      </div>
    </div>
    <p>${thermoCard.currentTemp.toFixed(1)} &#8457</p>
  </div>`
  
  appendToCardList(newThermoDevice);
}

const createVentCard = (ventCard) => {
//<!-- Vent Card -->
  const newVent = `<div data-item="${ventCard.controlName}" class="device-card">
    <div class="device-card-header">
      <h2>${ventCard.controlName}</h2>
      <div class="vent-icon-wrapper">
        <i class="fab fa-elementor"></i>
      </div>
    </div>
    <p>${ventCard.currentSetPosition}%</p>      
  </div>`;

  appendToCardList(newVent);
}

const servoDevices = getRemoteServoDevices();
const tempDevices = getRemoteTemperatureDevices();


tempDevices.forEach((thermoDevice) => createThermoCard(thermoDevice));
servoDevices.forEach((servoDevice) => createVentCard(servoDevice));

const searchBox = document.getElementById("search");

 searchBox.addEventListener('keyup', (e) => {
  const searchInput = e.target.value.toLowerCase().trim();
  
  const cards = document.getElementsByClassName("device-card"); 
  Array.from(cards).forEach( (card) => {    
    const cardString = card.dataset.item.toLowerCase();

    if(cardString.includes(searchInput.toLowerCase())){
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  })  
})