angular.module('streamBuddies')
.controller('AccountInviteCtrl', function($scope, $http, $routeParams) {
    
    new Clipboard('.clipboard-btn');

    $http.get(`/api/accounts/invite/${$routeParams.id}`)
    .then(({data}) => {
        console.log("data", data)
        $scope.userAccount = data
    })

    $scope.sendInviteRequest = (id, planId) => {
        const body = {
            toId: id,
            accountId: $routeParams.id,
            planId: planId
        }
        $http.post('/api/invites', body)
    }
})