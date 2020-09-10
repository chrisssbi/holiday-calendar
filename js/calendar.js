"use strict"

let getJSON = function(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      let status = xhr.status;
      let response = xhr.response;
      if (status === 200) {
        callback(null, response);
        console.log('Status:', status);
      } else if (callback !== 200) {
        callback(status, response);
        console.log(response);
        console.log('Oops! Something went wrong. Status:', status);
      }
    };
  xhr.send();
};

function createCalendar(year, month) {
  let mon = month;
  let d = new Date(year, mon);
  let monthName = document.querySelector('.monthName');
  let monthOne = document.querySelector('.month');
  let monName = {0: 'January', 1: 'February', 2: 'March', 3: 'April', 4: 'May', 5: 'June', 6: 'July', 7: 'August', 8: 'September', 9: 'October', 10: 'November', 11: 'December'};
  let table = '<table><tr><th>mon</th><th>tue</th><th>wed</th><th>thu</th><th>fri</th><th>sat</th><th>sun</th></tr><tr>';

  for (let i = 0; i < getDay(d); i++) {
    table += '<td></td>'; // fill empty cells, if necessary. e.g. * * * 1  2  3  4
  }
  while (d.getMonth() == mon) {
    table += (`<td id="day-${d.getDate()} month-${d.getMonth()}"> ${d.getDate()} </td>`);
      if (getDay(d) % 7 == 6) { // sunday, the last day -> newline
        table += '</tr><tr>';
      }
    d.setDate(d.getDate() + 1);
  }
  if (getDay(d) != 0) {
    for (let i = getDay(d); i < 7; i++) {
      table += '<td></td>'; // fill empty cells, if necessary. e.g. 29 30 31 * * * *
    }
  }
  table += '</tr></table>'; // close table
  let calendar = document.querySelector('.calendar');
  let resOne = [];
  resOne = `
    <div class="monthItem">
      <div class="monthName">
        ${monName[mon]}
      </div>
      <div class="month">
        ${table}
      </div>
    </div>`;
  calendar.innerHTML += resOne;
}

function getDay(date) { // get week number from 0 (mon) to 6 (su)
  let day = date.getDay();
  if (day == 0) day = 7; // sunday (0) the last day of week
  return day - 1;
}

function holidays(status, response) { // holiday's JSON
  for (let n = 0; n < response.length; n++) {
  let date = [];
  date = response[n].date;
  document.getElementById(`day-${date.day} month-${date.month-1}`).setAttribute('class', 'flag');
  document.getElementById(`day-${date.day} month-${date.month-1}`).setAttribute('new-title', `${response[n].englishName}`);
  }
}

document.getElementById('search-btn').onclick = function (e) {
  e.preventDefault();

  let j = 0;
  let day = 1;
  const year = document.getElementById('year').value;
  document.querySelector('h2').innerHTML = year;
  if (year == "") {
   return document.querySelector('.calendar').innerHTML = (`<div class="error">Please enter the year</div>`);
  }

  document.querySelector('.calendar').innerHTML = ''; // clear div
  for (j = 0; j < 12; j++) {
    createCalendar(year, j);
  }

  getJSON('http://www.kayaposoft.com/enrico/json/v1.0/?action=getPublicHolidaysForYear&year=' + encodeURIComponent(year) + '&country=ukr', holidays, true);
}
