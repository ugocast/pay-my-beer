'use strict';

/* App Module */

var seasonFixtureApp = angular.module('seasonFixtureApp', [
  'ngRoute',
  'facebook',
  'seasonFixtureControllers',
  'seasonFixtureFilters',
  'seasonFixtureServices',
  'payMyBeerServices',
  'authorizationServices',
  'facebookServices',
  'uiGmapgoogle-maps'
//   'ngMaterial'
]);

seasonFixtureApp.config(['$routeProvider',
  function ($routeProvider) {
        $routeProvider.
        when('/login', {
            templateUrl: 'partials/facebook.html',
            controller: 'authenticationCtrl'
        }).
        when('/soccerseasons', {
            templateUrl: 'partials/season-fixture-list.html',
            controller: 'SeasonFixtureListCtrl',
            resolve: { //Here we would use all the hardwork we have done 
                //above and make call to the authorization Service 
                //resolve is a great feature in angular, which ensures that a route 
                //controller (in this case superUserController ) is invoked for a route 
                //only after the promises mentioned under it are resolved.
                permission: function (authorizationService, $route) {
                    return authorizationService.permissionCheck();
                },
            }
        }).
        when('/fixtures/:fixtures', {
            templateUrl: 'partials/fixture-detail.html',
            controller: 'SeasonFixtureDetailCtrl',
            resolve: { //Here we would use all the hardwork we have done 
                //above and make call to the authorization Service 
                //resolve is a great feature in angular, which ensures that a route 
                //controller (in this case superUserController ) is invoked for a route 
                //only after the promises mentioned under it are resolved.
                permission: function (authorizationService, $route) {
                    return authorizationService.permissionCheck();
                },
            }
        }).
        otherwise({
            redirectTo: '/login'
        });
  }]).config(function (FacebookProvider) {
    // Set your appId through the setAppId method or
    // use the shortcut in the initialize method directly.
    FacebookProvider.init('803334449762938');
}).config(
    ['uiGmapGoogleMapApiProvider', function (GoogleMapApiProviders) {
        GoogleMapApiProviders.configure({
            china: true
        });
    }]
);