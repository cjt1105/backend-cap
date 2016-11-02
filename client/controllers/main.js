angular.module('streamBuddies')
.controller('MainCtrl', function($scope, $http, $window) {

$scope.login = () => {
    $window.open('/login/facebook/')
}
})