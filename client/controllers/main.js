angular.module('streamBuddies')
.controller('MainCtrl', function($scope, $http, $window) {
//  $http.get('/login/facebook')

$scope.login = () => {
    $window.open('/login/facebook/')
}
})