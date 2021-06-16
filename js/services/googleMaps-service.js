'use strict';

import { locService } from './geocode-Service.js';
import { storageService } from './storage-service.js';

export const mapService = {
  initMap,
  addMarker,
  panTo,
  gMap,
};

var gMap;
function initMap(lat = 35.51507111351932, lng = 139.75380019366722) {
  // console.log('InitMap');
  return _connectGoogleApi().then(() => {
    console.log('google available');
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: { lat, lng },
      zoom: 15,
    });
    gMap.addListener('click', (mapsMouseEvent) => {
      const lat = mapsMouseEvent.latLng.lat();
      const lng = mapsMouseEvent.latLng.lng();
      const pos = { lat, lng };
      addMarker(pos);
    });
  });
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: prompt('What is the name of this place?'),
  });
  const location = {
    name: marker.title,
    lat: loc.lat,
    lng: loc.lng,
    createdAt: Date.now(),
  };
  locService.getLocs().then((res) => {
    console.log(res);
    res.push(location);
    console.log(res);
    storageService.save('locationsDB', res);
  });
  return marker;
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng);
  gMap.panTo(laLatLng);
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve();
  const API_KEY = 'AIzaSyASojpKZ9kBLOjwP_7vIoC6mmEO_pbq-Jg';
  var elGoogleApi = document.createElement('script');
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
  elGoogleApi.async = true;
  document.body.append(elGoogleApi);

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve;
    elGoogleApi.onerror = () => reject('Google script failed to load');
  });
}
