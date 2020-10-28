const showContainer = () => {
	const fetchPromise = fetch(
		"https://api.thevirustracker.com/free-api?countryTimeline=NZ",
		{
		  headers: {
			Accept: "application/json",
		  },
		}
	  );
	  const streamPromise = fetchPromise.then((response) => response.json());
	
	  streamPromise.then((data) => printContent(data));
}

const printContent = (JSONdata) => {
	let total_cases = []
	let total_case_per_day = []
	let total_deaths = []
	let total_recoveries = []
	let dates = []
	let string = "";
	let count = 0;
	JSONdata.countrytimelinedata.forEach(element => {
		string += '<h1><img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Coronavirus_cartoon.svg">Covid 19 cases for ' + element.info.title + '<img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Coronavirus_cartoon.svg"></h1>'
		string += '<p>Sourced from <a href="' + element.info.source + '" target="_blank">' + element.info.source + '</p>'
	})
	document.getElementById("header").innerHTML += string
	let string2 = "";
	string2 += '<table class="center"><tr><th>Date</th><th>Daily New Cases</th><th>Daily New Deaths</th><th>Total Cases</th><th>Total Recoveries</th><th>Total Deaths</th></tr>'
	let string3 = ""
	JSONdata.timelineitems.forEach(element => {
		
		let even = false
		for (let date in element) {
			let tempString = ""
			if (date != "stat") {
				let temp = element[date]
				tempString += '<tr class="' + (even == true ? "even" : "odd") + '">'
				tempString += '<td>' + date + '</td>'
				dates[count] = date
				tempString += '<td>' + temp.new_daily_cases + '</td>'
				tempString += '<td>' + temp.new_daily_deaths + '</td>'
				tempString += '<td>' + temp.total_cases + '</td>'
				total_cases[count] = temp.total_cases
				tempString += '<td>' + temp.total_recoveries + '</td>'
				total_recoveries[count] = temp.total_recoveries
				total_case_per_day[count] = temp.new_daily_cases
				tempString += '<td>' + temp.total_deaths + '</td>'
				total_deaths[count] = temp.total_deaths
				tempString += '</tr>'
				count++
			}
			even = !even
			string3 = tempString + string3
		}
	})
	string2 += string3
	string2 += '</table>'
	document.getElementById("container").innerHTML += string2

	displaySVG(count, total_cases, total_case_per_day, dates, total_deaths, total_recoveries)
}

const displaySVG = (count, cases, case_per_day, dates, deaths, recoveries) => {
	let string1 = ""
	let string2 = ""
	let string3 = ""
	string1 += '<div class="picture"><h2 class="underline">Total Cases</h2><svg id="svg1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg></div>'
	string2 += '<div class="picture"><h2 class="underline">Cases Per Day</h2><svg id="svg2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg></div>'
	string3 += '<div class="stats"><h2>Latest Statistics for ' + dates[count-1] + '</h2>' +
	'<h3>Total Cases: ' + cases[count -1] + '</h3>' +
	'<h3>Num Cases Today : ' + case_per_day[count -1] + '</h3>' +
	'<h3>Total recovered: ' + recoveries[count -1] + '</h3>' +
	'<h3>Total Deaths: ' + deaths[count -1] + '</h3>' +
	'</div>'
	
	document.getElementById("pictures").innerHTML += string1 + string3 + string2
	document.getElementById("svg1").setAttribute("viewBox", "0 0 300 300");
	document.getElementById("svg2").setAttribute("viewBox", "0 0 300 300");

	string1 = ""
	string2 = ""

	let string = '<symbol id="symbol" width="100" height="100" viewBox="0 0 200 200">' +
	'<circle cx="10" cy="10" r="2" fill="red"/>' +
	'</symbol>'
	let num = 0;
	let i
	for (i = 0; i < cases.length; i++) {
		string += '<use xlink:href="#symbol" x=\"' + (i+40) + '\"  y="' + ((260 - cases[i]/12.5) - 24) + '"/>';
		
		if (i%20 == 0) {
			let xaxis = '<text x="' + (i+40) + '" y="' + 255 + '" font-size="10" transform="rotate(90 ' + (i+40) + ' 255) translate(-10 -2)">' + dates[i] + '</text>';
			string += xaxis
			let total = cases[cases.length-1]
			let yaxis = '<text x="' + 16 + '" y="' + (245-i) + '" font-size="10">' + 250*num + '</text>';
			string += yaxis
			num++
			if (i != 0) {
				for (j = 0; j < 50; j++) {
					string += '<circle cx="' + (43 + j*5) + '" cy="' + (242-i) + '" r="0.5" fill="black"/>'
				}
			}
		}
	}
	
	string += '<line x1="40" y1="30" x2="40" y2="242" stroke="black" stroke-wdith="1"/>'
	string += '<line x1="40" y1="242" x2="293" y2="242" stroke="black" stroke-wdith="1"/>'
	string += '<text x="140" y="290" font-size="10">date</text>';
	string += '<text x="0" y="0" font-size="10" transform="rotate(270) translate(-200 10)">Total Cases</text>';

	string1 += string
	document.getElementById("svg1").innerHTML += string1

	string = '<symbol id="symbol" width="100" height="100" viewBox="0 0 200 200">' +
	'<circle cx="10" cy="10" r="2" fill="red"/>' +
	'</symbol>'
	num = 0
	for (i = 0; i < case_per_day.length; i++) {
		string += '<use xlink:href="#symbol" x=\"' + (i+40) + '\"  y="' + (260 - case_per_day[i]/1.27 - 24) + '"/>';
		if (i%20 == 0) {
			let xaxis = '<text x="' + (i+40) + '" y="' + 255 + '" font-size="10" transform="rotate(90 ' + (i+40) + ' 255) translate(-10 -2)">' + dates[i] + '</text>';
			string += xaxis
			let yaxis = '<text x="' + 20 + '" y="' + (245-i) + '" font-size="10">' + 25*num + '</text>';
			string += yaxis
			num++
			if (i != 0) {
				for (j = 0; j < 50; j++) {
					string += '<circle cx="' + (43 + j*5) + '" cy="' + (242-i) + '" r="0.5" fill="black"/>'
				}
			}
		}
	}
	
	string += '<line x1="40" y1="30" x2="40" y2="242" stroke="black" stroke-wdith="1"/>'
	string += '<line x1="40" y1="242" x2="293" y2="242" stroke="black" stroke-wdith="1"/>'
	string += '<text x="140" y="290" font-size="10">date</text>';
	string += '<text x="0" y="0" font-size="10" transform="rotate(270) translate(-200 10)">Num cases</text>';

	string2 += string
	document.getElementById("svg2").innerHTML += string2
}