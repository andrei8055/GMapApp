function GMap() {

    var heigthArray = new Array();
    var runningParticipants = new Array(); // participants markers that are on the map
    var numOfRows = 0; // number of rows from the table
    var checkpointsArray = []; //array containing coordinates of chip checkpoints
    var coordinatesArray = new Array(); //array containing the coordinates of the existing route
    var urllocations = [];
    var markers = [];
    var distances = []; //array containing the length of each route segment
    var distance =0;
    var poly;
    var map;
    var URL = document.URL;
    //var flightPath;
    //var flightPlanCoordinates = new Array();
    var isRunning =false; //checks if the markers are moving on the route
    //var ex = false;
    //var cont = false;
    var tempMarker;
    var startMarker;
    var endMarker;
    var toRemove = 0;
    var movementArray = new Array();
    var start = true;
    var pathNo = 0; //Number of subpaths initialized to 0
    var firstAppend = true;
    //var mArray = [];
    //var points = new Array();
    //var coordinates = new Array();

    var landmarks = [];
    var distancesArray = new Array();

    var elevator;
    var infowindow = new google.maps.InfoWindow();


    /*initialize - class constructor
     arr - array with google maps coordinates to recreate the route
     var arr = new Array();
     arr.push(new google.maps.LatLng(57.03512594849537,9.920654296875));
     arr.push(new google.maps.LatLng(57.019804336633165,9.928207397460938));
     arr.push(new google.maps.LatLng(57.03101589205835, 9.968547821044922));
     arr.push(new google.maps.LatLng(57.03512594849537,9.920654296875));
     */

this.initializeResult = function (arr,divID,showBottomMenu)
{

    var div = document.getElementById(divID);
    var con = '';


    con += ' <input id="pac-input" class="controls" type="hidden" placeholder="Search Box" >';

    con += '<div id="map-canvas"></div>';


    con += '<div id="main-menu" style="visibility: hidden">';

    con += '<div id="buttons">';

        con += '<button id="runRight" onClick="GMapObj.run()">Run</button>';

    con += '<button id="hide">Hide</button>';
    con += '<button id="show" hidden="true">Show</button>';
    con += '</div>';
    con += '<div class="sub-menu">';
    con += '<div id="distance">Distance: 0 meters</div>';
    con += '</div>';



    con += '<div id="timeDiv" class="sub-menu"><form><table> <tr>';
    con += '<td>Time:</td>';
    con += '<td><input id="hours-time" type="text" name="hour" onkeyup="CalculateSpeed(GMapObj.getDistance())" placeholder="hh" style="width:25px;">:</td>';
    con += '<td><input id="minutes-time" type="text" name="minutes" onkeyup="CalculateSpeed(GMapObj.getDistance())"  placeholder="mm" style="width:25px;">:</td>';
    con += '<td><input id="seconds-time" type="text" name="seconds" onkeyup="CalculateSpeed(GMapObj.getDistance())"  placeholder="ss" style="width:25px;"></td>';
    con += '</tr> </table></form></div>';

    con += '<div id="speedDiv" class="sub-menu"><table> <tr>';
    con += '<td>Speed: <input readonly="true" value="0" id="speed" type="text" name="speed" style="width:40px; visibility: hidden">km/h</td>';
    con += '</tr>';
    con += '</table>';
    con += '</div>';



    con += '</div>';



    if(showBottomMenu==0)
    {
        con += '<div id="statistics-menu" style="visibility: hidden">';
    }
    else
    {
        con += '<div id="statistics-menu" style="height: auto; min-height: 145px; position: absolute;">';
    }
    con += '<div>';

    if(showBottomMenu!=2)
    {
        con += '<button id="hideStatistics"> Graph </button>';
        con += '<button id="showStatistics" hidden="true"> Table </button>';
    }

    con += '<button id="runBtn"type="button" onClick="GMapObj.run()">Run</button>';
    con += '</div>';
    con += '<div class="datagrid" id="tableDiv" style="float:center; width: 95%; height: 125px; margin:1px; overflow: scroll; position: absolute; ">';
    con += '<table id="tblDetails" border="1" >';
    con += '<thead>';
    con += '<tr>';
    con += '<th style="width: 10px">ID</th>';
    con += '<th style="width:100px;">Name</th>';
    con += '<th style="width:100px;">Distance</th>';
    con += '<th style="width:10px;">Delete</th>';
    con += '<th style="width:100px;">Speed</th>';
    con += '<th style="width:100px;">Altitude</th>';
    con += '</tr>';
    con += '</thead>';
    con += '</table>';
    if(showBottomMenu!=2)
    {
        con += '</div>';
        con += '<div id="container" style="float:left; width: 95%; height: 125px; margin: 1px; position: absolute;">';
        con += '</div>';
    }
    con += '</div>';


    if(showBottomMenu==1)
    {

        GMapObj.showGraph(true);
    }
    div.innerHTML += con;



    if(arr.length>0)
    {
        for(var i = 0;i<arr.length;i++)
        {
            coordinatesArray.push(new google.maps.LatLng(arr[i][0],arr[i][1]));
        }
    }


	//coordinatesArray = arr;
	poly = new google.maps.Polyline({
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
	});
  
  
	if(coordinatesArray.length>0) //If there is a path on initialization, set center of map to first marker coordinates
	{
		var mapOptions = { 
			zoom: 13,
			center: new google.maps.LatLng(coordinatesArray[0].lat(),coordinatesArray[0].lng())
			}
	}
	
	else //set center to aalborg
	{
	    var mapOptions = { 
		zoom: 11,
		center: new google.maps.LatLng(57.03512594849537,9.920654296875)
		}
	}

    //Create the map
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);


	//Create the search box and link it to the UI element.
	var input = /** @type {HTMLInputElement} */(
    document.getElementById('pac-input'));
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(input));
	
	 // [START region_getplaces] 
	 //Listen for the event fired when the user selects an item from the  pick list. Retrieve the matching places for that item.
  
	google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    for (var i = 0, marker; marker = markers[i]; i++)
    {
        marker.setMap(null);
    }

    // For each place, get the icon, place name, and location.
	
	
    markers = [];
    var bounds = new google.maps.LatLngBounds();
	
    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(1171, 171),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(215, 215)
      };

      bounds.extend(place.geometry.location);
    }


    map.fitBounds(bounds);
	map.setZoom(17); //set zoom level for search

	
	  });
	  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });
  
	
	if(coordinatesArray.length>0)
	{
        poly.setPath(coordinatesArray);
        poly.setMap(map);
  
  //add markers to array
	  for(var ind =0;ind<coordinatesArray.length;ind++)
	  {
			var marker = new google.maps.Marker({
			position: coordinatesArray[ind]

		  });
		  markers.push(marker);
	  }
	
	
	//Set starting Marker
	startMarker = new google.maps.Marker({
		position: coordinatesArray[0],
		title: 'Start',
		icon:'http://www.yournavigation.org/markers/route-start.png',
		zIndex: google.maps.Marker.MAX_ZINDEX + 1, 
		map: map
	  });


	//Set ending Marker
    endMarker = new google.maps.Marker({
		position: coordinatesArray[coordinatesArray.length-1],
		title: 'End',
		icon:'http://blind-summit.co.uk/wp-content/plugins/google-map/images/marker_red.png',
		map: map
	  });
	
	
	var dis = 0;
	for(var i = 0; i <coordinatesArray.length-1;i++)
	{
		var dis = getDistance(new google.maps.LatLng(coordinatesArray[i].lat(),coordinatesArray[i].lng()),new google.maps.LatLng(coordinatesArray[i+1].lat(),coordinatesArray[i+1].lng()));
		distances.push(dis);
		distance += dis;	
	}
	  distance = Math.floor(distance);
		if(distance<50000){
			document.getElementById('distance').innerHTML = 'Distance: ' +distance+' meters';
		}
		else
		document.getElementById('distance').innerHTML = 'Distance: ' +distance/1000+' km';
	}
	

	poly.setMap(map);

	// Add a listener for the click event
    elevator = new google.maps.ElevationService();
    google.maps.event.addListener(map, 'click', getElevation);
	//google.maps.event.addListener(map, 'click', addLatLng);


    //load KM markers

    //generate the road coordinates
    this.generateRoad();

	};


    /*
    drawGraph - draw the Heigth graph using movementArrays's coordinates
    interval = 15 gets heigth at each 75 meters (each unit interval = 5 meters)
    */

this.showSearchMenu = function()
{
    var x = document.getElementById("pac-input");
    x.setAttribute("type", "text");

};


    this.showSideMenu = function()
    {

        var x =  document.getElementById("main-menu").style.visibility = "visible";


    };

    this.hideTimeSpeed = function()
    {
         document.getElementById("speedDiv").style.visibility = "hidden";
         document.getElementById("timeDiv").style.visibility = "hidden";
    };



this.showKmMarks = function(show)
    {
        if(show)
        {
            loaddata(poly);
            km_on(poly);
        }


    };

drawGraph = function()
{

    for(var i =0;i<movementArray.length-15;i+=15)
    {
        heigthArray.push(movementArray[i][2]);//insert into array the height at this point (each 50 meters)
    }


};

    //run - loop trough runningParticipants array and call the Move function to make the Participants Markers move over the route
this.run =  function()
{
    if(!isRunning)
	for(var i = 0; i<runningParticipants.length;i++)
	{
        isRunning=true;
        runningParticipants[i]["passedCheckPoints"]= 0;
        runningParticipants[i] ["ranDistance"]= 0;
		this.move(i+1,runningParticipants[i],0,50);
	}

};


    /*
    addParticipant  - adds an object of type google maps marker into runningParticipants array
     name - name of the participant
     distanceTimeArray - 2-dimensional array containing distance and time for each lap/segment from route
     eg: var A1 = [[1000,100],[1000,100],[1000,1000],[1000,100],[1000,1000],[1000,1000],[1000,10],[500,55],[1,1],[1,1]];
     A1[0][0] - distance in meters
     A1[0][1] - time in seconds
     color - color of the marker
     fflag - finish flag - true if the participant finished the course, false otherwise
     */
this.addParticipant = function(name,distanceTimeArray,color,fflag)
{

    if(!isRunning)
    {

        var dArray = new Array();

        for(var i=0;i<distanceTimeArray.length;i++)
        {
            dArray.push(distanceTimeArray[i][0]);
        }

        var checkPoints = this.generateCheckpointsArray(dArray);

        var startPoint = poly.getPath().getAt(0);   //coordinates where to place the marker - start point
        var participant = new google.maps.Marker({
            position: startPoint,   //start position
            title: name,        //participant name
            passedPoints: 0,    //passed corners from path - needed to calculate ran distance at any point
            passedCheckPoints: 0,   //number of check points passed already
            checkPoints: checkPoints,   //array with the distance of each checkPoint from start
            ranDistance: 0,     //the distance ran on the path
            dtArray: distanceTimeArray,     //distance time array
            finishedFlag: fflag,        //finishedFlag
            icon:'http://blind-summit.co.uk/wp-content/plugins/google-map/images/marker_'+color+'.png',     //image of marker
            zIndex: google.maps.Marker.MAX_ZINDEX + 2,  //increase to appear over other markers
            map: map        //the map on which  will be displayed
        });

        createrow(participant); //add the participant details into table
        runningParticipants.push(participant);  //push the participant object into runningParticipants array

    }
};


    /*
     generates the coordinates in meters from the start point
     eg:
     input: [0,10,100,500,1000];
     output: [10,110,610,1610];
     */
this.generateCheckpointsArray = function(distancesArray)
{
                var localArray = new Array();
                localArray[0] = 0;
                for(var i = 1;i<distancesArray.length+1;i++)
                {
                    localArray[i] = distancesArray[i-1] + localArray[i-1];
                }
    return localArray;

};


/*
generates the array of coordinates from route at each 5 meters to make the marker movement possible
 */
this.generateRoad = function()
{

	var i=0;
	var inc = 1;
	var deltaLat = 0;
	var deltaLng = 0;
	var d;
	var frames;


	for(var j = 0;j<poly.getPath().getLength()-1;j++)
	{
		
		var startPoint = poly.getPath().getAt(j);
		var endPoint = poly.getPath().getAt(j+1);
		d = getDistance(startPoint,endPoint);
		frames = Math.round(d/5);   //increase the frames number for a more smooth movement of marker
		deltaLat = 0;
		deltaLng = 0;
		inc = 1;
		
			while((startPoint.lat() + (deltaLat * inc) != endPoint.lat()) && (startPoint.lng() + (deltaLng * inc) != endPoint.lng()))
			{

                movementArray[i] = new Array();
                deltaLat = (endPoint.lat() - startPoint.lat())/frames;
                deltaLng = (endPoint.lng() - startPoint.lng())/frames;
                var tempLat = startPoint.lat() + (deltaLat * inc);
                var tempLng = startPoint.lng() + (deltaLng * inc);
                movementArray[i][0] = tempLat;
                movementArray[i][1] = tempLng;
                if(i%15==0)
                {
                      getElevation(tempLat, tempLng,i); //get the heigth at each 75 meters
                }
                i++;
                inc++;
			}

	}
		
			
};


/*

getElevation - inserts into movement array, at position i, the heigth at coordinates latitude and longitude
 */
getElevation =  function(latitude,longitude,i) {

        var locations = [];

        var clickedLocation = new google.maps.LatLng(latitude,longitude);
        locations.push(clickedLocation);

        // Create a LocationElevationRequest object using the array's one value
        var positionalRequest = {
            'locations': locations
        }

        // Initiate the location request
        elevator.getElevationForLocations(positionalRequest, function(results, status) {
            if (status == google.maps.ElevationStatus.OK) {
                if (results[0]) {
                    var r = Math.round(results[0].elevation);
                    movementArray[i][2] = r;


                } else {
                    alert("No results found");
                }
            } else {
                alert("Elevation service failed due to: " + status);
            }
        });
    };


/*
produce the marker movement over the route
row - row of table to modify data
participant - object of type marker representing the participant details
the speed of marker movement (time in miliseconds for function to wait ) - calculated from distance/time
 */
this.move = function myself (row,participant,c,speed) {

	var myTable = document.getElementById('tblDetails');

    //if the marker is not at end of route
    if (movementArray.length  > c ) {

        //get current position of marker
		var point = new google.maps.LatLng(movementArray[c][0], movementArray[c][1]);

        //if the marker passed a corner, recalculate the ranDistance
		if(participant.passedPoints<coordinatesArray.length-1 && markerInRadius(point,coordinatesArray[participant.passedPoints+1],0.012))
		{
            participant["ranDistance"] += getDistance(coordinatesArray[participant.passedPoints+1],coordinatesArray[participant.passedPoints]);
            participant["passedPoints"]++;
		}

        //add details into table
        var ranDistance = Math.round( participant.ranDistance + getDistance(coordinatesArray[participant.passedPoints],point));
		myTable.rows[row].cells[2].innerHTML = ranDistance;
        var KmHourSpeed= speed;
        KmHourSpeed = KmHourSpeed/1000 *60*60;
        KmHourSpeed = Math.round(KmHourSpeed * 100) / 100;
        myTable.rows[row].cells[4].innerHTML = KmHourSpeed;

        //if we have the heigth at that point, print it
        if(movementArray[c][2])
        {
            myTable.rows[row].cells[5].innerHTML =  movementArray[c][2];
        }

        //if the finish flag is true
        if(participant.finishedFlag)
        {

            //and the ran distance is bigger than check point, update the speed with new distance/time details
            if(ranDistance > participant.checkPoints[participant.passedCheckPoints] && participant.passedCheckPoints < participant.dtArray.length )
            {

                speed =  Math.round(participant.dtArray[participant.passedCheckPoints][0] / participant.dtArray[participant.passedCheckPoints][1]);
                participant["passedCheckPoints"] ++;
                var KmHourSpeed= speed;
                KmHourSpeed = KmHourSpeed/1000 *60*60;
                KmHourSpeed = Math.round(KmHourSpeed * 100) / 100;
                myTable.rows[row].cells[4].innerHTML = KmHourSpeed;
            }


        }
        //if the finish flag is false
        else
        {
            //if we didn't reach the last checkPoint from array
            if( participant.passedCheckPoints <= participant.dtArray.length )
            {
                //and the distance is greater than the checkPoint that we pass, update the speed
                if(ranDistance >= participant.checkPoints[participant.passedCheckPoints])
                {
                speed = Math.round(participant.dtArray[participant.passedCheckPoints][0] / participant.dtArray[participant.passedCheckPoints][1]);
                participant["passedCheckPoints"] ++;

                var KmHourSpeed= speed;
                KmHourSpeed = KmHourSpeed/1000 *60*60;
                KmHourSpeed = Math.round(KmHourSpeed * 100) / 100;
                myTable.rows[row].cells[4].innerHTML = KmHourSpeed;
                }

            }
            //if we reached the last checkPoint, and the finish flag is false, we stop here
            else
            {
                participant["zIndex"] = google.maps.Marker.MAX_ZINDEX - 2;
            }
        }

        //update the marker position
        participant.setPosition(point);


        window.setTimeout(function(){
            myself(row,participant,c+2,speed);
        },100-speed);
		
		
    }

    //if the marker is at end of route
	else
	{

        participant["passedPoints"]=0;

         //if the finish flag is true and we reached the last check point - we stop here
         // or
         // if we ar at the first to the end check point and the distance is less than 300 meters, we still stop
         if((participant.finishedFlag && participant.passedCheckPoints >= participant.dtArray.length)||(participant.finishedFlag && participant.passedCheckPoints+2 >= participant.dtArray.length && ( participant.checkPoints[participant.checkPoints.length-1]+300 > participant.ranDistance && participant.checkPoints[participant.checkPoints.length-1]-300 < participant.ranDistance  ) ) )
         {
             participant["zIndex"] = google.maps.Marker.MAX_ZINDEX - 2;
             isRunning = false;
         }

         //if we still have checkPoints to pass, start from the beginning (circuit)
         else
		{
            myself(row,participant,0,speed);
		}

	}

};


// check if point1 and point2 are in range
//  range = 0.001 ~ 10 meters
markerInRadius = function(position1,position2,range)
{
		var range = range/70;
		var minLat = position2.lat() - range;
		var maxLat = position2.lat() + range;
		var minLon = position2.lng() - range;
		var maxLon = position2.lng() + range;

	if(position1.lat() > minLat && position1.lat() < maxLat && position1.lng() > minLon && position1.lng() < maxLon)
		return true;
	return false;

};


/*
return a marker with numbered "i"
used for marking kilometers
 */
this.createMarker = function(point,html,i) {

	var iconString = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+i+'|F5F5DC|000000';
    var contentString = html;
    var marker = new google.maps.Marker({
		icon: iconString,
        position: point,
        map: map,
        title: name,
        zIndex: Math.round(point.lat()*-100000)<<5
        });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(contentString); 
        infowindow.open(map,marker);
        });
        return marker;
};







//Add details of participant in a new row of the bottom-page table
    createrow = function(marker){

        if(!isRunning){
            var table = document.getElementById('tblDetails'),
                rowCount = table.rows.length,
                row = table.insertRow(rowCount),
                cell = row.insertCell(0),
                a = document.createElement('a');

            cell.innerHTML = "<img src='"+marker.icon+"' >";

            cell = row.insertCell(1);
            cell.innerHTML= marker.title;

            cell = row.insertCell(2);
            cell.innerHTML= 0;

            cell = row.insertCell(3);
            a.href = '#';
            a.innerHTML = "<img src='https://www.pschrome.com/chrome/PSChrome2/icons/delete.png' >";
            a.onclick = function() {
                // `this` refers to the `a` element.
                removerow(this.parentNode.parentNode.rowIndex);
                return false;
            };

            cell.appendChild(a);


            cell = row.insertCell(4);
            cell.innerHTML= 0;

            cell = row.insertCell(5);
            cell.innerHTML= 0;

            // still needed for IE memory leak? Don't know...
            table = row = cell = a = null;
        }
    };

//Remove row from table
     removerow = function(i){

        if(!isRunning)
        {
            var table = document.getElementById('tblDetails');
            table.deleteRow(i);
        }
        //alert(i);
        //alert(runningParticipants[i-1]["title"]);
        runningParticipants[i-1].setMap(null);
        runningParticipants.splice(i-1,1);


    };


    //Display markers at each Kilometer
     km_on = function(polyline) {

        var arr =  new Array();
        arr.push(1000);
        landmarks = new Array();
        if (landmarks.length && (landmarks.length > 0)) {
            for (var i=0; i<landmarks.length; i++) landmarks[i].setMap(map);
        }

        var km_points = polyline.GetPointsAtDistance(arr);
        for (var i=0; i<km_points.length; i++) {
            var infoWindowContent = 'marker '+i/2000+' of '+Math.floor(polyline.Distance()/2000)+'<br>kilometer '+i/1000+' of '+(polyline.Distance()/1000).toFixed(2);
            var landmark = createMarker(km_points[i], infoWindowContent,i+1);
            landmarks.push(landmark);
        }

    };


//Delete markers at each Kilometer
     km_off = function() {


        for (var i=0; i<landmarks.length; i++)
        {
            landmarks[i].setMap(null);

        }

    };

//Load data for display markers at each Kilometer
    loaddata = function(polyline) {
        km_off();
        var pointsud = new Array();
        var points = new Array();
        var coordinates = new Array;
        coordinates.lenght = 0;
        for(var i=0;i<markers.length;i++)
        {
            points.push(markers[i].getPosition().lat()+','+markers[i].getPosition().lng());
        }

        for (var i=1; i<(points.length-1); i++) {
            var mData = points[i].split(',');
            var point = new google.maps.LatLng(parseFloat(mData[0]),parseFloat(mData[1]));
            coordinates[ coordinates.length ] = [ point.lat(), point.lng() ];
            pointsud.push(point);
        }

        //alert(polyline);
        for (var i=0; i<polyline.Distance(); i+=2000) {
            var pointkm = polyline.GetPointAtDistance(i);
            if (pointkm) {
                // GLog.write(pointkm);
                //landmark = new GMarker(pointkm);
                //map.addOverlay(landmark);
            }
        }

    };


     createMarker = function(point,html,i) {
        var iconString = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+i+'|F5F5DC|000000';
        var contentString = html;
        var marker = new google.maps.Marker({
            icon: iconString,
            position: point,
            map: map,
            title: name,
            zIndex: Math.round(point.lat()*-100000)<<5
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(contentString);
            infowindow.open(map,marker);
        });
        return marker;
    };

     rad = function(x) {
        return x * Math.PI / 180;
    };

//Get distance in km from point p1 to p2
     getDistance = function(p1, p2) {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = rad(p2.lat() - p1.lat());
        var dLong = rad(p2.lng() - p1.lng());
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
                Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d; // returns the distance in meter
    };

    this.getDistance = function(){
        return distance;
    };

    this.getHeigthArray = function(){
        return heigthArray;
    };

    this.getParticipants = function(){
        return runningParticipants;
    }

    this.getCoordinates = function(){
        return coordinatesArray;
    }

    this.getSegmentDistances = function(){
        return distances;
    }

    this.getRunningStatus = function(){
        return isRunning;
    }

    this.getLandmarks = function(){
        return landmarks;
    }

    this.getRoad = function(){
        return movementArray;
    }

    CalculateSpeed = function(distance){


        var hours;
        var minutes ;
        var seconds ;
        if(isNaN(parseInt(document.getElementById('hours-time').value)))
        {
            hours = 0;
        }
        else
            hours = parseInt(document.getElementById('hours-time').value);

        if(isNaN(parseInt(document.getElementById('minutes-time').value)))
        {
            minutes =0;
        }
        else
            minutes = parseInt(document.getElementById('minutes-time').value);

        if(isNaN(parseInt(document.getElementById('seconds-time').value)))
        {
            seconds = 0;
        }
        else
            seconds = parseInt(document.getElementById('seconds-time').value);



        var time = hours*3600+minutes*60+seconds;
        if(time !=0)
        {

            var x = distance/time;
            x = x/1000 *60*60;
            x = Math.round(x * 100) / 100;
            document.getElementById('speed').value = x;

        }

        else
        {
            alert('Time can not be 0');
        }
    };




    this.showGraph = function (show){
        if(show)
        {
            $(window).load(function () {
                drawGraph();
                $(function () {

                    $("#container").highcharts({
                        chart: {
                            type: 'spline'
                        },
                        title: {
                            text: ''
                        },

                        xAxis: {

                            type: 'linear',
                            labels: {
                                overflow: 'justify'
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'HEIGTH'
                            },
                            min: 0,
                            minorGridLineWidth: 0,
                            gridLineWidth: 0,
                            alternateGridColor: null,
                            plotBands: [{ // Light air
                                from: 0.3,
                                to: 1.5,
                                color: 'rgba(68, 170, 213, 0.1)',
                                label: {
                                    text: '',
                                    style: {
                                        color: '#606060'
                                    }
                                }
                            }, { // Light breeze
                                from: 1.5,
                                to: 3.3,
                                color: 'rgba(0, 0, 0, 0)',
                                label: {
                                    text: '',
                                    style: {
                                        color: '#606060'
                                    }
                                }
                            }, { // Gentle breeze
                                from: 3.3,
                                to: 5.5,
                                color: 'rgba(68, 170, 213, 0.1)',
                                label: {
                                    text: '',
                                    style: {
                                        color: '#606060'
                                    }
                                }
                            }, { // Moderate breeze
                                from: 5.5,
                                to: 8,
                                color: 'rgba(0, 0, 0, 0)',
                                label: {
                                    text: '',
                                    style: {
                                        color: '#606060'
                                    }
                                }
                            }, { // Fresh breeze
                                from: 8,
                                to: 11,
                                color: 'rgba(68, 170, 213, 0.1)',
                                label: {
                                    text: '',
                                    style: {
                                        color: '#606060'
                                    }
                                }
                            }, { // Strong breeze
                                from: 11,
                                to: 14,
                                color: 'rgba(0, 0, 0, 0)',
                                label: {
                                    text: '',
                                    style: {
                                        color: '#606060'
                                    }
                                }
                            }, { // High wind
                                from: 14,
                                to: 15,
                                color: 'rgba(68, 170, 213, 0.1)',
                                label: {
                                    text: '',
                                    style: {
                                        color: '#606060'
                                    }
                                }
                            }]
                        },

                        tooltip: {
                            formatter: function() {
                                return 'The height at km <b>'+ Math.round(this.x *100)/100 +
                                    '</b> is <b>'+ this.y +'</b> m';
                            }
                        },

                        plotOptions: {

                            spline: {
                                lineWidth: 4,
                                states: {
                                    hover: {
                                        lineWidth: 5
                                    }
                                },
                                marker: {
                                    enabled: false
                                },
                                pointInterval: 0.075, // distance between points in KM
                                pointStart: 0
                            }
                        },
                        series: [{
                            name: 'Distance',
                            data: heigthArray

                        }]
                        ,
                        navigation: {
                            menuItemStyle: {
                                fontSize: '10px'
                            }
                        }
                    });
                });
            });
        }
    };


//Second Constructor


    this.initializeDraw = function (divID,showRightMenu)
    {
        var div = document.getElementById(divID);
        var con = '';
        con += ' <input id="pac-input" class="controls" type="hidden" placeholder="Search Box">';

        con += '<div id="map-canvas"></div>';

        if(showRightMenu==0)
        {
            con += '<div id="main-menu" style="visibility: hidden">';
        }
        else
        {
            con += '<div id="main-menu">';
        }
        con += '<div id="buttons">';
        con += '<button id="hide">Hide</button>';
        con += '<button id="show" hidden="true">Show</button>';
        con += '</div>';
        con += '<div class="sub-menu">';
        con += '<div id="distance">Distance: 0 meters</div>';
        con += '<div id="menu-buttons">';
        con += '<button id="RemoveLastBtn"type="button" onClick="GMapObj.removeLast()">Undo</button>';
        con += '<button id="RemoveAll"type="button" onClick="GMapObj.removeAll()">Delete</button>';
        con += '</div>'
        con += '</div>';

        if(showRightMenu==2)
        {

        }
        else
        {
            con += '<div class="sub-menu"><form><table> <tr>';
            con += '<td>Time:</td>';
            con += '<td><input id="hours-time" type="text" name="hour" onkeyup="CalculateSpeed(GMapObj.getDistance())" placeholder="hh" style="width:25px;">:</td>';
            con += '<td><input id="minutes-time" type="text" name="minutes" onkeyup="CalculateSpeed(GMapObj.getDistance())"  placeholder="mm" style="width:25px;">:</td>';
            con += '<td><input id="seconds-time" type="text" name="seconds" onkeyup="CalculateSpeed(GMapObj.getDistance())"  placeholder="ss" style="width:25px;"></td>';
            con += '</tr> </table></form></div>';
            con += '<div class="sub-menu"><table> <tr>';
            con += '<td>Speed: <input readonly="true" value="0" id="speed" type="text" name="speed" style="width:40px;">km/h</td>';
            con += '</tr>';
            con += '</table>';
            con += '</div>';
        }
        con += '</div>';
        div.innerHTML += con;


        firstAppend = true;
        pathNo = coordinatesArray.length;
        poly = new google.maps.Polyline({
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });


        if(coordinatesArray.length>0) //If there is a path on initialization, set center of map to first marker coordinates
        {
            start = false;
            var mapOptions = {
                zoom: 13,
                center: new google.maps.LatLng(coordinatesArray[0].lat(),coordinatesArray[0].lng())
            }
        }

        else
        {
            var mapOptions = {
                zoom: 11,
                center: new google.maps.LatLng(57.0458428,9.9310455)
            }
        }

        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        //----------------------Search Box.Create the search box and link it to the UI element.

        var input = /** @type {HTMLInputElement} */(
            document.getElementById('pac-input'));

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        var searchBox = new google.maps.places.SearchBox(
            /** @type {HTMLInputElement} */(input));

        // [START region_getplaces]
        //Listen for the event fired when the user selects an item from the  pick list. Retrieve the matching places for that item.

        google.maps.event.addListener(searchBox, 'places_changed', function() {
            var places = searchBox.getPlaces();


            for (var i = 0, marker; marker = markers[i]; i++) {
                marker.setMap(null);

            }

            // For each place, get the icon, place name, and location.


            markers = [];
            var bounds = new google.maps.LatLngBounds();

            for (var i = 0, place; place = places[i]; i++) {
                var image = {
                    url: place.icon,
                    size: new google.maps.Size(1171, 171),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(215, 215)
                };

                bounds.extend(place.geometry.location);
            }


            map.fitBounds(bounds);
            map.setZoom(17); //set zoom level for search


        });
        google.maps.event.addListener(map, 'bounds_changed', function() {
            var bounds = map.getBounds();
            searchBox.setBounds(bounds);
        });


        if(coordinatesArray.length>0)
        {

            poly.setPath(coordinatesArray);
            poly.setMap(map);

            //add markers to array
            for(var ind =0;ind<coordinatesArray.length;ind++)
            {

                var marker = new google.maps.Marker({
                    position: coordinatesArray[ind]

                });
                markers.push(marker);
            }


            //Set starting Marker
            startMarker = new google.maps.Marker({
                position: coordinatesArray[0],
                title: 'Start',
                icon:'http://www.yournavigation.org/markers/route-start.png',
                zIndex: google.maps.Marker.MAX_ZINDEX + 1,
                map: map
            });

            //Set ending Marker
            endMarker = new google.maps.Marker({
                position: coordinatesArray[coordinatesArray.length-1],
                title: 'End',
                icon:'http://blind-summit.co.uk/wp-content/plugins/google-map/images/marker_red.png',
                map: map
            });


            var dis = 0;

            for(var i = 0; i <coordinatesArray.length-1;i++)
            {
                var dis = getDistance(new google.maps.LatLng(coordinatesArray[i].lat(),coordinatesArray[i].lng()),new google.maps.LatLng(coordinatesArray[i+1].lat(),coordinatesArray[i+1].lng()));
                distances.push(dis);
                distance += dis;
            }
            distance = Math.floor(distance);
            if(distance<50000){
                document.getElementById('distance').innerHTML = 'Distance: ' +distance+' meters';
            }
            else
                document.getElementById('distance').innerHTML = 'Distance: ' +distance/1000+' km';
        }


        poly.setMap(map);
        // Add a listener for the click event

        google.maps.event.addListener(map, 'click', addLatLng);
        loaddata(poly);
        km_on(poly);

    };



    function addLatLng(event) {


        var path = poly.getPath();


        pathNo++;
        toRemove++;
        //flightPlanCoordinates.push(event.latLng);

        coordinatesArray.push(event.latLng);

        if(markers.length>0)
        {
            endMarker = new google.maps.Marker({
                position: event.latLng,
                title: '#' + path.getLength(),
                icon:'http://blind-summit.co.uk/wp-content/plugins/google-map/images/marker_red.png',
                map: map
            });
            markers.push(endMarker);



            if(markers.length>2)
            {
                markers[markers.length-2].setMap(null);

            }

        }


        if(firstAppend==true)
        {
            var appendLocation = '?a[lat'+pathNo+']='+event.latLng.lat()+'&a[lng'+pathNo+']='+event.latLng.lng();
            firstAppend = false;
        }
        else
            var appendLocation = '&a[lat'+pathNo+']='+event.latLng.lat()+'&a[lng'+pathNo+']='+event.latLng.lng();

        urllocations.push(appendLocation);
        var curentUrl = document.URL + appendLocation;
        window.history.pushState('object or string', 'Title', curentUrl);

        // Because path is an MVCArray, we can simply append a new coordinate
        // and it will automatically appear.


            if(coordinatesArray.length>0)
            {

                path.push(new google.maps.LatLng(coordinatesArray[coordinatesArray.length-1].lat(), coordinatesArray[coordinatesArray.length-1].lng()));
               // cont = false;
            }

        path.push(event.latLng);

        // Add a new marker at the new plotted point on the polyline.
        if(start)
        {
            startMarker = new google.maps.Marker({
                position: event.latLng,
                title: '#' + path.getLength(),
                icon:'http://www.yournavigation.org/markers/route-start.png',
                map: map
            });
            markers.push(startMarker);
        }
        start = false;



        if(markers.length>1)
        {
            distances.push(getDistance(markers[markers.length-2].getPosition(),markers[markers.length-1].getPosition()));
        }

        distance = 0;
        for(var i=0; i<distances.length; i++){
            distance += distances[i];
        }

        distance = Math.floor(distance);
        if(distance<50000){
            document.getElementById('distance').innerHTML = 'Distance: ' +distance+' meters';
        }
        else
            document.getElementById('distance').innerHTML = 'Distance: ' +distance/1000+' km';

        loaddata(poly);
        km_on(poly);

    }

    this.removeAll = function(){


        toRemove = 0;

        for(var i=0;i<markers.length;i++)
        {
            markers[i].setMap(null);
        }

        var i=poly.getPath().getLength();
        while(i>0)
        {
            poly.getPath().pop();
            i--;
        }

        distance = 0;
        distances = [];
        markers = [];
        pathNo=0;
        start = true;
        firstAppend = true;
        startMarker.setMap(null);
        endMarker.setMap(null);
        document.getElementById('distance').innerHTML = 'Distance: 0 meters';
        window.history.pushState('object or string', 'Title', URL);
        km_off();

    };


    this.removeLast = function(){


        poly.getPath().pop();
        if(markers.length>1 && toRemove>0)
        {
            endMarker.setMap(null);
            markers[markers.length-1].setMap(null);
            markers[markers.length-2].setMap(map);

            markers.pop();
            poly.getPath().pop();

            distance -= distances[distances.length-1];
            distance = Math.floor(distance);
            distances.pop();

            var permalink = URL;
            urllocations.pop();
            for (var index = 0; index < urllocations.length; ++index){
                permalink+=urllocations[index];
            }
            window.history.pushState('object or string', 'Title', permalink);
            pathNo--;
            loaddata(poly);
            km_on(poly);
            toRemove--;
        }




        if(distance<50000){
            document.getElementById('distance').innerHTML = 'Distance: ' +distance+' meters';
        }
        else
            document.getElementById('distance').innerHTML = 'Distance: ' +distance/1000+' km';

    };

}