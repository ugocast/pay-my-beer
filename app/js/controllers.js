'use strict';

/* Controllers */

var seasonFixtureControllers = angular.module('seasonFixtureControllers', []);

seasonFixtureControllers.controller('SeasonFixtureListCtrl', ['$scope', 'SeasonFixture',
  function($scope, SeasonFixture) {
   SeasonFixture.query(function(data) {
     $scope.fixtures = data.fixtures;  
  });
   $scope.items = [{'name':'TIMED'},{'name':'FINISHED'}];
    /*$scope.orderProp = 'age';*/
  }]);

/*phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone',
  function($scope, $routeParams, Phone) {
    $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
      $scope.mainImageUrl = phone.images[0];
    });

    $scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    }
  }]);*/
