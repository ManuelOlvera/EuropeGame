var europeGameApp = angular.module('europeGameApp', []);

europeGameApp.controller('europeGameController', ['$scope', '$log', '$q', '$timeout', function($scope, $log, $q, $timeout){
    
    $scope.citiesPlaced = 0;
    $scope.kmLeft = 1500;
    $scope.cityToPlace = '';
    var selectedPosition = {};    
    var cityList = [
        {city: 'London', country: 'United Kingdom'},
        {city: 'Madrid', country: 'Spain'},
        {city: 'Berli', country: 'Germany'},
        {city: 'Bratislava', country: 'Slovakia'},
        {city: 'Paris', country: 'France'}
    ];
    var keyMaps = 'AIzaSyAWC7jPno7JWv4ciZBFE2iq-ANpmaxHn68';
    var keyGeoServer = 'AIzaSyB0-QtFkqYFWQpNJm2RfhcK6x3j0NYdJJw';
         
    $scope.placeCity = function(){
        $log.log('in place city');
    };
    
    $scope.computeDistanceBetween = function(){
        for(pos in cityList){
            $log.log('cityList[pos]', cityList[pos]);
            if(cityList[pos].city === $scope.cityToPlace){
                var LatLn1 = new google.maps.LatLng(cityList[pos].lat, cityList[pos].lng);
                break;
            }
        }
        var LatLn2 = new google.maps.LatLng(selectedPosition.lat, selectedPosition.lng);
        $log.log('LatLn2', LatLn2);
        $log.log('LatLn1', LatLn1);
        google.maps.geometry.spherical.computeDistanceBetween(LatLn1, LatLn2);
    };
    
    var map;
    $scope.initMap = function() {
        
        $scope.cityToPlace = cityList[0].city;
        
        var myStyle = [{
            featureType: "all",
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
        }];

        map = new google.maps.Map(document.getElementById('map'), {
            mapTypeControlOptions: {
                mapTypeIds: ['mystyle', google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.TERRAIN]
            },
            center: new google.maps.LatLng(30, 0),
            zoom: 3,
            mapTypeId: 'mystyle'
        });

        map.mapTypes.set('mystyle', new google.maps.StyledMapType(myStyle, { name: 'My Style' }));

        map.addListener('click', function(e) {
            console.log('in click e ', e);
            placeMarkerAndPanTo(e.latLng, map);
        });
        
        for(var i = 0; i < cityList.length; i++){
            var address = cityList[i].city + ', ' + cityList[i].country;
            (function(pos){
                $.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + keyGeoServer, function(data) {      
                    $log.log('geo data', data);
                    try{
                        cityList[pos].lat = data.results[0].geometry.location.lat;
                        cityList[pos].lng = data.results[0].geometry.location.lng;
                        $log.log('cityList -> ', cityList);
                    }catch(err){
                        $log.log('error getting latitude and longitude', err)   ;
                    }
                });   
            })(i);
        }
    }

    function placeMarkerAndPanTo(latLng, map) {
        console.log('in placeMarkerAndPanTo latLng ', latLng);
        var marker = new google.maps.Marker({
            position: latLng,
            map: map
        });
        // map.panTo(latLng);
        
        selectedPosition = {
            lat: marker.position.lat(),
            lng: marker.position.lng()
        };
        
        $log.log('selectedPosition', selectedPosition);
    }
    
}]);