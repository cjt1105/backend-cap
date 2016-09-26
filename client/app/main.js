angular.module('streamBuddies', ['ngRoute'])
.config($routeProvider =>
    $routeProvider
      .when('/', {
        controller: 'MainCtrl',
        templateUrl: 'partials/main.html',
      })

)