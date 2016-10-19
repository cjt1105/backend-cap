angular.module('streamBuddies')
.controller('UserAccountCtrl', function($scope, $routeParams) {
    console.log(`/api/user/account/${$routeParams.id}`)
    axios.get(`/api/user/account`)
    .then(account => console.log(account))
})