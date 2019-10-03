var geocoder = new google.maps.Geocoder();

var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 2,
    center: new google.maps.LatLng(0, 0),
    mapTypeId: google.maps.MapTypeId.HYBRID
});

//google.maps.event.addDomListener(window, 'load', initialize);



var addresses;
var titles;
var dist;
var overlays = [];

function initialize() {

	google.maps.event.addDomListener(window, 'load', initialize);

    	while (overlays[0]) {
        	overlays.pop().setMap(null);
    }
	addresses = [
       	document.getElementById("origfrom").value,
	document.getElementById("iwpto").value,
 	document.getElementById("iwpto2").value,
        	document.getElementById("destto").value
    ];
    titles = [];
    geocode();
}

 function GetLocation() {
            var geocoder = new google.maps.Geocoder();
            var address = document.getElementById("origfrom").value;
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var lat = results[0].geometry.location.lat();
                    var lng = results[0].geometry.location.lng();
                    document.getElementById("orig").value=lat + "," + lng
                } 
            });
        };

 function GetLocation1() {
            var geocoder = new google.maps.Geocoder();
            var address = document.getElementById("iwpto").value;
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var lat = results[0].geometry.location.lat();
                    var lng = results[0].geometry.location.lng();
                    document.getElementById("iwp").value=lat + "," + lng
                } 
            });
        };

function GetLocation2() {
            var geocoder = new google.maps.Geocoder();
            var address = document.getElementById("iwpto2").value;
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var lat = results[0].geometry.location.lat();
                    var lng = results[0].geometry.location.lng();
                    document.getElementById("iwp2").value=lat + "," + lng
                } 
            });
        };

function GetLocation3() {
            var geocoder = new google.maps.Geocoder();
            var address = document.getElementById("destto").value;
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var lat = results[0].geometry.location.lat();
                    var lng = results[0].geometry.location.lng();
                    document.getElementById("dest").value=lat + "," + lng
                } 
            });
        };


			
			// create array containing titles
			var titles = [
				[ 'ORIGIN',document.getElementById("orig").value,4],
				[ 'IWP', document.getElementById("iwp").value,3],
				[ 'IWP2', document.getElementById("iwp2").value,2],
				[ 'DESTINATION', document.getElementById("dest").value,1]
			];


var marker, i;

    for (i = 0; i < titles.length; i++) {  
      marker = new google.maps.Marker({
        position:new google.maps.latlng(titles[i][1], titles[i][2]),
        map: map,
title:titles[i][0]
      });

google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(titles[i][0]);
          infowindow.open(map, marker);
        }
      })(marker, i));
    

   }
			
 
 





function geocode() {
   	if (titles.length === 4) {
       	return route();
    }
	geocoder.geocode( { 'address': addresses.shift() }, function(res, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			titles.push(res[0]);
		}
		else {
			titles.push({});
		}
        	geocode();
    });
}

function route() {
    var coords = [];
    var path;
	var bounds = new google.maps.LatLngBounds();

   	function addMarker(location, latlng) {
       	latlng = latlng || new google.maps.LatLng(location.geometry.location.lat(), location.geometry.location.lng());
       	var marker_image = 'http://maps.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png';
       	
	var marker = new google.maps.Marker({
           	map: map,
            	icon: marker_image,
            	position: latlng,
	title:""+latlng
	
        });


    
	var infowindow = new google.maps.InfoWindow({
           	content:'<div  style="text-align:center;font-size:12px;padding:4px;background-color:black;color:yellow;">'+location.formatted_address + '<br/>' + '</div>'+'<br style="line-height:40%">'+'<div>'+ '<center style="font-size:10px">'+"Click Marker to Zoom-In the 		Airport"+'<br>'+"  and Right Click Marker to Zoom-Out the Airport" + '</center>'+'</div>',
	maxWidth: 200,
        });



        	google.maps.event.addListener(marker, 'mouseover', function() {
           	infowindow.open(map, marker);
        });

 	google.maps.event.addListener(marker, 'mouseout', function() {
           	//infowindow.close();
        });



         	google.maps.event.addListener(marker, 'click', function() {
           	map.setZoom(15);
 	map.setCenter(marker.getPosition());
        });

 	google.maps.event.addListener(marker, 'rightclick', function() {
     	initialize();
        });


        	overlays.push(marker);
    }

   	titles.forEach(function (location) {
       	if (location.geometry) {
           	var latlng = new google.maps.LatLng(location.geometry.location.lat(), location.geometry.location.lng());
           	coords.push(latlng);
           	addMarker(location, latlng);
            	bounds.extend(latlng);
        }
    });

    	map.fitBounds(bounds);

   	path = new google.maps.Polyline({
      	path: coords,
      	strokeColor: "#FF0000",
      	strokeOpacity: 0.5,
	geodesic: true,
     	strokeWeight: 2
    });

	path.setMap(map);

  	overlays.push(path);

var distanceKm = google.maps.geometry.spherical.computeLength(coords);
document.getElementById("dist").value= Math.round(distanceKm/1852,0) + " Nm";

    }
