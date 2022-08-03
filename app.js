const { log } = console

const resultIp = document.querySelector('.ip-address')
const resultLocation = document.querySelector('.location')
const resultTimezone = document.querySelector('.timezone')
const resultIsp = document.querySelector('.isp')
const input = document.querySelector('input')
const submitBtn = document.querySelector('.submit-btn')
const search = document.querySelector('.search')
const alert = document.querySelector('.alert')
const result = document.querySelector('.result')

let map

$.getJSON('//api.ipify.org?format=jsonp&callback=?', function (data) {
  // const API = `//ip-api.com/json/${data.ip}`  //over https unavailable
  // const API = `https://ipapi.co/${data.ip}/json/` //domain unavailable
  // const API=`https://geo.ipify.org/api/v2/country,city?apiKey=at_vHasExd2Dgin4pbT7YpU10jS8qnoF&ipAddress=${data.ip}` //reached to limit
  const API = `https://api.ipgeolocation.io/ipgeo?apiKey=b660ef56ed1e45c29bcfd0e02a7cd35a&ip=${data.ip}` ////domain unavailable
  log(API)

  fetchData(API)
})

const fetchData = async (api) => {
  try {
    const res = await fetch(api)
    const data = await res.json()
    log(data)
    setMap(data)
    displayInfo(data)
  } catch (err) {
    console.log(err)
  }
}

function displayInfo({
  ip,
  city,
  state_prov,
  country_code2,
  zipcode,
  time_zone,
  isp,
}) {
  resultIp.innerHTML = ip
  resultLocation.innerHTML = `${city}, ${state_prov}, ${country_code2}, ${zipcode}`
  resultTimezone.innerHTML = `UTC ${
    Math.abs(time_zone.offset) < 10
      ? `${
          time_zone.offset >= 0
            ? `+0${time_zone.offset}`
            : `-0${Math.abs(time_zone.offset)}`
        }`
      : `${time_zone.offset >= 0 ? `+${time_zone.offset}` : time_zone.offset}`
  }:00`
  resultIsp.innerHTML = isp
}

function setMap({ latitude, longitude }) {
  if (map) {
    map.remove()
  }
  map = L.map('map').setView([latitude, longitude], 13)
  const marker = L.marker([latitude, longitude]).addTo(map)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap',
  }).addTo(map)
}

search.addEventListener('submit', (e) => {
  e.preventDefault()
  if (ValidateIPaddress(input.value)) {
    log('success')
    const API = `https://api.ipgeolocation.io/ipgeo?apiKey=b660ef56ed1e45c29bcfd0e02a7cd35a&ip=${input.value}`

    fetchData(API)
  } else {
    log('failure')
    displayAlert()
  }
})

const displayAlert = () => {
  alert.innerHTML = 'Please enter valid IP addres or domain.'
  alert.classList.add('show')
  setTimeout(() => {
    alert.classList.remove('show')
  }, 3000)
}

function ValidateIPaddress(ipAddress) {
  const IPv4RegEx = /^((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(?!$)|$)){4}$/
  const IPv6RegEx =
    /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/
  const domainRegEx =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/

  // alt
  // const domainRegEx = /^[a-zA-Z0-9._-]+\\[a-zA-Z0-9.-]$/

  if (IPv4RegEx.test(ipAddress) || IPv6RegEx.test(ipAddress)) {
    log('ip')
    return true
  } else if (domainRegEx.test(ipAddress)) {
    log('domain')
    return true
  } else {
    return false
  }
}

document.querySelector('body').addEventListener('mouseover', (e) => {
  toggleHideResult(e)
})

const toggleHideResult = (e) => {
  const id = e.target.id
  if (id === 'map') {
    result.classList.add('hide')
  } else {
    result.classList.remove('hide')
  }
}
