angular.module('streamBuddies')
.controller('ProfileCtrl', function($scope, $rootScope) {
    $rootScope.user = null,
    $scope.userAccounts = null;
   axios.get('/api/user/accounts')
   .then(({data}) => console.log(data))
   axios.get('/api/user/info')
   .then(({data})=> {
       console.log(data)
       $rootScope.user = data;
       $scope.$apply()
   })
    axios.get('/me')
    .then(({data}) => {
        console.log(data.data)
    })
})