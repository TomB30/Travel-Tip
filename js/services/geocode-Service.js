'use strict';

import { storageService } from './storage-Service.js'

export const locService = {
    getLocs,
    panTo,
    getCoords,
}

const locs = storageService.load('locationsDB') || [];


function getLocs() {
    return new Promise((resolve, reject) => {
            resolve(locs);
    });
}

function getCoords(address) {
    if (findIdxByName(address) >= 0) return Promise.resolve(locs[findIdxByName(address)]);

    console.log('Getting data from server');
    const API_KEY = 'AIzaSyBPyiw6Z3xEf5KBfpiCwH3zOBboChLgf8A';
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`)
        .then((res) => res.data)
        .then((res) => res.results[0])
        .then((res) => res.geometry)
        .then((res) => res.viewport)
        .then((res) => res.northeast)
        .then((res) => {
            const loc = {
                name: address,
                lat: res.lat,
                lng: res.lng,
                createdAt: Date.now()
            }
            locs.push(loc);
            storageService.save('locationsDB', locs);
            return loc
        })
}



function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}


function findIdxByName(name){
   return locs.findIndex((location) => location.name === name)
}