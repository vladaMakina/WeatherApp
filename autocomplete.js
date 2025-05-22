// ///////////////////// autocomplete ////////////////////
class Autocomplete {

   constructor() {

      this.weather = new Weather();

      this.apiKey = this.weather.apiKey;
      // console.log("Autocomplete -> constructor -> apiKey", this.apiKey)

      // Api key
      // search input text
      this.searchInputText;
      // index of a list element that is in focus
      this.childIndex = 0;

      // COUNTRY //

      // countries from json file to fetch
      this.countries;
      // matches of countries from input 
      this.countryMatches;
      // input box for countries
      this.countryInput;


      // STATE //

      // input box for states
      this.states;
      // state from list of suggestions
      this.stateMatches;
      // input field for state
      this.stateInput;

      // CITY //

      // cities
      this.cities;
      // city from list
      this.cityMatches;
      // city input field
      this.cityInput;
   }



   // ///////////////////////////       COUNTRY       ///////////////////////////////
   // get countries from api server
   getCountries = async () => {
      const res = await fetch('https://alexkozelj.github.io/AirPollutionApp/countries.json');
      // console.log(res);
      this.countries = await res.json();
   };

   // Filter countries
   searchCountries = searchText => {
      // set the text in input field
      this.searchInputText = searchText;
      // Get matches to current text input
      this.countryMatches = this.countries.data.filter(country => {
         if (searchText.length > 1) {
            const regex = new RegExp(`^${searchText}`, 'gi');
            return country.country.match(regex);
         }
      });
      // Clear when input or matches are empty
      if (searchText.length === 0) {
         this.countryMatches = [];
         countryMatchList.innerHTML = '';
      }

      this.outputHtmlCountry(this.countryMatches);
   };

   // select country over keyboard
   keyboardSelectCountry = (e) => {
      // ENTER KEY
      if (e.keyCode === 13) {
         // remove cursor when enter key is pressed
         countryInput.blur();
         // assign input text
         this.searchInputText = countryInput.value;
         // if there are no matches on the list, the input value is always false
         if (this.countryMatches.length === 0) {
            countryInput.setAttribute("class", "form-control is-invalid");
         } else {
            // if there is a match, assign to true
            let match = false;
            // go through a list to find a match with input field
            this.countryMatches.forEach((country) => {
               // if there is a match
               if (this.searchInputText.toLowerCase() === country.country.toLowerCase()) {
                  match = true;
                  // set the country value by clicking on a dropdown list of countries
                  this.countryInput = country.country;
                  // add a completion style to input when selection is done
                  countryInput.setAttribute("class", "form-control is-valid");
                  // reset a index for a next search
                  this.childIndex = 0;
                  // show state input field
                  stateForm.style.display = "block";
                  // hide modal info if there
                  modalInfo.style.display = "none";

                  // reset the search list array
                  this.countryMatches = [];
                  // clear search list output
                  this.outputHtmlCountry(this.countryMatches);

                  // set focus to state input field
                  stateInput.focus();

                  // GET STATES for a selected country
                  // Serbia states are not complete in api
                  if (this.countryInput === "Serbia") {
                     this.getSerbiaStates();
                  } else {
                     // get states of selected country
                     this.getStates();
                  }
               }
               // if there are no match, show invalid form style
               if (match === false) {
                  countryInput.setAttribute("class", "form-control is-invalid");
                  countryMatchList.innerHTML = '';
               }
            })
         }
         e.preventDefault();
      }

      // DOWN ARROW KEY
      if (e.keyCode === 40) {
         // end of a list
         if (this.childIndex === countryMatchList.children.length - 1) {
            // stay at the last li
            this.childIndex = this.countryMatches.length - 1;
         } else {
            // need a loop while up arrow key changes child index
            for (let i = 0; i < this.countryMatches.length; i++) {
               // match the input name and list item to add style
               if (countryInput.value.toLowerCase() === this.countryMatches[i].country.toLowerCase()) {
                  this.childIndex = i + 1;
               }
            }
         }
         // assign input text to the countries from match list
         countryInput.value = countryMatchList.children[this.childIndex].children[0].innerText;
         // add style to list item 
         for (let i = 0; i < this.countryMatches.length; i++) {
            // match the input name and list item to add style
            if (this.countryMatches[i].country.toLowerCase() === countryInput.value.toLowerCase()) {
               // in case when it's not the first list item
               if (i !== 0) {
                  // default style to previous list item
                  countryMatchList.children[i - 1].setAttribute("class", "card card-body parent");
                  // item that is bin selected
                  countryMatchList.children[i].setAttribute("class", "card card-body parent selectedCard");
               } else {
                  // if its the first list item, set default style to the last element and add style to fist
                  countryMatchList.children[this.countryMatches.length - 1].setAttribute("class", "card card-body parent");
                  countryMatchList.children[i].setAttribute("class", "card card-body parent selectedCard");
               }
            }
         }
         e.preventDefault();
      }

      // UP ARROW KEY
      if (e.keyCode === 38) {
         // stays at the first element
         if (this.childIndex === 0) {
            // first list item
            this.childIndex = 0;
         } else {
            // going back
            this.childIndex -= 1;
         }
         // assign input text to the countries from match list
         countryInput.value = countryMatchList.children[this.childIndex].children[0].innerText;
         // add style to list item 
         for (let i = 0; i < this.countryMatches.length; i++) {
            // match the input name and list item to add style
            if (this.countryMatches[i].country.toLowerCase() === countryInput.value.toLowerCase()) {
               // in case when it's not the first list item
               if (i === this.countryMatches.length - 1) {
                  countryMatchList.children[0].setAttribute("class", "card card-body parent");
                  countryMatchList.children[i].setAttribute("class", "card card-body parent selectedCard");
               } else {
                  // default style to previous list item
                  countryMatchList.children[i + 1].setAttribute("class", "card card-body parent");
                  // item that is bin selected
                  countryMatchList.children[i].setAttribute("class", "card card-body parent selectedCard");
               }
            }
         }
         e.preventDefault();
      }

      // BACKSPACE KEY
      if (e.keyCode === 8) {
         // reset
         this.childIndex = 0;
      }
   }

   // Selecting country from suggestion list
   selectCountry = (e) => {
      // h5 element
      if (e.target.classList.contains("child")) {
         this.countryInput = e.target.innerText;
      }
      // parent div of h5 element
      if (e.target.classList.contains("parent")) {
         this.countryInput = e.target.firstElementChild.innerText;
      }

      if (this.countryInput === undefined) {
         countryInput.value = '';
         countryInput.setAttribute("class", "form-control is-invalid");
      } else {
         // set the country value by clicking on a dropdown list of countries
         countryInput.value = this.countryInput;
         // add a completion style to input when selection is done
         countryInput.setAttribute("class", "form-control is-valid");
         // show state input
         stateForm.style.display = "block";
         // hide modal info if there
         modalInfo.style.display = "none";

         // set focus to state input field
         stateInput.focus();
         // reset the search list array
         this.countryMatches = [];
         // clear search list output
         this.outputHtmlCountry(this.countryMatches);

         // ////////////   STATE    //////////////
         // Serbia states are not complete in api
         if (this.countryInput === "Serbia") {
            this.getSerbiaStates();
         } else {
            // get states of selected country
            this.getStates();
         }
      }
      e.preventDefault();
   }

   // Show results in HTML COUNTRY
   outputHtmlCountry = matches => {
      if (matches.length > 0) {
         const html = matches.map(match => `
         <div class="card card-body parent">
         <h5 class="child">${match.country}</h5>
         </div>
         `).join('');
         countryMatchList.innerHTML = html;
      } else {
         countryMatchList.innerHTML = '';
      }
   }

   // Clicking on input will reset to input mode
   clickInputCountry = e => {
      if (e.target.classList.contains("is-valid") && e.target.id === "countryInput" || e.target.classList.contains("is-invalid") && e.target.id === "countryInput") {
         stateForm.style.display = "none";
         cityForm.style.display = "none";
         // hide modal info if there
         modalInfo.style.display = "none";
         countryInput.setAttribute("class", "form-control");
         stateInput.setAttribute("class", "form-control");
         cityInput.setAttribute("class", "form-control");
         cityMatchList.innerHTML = '';
         stateMatchList.innerHTML = '';
         countryMatchList.innerHTML = '';
         countryInput.value = '';
         stateInput.value = '';
         cityInput.value = '';
         this.cityInput = undefined;
         this.stateInput = undefined;
         this.countryInput = undefined;
         this.searchInputText = undefined;
      }
   }


   // //////////////////////////////////////     STATE      ///////////////////////////////////////////
   // get states from server api
   getStates = async () => {
      const res = await fetch(`https://api.airvisual.com/v2/states?country=${this.countryInput}&key=${this.apiKey}`);
      this.states = await res.json()
   };
   // get serbia states
   getSerbiaStates = async () => {
      const res = await fetch('https://alexkozelj.github.io/AirPollutionApp/serbia_states.json');
      this.states = await res.json();
   };
   // search states through input text
   searchState = searchText => {
      // set the text in input field
      this.searchInputText = searchText;
      // Get matches to current text input
      this.stateMatches = this.states.data.filter(state => {
         // console.log(state);
         // match more than 1 letter
         if (searchText.length > 1) {
            const regex = new RegExp(`${searchText}`, 'gi');
            return state.state.match(regex);
         }
      });
      // Clear when input or matches are empty
      if (searchText.length === 0) {
         this.stateMatches = [];
         stateMatchList.innerHTML = '';
      }
      this.outputHtmlStates(this.stateMatches);
   }



   keyboardSelectState = (e) => {

      // ENTER KEY
      if (e.keyCode === 13) {
         // remove cursor when enter key is pressed
         stateInput.blur();
         // assign global var to a input var
         this.searchInputText = stateInput.value;
         // if there are no matches on the list, the input value is always false
         if (this.stateMatches.length === 0) {
            stateInput.setAttribute("class", "form-control is-invalid");
         } else {
            // if there is a match, assign to true
            let match = false;
            // go through a list to find a match with input field
            this.stateMatches.forEach((state) => {
               // if there is a match
               if (this.searchInputText.toLowerCase() === state.state.toLowerCase()) {
                  // match is found
                  match = true;
                  // set the value by clicking on a dropdown list 
                  this.stateInput = state.state;

                  // add a completion style to input when selection is done
                  stateInput.setAttribute("class", "form-control is-valid");
                  // reset a index for a next search
                  this.childIndex = 0;
                  // show city input field
                  cityForm.style.display = "block";
                  // hide modal info if there
                  modalInfo.style.display = "none";

                  // reset the search list array
                  this.stateMatches = [];
                  // clear search list output
                  this.outputHtmlStates(this.stateMatches);

                  // set focus to next input field
                  cityInput.focus();

                  // GET CITIES for a selected state
                  // Serbia states are not complete in api
                  if (this.stateInput === "Kosovo") {
                     this.getKosovoCities();
                  } else {
                     // get cities of selected country
                     this.getCities();
                  }
               }
               // no match
               if (match === false) {
                  stateInput.setAttribute("class", "form-control is-invalid");
                  stateMatchList.innerHTML = '';
               }
            })
         }
         e.preventDefault();
      }

      // DOWN ARROW KEY
      if (e.keyCode === 40) {
         // end of a list
         if (this.childIndex === stateMatchList.children.length - 1) {
            // stay at the last li
            this.childIndex = this.stateMatches.length - 1;
         } else {
            // need a loop while up arrow key changes child index
            for (let i = 0; i < this.stateMatches.length; i++) {
               // match the input name and list item to add style
               if (stateInput.value.toLowerCase() === this.stateMatches[i].state.toLowerCase()) {
                  this.childIndex = i + 1;
               }
            }
         }
         // assign input text to the countries from match list
         stateInput.value = stateMatchList.children[this.childIndex].children[0].innerText;
         // add style to list item 
         for (let i = 0; i < this.stateMatches.length; i++) {
            // match the input name and list item to add style
            if (this.stateMatches[i].state.toLowerCase() === stateInput.value.toLowerCase()) {
               // in case when it's not the first list item
               if (i !== 0) {
                  // default style to previous list item
                  stateMatchList.children[i - 1].setAttribute("class", "card card-body parent");
                  // item that is bin selected
                  stateMatchList.children[i].setAttribute("class", "card card-body parent selectedCard");
               } else {
                  // if its the first list item, set default style to the last element and add style to fist
                  stateMatchList.children[this.stateMatches.length - 1].setAttribute("class", "card card-body parent");
                  stateMatchList.children[i].setAttribute("class", "card card-body parent selectedCard");
               }
            }
         }
         e.preventDefault();
      }

      // UP ARROW KEY
      if (e.keyCode === 38) {
         // stays at the first element
         if (this.childIndex === 0) {
            // first list item
            this.childIndex = 0;
         } else {
            // going back
            this.childIndex -= 1;
         }
         // assign input text to the countries from match list
         stateInput.value = stateMatchList.children[this.childIndex].children[0].innerText;
         // add style to list item 
         for (let i = 0; i < this.stateMatches.length; i++) {
            // match the input name and list item to add style
            if (this.stateMatches[i].state.toLowerCase() === stateInput.value.toLowerCase()) {
               // in case when it's not the first list item
               if (i === this.stateMatches.length - 1) {
                  stateMatchList.children[0].setAttribute("class", "card card-body parent");
                  stateMatchList.children[i].setAttribute("class", "card card-body parent selectedCard");
               } else {
                  // default style to previous list item
                  stateMatchList.children[i + 1].setAttribute("class", "card card-body parent");
                  // item that is bin selected
                  stateMatchList.children[i].setAttribute("class", "card card-body parent selectedCard");
               }
            }
         }
         e.preventDefault();
      }

      // BACKSPACE KEY
      if (e.keyCode === 8) {
         // reset
         this.childIndex = 0;
      }
   }

   // select state by click
   selectState = (e) => {
      // h5 element
      if (e.target.classList.contains("child")) {
         this.stateInput = e.target.innerHTML;
      }
      // parent div of h5 element
      if (e.target.classList.contains("parent")) {
         this.stateInput = e.target.firstElementChild.innerText;
      }
      // search is set to match the state from the list
      if (this.stateInput === undefined) {
         stateInput.value = '';
         stateInput.setAttribute("class", "form-control is-invalid");
      } else {

         stateInput.value = this.stateInput;
         // countries from the list are always valid
         stateInput.setAttribute("class", "form-control is-valid");
         // show city input
         cityForm.style.display = "block";
         // set focus to next input field
         cityInput.focus();
         // state is selected, no need of displaying a list
         this.stateMatches = [];
         // clear search list output
         this.outputHtmlStates(this.stateMatches);

         //  CITIES  //
         if (this.stateInput === "Kosovo") {
            this.getKosovoCities();
         } else {
            // get states of selected country
            this.getCities();
         }
      }
      e.preventDefault();
   }

   // Show results in HTML STATE
   outputHtmlStates = matches => {
      if (matches.length > 0) {
         const html = matches.map(match => `
         <div class="card card-body parent">
         <h5 class="child">${match.state}</h5>
         </div>
         `).join('');
         stateMatchList.innerHTML = html;
      } else {
         // if no input, clear search list
         stateMatchList.innerHTML = '';
      }
   }

   // when input field is clicked
   clickInputState = e => {
      if (e.target.classList.contains("is-valid") && e.target.id === "stateInput" || e.target.classList.contains("is-invalid") && e.target.id === "stateInput") {
         stateInput.setAttribute("class", "form-control");
         cityInput.setAttribute("class", "form-control");
         cityForm.style.display = "none";
         // hide modal info if there
         modalInfo.style.display = "none";
         cityMatchList.innerHTML = '';
         stateMatchList.innerHTML = '';
         stateInput.value = '';
         cityInput.value = '';
         this.cityInput = undefined;
         this.stateInput = undefined;
         this.searchInputText = undefined;
      }
   }

   // ////////////////////         CITIES         //////////////////////////////
   getCities = async () => {
      const res = await fetch(`https://api.airvisual.com/v2/cities?state=${this.stateInput}&country=${this.countryInput}&key=${this.apiKey}`);
      this.cities = await res.json()
   };

   getKosovoCities = async () => {
      const res = await fetch(`https://alexkozelj.github.io/AirPollutionApp/serbia_cities.json`);
      this.cities = await res.json()
   };

   searchCity = searchText => {
      // set the text in input field
      this.searchInputText = searchText;
      // Get matches to current text input
      this.cityMatches = this.cities.data.filter(city => {
         if (searchText.length > 1) {
            const regex = new RegExp(`${searchText}`, 'gi');
            return city.city.match(regex);
         }
      });
      // Clear when input or matches are empty
      if (searchText.length === 0) {
         this.cityMatches = [];
         cityMatchList.innerHTML = '';
      }
      this.outputHtmlCities(this.cityMatches);
   }


   keyboardSelectCity = (e) => {

      // ENTER KEY
      if (e.keyCode === 13) {
         // if (this.cityInput !== undefined) {}
         // remove cursor when enter key is pressed
         cityInput.blur();
         // assign global var to input value
         this.searchInputText = cityInput.value;
         // if there are no matches on the list, the input value is always false
         if (this.cityMatches.length === 0) {
            cityInput.setAttribute("class", "form-control is-invalid");
         } else {
            // if there is a match, assign to true
            let match = false;
            // go through a list to find a match with input field
            this.cityMatches.forEach((city) => {
               // if there is a match
               if (this.searchInputText.toLowerCase() === city.city.toLowerCase()) {
                  // match is found
                  match = true;
                  // set the value by clicking on a dropdown list
                  this.cityInput = city.city;

                  // hide modal info if there
                  modalInfo.style.display = "none";

                  // add a completion style to input when selection is done
                  cityInput.setAttribute("class", "form-control is-valid");
                  // reset a index for a next search
                  this.childIndex = 0;

                  // reset the search list array
                  this.cityMatches = [];
                  // clear search list output
                  this.outputHtmlCities(this.cityMatches);
               }
               if (match === false) {
                  cityInput.setAttribute("class", "form-control is-invalid");
                  cityMatchList.innerHTML = '';
               }
            })
         }
         e.preventDefault();
      }

      // DOWN ARROW KEY
      if (e.keyCode === 40) {
         // end of a list
         if (this.childIndex === cityMatchList.children.length - 1) {
            // stay at the last li
            this.childIndex = this.cityMatches.length - 1;
         } else {
            // need a loop while up arrow key changes child index
            for (let i = 0; i < this.cityMatches.length; i++) {
               // match the input name and list item to add style
               if (cityInput.value.toLowerCase() === this.cityMatches[i].city.toLowerCase()) {
                  this.childIndex = i + 1;
               }
            }
         }
         // assign input text from match list
         cityInput.value = cityMatchList.children[this.childIndex].children[0].innerText;
         // add style to list item 
         for (let i = 0; i < this.cityMatches.length; i++) {
            // match the input name and list item to add style
            if (this.cityMatches[i].city.toLowerCase() === cityInput.value.toLowerCase()) {
               // in case when it's not the first list item
               if (i !== 0) {
                  // default style to previous list item
                  cityMatchList.children[i - 1].setAttribute("class", "card card-body parent");
                  // item that is bin selected
                  cityMatchList.children[i].setAttribute("class", "card card-body parent selectedCard");

               } else {
                  // if its the first list item, set default style to the last element and add style to fist
                  cityMatchList.children[this.cityMatches.length - 1].setAttribute("class", "card card-body parent");
                  cityMatchList.children[i].setAttribute("class", "card card-body parent selectedCard");
               }
            }
         }
         e.preventDefault();
      }

      // UP ARROW KEY
      if (e.keyCode === 38) {
         // stays at the first element
         if (this.childIndex === 0) {
            // first list item
            this.childIndex = 0;
         } else {
            // going back
            this.childIndex -= 1;
         }
         // assign input text to the countries from match list
         cityInput.value = cityMatchList.children[this.childIndex].children[0].innerText;
         // add style to list item 
         for (let i = 0; i < this.cityMatches.length; i++) {
            // match the input name and list item to add style
            if (this.cityMatches[i].city.toLowerCase() === cityInput.value.toLowerCase()) {
               // in case when it's not the first list item
               if (i === this.cityMatches.length - 1) {
                  cityMatchList.children[0].setAttribute("class", "card card-body parent");
                  cityMatchList.children[i].setAttribute("class", "card card-body parent selectedCard");
               } else {
                  // default style to previous list item
                  cityMatchList.children[i + 1].setAttribute("class", "card card-body parent");
                  // item that is bin selected
                  cityMatchList.children[i].setAttribute("class", "card card-body parent selectedCard");
               }
            }
         }
         e.preventDefault();
      }

      // BACKSPACE KEY
      if (e.keyCode === 8) {
         // reset
         this.childIndex = 0;
      }
   }


   selectCity = (e) => {
      // h5 element
      if (e.target.classList.contains("child")) {
         this.cityInput = e.target.innerHTML;
      }
      // parent div of h5 element
      if (e.target.classList.contains("parent")) {
         this.cityInput = e.target.firstElementChild.innerText;
      }
      if (this.cityInput === undefined) {
         cityInput.value = '';
         cityInput.setAttribute("class", "form-control is-invalid");
      } else {
         // assign cities from search list
         cityInput.value = this.cityInput;
         // set valid style to input
         cityInput.setAttribute("class", "form-control is-valid");
         // city is selected, no need of displaying a list
         this.cityMatches = [];
         // clear the matching list
         this.outputHtmlCities(this.cityMatches);
      }
   }


   // Show results in HTML CITY
   outputHtmlCities = matches => {
      if (matches.length > 0) {
         const html = matches.map(match => `
         <div class="card card-body parent">
         <h5 class="child">${match.city}</h5>
         </div>
         `).join('');
         cityMatchList.innerHTML = html;
      } else {
         cityMatchList.innerHTML = '';
      }
   }


   clickInputCity = e => {
      if (e.target.classList.contains("is-valid") && e.target.id === "cityInput" || e.target.classList.contains("is-invalid") && e.target.id === "cityInput") {
         cityInput.setAttribute("class", "form-control");
         // hide modal info if there
         modalInfo.style.display = "none";
         cityMatchList.innerHTML = '';
         cityInput.value = '';
         this.cityInput = undefined;
         this.searchInputText = undefined;
      }
   }
}
