'use strict';

/* Controllers */

var seasonFixtureControllers = angular.module('seasonFixtureControllers', []);

seasonFixtureControllers.controller('SeasonFixtureListCtrl', ['$scope', '$rootScope', 'SeasonFixture', 'facebookService',
  function ($scope, $rootScope, seasonFixture, facebookService) {
        seasonFixture.query(function (data) {
            $scope.fixtures = data.fixtures;
        });
        $scope.items = [{
            'name': 'TIMED'
        }, {
            'name': 'FINISHED'
        }];

        facebookService.me().then(function (response) {

            $scope.user = response;

        });

                }]);

seasonFixtureControllers.controller('SeasonFixtureDetailCtrl', ['$scope', '$rootScope', '$routeParams', 'Fixture', 'BusinessServiceList', 'BusinessService', 'facebookService',

  function ($scope, $rootScope, $routeParams, fixture, businessServiceList, businessService, facebookService) {

        facebookService.me().then(function (response) {

            $scope.user = response;

        });

        facebookService.friends().then(function (response) {

            $scope.friends = response.data;

        });

        $scope.businessList = businessServiceList.query();

        navigator.geolocation.getCurrentPosition(function (pos) {

                var prevMarker;

                $scope.$apply(function () {
                    $scope.map = {
                        center: {
                            latitude: pos.coords.latitude,
                            longitude: pos.coords.longitude
                        },
                        zoom: 16,
                        bounds: {}
                    };

                    var createRandomMarker = function (i, value, bounds, idKey) {

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
                            title: value.comercialName,
                            show: false,
                            value: value
                        };
                        ret.onClick = function () {
                            if (prevMarker) {
                                prevMarker.show = false;
                            }
                            ret.show = true;
                            prevMarker = ret;
                            $scope.myBusiness = ret.value;
                            $scope.showBeer($scope.myBusiness);


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
                            angular.forEach($scope.businessList, function (value, key) {
                                markers.push(createRandomMarker(key, value, $scope.map.bounds))
                            });
                            $scope.randomMarkers = markers;
                        }
                    }, true);

                });

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
    '$timeout',
    'Facebook',
    'facebookService',
    function ($scope, $timeout, Facebook, facebookService) {

        // Define user empty data :/
        $scope.user = {};

        // Defining user logged status
        $scope.logged = false;

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
                $scope.facebookReady = true;
                $scope.logged = true;
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
                    $scope.logged = true;
                    $scope.me();
                }

            }, {
                scope: 'user_friends'
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
                    $scope.user = response;
                });

            });
        };

        /**
         * Logout
         */
        $scope.logout = function () {
            Facebook.logout(function () {
                $scope.$apply(function () {
                    $scope.user = {};
                    $scope.logged = false;
                });
            });
        }
    }
  ]);