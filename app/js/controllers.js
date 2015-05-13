'use strict';

/* Controllers */

var seasonFixtureControllers = angular.module('seasonFixtureControllers', []);

seasonFixtureControllers.controller('SeasonFixtureListCtrl', ['$scope', '$rootScope', 'SeasonFixture',
  function ($scope, $rootScope, seasonFixture) {
        seasonFixture.query(function (data) {
            $scope.fixtures = data.fixtures;
        });
        $scope.items = [{
            'name': 'TIMED'
        }, {
            'name': 'FINISHED'
        }];
        /*$scope.orderProp = 'age';*/
  }]);

seasonFixtureControllers.controller('SeasonFixtureDetailCtrl', ['$scope', '$rootScope', '$routeParams', 'Fixture', 'BusinessServiceList', 'BusinessService',

  function ($scope, $rootScope, $routeParams, fixture, businessServiceList, businessService) {

        $scope.businessList = businessServiceList.query();

        navigator.geolocation.getCurrentPosition(function (pos) {

                $scope.$apply(function () {
                    $scope.map = {
                        center: {
                            latitude: pos.coords.latitude,
                            longitude: pos.coords.longitude
                        },
                        zoom: 12,
                        bounds: {}
                    };

                    var createRandomMarker = function (i, bounds, idKey) {
                        var lat_min = bounds.southwest.latitude,
                            lat_range = bounds.northeast.latitude - lat_min,
                            lng_min = bounds.southwest.longitude,
                            lng_range = bounds.northeast.longitude - lng_min;

                        if (idKey == null) {
                            idKey = "id";
                        }

                        var latitude = lat_min + (Math.random() * lat_range);
                        var longitude = lng_min + (Math.random() * lng_range);
                        var ret = {
                            latitude: latitude,
                            longitude: longitude,
                            title: 'm' + i
                        };
                        ret[idKey] = i;
                        return ret;
                    };
                    $scope.randomMarkers = [];
                    // Get the bounds from the map once it's loaded
                    $scope.$watch(function () {
                        return $scope.map.bounds;
                    }, function (nv, ov) {
                        // Only need to regenerate once
                        if (!ov.southwest && nv.southwest) {
                            var markers = [];
                            for (var i = 0; i < 3; i++) {
                                markers.push(createRandomMarker(i, $scope.map.bounds))
                            }
                            $scope.randomMarkers = markers;
                        }
                    }, true);

                });


                $scope.events = {
                    events: {
                        click: function (marker, eventName, args) {
                            var lat = marker.getPosition().lat();
                            var lon = marker.getPosition().lng();

                            $scope.myLocation = 'Santiago';
                        }
                    }
                }

            },
            function (error) {
                alert('Unable to get location: ' + error.message);
            }
        );

        fixture.query({
            fixtureId: $routeParams.fixtures
        }, function (data) {
            $scope.fixture = data.fixture;
        });



        $scope.showBeer = function (myBusiness) {
            businessService.query({
                businessName: myBusiness.name
            }, function (data) {
                $scope.beerList = data.beers;
            });
        };

}]);

seasonFixtureControllers.controller('authenticationCtrl', [
    '$scope',
    '$rootScope',
    '$timeout',
    'Facebook',
    function ($scope, $rootScope, $timeout, Facebook) {

        // Define user empty data :/
        $rootScope.user = {};

        // Defining user logged status
        $rootScope.logged = false;

        // And some fancy flags to display messages upon user status change
        $scope.byebye = false;
        $scope.salutation = false;

        /**
         * Watch for Facebook to be ready.
         * There's also the event that could be used
         */
        $scope.$watch(
            function () {
                return Facebook.isReady();
            },
            function (newVal) {
                if (newVal)
                    $scope.facebookReady = true;
            }
        );

        var userIsConnected = false;

        Facebook.getLoginStatus(function (response) {
            if (response.status == 'connected') {
                userIsConnected = true;
                $scope.me();
                $rootScope.facebookReady = true;
                $rootScope.logged = true;
                $scope.salutation = true;
            }
        });

        /**
         * IntentLogin
         */
        $scope.IntentLogin = function () {
            if (!userIsConnected) {
                $scope.login();
            }
        };

        /**
         * Login
         */
        $scope.login = function () {
            Facebook.login(function (response) {
                if (response.status == 'connected') {
                    $rootScope.logged = true;
                    $scope.me();
                }

            });
        };

        /**
         * me
         */
        $scope.me = function () {
            Facebook.api('/me', function (response) {
                /**
                 * Using $scope.$apply since this happens outside angular framework.
                 */
                $scope.$apply(function () {
                    $rootScope.user = response;
                });

            });
        };

        /**
         * Logout
         */
        $scope.logout = function () {
            Facebook.logout(function () {
                $scope.$apply(function () {
                    $rootScope.user = {};
                    $rootScope.logged = false;
                });
            });
        }

        /**
         * Taking approach of Events :D
         */
        $scope.$on('Facebook:statusChange', function (ev, data) {
            console.log('Status: ', data);
            if (data.status == 'connected') {
                $scope.$apply(function () {
                    $scope.salutation = true;
                    $scope.byebye = false;
                });
            } else {
                $scope.$apply(function () {
                    $scope.salutation = false;
                    $scope.byebye = true;

                    // Dismiss byebye message after two seconds
                    $timeout(function () {
                        $scope.byebye = false;
                    }, 2000)
                });
            }


        });


    }
  ]);