angular.module('streamBuddies')
.controller('NewAccountCtrl', function($scope) {
    
    $scope.account = { name: null, price: null}
    ///populate account options for select tag
    $scope.accountInfo = ""
    axios.get('/accounts/populate')
    .then(({ data }) => {
        $scope.accountInfo = data
        $scope.$apply()
    })
    .then(() => console.log($scope.accountInfo))

    /// post new account
    $scope.createAccount = () => {
        const account = {
            name: $scope.account.name,
            email: $scope.email,
            password: $scope.password,
            price: $scope.account.price,
            canAccess: [],
            users: 1
        }

        axios.post('accounts/add', account)
    }
})