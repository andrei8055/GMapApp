//Calculate speed based on distance of route and time entered by user



//Fade IN/OUT Graph and Table
$(document).ready(function(){

    $(document.body).on('click','#hideStatistics', function(){

        $("#container").fadeOut("slow");
        $("#tableDiv").fadeIn("slow");
        $("#showStatistics").show();
        $("#hideStatistics").hide();
    });
    $(document.body).on('click','#showStatistics', function(){

        $("#container").fadeIn("slow");
        $("#tableDiv").fadeOut("slow");
        $("#hideStatistics").show();
        $("#showStatistics").hide();
    });
});


//Fade IN/OUT Jquery for right-menu
$(document).ready(function(){

    $(document.body).on('click','#hide', function(){

        $(".sub-menu").fadeOut("slow");
        $("#show").show();
        $("#hide").hide();
    });
    $(document.body).on('click','#show', function(){

        $(".sub-menu").fadeIn("slow");
        $("#hide").show();
        $("#show").hide();
    });
});



// Second Constructor

this.init = function ()
{

    firstAppend = false;
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

