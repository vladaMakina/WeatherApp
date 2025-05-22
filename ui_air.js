class UI {
   constructor() {
      this.location = document.getElementById('w-location');
      this.pollution = document.getElementById('w-aqi');
      this.pollutionNumber;
      this.pollutionSign = document.getElementById('pollution-sign');
      this.desc = document.getElementById('w-temp');
      this.details = document.getElementById('w-details');
      this.icon = document.getElementById('w-icon');
      this.humidity = document.getElementById('w-humidity');
      this.timestamp = document.getElementById('w-timestamp');
      this.feelsLike = document.getElementById('w-wind-direction');
      this.dewpoint = document.getElementById('w-pressure');
      this.wind = document.getElementById('w-wind-speed');
   }

   // fill UI with data
   paint(weather, storage) {
      if(weather.data.city === "Mitrovice" && weather.data.country === "Kosovo") {
         this.location.textContent = "Kosovska Mitrovica, Serbia"
      } 
      else if (weather.data.city === undefined || weather.data.country === undefined){
         this.location.textContent = storage.this.defaultCity + ", " + storage.this.defaultCountry;
      }
      else {
         this.location.textContent = weather.data.city + ", " + weather.data.country;
      }

      this.pollution.textContent = "US AirQualityIndex: " + weather.data.current.pollution.aqius;
      this.pollutionNumber = weather.data.current.pollution.aqius;
      let aqi = weather.data.current.pollution.aqius;

      // depending of pollution index, button will get certain class
      // Good
      if(aqi < 51) {
         this.pollutionSign.setAttribute("class", "col-md-5 mx-auto text-center mb-4 mt-4 good");
         this.pollutionSign.innerHTML = "Good";
         // description text
         const header = "0 - 50 = Good";
         const content = "Air quality is satisfactory and poses little or no health risk. Ventilating your home is recommended.";
         const recommendation = "Recommendations: Enjoy your usual outdoor activities. We recommend opening your windows and ventilating your home to bring in fresh, oxygen-rich air.";
         document.getElementById("description-1").innerHTML = header;
         document.getElementById("description-2").innerHTML = content;
         document.getElementById("description-3").innerHTML = recommendation;
      }

      // Moderate
      else if (aqi > 51 && aqi < 100) {  
         this.pollutionSign.setAttribute("class", "col-md-5 mx-auto text-center mb-4 mt-4 moderate");
         this.pollutionSign.innerHTML = "Moderate";
         // description text
         const header = "51 - 100 = Moderate";
         const content = "Air quality is acceptable and poses little health risk. Sensitive individuals should avoid outdoor activity as they may experience respiratory symptoms.";
         const recommendation = "Recommendations: Sensitive groups should greatly reduce outdoor exercise. Ventilation is discouraged, and windows should be closed to avoid dirty outdoor air.";

         document.getElementById("description-1").innerHTML = header;
         document.getElementById("description-2").innerHTML = content;
         document.getElementById("description-3").innerHTML = recommendation;
      }

      // Unhealthy*
      else if (aqi > 101 && aqi < 150) {
         this.pollutionSign.setAttribute("class", "col-md-5 mx-auto text-center mb-4 mt-4 unhealthy-1");
         this.pollutionSign.innerHTML = "Unhealthy";
         // description text
         const header = "101 - 150 = Unhealthy for Sensitive Groups";
         const content = "General public and sensitive individuals in particular are at risk to experience irritation and respiratory problems.";
         const recommendation = "Recommendations: The general public should greatly reduce outdoor exertion. Sensitive groups should avoid all outdoor activity and should take care to wear a pollution mask outdoors. Ventilation is discouraged. Air purifiers should be turned on if indoor air quality is unhealthy.";

         document.getElementById("description-1").innerHTML = header;
         document.getElementById("description-2").innerHTML = content;
         document.getElementById("description-3").innerHTML = recommendation;
      }

      // Unhealthy**
      else if (aqi > 151 && aqi < 200) {
         this.pollutionSign.setAttribute("class", "col-md-5 mx-auto text-center mb-4 mt-4 unhealthy-2");
         this.pollutionSign.innerHTML = "Unhealthy**";
         // description text
         const header = "151 - 200 = Unhealthy";
         const content = "Increased likelihood of adverse effects and aggravation to the heart and lungs among general public - particularly for sensitive groups.";
         const recommendation = "Recommendations: Everyone should avoid outdoor exercise and take care to wear a pollution mask outdoors. Ventilation is discouraged. Air purifiers should be turned on.";

         document.getElementById("description-1").innerHTML = header;
         document.getElementById("description-2").innerHTML = content;
         document.getElementById("description-3").innerHTML = recommendation;
      }

      // Very unhealthy
      else if (aqi > 201 && aqi < 300) {
         this.pollutionSign.setAttribute("class", "col-md-5 mx-auto text-center mb-4 mt-4 very-unhealthy");
         this.pollutionSign.innerHTML = "Very Unhealthy";
         // description text
         const header = "201 - 300 = Very Unhealthy";
         const content = "General public will be noticeably affected. Sensitive groups will experience reduced endurance in activities. These individuals should remain indoors and restrict activities.";
         const recommendation = "Recommendations: Everyone should avoid outdoor exercise and take care to wear a pollution mask outdoors. Ventilation is discouraged. Air purifiers should be turned on.";

         document.getElementById("description-1").innerHTML = header;
         document.getElementById("description-2").innerHTML = content;
         document.getElementById("description-3").innerHTML = recommendation;
      }

      // Hazardous
      else if (aqi > 201 && aqi < 500) {
         this.pollutionSign.setAttribute("class", "col-md-5 mx-auto text-center mb-4 mt-4 hazardous");
         this.pollutionSign.innerHTML = "Hazardous";
         // description text
         const header = "201 - 300 = Hazardous";
         const content = " General public and sensitive groups are at high risk to experience strong irritations and adverse health effects that could trigger other illnesses. Everyone should avoid exercise and remain indoors.";
         const recommendation = "Recommendations: Everyone should avoid outdoor exercise and take care to wear a pollution mask outdoors. Ventilation is discouraged. Air purifiers should be turned on.**Sensitive groups include children, elderly and pregnant people or those suffering from cardiac or pulmonary diseases.";

         document.getElementById("description-1").innerHTML = header;
         document.getElementById("description-2").innerHTML = content;
         document.getElementById("description-3").innerHTML = recommendation;
      }
      else {
         alert("Something's wrong, please try latter")
      }

      this.desc.textContent = weather.data.current.weather.tp + " C°";
      // if there is a fog, change the N character to D to get the icon from server
      this.icon.setAttribute('src', "https://airvisual.com/images/" + weather.data.current.weather.ic + ".png");
      if(weather.data.current.weather.ic === "50n") {
         this.icon.setAttribute('src', "https://airvisual.com/images/50d.png");
      } 
      if (weather.data.current.weather.ic === "04n") {
         this.icon.setAttribute('src', "https://airvisual.com/images/04d.png");
      }
      if (weather.data.current.weather.ic === "13n") {
         this.icon.setAttribute('src', "https://airvisual.com/images/13d.png");
      }

      // import moment from 'C:\Users\aleks\Documents\AirPollutionApp\node_modules\moment';
      // const formatTimestamp = moment(`"${weather.data.current.pollution.ts}", "YYYYMMDD"`).fromNow();
      // var moment = require('moment'); // require
      const formatTimestamp = weather.data.current.pollution.ts.slice(0, -5).replace('T', ' ');
      this.humidity.textContent = `Relative Humidity: ${weather.data.current.weather.hu}%`;
      this.timestamp.textContent = "Pollution Timestamp: " + formatTimestamp;
      this.dewpoint.textContent = `Pressure: ${weather.data.current.weather.pr}mb`;
      this.feelsLike.textContent = `Wind Direction: ${this.degToCompass(weather.data.current.weather.wd)}`;
      this.wind.textContent = "Wind Speed: " + weather.data.current.weather.ws + "km/h";
   }

   // Wind direction from degrees(API) to Compass cardinal direction
   degToCompass(num) {
      var val = Math.floor((num / 22.5) + 0.5);
      var arr = ["North", "North-NorthEast", "North-East", "East-NorthEast", "East", "East-SouthEast", "South-East", "South-SouthEast", "South", "South-SouthWest", "South-West", "West-SouthWest", "West", "West-NorthWest", "North-West", "North-NorthWest"];
      return arr[(val % 16)];
   }
}