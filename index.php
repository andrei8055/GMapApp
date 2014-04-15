<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <title>Complex Polylines</title>
 
	
	<link rel="stylesheet" type="text/css" href="googlemaps.css">
	<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=places"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script src='APIversion2.js'></script>
	<script src='GMap.js'></script>
    <script src='functions.js'></script>
    <script src="http://code.highcharts.com/highcharts.js"></script>
    <script src="http://code.highcharts.com/modules/exporting.js"></script>


      <script>

    var GMapObj = new GMap();

    var arr = new Array(); // array containing the coordinates used to draw the route

    var sub = new Array();
    sub.push(57.03512594849537,9.920654296875);
    arr.push(sub);

    var sub = new Array();
    sub.push(57.019804336633165,9.928207397460938);
    arr.push(sub);
    /*
    var sub = new Array();
    sub.push(57.03101589205835,9.968547821044922);
    arr.push(sub);

    var sub = new Array();
    sub.push(57.03512594849537,9.920654296875);
    arr.push(sub);
    */

    //Arrays of Distace/Time for each participant that will be added to map
    var A1=  [[100,12],[1000,120],[1000,1000],[1000,100],[1000,1000],[1000,1000],[1000,10],[500,55],[1,1],[1,1]];
    var A2 = [[578,17],[1000,36],[1000,133]];
    var A3 = [[1000,10],[100,32]];

		jQuery(function ($){

            GMapObj.initializeDraw("main",2);
         //   GMapObj.showKmMarks(true,2000);

        /*
             GMapObj.initializeResult(arr,"main",2);
             GMapObj.showKmMarks(true);
             GMapObj.addParticipant('michael', A1,'blue',true);
             GMapObj.addParticipant('paul', A3,'red',true);
             GMapObj.addParticipant('jhonny', A2,'orange',false);

             GMapObj.showSearchMenu();
             GMapObj.showSideMenu();
             //GMapObj.hideTimeSpeed();
            */



		});

     /*
     GMap.initialize(array,string)
     @param1 - 2dimensional array of course coordinates. type numeric
     array[i][0] - longitude
     array[i][1] - latitude

      var arr = new Array();
      var sub = new Array();
      sub.push(57.03512594849537,9.920654296875);
      arr.push(sub);


     $param2 - Div ID inside which map will be displayed

    GMap.showKmMarks(boolean)
    @param1 - true to display Km marks on course, false otherwise. default: false

    GMap.run()
    starts the markers movement

    GMap.addParticipant (string name, array distanceTimeArray,string color, boolean fflag)
    @param1 - name of participant
    @param2 - 2-dimensional array containing distance and time for each lap/segment from route
     eg: var A1 = [[1000,100],[1000,100],[1000,1000],[1000,100],[1000,1000],[1000,1000],[1000,10],[500,55],[1,1],[1,1]];
     A1[0][0] - distance in meters
     A1[0][1] - time in seconds
    @param3 - color of the marker
    @param4 - finish flag - true if the participant finished the course, false otherwise. If false, participant stops at last checkcoint from distanceTimeArray


    GMap.showGraph(boolean show,string divID)
    @param1 - true to display it in div with id divID
    @param2 - the div inside which the graph will be displayed

    GMap.showSideMenu(boolean)
    @param1 - if true, display the right side menu. default false

    GMap.getDistance() - returns total length of course in meters

    GMap.getHeigthArray() - returns array of points heigth in meters

    GMap.getParticipants() - returns an array of google maps marker objects containing name (title), his/her distanceTimeArray (dtArray), the finishedFlag, the icon

    GMap.getCoordinates() - returns an array of google map LngLat objects

    GMap.getSegmentDistances() - returns an array with distances of each road segment (a segment is defined as straight path between 2 points)

    GMap.getRunningStatus() - returns true if the markers are moving, false otherwise

    GMap.getLandmarks() - returns the array of google maps marker objects that are displayed at each 1 KM

    GMap.getRoad() - returns an array with the coordinates necessary for the markers to move along the course.

      */

	</script>


  </head>


  <body>

         <div id="main" style="width: 550px;height: 500px; position: relative;"></div>


  </body>
</html>

