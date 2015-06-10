'use strict';

/* Controllers */

var seasonFixtureControllers = angular.module('seasonFixtureControllers', []);

seasonFixtureControllers.controller('SeasonFixtureListCtrl', ['$scope', '$rootScope', 'SeasonFixture', 'Seasons', 'facebookService',
  function ($scope, $rootScope, seasonFixture, Seasons, facebookService) {

        Seasons.query(function (data) {
            $scope.seasons = data;
        });

        $scope.items = [{
            'name': 'TIMED'
        }, {
            'name': 'FINISHED'
        }];

        facebookService.me().then(function (response) {

            $scope.user = response;

        });

        $scope.getFixtures = function (mySeason) {

            $scope.loading = true;

            seasonFixture.query({
                    seasonId: mySeason._links.fixtures.href.split('/')[5]
                },
                function (data) {
                    $scope.fixtures = data.fixtures;
                    $scope.loading = false;
                });
        };


                }]);

seasonFixtureControllers.controller('SeasonFixtureDetailCtrl', ['$scope', '$rootScope', '$routeParams', '$modal', 'Fixture', 'BusinessServiceList', 'BusinessService', 'facebookService',

  function ($scope, $rootScope, $routeParams, $modal, fixture, businessServiceList, businessService, facebookService) {


        $scope.items = ['item1', 'item2', 'item3'];

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

        $scope.openModalBeet = function (size) {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'partials/modals/makeBeet.html',
                controller: 'ModalBeetInstanceCtrl',
                size: size,
                resolve: {
                    price: function () {
                        return $scope.myBeer.price * $scope.numberOfBeer * 2;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {

            });
        };

                }]);

seasonFixtureControllers.controller('ModalBeetInstanceCtrl', function ($scope, $modalInstance, price) {

    $scope.price = price;

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.pay = function () {
        $scope.paid = true;
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

seasonFixtureControllers.controller('authenticationCtrl', [
    '$scope',
    '$timeout',
    'Facebook',
    'facebookService',
    '$routeParams',
    function ($scope, $timeout, Facebook, facebookService, $routeParams) {

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