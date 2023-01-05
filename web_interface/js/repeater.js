/* This software is licensed under the MIT License: https://github.com/spacehuhntech/esp8266_deauther */

var nameJson = [];
var repeaterJson = { aps: [] };

function drawScan() {
	var html;
	var selected;
	var width;
	var color;
	var macVendor;

	// Access Points
	getE("apNum").innerHTML = repeaterJson.aps.length;
	html = "<tr>"
		+ "<th class='id'></th>"
		+ "<th class='ssid'>SSID</th>"
		+ "<th class='name'>Name</th>"
		+ "<th class='ch'>Ch</th>"
		+ "<th class='rssi'>RSSI</th>"
		+ "<th class='enc'>Enc</th>"
		+ "<th class='lock'></th>"
		+ "<th class='mac'>MAC</th>"
		+ "<th class='vendor'>Vendor</th>"
		+ "<th class='remove'></th>"
		+ "</tr>";

	for (var i = 0; i < repeaterJson.aps.length; i++) {
		selected = repeaterJson.aps[i][repeaterJson.aps[i].length - 1];
		width = parseInt(repeaterJson.aps[i][3]) + 130;

		if (width < 50) color = "meter_red";
		else if (width < 70) color = "meter_orange";
		else color = "meter_green";

		html += (selected ? "<tr class='selected'>" : "<tr>")
			+ "<td class='id'>" + i + "</td>" // ID
			+ "<td class='ssid'>" + esc(repeaterJson.aps[i][0]) + "</td>" // SSID
			+ "<td class='ch'>" + esc(repeaterJson.aps[i][2]) + "</td>" // Ch
			// RSSI
			+ "<td class='rssi'><div class='meter_background'> <div class='meter_forground " + color + "' style='width: " + width + "%;'><div class='meter_value'>" + repeaterJson.aps[i][3] + "</div></div> </div></td>"
			+ "<td class='enc'>" + esc(repeaterJson.aps[i][4]) + "</td>" // ENC
			+ "<td class='lock'>" + (repeaterJson.aps[i][4] == "-" ? "" : "&#x1f512;") + "</td>" // Lock Emoji
			+ "<td class='mac'>" + esc(repeaterJson.aps[i][5]) + "</td>" // MAC
			+ "<td class='vendor'>" + esc(repeaterJson.aps[i][6]) + "</td>" // Vendor
			// Connect
			+ "<td class='remove'><button class='red' onclick='connect(0," + i + ")'>Connect</button></td>" // Remove
			+ "</tr>";
	}

	getE("apTable").innerHTML = html;
}


var duts;
var elxtime;
function scan(type) {
	getE('RButton').disabled = true;
	switch (type) {
		case 0:
			getE('scanOne').disabled = true;
			getE('scanZero').style.visibility = 'hidden';
			elxtime = 2450;
			break;
		case 1:
			getE('scanZero').disabled = true;
			getE('scanOne').style.visibility = 'hidden';
			elxtime = parseInt(getE("scanTime").value + "000") + 1500;
	}
	var cmdStr = "scan "
		+ (type == 0 ? "aps " : "stations -t " + getE("scanTime").value + "s")
		+ " -ch " + getE("ch").options[getE("ch").selectedIndex].value;
	getFile("run?cmd=" + cmdStr);
	duts = parseInt(type);
	setTimeout(buttonFunc, elxtime);
	setTimeout(load, elxtime);
}

function buttonFunc() {
	switch (duts) {
		case 0:
			getE('scanZero').style.visibility = 'visible';
			getE('scanOne').disabled = false;
			break;
		case 1:
			getE('scanOne').style.visibility = 'visible';
			getE('scanZero').disabled = false;
	}
	getE('RButton').disabled = false;
}

function load() {
	// APs and Stations
	getFile("run?cmd=save scan", function () {
		getFile("scan.json", function (res) {
			repeaterJson = JSON.parse(res);
			showMessage("connected");
			drawScan();
		});
	});
}

function connect(type, id) {
	switch (type) {
		case 0:
			scanJson.aps.splice(id, 1);
			drawScan();
			getFile("run?cmd=remove ap " + id);
			break;
		case 1:
			scanJson.stations.splice(id, 1);
			drawScan();
			getFile("run?cmd=remove station " + id);
			break;
		case 2:
			nameJson.splice(id, 1);
			drawNames();
			getFile("run?cmd=remove name " + id);
	}
}