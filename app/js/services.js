'use strict';

/* Services */

var seasonFixtureServices = angular.module('seasonFixtureServices', ['ngResource']);

seasonFixtureServices.factory('Seasons', ['$resource',
  function ($resource) {
        return $resource('http://api.football-data.org/alpha/soccerseasons', {}, {
            query: {
                method: 'GET',
                headers: {
                    'X-Auth-Token': '8b6403cdb22b449c9a7d43e40e121ba3'
                },
                isArray: true
            }
        });
  }]).factory('SeasonFixture', ['$resource',
  function ($resource) {
        return $resource('http://api.football-data.org/alpha/soccerseasons/:seasonId/fixtures', {}, {
            query: {
                method: 'GET',
                headers: {
                    'X-Auth-Token': '8b6403cdb22b449c9a7d43e40e121ba3'
                },
                isArray: false
            }
        });
  }]).factory('Fixture', ['$resource',
  function ($resource) {
        return $resource('http://api.football-data.org/alpha/fixtures/:fixtureId', {}, {
            query: {
                method: 'GET',
                headers: {
                    'X-Auth-Token': '8b6403cdb22b449c9a7d43e40e121ba3'
                },
                isArray: false
            }
        });
  }]);

var payMyBeerServices = angular.module('payMyBeerServices', ['ngResource']);

payMyBeerServices.factory('BusinessServiceList', ['$resource',
  function ($resource) {
        return $resource('json/business.json', {}, {
            query: {
                method: 'GET',
                isArray: true
            }
        });
  }]).factory('BusinessService', ['$resource',
  function ($resource) {
        return $resource('json/business/:businessName.json', {}, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
  }]);

var authServices = angular.module('authorizationServices', ['ngResource']);

authServices.factory('authorizationService', ['$q', '$rootScope', '$location', 'Facebook', function ($q, $rootScope, $location, Facebook) {
    return {

        permissionModel: {
            permission: {},
            isPermissionLoaded: false
        },

        permissionCheck: function () {

            // we will return a promise .
            var deferred = $q.defer();

            //this is just to keep a pointer to parent scope from within promise scope.
            var parentPointer = this;

            deferred.promise.then(
                Facebook.getLoginStatus(function (response) {

                    if (response.status == 'connected') {
                        parentPointer.getPermission(true, deferred);

                    } else {
                        parentPointer.getPermission(false, deferred);
                    }

                }));

            return deferred.promise;
        },

        getPermission: function (isPermissionLoaded, deferred) {

            if (!isPermissionLoaded) {
                //If user does not have required access, 
                //we will route the user to unauthorized access page
                $location.path('/login');
                //As there could be some delay when location change event happens, 
                //we will keep a watch on $locationChangeSuccess event
                // and would resolve promise when this event occurs.
                $rootScope.$on('$locationChangeSuccess', function (next, current) {
                    deferred.resolve();
                });
            } else {
                deferred.resolve();
            }
        }
    };
}]);

var facebookServices = angular.module('facebookServices', ['ngResource']);

facebookServices.factory('facebookService', ['$resource', '$q', '$rootScope', '$location', 'Facebook', function ($resource, $q, $rootScope, $location, Facebook) {
    return {
        me: function () {
            // we will return a promise .
            var deferred = $q.defer();

            deferred.promise.then(Facebook.api('/me', function (response) {
                deferred.resolve(response);
            }));

            return deferred.promise;
        },
        friends: function () {
            // we will return a promise .
            var deferred = $q.defer();

            deferred.promise.then(Facebook.api('/me/taggable_friends', function (response) {
                deferred.resolve(response);
            }));

            return deferred.promise;
        }

    }
}]);