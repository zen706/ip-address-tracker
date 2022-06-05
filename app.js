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
  const API = `//ip-api.com/json/${data.ip}`
  log(API)

  fetchData(API)
})

const fetchData = async (api) => {
  try{
    const res = await fetch(api)
    const data = await res.json()
    setMap(data)
    displayInfo(data)
  }
  catch(err) {
    console.log(err)
  }
}

function displayInfo({ query, city, regionName, countryCode,zip, timezone, isp }) {
  resultIp.innerHTML = query
  resultLocation.innerHTML = `${city}, ${regionName}, ${countryCode}, ${zip}`
  resultTimezone.innerHTML = timezone
  resultIsp.innerHTML = isp
}

function setMap({ lat, lon }) {
  if (map) {
    map.remove()
  }
  map = L.map('map').setView([lat, lon], 13)
  const marker = L.marker([lat, lon]).addTo(map)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap',
  }).addTo(map)
}

search.addEventListener('submit', (e) => {
  e.preventDefault()
  if (ValidateIPaddress(input.value)) {
    log('success')
    const API = `http://ip-api.com/json/${input.value}`
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
  const IPv4RegEx =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  const IPv6RegEx =
    /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/
  const domainRegEx =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/

  // alt
  // const IPv4RegEx =/^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/
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

document.querySelector('body').addEventListener('mouseover',(e)=>{
  toggleHideResult(e)
})

const toggleHideResult=(e)=>{
  const id = e.target.id
  if (
    id === 'map' 
  ) {
    result.classList.add('hide')
  } else {
    result.classList.remove('hide')
  }
}