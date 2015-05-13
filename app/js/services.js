'use strict';

/* Services */

var seasonFixtureServices = angular.module('seasonFixtureServices', ['ngResource']);

seasonFixtureServices.factory('SeasonFixture', ['$resource',
  function ($resource) {
        return $resource('http://api.football-data.org/alpha/soccerseasons/:soccerSeasonId/fixtures', {}, {
            query: {
                method: 'GET',
                headers: {
                    'X-Auth-Token': '8b6403cdb22b449c9a7d43e40e121ba3'
                },
                params: {
                    soccerSeasonId: '362'
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