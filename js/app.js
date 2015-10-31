'use strict';
/*global angular, google, $ */

var europeGameApp = angular.module('europeGameApp', []);

europeGameApp.controller('europeGameController', ['$scope', '$log', '$q', '$timeout', function ($scope, $log, $q, $timeout) {
    
    $scope.citiesPlaced = 0;
    $scope.kmLeft = 1500;
    $scope.cityToPlace = '';
    $scope.message = '';
    var selectedPosition = {},
        cityList = [
            {city: 'London', country: 'United Kingdom'},
            {city: 'Madrid', country: 'Spain'},
            {city: 'Berli', country: 'Germany'},
            {city: 'Bratislava', country: 'Slovakia'},
            {city: 'Paris', country: 'France'}
        ],
        keyMaps = 'AIzaSyAWC7jPno7JWv4ciZBFE2iq-ANpmaxHn68',
        keyGeoServer = 'AIzaSyB0-QtFkqYFWQpNJm2RfhcK6x3j0NYdJJw',
        map;
         
    $scope.placeCity = function () {
        $log.log('in place city');
    };
    
    $scope.computeDistanceBetween = function () {
        var pos,
            latLn1,
            latLn2 = new google.maps.LatLng(selectedPosition.lat, selectedPosition.lng),
            distance;
        
        for (pos in cityList) {
            if (cityList.hasOwnProperty(pos)) {
                $log.log('cityList[pos]', cityList[pos]);
                if (cityList[pos].city === $scope.cityToPlace) {
                    latLn1 = new google.maps.LatLng(cityList[pos].lat, cityList[pos].lng);
                    break;
                }
            }
        }
        $log.log('latLn2', latLn2);
        $log.log('latLn1', latLn1);
        distance = google.maps.geometry.spherical.computeDistanceBetween(latLn1, latLn2);
        $log.log('distance', distance);
        if (distance > 50) {
            $scope.message = 'Error, you missed by ' + distance + ' kilometers';
            $scope.kmLeft = $scope.kmLeft - distance;
        } else {
            $scope.message = 'Well done! That was within the 50km margin';
            $scope.citiesPlaced = $scope.citiesPlaced + 1;
        }
    };
    
    $scope.initMap = function () {
        
        $scope.cityToPlace = cityList[0].city;
        
        var myStyle = [{
            featureType: "all",
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
        }],
            i,
            address;

        map = new google.maps.Map(document.getElementById('map'), {
            mapTypeControlOptions: {
                mapTypeIds: ['mystyle', google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.TERRAIN]
            },
            center: new google.maps.LatLng(30, 0),
            zoom: 3,
            mapTypeId: 'mystyle'
        });

        map.mapTypes.set('mystyle', new google.maps.StyledMapType(myStyle, { name: 'My Style' }));

        map.addListener('click', function (e) {
            $log.log('in click e ', e);
            placeMarkerAndPanTo(e.latLng, map);
        });
        
        for (i = 0; i < cityList.length; i + 1) {
            address = cityList[i].city + ', ' + cityList[i].country;
            /*(function (pos) {
                $.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + keyGeoServer, function(data) {      
                    $log.log('geo data', data);
                    try {
                        cityList[pos].lat = data.results[0].geometry.location.lat;
                        cityList[pos].lng = data.results[0].geometry.location.lng;
                        $log.log('cityList -> ', cityList);
                    } catch (err) {
                        $log.log('error getting latitude and longitude', err);
                    }
                }); 
            })(i);*/
            getGeoPosition(address, i);
        }
    };

    function placeMarkerAndPanTo(latLng, map) {
        $log.log('in placeMarkerAndPanTo latLng ', latLng);
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
    
    function getGeoPosition(address, pos) {
        $.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + keyGeoServer, function (data) {
            $log.log('geo data', data);
            try {
                cityList[pos].lat = data.results[0].geometry.location.lat;
                cityList[pos].lng = data.results[0].geometry.location.lng;
                $log.log('cityList -> ', cityList);
            } catch (err) {
                $log.log('error getting latitude and longitude', err);
            }
        });
    }
    
}]);