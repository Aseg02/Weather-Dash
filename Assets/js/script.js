var key = 'e7f98c5b4098b856e784c51e9a1f7fca';
var city = "Austin"

//Current time and date
var date = moment().format('dddd, MMMM Do YYYY');
var dateTime = moment().format('YYYY-MM-DD HH:MM:SS')
var cityHist = [];

//Saves the text value of the search, saves it to storage
$('.search').on("click", function (event) {
	event.preventDefault();
	city = $(this).parent('.buttonPar').siblings('.textVal').val().trim();
	if (city === "") {
		return;
	};
	cityHist.push(city);
	localStorage.setItem('city', JSON.stringify(cityHist));
	fiveForecastEl.empty();
	getHistory();
	getWeatherToday();
});

//Create buttons based on search
var contHistEl = $('.cityHist');
function getHistory() {
	contHistEl.empty();

	for (let i = 0; i < cityHist.length; i++) {
		var rowEl = $('<row>');
		var buttonEl = $('<button>').text(`${cityHist[i]}`)
		rowEl.addClass('row ListButtonRow');
		buttonEl.addClass('button button-outline-secondary listButton');
		buttonEl.attr('type', 'button');
		contHistEl.prepend(rowEl);
		rowEl.append(buttonEl);
	} if (!city) {
		return;
	}

	//Allows buttons to start search 
	$('.listButton').on("click", function (event) {
		event.preventDefault();
		city = $(this).text();
		fiveForecastEl.empty();
		getWeatherToday();
	});
};

//Grabs 'today' card body.
var cardTodayBody = $('.cardBodyToday')


//Applies weather data to today card, launches five day forecast
// API KEY GOES HERE
function getWeatherToday() {
	var city = $('.textVal').val ();
	//var city = 'Austin';
	var getUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;

	$(cardTodayBody).empty();
	$.ajax({
		url: getUrlCurrent,
		method: 'GET',
	}).then(function (response) {
		$('.cardTodayCityName').text(response.name);
		$('.cardTodayDate').text(date);

		//icons
		$('.icons').attr('src', `https://api.openweathermap.org/img/wn/${response.weather[0].icon}@3x.png`);

		// temp
		var pEl = $('<p>').text(`Temperature: ${response.main.temp} °F`);
		cardTodayBody.append(pEl);

		//humidity
		var pElHumid = $('<p>').text(`Humidity: ${response.main.humidity} %`);
		cardTodayBody.append(pElHumid);

		//wind speed
		var pElWind = $('<p>').text(`Wind Speed: ${response.wind.speed} MPH`);
		cardTodayBody.append(pElWind);

		//Set lat & long from searched city
		var cityLon = response.coord.lon;

		// console.log(cityLon);
		var cityLat = response.coord.lat;

		// console.log(cityLat);
		var getUrlUvi = 'https://open-weather13.p.rapidapi.com/city/landon/data/onecall?lat=${citylat}&lon=${citylon}&appid={key};'
		 
		$.ajax({
			url: getUrlUvi,
			method: 'GET',
		}).then(function (response) {
			var pElUvi = $('<p>').text(`UV Index: `);
			var uviSpan = $('<span>').text(response.current.uvi);
			var uvi = response.current.uvi;
			pElUvi.append(uviSpan);
			cardTodayBody.append(pElUvi);

			//sets UV index to match exposure
			if (uvi >= 0 && uvi <= 2) {
				uviSpan.attr('class', 'green');
			} else if (uvi > 2 && uvi <= 5) {
				uviSpan.attr("class", "yellow")
			} else if (uvi > 5 && uvi <= 7) {
				uviSpan.attr("class", "orange")
			} else if (uvi > 7 && uvi <= 10) {
				uviSpan.attr("class", "red")
			} else {
				uviSpan.attr("class", "purple")
			}
		});
	});
	getFiveDayForecast();
};

var fiveForecastEl = $('.fiveForecast');

function getFiveDayForecast() {
	var getUrlFiveDay = `https://open-weather13.p.rapidapi.com/city/landon/data/forecast?q=${city}&units=imperial&appid=${key}`;

	$.ajax({
		url: getUrlFiveDay,
		method: 'GET',
	}).then(function (response) {
		var fiveDayArray = response.list;
		var myWeather = [];

		//Created an object, allow for easier data read
		$.each(fiveDayArray, function (index, value) {
			testObj = {
				date: value.dt_txt.split(' ')[0],
				time: value.dt_txt.split(' ')[1],
				temp: value.main.temp,
				feels_like: value.main.feels_like,
				icon: value.weather[0].icon,
				humidity: value.main.humidity
			}
			if (value.dt_txt.split(' ')[1] === "12:00:00") {
				myWeather.push(testObj);
			}
		})

		//Inject cards to screen 
		for (let i = 0; i < myWeather.length; i++) {

				//divElCard
			var divElCard = $('<div>');
			divElCard.attr('class', 'card text-white bg-primary mb-3 cardOne');
			divElCard.attr('style', 'max-width: 200px;');
			fiveForecastEl.append(divElCard);

				//divElHeader
			var divElHeader = $('<div>');
			divElHeader.attr('class', 'card-header')
			var m = moment(`${myWeather[i].date}`).format('MM-DD-YYYY');
			divElHeader.text(m);
			divElCard.append(divElHeader)

				//divElBody
			var divElBody = $('<div>');
			divElBody.attr('class', 'card-body');
			divElCard.append(divElBody);

				//divElIcon
			var divElIcon = $('<img>');
			divElIcon.attr('class', 'icons');
			divElIcon.attr('src', `https://open-weather13.p.rapidapi.com/city/landon/img/wn/${myWeather[i].icon}@2x.png`);
			divElBody.append(divElIcon);

			//Temp
			var pElTemp = $('<p>').text(`Temperature: ${myWeather[i].temp} °F`);
			divElBody.append(pElTemp);
			//Humidity
			var pElHumid = $('<p>').text(`Humidity: ${myWeather[i].humidity} %`);
			divElBody.append(pElHumid);
		}
	});
};

//Allows data to load for Austin
function initLoad() {
	var cityHistStore = JSON.parse(localStorage.getItem('city'));
	if (cityHistStore !== null) {
		cityHist = cityHistStore
	}
	getHistory();
	getWeatherToday();
};

initLoad();
