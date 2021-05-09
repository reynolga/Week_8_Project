import {getRemoteVentDevices, getRemoteTemperatureDevices} from './jsonFile.js';



const calculateAvgTemp = () => {
  let count = 0.0;
  const avgTemp = tempDevices.reduce((acc, dev) => { 
     if(dev.currentTemp > 0) {
       count++;
       return acc + dev.currentTemp;
     } else {
       return acc;
     }
  }, 0) //0 Initial value

  return avgTemp/count;
}

const calculateOverallUtilization = () => {
  
  const totalUtilization = ventDevices.reduce((acc, dev) => { 
      return acc + dev.currentSetPosition;
  }, 0) //0 Initial value

  return totalUtilization/ventDevices.length;
}

const getDeviceList = () => {
  const ventNames = ventDevices.map((device) => { return {name:device.controlName, type:'vent'} }); 
  const tempNames = tempDevices.map((device) => { return {name:device.deviceLocation, type:'temp'} }); 

  const allNames = [...ventNames, ...tempNames];
  return allNames;
}

const findDevice = (nameType) => { 
  //find which device
  if(listItem.type == 'vent') {
    return ventDevices.find(vent => vent.controlName === listItem.name); 
    } else if(listItem.type == 'temp'){
    //Find it.
    return tempDevices.find(vent => vent.deviceLocation === listItem.name);        
    }
} 

const updateDeviceOverview = (deviceList) => {
  const htmlDevices = getDeviceList();

    //Update Temperature
  const htmlAvgTemp = document.getElementById('avg-temp');  
  htmlAvgTemp.innerText = calculateAvgTemp().toFixed(1);

  //update Utilization
  const htmlUtilization = document.getElementById('utilization');
  htmlUtilization.innerText = calculateOverallUtilization().toFixed(1);

  // Update number of Decives
  const htmlNumberOfDevices = document.getElementById('number-of-devices');
  htmlNumberOfDevices.innerText = ventDevices.length + tempDevices.length;
}





const appendToCardList = (htmlString) => {
  const cardList = document.getElementById('device-card-flexbox');  
  cardList.innerHTML += htmlString; 
}

const createThermoCard = (thermoCard) => {
  // <!-- Thermometer Card -->
  const newThermoDevice = `<div data-item="${thermoCard.deviceLocation}" data-deviceType="temperature" class="device-card">
    <div class="device-card-header">
      <div class="thermometer-icon-wrapper">
        <i class="fas fa-thermometer-half"></i>
      </div>
      <h2>${thermoCard.deviceLocation}</h2>      
    </div>
    <p>${thermoCard.currentTemp.toFixed(1)} &#8457</p>
  </div>`
  
  appendToCardList(newThermoDevice);
}

const createVentCard = (ventCard) => {
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

  appendToCardList(newVent);
}

const ventDevices = getRemoteVentDevices();
const tempDevices = getRemoteTemperatureDevices();
const dataFilter = '[data-filter]';

tempDevices.forEach((thermoDevice) => createThermoCard(thermoDevice));
ventDevices.forEach((ventDevice) => createVentCard(ventDevice));

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
});


const filterLink = document.querySelectorAll(dataFilter);
const active = 'active';

const setActive = (elm, selector) => {
  if(document.querySelector(`${selector}.${active}`) !== null){
    document.querySelector(`${selector}.${active}`).classList.remove(active);
  }
  elm.classList.add(active);  
};

const showAllCards = () => {
  const cards = document.getElementsByClassName("device-card"); 
  Array.from(cards).forEach( (card) => { 
    card.style.display = 'block';
  })
}


const showCardsOfType = (type) => {
  const cards = document.getElementsByClassName("device-card"); 
  Array.from(cards).forEach((card) => { 
    if(card.dataset.devicetype == type){
      card.style.display = 'block';
    } else{
      card.style.display = 'none';
    }
  })
}

const sortCardsByTemperature = () => {
  const sortedList = tempDevices.sort(function(a,b) {
    return a.currentTemp - b.currentTemp;
  })
  //delete cards
  const cardList = document.getElementById('device-card-flexbox');  
  cardList.innerHTML = ""; 

  //create cards
  sortedList.forEach((thermoDevice) => createThermoCard(thermoDevice));
  ventDevices.forEach((ventDevice) => createVentCard(ventDevice));
}

const sortCardsByOpenPosition = () => {
  const sortedList = ventDevices.sort(function(a,b) {
    return a.currentSetPosition - b.currentSetPosition;
  })
  //delete cards
  const cardList = document.getElementById('device-card-flexbox');  
  cardList.innerHTML = ""; 

  //create cards
  sortedList.forEach((ventDevice) => createVentCard(ventDevice));
  tempDevices.forEach((thermoDevice) => createThermoCard(thermoDevice)); 
}

const sortByRoom = () => {
  //Delete cards
  const cardList = document.getElementById('device-card-flexbox');  
  cardList.innerHTML = ""; 

  const allNames = getDeviceList(); 

  allNames.sort(function(a,b) {
    if(a.name < b.name) return -1;
    if(a.name > b.name) return 1;
    return 0;
  });

  allNames.forEach((listItem) => {
    
    //find which device
    if(listItem.type == 'vent') {
        //Find it.
        const ventDevice = ventDevices.find(vent => vent.controlName === listItem.name);        
        //build it.
        if(ventDevice != undefined) {
          createVentCard(ventDevice);
        }
    }else if(listItem.type == 'temp'){
        //Find it.
        const tempDev = tempDevices.find(vent => vent.deviceLocation === listItem.name);        
        //build it.
        if(tempDev != undefined) {
          createThermoCard(tempDev);
        }
    }
  })
}

const getDevicesFromHtml = () => {

  const cards = document.getElementsByClassName("device-card"); 
  const tempDeviceList = [];
  const ventDeviceList = [];

  Array.from(cards).forEach((card) => { 
    if(card.dataset.devicetype == 'vent'){
      
    } else if(card.dataset.devicetype == 'temperature'){      
      card.dataset.item //Location
      find
    }
  })

}




for(const filter of Array.from(filterLink))
{
  filter.addEventListener("click", function(filter){
    //Set active
    setActive(this, '.filter-label');

    //filter values
    if(this.dataset.filter == 'all'){
      showAllCards();
    }else if(this.dataset.filter == 'sortByTemp'){
      sortCardsByTemperature();
    }else if(this.dataset.filter == 'sortByOpen'){
      sortCardsByOpenPosition();
    }else if(this.dataset.filter == 'sortByRoom'){
      sortByRoom();
    }else if (this.dataset.filter == 'vent'){
      showCardsOfType('vent');
    }else if (this.dataset.filter == 'temperature'){
      showCardsOfType('temperature');
    }

    updateDeviceOverview(); //After changes to the table.
  })
}

updateDeviceOverview();
