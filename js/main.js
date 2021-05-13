import {getRemoteVentDevices, getRemoteTemperatureDevices} from './jsonFile.js';
import {getVentCardString, getThermoCardString, getThermoModalString, getVentCardModal} from './htmlHelper.js'



const calculateAvgTemp = (temperatureDeviceList) => {
  let count = 0.0;
  const avgTemp = temperatureDeviceList.reduce((acc, dev) => { 
     if(dev.currentTemp > 0) {
       count++;
       return acc + dev.currentTemp;
     } else {
       return acc;
     }
  }, 0) //0 Initial value

  let result = avgTemp/count;
  if(isNaN(result))return '-';
  return result.toFixed(1);
}

const calculateOverallUtilization = (ventDeviceList) => {
  
  const totalUtilization = ventDeviceList.reduce((acc, dev) => { 
      return acc + dev.currentSetPosition;
  }, 0) //0 Initial value

   const result = totalUtilization/ventDeviceList.length;

   if(isNaN(result)){ return '-';}
   return result.toFixed(1);
}

const getDeviceList = () => {
  const ventNames = ventDevices.map((device) => { return {name:device.controlName, type:'vent'} }); 
  const tempNames = tempDevices.map((device) => { return {name:device.deviceLocation, type:'temp'} }); 

  const allNames = [...ventNames, ...tempNames];
  return allNames;
}

const updateDeviceOverview = (deviceList) => {
  const [tempVentDevices, tempTemperatureDevices] = getDevicesFromHtml()

  //Update Temperature
  const htmlAvgTemp = document.getElementById('avg-temp');  
  htmlAvgTemp.innerText = calculateAvgTemp(tempTemperatureDevices);

  //update Utilization
  const htmlUtilization = document.getElementById('utilization');
  htmlUtilization.innerText = calculateOverallUtilization(tempVentDevices);

  // Update number of Decives
  const htmlNumberOfDevices = document.getElementById('number-of-devices');
  htmlNumberOfDevices.innerText = tempVentDevices.length + tempTemperatureDevices.length;
}


const appendToCardList = (htmlString) => {
  const cardList = document.getElementById('device-card-flexbox');  
  cardList.innerHTML += htmlString; 
}

const createThermoCard = (thermoCard) => {
  // <!-- Thermometer Card -->
  const newThermoDevice = getThermoCardString(thermoCard);
  appendToCardList(newThermoDevice);
}

const createVentCard = (ventCard) => {
//<!-- Vent Card -->
  const newVent = getVentCardString(ventCard);
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
    if(card.style.display != 'none') {

      if(card.dataset.devicetype == 'vent'){
        const ventDevice = ventDevices.find(vent => vent.controlName === card.dataset.item);     
        if(ventDevice != undefined) ventDeviceList.push(ventDevice);

      } else if(card.dataset.devicetype == 'temperature'){      
        const tempDev = tempDevices.find(vent => vent.deviceLocation === card.dataset.item); 
        if(tempDev != undefined) tempDeviceList.push(tempDev);
      }
    }
  })
  

  return [ventDeviceList, tempDeviceList];
}

const getDeviceObjectFromNameAndType = (deviceObj) => {

  const cards = document.getElementsByClassName("device-card"); 
  let device = undefined;

  for(const card of Array.from(cards)){ 
    //If displayed
    if(card.style.display != 'none') {
      
      if(card.dataset.item == deviceObj.name){

        if(card.dataset.devicetype == "vent"){
          device = ventDevices.find(vent => vent.controlName === deviceObj.name);  
          break;   
        } else if(card.dataset.devicetype == 'temperature'){      
          device = tempDevices.find(vent => vent.deviceLocation === card.dataset.item);           
          break;
        }
      }
    }
  }

  return device;
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


const createTemperatureModal = (tempObject) => {  
  // Create String
  const tempModalString = getThermoModalString(tempObject);

  //Append to html
  const modalSection = document.getElementById("modal-section");
  modalSection.innerHTML += tempModalString;  

  const modalX = findModalX({name: tempObject.controlName, type: "temperature"});
  const modalStar = findModalStar({name: tempObject.controlName, type: "temperature"});

}


const createVentModal = (tempObject) => {  
  // Create String
  const tempModalString = getVentCardModal(tempObject);

  //Append to html
  const modalSection = document.getElementById("modal-section");
  modalSection.innerHTML += tempModalString;  

  const modalX = findModalX({name: tempObject.controlName, type: "vent"});
  const modalStar = findModalStar({name: tempObject.controlName, type: "vent"});
  
}

const cardEditor = document.getElementsByClassName("triple-dot-wrapper");


const isModalCreated = (deviceObj) => {
  const modals = document.getElementsByClassName("device-modal");

  if(!modals) return false;
  let foundValue = false;

  for(const modal of Array.from(modals)) {
    if(modal.dataset.location == deviceObj.name && 
       modal.dataset.devicetype === deviceObj.type){
        foundValue = true;
        break;
       }
  }

  return foundValue;
}

const findModalX = (deviceObj) => {  
  return findModalObjectByClass("close-dialog-wrapper", deviceObj); 
}

const findModalStar = (deviceObj) => {
  return findModalObjectByClass("starWrapper", deviceObj);
}

const findModalObjectByClass = (className, deviceObj) => {
  const modalObjects = document.getElementsByClassName(className);
  
  if(!modalObjects) return false;
  let foundValue = undefined;

  for(const modal of Array.from(modalObjects)) {
    if(modal.dataset.location == deviceObj.name && 
       modal.dataset.devicetype === deviceObj.type){
        foundValue = modal;
        break;
       }
  }

  return foundValue;
}



for(const tripleDots of cardEditor) {
  tripleDots.addEventListener('click', function(event) {
      console.log('clicked' + event + this);

      const deviceObject = getDeviceObjectFromNameAndType({name: this.dataset.item, type: this.dataset.devicetype})

      if(!isModalCreated({name: this.dataset.item, type: this.dataset.devicetype}))
      {
        //CreateModal
        if(this.dataset.devicetype === 'temperature'){
          createTemperatureModal(deviceObject);
        }else if(this.dataset.devicetype === 'vent'){
          createVentModal(deviceObject);
        }
      }
  })
}

document.addEventListener('keyup', (e) => {
  if(e.key === 'Escape'){
    document.querySelector('.full-site-modal.is-visible').classList.remove('is-visible');
  }
})