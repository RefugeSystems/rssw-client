var root = [{
	// Left
	"icon": "bankleft",
	"dir": "Bank Left"
}, {
	"icon": "sloopleft",
	"dir": "Segnor's Loop Left"
}, {
	"icon": "dalan-bankleft",
	"dir": "Dalan Left Bank"
}, {
	"icon": "turnleft",
	"dir": "Turn Left"
}, {
	"icon": "trollleft",
	"dir": "Talon Roll Left"
}, { // Straight
	"icon": "straight",
	"dir": "Forward"
}, { // Right
	"icon": "bankright",
	"dir": "Bank Right"
}, {
	"icon": "sloopright",
	"dir": "Segnor's Loop Right"
}, {
	"icon": "dalan-bankright",
	"dir": "Dalan Right Bank"
}, {
	"icon": "turnright",
	"dir": "Turn Right"
}, {
	"icon": "trollright",
	"dir": "Talon Roll Right"
}, { // Reversing
	"icon": "kturn",
	"dir": "Koiogran Turn"
}, {
	"icon": "reversebankleft",
	"dir": "Reverse Left"
}, {
	"icon": "reversestraight",
	"dir": "Reverse"
}, {
	"icon": "reversebankright",
	"dir": "Reverse Right"
}];

var stresses = ["Green", "White", "Red"];

var speeds = [1,2,3,4,5];

var costs = [1,2,3,4,5];

var output = [];

var order = 0;


// TODO: Map color CSS Style from streess name
var classes = {
	"Red": "rs-light-red",
	"White": "rs-white",
	"Green": "rs-light-green"
};

var buffer;

speeds.forEach(function(speed) {
	order += 1000-order%1000;
	stresses.forEach(function(stress) {
		root.forEach(function(man) {
			buffer = {};
			output.push(buffer);
			buffer.id = "maneuver:" + stress.toLowerCase() + ":" + man.dir.replace(" ", "").toLowerCase() + ":" + speed;
			buffer.name = man.dir + " (" + stress + ") " + speed;
			buffer.icon = "xwm xwing-miniatures-font-" + man.icon + " " + classes[stress];
			buffer.stress = stress.toLowerCase();
			buffer.speed = speed;
			buffer.order = order;
			buffer.energy = 0;
			order += 10;
		});
		order += 300-order%300;
	});
});

order = 10000;
var speed = 1;
stresses.forEach(function(stress) {
	for(var x=0; x<5; x++) {
		buffer = {};
		output.push(buffer);
		buffer.id = "maneuver:" + stress.toLowerCase() + ":" + root[x].dir.replace(" ", "").toLowerCase() + ":" + speed + ":ending";
		buffer.name = root[x].dir + " (" + stress + ") " + speed;
		buffer.icon = "xwm xwing-miniatures-font-" + root[x].icon + " " + classes[stress];
		buffer.stress = stress.toLowerCase();
		buffer.speed = speed;
		buffer.order = order;
		buffer.energy = 0;
		order += 10;
	}
	order += 100-order%100;
});

stresses.forEach(function(stress) {
	output.push({
		"id": "maneuver:" + stress.toLowerCase() + ":stop:0",
		"speed": 0,
		"name": "Stop (" + stress + ")",
		"icon": "xwm xwing-miniatures-font-stop " + classes[stress],
		"order": order
	});
	order += 10;
});

console.log(JSON.stringify(output, null, 4));
