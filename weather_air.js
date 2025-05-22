class Weather {
   constructor(city, state, country) {
      this.apiKey = '71109e2e-056e-4ee5-8a02-b5a647658447';
      // bc0a9898-a47e-468d-b220-6d1f68798f2c
      this.city = city;
      this.state = state;
      this.country = country;

   }

   // Fetch weather from API
   async getWeather() {
      // Kosovo is Serbian state, correction
      if (this.city === "Kosovska Mitrovica" && this.state === "Kosovo" && this.country === "Serbia") {
         const response = await fetch(`https://api.airvisual.com/v2/city?city=mitrovice&state=mitrovica&country=kosovo&key=${this.apiKey}`);
         const responseData = await response.json();
         return responseData;
      } else {
         const response = await fetch(`https://api.airvisual.com/v2/city?city=${this.city}&state=${this.state}&country=${this.country}&key=${this.apiKey}`);
         const responseData = await response.json();
         return responseData;
      }
   }

   // change location collected from modal
   changeLocation(city, state, country) {
      this.city = city;
      this.state = state;
      this.country = country;
   }

}