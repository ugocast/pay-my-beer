'use strict';

/* App Module */

var seasonFixtureApp = angular.module('seasonFixtureApp', [
  'ngRoute',
  'seasonFixtureAnimations',
  'seasonFixtureControllers',
  'seasonFixtureFilters',
  'seasonFixtureServices'
]);

seasonFixtureApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/seasonFixtures', {
        templateUrl: 'partials/season-fixture-list.html',
        controller: 'SeasonFixtureListCtrl'
      }).
      /*when('/phones/:phoneId', {
        templateUrl: 'partials/phone-detail.html',
        controller: 'PhoneDetailCtrl'
      }).*/
      otherwise({
        redirectTo: '/seasonFixtures'
      });
  }]);
