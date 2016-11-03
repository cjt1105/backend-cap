angular.module('streamBuddies')
.controller('InviteRequestsCtrl', function($scope, $rootScope, $http) {
   $http.get('/api/invites')
   .then(({data}) => {
       console.log(data)
       $scope.accessRequests = data
   })

   $scope.acceptRequest = (request) => {
       const updates = {
           userToAdd: request.fromId,
           accountId: request.accountId,
           senderName: request.fromName,
           picture: request.fromPicture,
           id: request._id
       }
       const subscriptionDetails = {
           senderId: request.fromId,
           planId: request.planId,
           senderName: request.fromName
       }
       $http.patch('/api/accounts/addUser', updates)
    //    $http.post('/api/accounts/subscribeUser', subscriptionDetails)
   }
})