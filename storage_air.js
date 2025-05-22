class Storage {
   constructor() {
      this.city;
      this.state;
      this.country;
      this.defaultCity = 'Frankfurt am Main';
      this.defaultState = 'Hessen'
      this.defaultCountry = 'Germany';
   }

   // when loading the DOM, created default city to show or when entering empty field
   getLocationData() {
      if (localStorage.getItem('city') === null || localStorage.getItem('city') === undefined) {
         this.city = this.defaultCity;
      } else {
         this.city = localStorage.getItem('city');
      }

      if (localStorage.getItem('state') === null || localStorage.getItem('state') === undefined) {
         this.state = this.defaultState;
      } else {
         this.state = localStorage.getItem('state');
      }

      if (localStorage.getItem('country') === null || localStorage.getItem('country') === undefined) {
         this.country = this.defaultCountry;
      } else {
         this.country = localStorage.getItem('country');
      }

      return {
         city: this.city,
         state: this.state,
         country: this.country
      }
   }

   setLocationData(city, state, country) {
      localStorage.setItem('city', city);
      localStorage.setItem('state', state);
      localStorage.setItem('country', country);
   }

}

