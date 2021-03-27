// import { getMyIp, getIp, getDomain } from "./httpService";

const formEl = document.querySelector("form");
const formInputEl = document.querySelector("form input");
const addressEl = document.querySelector(".address-wrp p");
const locationEl = document.querySelector(".location-wrp p");
const timezoneEl = document.querySelector(".timezone-wrp p");
const providerEl = document.querySelector(".isp-wrp p");
var markerMap = L.icon({
  iconUrl: './src/images/icon-location.svg',

  iconSize:     [46, 56], // size of the icon
});

getMyIp()
  .then((response) => response.json())
  .then((data) => {
    search(data.ip);
  });

const mapLayer = L.map("mapid", {
  zoomControl: false,
}).setView([51.505, -0.09], 16);

L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(
  mapLayer
);

formEl.addEventListener("submit", function (event) {
  event.preventDefault();
  search(formInputEl.value);
});

formInputEl.addEventListener("input", (event) => {
  formEl.classList.remove("has-error");
});

function setValueForInfoBar(ipAddress, locationVal, timeZonaVal, ispProvider) {
  addressEl.innerText = ipAddress;
  locationEl.innerText = locationVal;
  timezoneEl.innerText = timeZonaVal;
  providerEl.innerText = ispProvider;
}

function loadDataWithIp(ip) {
  getIp(ip)
    .then((response) => response.json())
    .then((data) => {
      updateInfoBar(data);
    })
    .catch((error) => {
      resetInfoBar();
    });
}

function loadDataWithDomain(domain) {
  getDomain(domain)
    .then((response) => response.json())
    .then((data) => {
      updateInfoBar(data);
    })
    .catch((error) => {
      resetInfoBar();
    });
}

function updateInfoBar(data) {
  L.marker([data.location.lat, data.location.lng], {icon: markerMap}).addTo(mapLayer);
  mapLayer.panTo(new L.LatLng(data.location.lat, data.location.lng));
  setValueForInfoBar(
    data.ip,
    data.location.region + " " + data.location.city,
    data.location.timezone,
    data.isp
  );
}

function resetInfoBar() {
  setValueForInfoBar("--", "--", "--", "--");
}

function search(value) {
  if (checkIsValidIp(value)) {
    loadDataWithIp(value);
  } else if (сheckIsValidDomain(value)) {
    loadDataWithDomain(value);
  } else {
    formEl.classList.add("has-error");
    resetInfoBar();
    return false;
  }
}

function checkIsValidIp(ipaddress) {
  return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    ipaddress
  )
    ? true
    : false;
}

function сheckIsValidDomain(domain) {
  return /^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/.test(
    domain
  )
    ? true
    : false;
}

function getMyIp() {
  return fetch("https://api.ipify.org/?format=json");
}

function getIp(ipAddress) {
  url =
    "https://geo.ipify.org/api/v1?apiKey=at_NmSBWmXFUIMCUe5yzb296CXgg18JC&ipAddress=" +
    ipAddress;

  return fetch(url);
}

function getDomain(domain) {
  url =
    "https://geo.ipify.org/api/v1?apiKey=at_NmSBWmXFUIMCUe5yzb296CXgg18JC&domain=" +
    domain;
  return fetch(url);
}
