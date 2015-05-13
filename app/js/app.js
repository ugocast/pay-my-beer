'use strict';

/* App Module */

var seasonFixtureApp = angular.module('seasonFixtureApp', [
  'ngRoute',
  'facebook',
  'seasonFixtureAnimations',
  'seasonFixtureControllers',
  'seasonFixtureFilters',
  'seasonFixtureServices',
  'payMyBeerServices',
  'uiGmapgoogle-maps'
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
            controller: 'SeasonFixtureListCtrl'
        }).
        when('/fixtures/:fixtures', {
            templateUrl: 'partials/fixture-detail.html',
            controller: 'SeasonFixtureDetailCtrl'
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