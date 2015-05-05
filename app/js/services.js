'use strict';

/* Services */

var seasonFixtureServices = angular.module('seasonFixtureServices', ['ngResource']);

seasonFixtureServices.factory('SeasonFixture', ['$resource',
  function($resource){
    return $resource('http://api.football-data.org/alpha/soccerseasons/:soccerSeasonId/fixtures', {}, {
      query: {method:'GET',headers:{'X-Auth-Token':'8b6403cdb22b449c9a7d43e40e121ba3'},params:{soccerSeasonId:'362'}, isArray:false}
    });
  }]);
