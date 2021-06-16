'use strict';

import { locService } from './services/geocode-Service.js';
import { mapService } from './services/googleMaps-service.js';

window.onload = onInit;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;

function onInit() {
  mapService
    .initMap()
    .then(() => {
      console.log('Map is ready');
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

function onGetLocs(ev) {
  ev.stopPropagation();
  locService.getLocs().then((locs) => {
    console.log('Locations:', locs);
    var strHtml = locs
      .map((loc) => {
        return `<tr>
      <td>${loc.name}</td>
      <td>${loc.lat}</td>
      <td>${loc.lng}</td>
      <td><button class="go-btn" data-lat="${loc.lat}" data-lng="${loc.lng}">Go</button></td>
  </tr>`;
      })
      .join('');
    document.querySelector('.locs').innerHTML = strHtml;
    const elbtns = document.querySelectorAll('.go-btn');
    elbtns.forEach((btn) => {
      console.log(btn.dataset.lat, btn.dataset.lng);
      btn.addEventListener('click', () => {
        onGoTo(btn.dataset.lat, btn.dataset.lng);
      });
    });
  });
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      //pos is by pos.coords
      document.querySelector(
        '.user-pos'
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
      mapService.panTo(pos.coords.latitude, pos.coords.longitude);
    })
    .catch((err) => {
      console.log('err!!!', err);
    });
}

function onGoTo(lat, lng) {
  console.log('hi');
  mapService.panTo(lat, lng);
}

function onPanTo() {
  console.log('Panning the Map');
  var address = document.querySelector('.search-input').value;
  locService.getCoords(address).then((res) => {
    mapService.panTo(res.lat, res.lng);
  });
  document.querySelector('.search-input').value = '';
}
