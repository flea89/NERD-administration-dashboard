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
    var myScroll = new iScroll('scrollContainer', {
        bounceLock: true
    });
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    });
});