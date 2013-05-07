'use strict';

angular.module('publicApp')
    .factory('filters', function($resource, $rootScope) {
    var filterResource = $resource('/filters');
    var syncFilters = {
        user: false,
        entity: false
    }
    var filters = {
        filters: [],
        idFilter: undefined
    };

    var getFilter = function(entity, cb) {
        var array;
        filters.filters = [];
        filterResource.query({
            entity: entity,
        }, function(data) {
            if (data.length !== 0) {
                array = JSON.parse(data[0].filter);
                array.forEach(function(el, index) {
                    filters.filters.push(el);
                });
                filters.idFilter = data[0].id;
                if (typeof cb === 'function') {
                    cb(filters);
                }
            }
            syncFilters[entity] = true;
        }, function(data) {

        });

        return filters;
    };

    var putFilter = function(idFilter, entity, filter) {

        if (filter) {
            filters[entity] = filter;
        }
        idFilter = idFilter ? idFilter : 'null';
        filterResource.save({
            idFilter: idFilter,
            filter: filter,
            entity: entity
        }, function(response) {
            if (response.success === 'no') {
                alert('error savingt filer');
            }
        });

    };
    // Public API here
    return {
        getFilter: getFilter,
        putFilter: putFilter
    };
});