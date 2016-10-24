angular.module('streamBuddies')
.controller('AccountInviteCtrl', function($scope, $http, $routeParams) {
    
    $http.get(`/api/accounts/invite/${$routeParams.id}`)
    .then(({data}) => {
        $scope.userAccount = data
    })

    $scope.sendInviteRequest = (id) => {
        const body = {
            toId: id,
            accountId: $routeParams.id
        }
        $http.post('/api/invites', body)
    }
})