"use strict";
const main = document.getElementById("results");
const url = "https://apis.is/concerts";
const dateRange = document.getElementById('date');
const search = document.getElementById('search');

let cons = [];

fetch(url)
    .then(function(results) {
        return results.json();
    })
    .then(function(results) {
        let concerts = [...results.results]; // setja allt úr json í array

        return concerts.map(function(concert) {
            // búa til elements
            let div = document.createElement("div"),
                img = document.createElement("img"),
                pName = document.createElement("p"),
                pDate = document.createElement("p"),
                pPlace = document.createElement("p");
            div.dataset.eventDateName = concert.eventDateName.toLowerCase();
            img.src = concert.imageSource
            let date = concert.dateOfShow;
            let dateArray = date.split("T");
            let islDateArray = dateArray[0].split("-");
            let islclockArray = dateArray[1].split(":");
            div.dataset.Date = dateArray[0];

            // tekur inn ár, mánuð og dag og breytir í íslenskt format 
            function islDate(year, month, day) {
                return day +"." + month + "." + year;
            }
            // breyta formatið á tímanum í klst:min
            function clock(hours, minutes) {
                return hours + ":" + minutes;
            }

            pName.innerHTML = concert.eventDateName;
            pDate.innerHTML = islDate(islDateArray[0],islDateArray[1],islDateArray[2]) + " Kl: " + clock(islclockArray[0], islclockArray[1]);
            pPlace.innerHTML = concert.eventHallName;
            div.appendChild(img);
            div.appendChild(pName);
            div.appendChild(pDate);
            div.appendChild(pPlace);
            main.appendChild(div);
            cons.push(div); // setur div elementinn inn í cons listan
            
            // keyrir searchDisplay fallið þegar að það er lift takka þegar verið er að skrifa í search barinn 
            search.addEventListener('keyup', searchDisplay);
            
            // finnur hvort að hvort að searchið passar ekki í eitthvað nafn
            // setur hide classið á elementið það ef það passar ekki annars tekur fallið hide af 
            function searchDisplay() {
                if(!div.dataset.eventDateName.includes((this.value).toLowerCase())) {
                        div.classList = 'hide';
                }
                else {
                    div.classList.remove('hide');
                }
            }

            // function sem lagar formatið á dateinu sem er gefið af flatpickr.
            // breytir úr d/m/yy yfir í yy-mm-dd
            function dateFormat(date) {
                let dateSplit = date.split('/');
                if (dateSplit[0].length < 2 && dateSplit[1].length < 2){
                    return dateSplit[2]+"-0"+dateSplit[1]+"-0"+dateSplit[0];
                }
                else if (dateSplit[0].length < 2) {
                    return dateSplit[2]+"-"+dateSplit[1]+"-0"+dateSplit[0];
                }
                else if (dateSplit[1].length < 2) {
                    return dateSplit[2]+"-0"+dateSplit[1]+"-"+dateSplit[0];
                }
                else {
                    return dateSplit[2]+"-"+dateSplit[1]+"-"+dateSplit[0];
                }
            }

            // býr til dagatal
            flatpickr(dateRange, {
                locale: "is",
                mode: "range",
                altInput: true,
                altFormat: "d.m.Y",
                onChange(selectedDates) {
                    let dateAfter = selectedDates[0];
                    let dateBefore = selectedDates[1];
                    dateDisplay(dateAfter, dateBefore); // kallar í fallið dateDisplay með fyrri og seinni tímanum á dagatalinu
                }
        });

            function dateDisplay(after, before) {
                let afterArray = (after.getDate() +"/"+ (after.getMonth() +1) +"/"+ after.getFullYear());
                let beforeArray = (before.getDate() +"/"+ (before.getMonth() + 1) +"/"+ before.getFullYear());
                // fer í gegnum hvert div element í cons arrayinu
                cons.forEach(concert => {
                    // finnur hvaða element er utan tímabilinu sem notandi valdi og felur það.
                    
                    if(((concert.dataset.Date >= dateFormat(afterArray)) && (concert.dataset.Date <= dateFormat(beforeArray))) || (dateFormat(afterArray) === undefined && dateFormat(beforeArray) === undefined)) {
                        concert.classList.remove('hide');
                    }
                    else {
                        concert.classList = 'hide';
                    }
                });
            }
        });  
    })
    .catch(function(error) {
        console.log(error);
    });
