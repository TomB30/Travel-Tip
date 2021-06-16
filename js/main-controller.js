'use strict';

import { locService } from './services/geocode-Service.js';
import { mapService } from './services/googleMaps-service.js';

window.onload = onInit;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
document.querySelector('.copy-btn').addEventListener('click', onCopyLocation);

function onInit() {
  mapService
    .initMap()
    .then(() => {
      console.log('Map is ready');
    })
    .then(() => {
      console.log('hello');
      const paramters = new URLSearchParams(window.location.search);
      const lat = paramters.get('lat');
      const lng = paramters.get('lng');
      console.log('outside', +lat, +lng);
      if (lat && lng) {
        console.log('inside', +lat, +lng);
        mapService.panTo(+lat, +lng);
        initMap(lat, lng);
      }
    })
    .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos');
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function onGetLocs() {
  document.querySelector('.locs-table').hidden = false;
  locService.getLocs().then((locs) => {
    // console.log('Locations:', locs);
    var strHtml = locs
      .map(
        (loc) =>
          `<tr>
      <td>${loc.name}</td>
      <td>${loc.lat}</td>
      <td>${loc.lng}</td>
      <td><button class="go-btn" data-lat="${loc.lat}" data-lng="${loc.lng}">Go</button></td>
      <td><button class="delete-loc-btn" data-name="${loc.name}">Delete</button></td>
      </tr>`
      )
      .join('');

    onSetParams(locs[locs.length - 1].lat, locs[locs.length - 1].lng, false);
    document.querySelector('.locs').innerHTML = strHtml;
    const elGoBtns = document.querySelectorAll('.go-btn');
    elGoBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        onGoTo(btn.dataset.lat, btn.dataset.lng);
      });
    });
    const elDelBtns = document.querySelectorAll('.delete-loc-btn');
    elDelBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        onDeleteLoc(btn.dataset.name);
      });
    });
  });
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      console.log(pos);
      //pos is by pos.coords
      mapService.panTo(pos.coords.latitude, pos.coords.longitude);
      document.querySelector('.location-title').innerText = getName(pos.coords.latitude,pos.coords.longitude).then(res)
    })
    .catch((err) => {
      console.log('err!!!', err);
    });
}

function onDeleteLoc(name) {
  locService.deleteLoc(name);
  onGetLocs();
}

function onGoTo(lat, lng) {
  mapService.panTo(lat, lng);
  onSetParams(lat, lng, true);
  document.querySelector('.locs-table').hidden = true;
}

function onPanTo() {
  console.log('Panning the Map');
  const elLocationName = document.querySelector('.location-title');
  var address = document.querySelector('.search-input').value;
  elLocationName.innerText = address;
  locService.getCoords(address).then((res) => {
    mapService.panTo(res.lat, res.lng);
  });
  document.querySelector('.search-input').value = '';
  onGetLocs();
  document.querySelector('.locs-table').hidden = false;
}

function onSetParams(lat, lng, toPrint) {
  if (toPrint) {
    const elLocationName = document.querySelector('.location-title');
    elLocationName.innerText = mapService.setParams(lat, lng);
  }
  mapService.setParams(lat, lng);
}

function onCopyLocation() {
  console.log('hi');
  mapService.copyLocation();
}

function getName(lat,lng){
  return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${+lat},${+lng}&key=AIzaSyBPyiw6Z3xEf5KBfpiCwH3zOBboChLgf8A`)
  .then((res) =>{
    return res.data
  })
  .then((res) => {
    return res.results[0]
  })
  .then((res)=>{
    return res.formatted_address
  })
  .then((res) =>{
    console.log(res);
    return res;
  })
}