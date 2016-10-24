angular.module('streamBuddies')
.controller('InviteRequestsCtrl', function($scope, $rootScope, $http) {
   $http.get('/api/invites')
   .then(({data}) => {
       $scope.accessRequests = data
   })

   $scope.acceptRequest = (userId, accountId) => {
       const updates = {
           userToAdd: userId,
           accountId: accountId
       }
       $http.patch('/api/accounts/addUser', updates)
   }
})