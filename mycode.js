
$mykey = "00d54096632a28e3a0d2d89dfadf3b25";
$service_url = "https://api.openweathermap.org/data/2.5/find?";

var stations; // Save all the stations according to the user location
var currentStation; // Station that user selected in the home view

$(document).on('pageinit', '#home', function(){
    if('geolocation' in navigator){
        console.log('Geolocation OK:');

        

        // navigator.geolocation.getCurrentPosition((position) => {
        //     alert(`lat: ${position.coords.latitude} lon: ${position.coords.longitude}`);
        // });

        navigator.geolocation.getCurrentPosition((position) => {
            populateList(position.coords.latitude, position.coords.longitude)
        });
    }
    else{
        console.log('Geolocation is NOT available');
    }
});

$(document).on("click", "#refresh", function(event){
    
});

$(document).on("pagebeforeshow", "#home", function(event){
    $(document).on("click", "#to_details", function(e){
        console.log('Event fired!');
        // Stop link behaviour
        e.preventDefault();
        e.stopImmediatePropagation();
        
        // Store the station user selected
        currentStation = stations[e.target.children[0].id];
        console.log(currentStation);
        
        // Change to details page
        $.mobile.changePage('#details');
    });
});

$(document).on("pagebeforeshow", "#details", function(e){
    e.preventDefault();

    // Modify the html elements with my currentStation data
    $('#stationIcon').attr('src', 'https://')
    $('#stationName').text(currentStation.name);
    $('#stationDescription').text(currentStation.weather[0].description);
    $('#stationTemp').text('Temperature: ' + currentStation.main.temp);
    $('#stationHumidity').text('Humidity: ' + currentStation.main.humidity + ' %');
    $('#stationPressure').text('Pressure: ' + currentStation.main.pressure + ' hpa');



});

function populateList($lat, $lon){
    $url = $service_url + 'lat=' + $lat + '&lon=' + $lon + '&appid=' + $mykey + '&cnt=20&units=metric';
    $.getJSON($url, function(data){
        // console.log($url);
        console.log(data);
        stations = data.list;
        console.log(stations);
        $('#stations_list li').remove();
        $.each(stations, function(index, station){
            $('#stations_list').append('<li><a id = "to_details" href = "#">' + station.name + 
            '<span id = "' + index + '"class = "ui-li-count">' + Math.round(station.main.temp) + '°</span></a></li>');
        });
        // Refresh list content
        $('#stations_list').listview('refresh');

        $.mobile.loading('hide');
    });
}

