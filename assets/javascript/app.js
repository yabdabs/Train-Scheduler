//regular expression validation for form
//error logging on page
//front end design
//updating minutes to arrival every minute(timer?)create a function that would check it
//update/ remove buttons
// $(document).ready(function(){

var database;
var trainName="";
var destination= "";
var frequency=0;
var time;


// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAcQedWBX5pdGxGqOtOJzS5RT5jeuam7Ls",
    authDomain: "train-scheduler-f5457.firebaseapp.com",
    databaseURL: "https://train-scheduler-f5457.firebaseio.com",
    projectId: "train-scheduler-f5457",
    storageBucket: "train-scheduler-f5457.appspot.com",
    messagingSenderId: "543639544086"
  };

  firebase.initializeApp(config);

  database= firebase.database();



	$("#submit").on("click", function(){

		event.preventDefault();

		trainName= $("#train-name").val().trim();
		destination= $("#destination").val().trim();
		frequency= $("#frequency").val().trim();
	 	time= $("#train-time").val();

	 	//military time?
	 	console.log(time);

		//1.take the time and convert it using moment.js
		 //subtracts the first train time back a year to ensure it's before current time.
		var convertedTime= moment(time, "hh:mm").subtract("1, years");;
		console.log(convertedTime);

		//2.get current time and frequency to calculate the next arrival. 
		// var currentTime= moment().format("hh:mm");
		var currentTime=moment();
		console.log(currentTime);


		var difference= currentTime.diff(moment(convertedTime), "minutes");
		console.log(difference);
		

		//3. calculate minutes away by difference between next arrival and current time
		//store that in next arrival key variable
		var remainder= difference%frequency;
		var minsRemaining= frequency-remainder;
		console.log(minsRemaining);

		//next arrival time= mins remaining+ current time
		var nextTrain = moment().add(minsRemaining, "minutes").format("hh:mm a");;
		console.log(nextTrain);

		$("#train-name").val("");
		$("#destination").val("");
		$("#frequency").val("");
	 	$("#train-time").val("");

		database.ref().push	({
			trainName: trainName,
			destination: destination,
			frequency: frequency,
			minsRemaining: minsRemaining,
			nextTrain: nextTrain
		});

	});
// });

database.ref().on("child_added", function(snapshot){
	console.log(snapshot.val());
	var row= $("<tr>");
	var data= $("<td>" +snapshot.val().trainName + "</td><td>" +snapshot.val().destination + "</td><td>" +snapshot.val().frequency + "</td><td>" +snapshot.val().nextTrain + "</td><td>" +snapshot.val().minsRemaining + "</td>");

	row.append(data)

	$("tbody").append(row);
});