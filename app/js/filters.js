'use strict';

/* Filters */

angular.module('seasonFixtureFilters', []).filter('checkmark', function () {
    return function (input) {
        return input ? '\u2713' : '\u2718';
    };
});