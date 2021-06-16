'use strict';
export const locService = {
    getLocs,
    panTo,
    getCoords
}


const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 }, 
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function getCoords(address){
    const API_KEY = 'AIzaSyBPyiw6Z3xEf5KBfpiCwH3zOBboChLgf8A';
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`)
    .then((res) => res.data)
    .then((res) => res.results[0])
    .then((res) => res.geometry)
    .then((res) => res.viewport)
    .then((res) => res.northeast)
    .then((res) => {
        return {
            lat : res.lat,
            lng : res.lng
        }
    })
}


function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
  }
  