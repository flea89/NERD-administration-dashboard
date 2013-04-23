'use strict';

google.setOnLoadCallback(function() {
    angular.bootstrap(document.body, ['publicApp', 'ngResource']);
});

google.load('visualization', '1', {
    packages: ['corechart', 'annotatedtimeline', 'geochart']
});


angular.module('publicApp', []).config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
    })
        .when('/fixedBar', {
        templateUrl: 'views/fixedBar.html',
        controller: 'FixedBarCtrl'
    })
        .otherwise({
        redirectTo: '/'
    });
}).run(function() {

    Array.prototype.max = function(propertyName) {
        if (this.length === 0) return 0;
        return Math.max.apply(Math, this.map(function(o) {
            return o[propertyName];
        }));
    };

    Array.prototype.min = function(propertyName) {
        if (this.length === 0) return 0;
        return Math.min.apply(Math, this.map(function(o) {
            return o[propertyName];
        }));
    };


    Array.prototype.getByProperty = function(propertyName, propertyValue) {
        if (this.length === 0) return null;
        var objFound = null;
        this.map(function(el, index) {
            if (el[propertyName] === propertyValue) {
                objFound = el;
            }
        });
        return objFound;
    };


    // var myScroll = new iScroll('scrollContainer', {
    //     bounceLock: true
    // });
    // document.addEventListener('touchmove', function(e) {
    //     e.preventDefault();
    // });
});