(function(){

    'use strict';

    /* Controllers */
    var app = angular.module('myApp', [
        'ui.router',
        'ngResource'
    ]);

    app.config(function($stateProvider, $urlRouterProvider){
        $stateProvider.state('hello', {
            url:         '/hello',
            templateUrl: '/hello.html',
            controller:  'HelloController'
        });
    });

    app.controller('myTestApp', function($scope) {
        $scope.list = [
            {
                'a': 'First 1.1',
                'b': 'Second 1.2'
            },
            {
                'a': 'First 2.1',
                'b': 'Second 2.2'
            },
            {
                'a': 'First 3.1',
                'b': 'Second 3.2'
            }
        ];
    });


    app.controller('HelloController', function($scope) {

    });

})();