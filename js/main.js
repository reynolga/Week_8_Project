import {getRemoteVentDevices, getRemoteTemperatureDevices} from './jsonFile.js';
import {getVentCardString, getThermoCardString} from './htmlHelper.js'



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


const createVentModal = (ventObject) => {
  /*{"id":8,
  "controlName":"Master bedroom 1",                //Show
  "macAddress":"5c:cf:7f:23:95:4b",                //Show
  "closedPosition":25,"openPosition":150,
  "currentSetPosition":100,                        //Show
  "timeStamp":"2019-12-08T16:49:55.483Z",
  "roomRoomId":4,
  "softwareVersion":"4.0.1",                       //Show
  "controlCode":1,                                 //Show
  "ipAddress":"192.168.0.27",                
  "posChanged":0,"pressure":99622,
  "temperature":61.89,                             
  "tempSlopeCalibration":1.047,
  "tempOffsetCalibration":-4.599},  
  */
  
}

const createTemperatureModal = (tempObject) => {
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
  */

  // Create String
  const modalDialog = `<div id="device-modal" data-location="${tempObject.deviceLocation}" data-deviceType="temperature" class="full-site-modal page-block" data-animation="zoomInOut">      
    <div class="modal">
      <div class="modal-header">
        <div class="thermometer-icon-wrapper">
          <i class="fas fa-thermometer-half"></i>
        </div>
        <h2>Temperature Sensor</h2>
        <div class="starWrapper"><i class="fas fa-star"></i></div>
        <div class="close-dialog-wrapper"><i class="fas fa-times"></i></div>
      </div>
      <div class="modal-dialog-line"><span>Room:</span><span>${tempObject.deviceLocation}</span></div>
      <div class="modal-dialog-line"><span>Mac Address:</span> <span>${tempObject.macAddress}</span></div>
      <div class="modal-dialog-line"><span>Ip Address:</span> <span>${tempObject.ipAddress}</span></div>
      <div class="modal-dialog-line"><span>Device Type:</span> <span>Temperature sensor%</span></div>
      <div class="modal-dialog-line"><span>Software Version:</span> <span>${tempObject.softwareVersion}</span></div>
      <div class="modal-dialog-line"><span>Temperature:</span> <span>${tempObject.currentTemp}</span></div> 
      <div class="modal-dialog-line"><span>Humidity:</span> <span>${tempObject.currentHumidity || 0}</span></div> 
      <div class="modal-dialog-line"><span>Voltage:</span> <span>${tempObject.batteryVoltage}</span></div> 
    </div>
  </div>`

  //Append to html
  
}

//createVentModal(ventDevices[1]);

const cardEditor = document.getElementsByClassName("triple-dot-wrapper");

for(const tripleDots of cardEditor) {
  tripleDots.addEventListener('click', function(event) {
      console.log('clicked' + event + this);

      //CreateModal
  })
}