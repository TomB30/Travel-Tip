'use strict';
export const locService = {
    getLocs,
    panTo
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


function panTo(address){
    const API_KEY = 'AIzaSyBPyiw6Z3xEf5KBfpiCwH3zOBboChLgf8A'
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`)
}