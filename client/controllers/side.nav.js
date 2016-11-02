angular.module('streamBuddies')
.controller('SideNavCtrl', function($scope, $timeout, $mdSidenav, $http) {
   $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    $http.get('/loggedIn')
        .then((data) => {
            console.log(data)
            console.log("hi")
        })

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      }
    }
})