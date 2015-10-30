var europeGameApp = angular.module('europeGameApp', []);

europeGameApp.controller('europeGameController', ['$scope', '$log', '$q', '$timeout', function($scope, $log, $q, $timeout){
    
    $scope.citiesPlaced = 0;
    $scope.kmLeft = 1500;
    $scope.cityToPlace = '';
    var cityList = [
        {city: 'London', country: 'United Kingdom'},
        {city: 'Madrid', country: 'Spain'},
        {city: 'Berli', country: 'Germany'},
        {city: 'Bratislava', country: 'Slovakia'},
        {city: 'Paris', country: 'France'}
    ];
    var keyMaps = 'AIzaSyAWC7jPno7JWv4ciZBFE2iq-ANpmaxHn68';
    var keyGeo = 'AIzaSyByUSKPMhbBlN-S_cPg_d0eJlkIGDB9LRs';
    var keyGeoServer = 'AIzaSyB0-QtFkqYFWQpNJm2RfhcK6x3j0NYdJJw';
        
    init();
    
    function init(){
        $log.log('in init'); 
    }
    
    $scope.placeCity = function(){
        $log.log('in place city');
    };
    
    var map;
    $scope.initMap = function() {
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
    }
    
}]);