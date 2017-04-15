angular.module('streamBuddies')
.controller('ProfileCtrl', function($scope, $rootScope, $mdDialog, $http, $window, $timeout) {

    $scope.user = null,
    $scope.userAccounts = null;
    $scope.contributors = []
    $scope.cardAdded = null
    const _scope = $scope

    $timeout(() => {
        axios.get('/api/user/accounts')
        .then(({data}) => {
            data.forEach((item) => {
                item.contributors.forEach((_item) => {
                _item.contribution = ((item.price/item.users).toFixed(2))
                })
            })
            $scope.userAccounts = data
            console.log(data)
            })
            .then(() => {
                axios.get('/api/subscriptions')
                .then(({data}) => {
                    console.log(data.contributors)
                    data.forEach((item) => {
                        item.contributors.forEach((_item) => {
                            _item.contribution = ((item.price/item.users).toFixed(2))
                        })
                    })
                    $scope.userSubscriptions = data
                    console.log("yoooooo",$scope.userSubscriptions)

                })
                .then(() => {
                    axios.get('/api/user/info')
                    .then(({data})=> {
                        console.log(data)
                        $scope.user = data;
                        $scope.cardAdded = !data.card_added
                        console.log($scope.cardAdded)
                        $scope.$digest()
                    })
                })
            })
    }, 300)




    function DialogController($scope, $mdDialog, $http) {
        $scope.number = 4000056655665556
        $scope.account = { name: null, price: null}
        ///populate account options for select tag
        $scope.accountInfo = ""
        axios.get('/accounts/populate')
        .then(({ data }) => {
            $scope.accountInfo = data
        })
        .then(() => console.log($scope.accountInfo))

        $scope.closeDialog = function() {
            $mdDialog.hide();

        }

        $scope.createAccount = () => {
            const account = {
                name: $scope.account.name,
                email: $scope.email,
                password: $scope.password,
                price: $scope.account.price,
                canAccess: [],
                users: 1,
            }

            axios.post('/accounts/add', account)
            .then(() => {
                axios.get('/api/user/accounts')
                .then(({data}) => {
                    _scope.userAccounts = []
                    _scope.userAccounts = data
                    _scope.$apply();
                    console.log(_scope.userAccounts)
                    $mdDialog.hide();
                })
            })
        }

          $scope.submit = () => {

              const cardDetails = {
                  number: $scope.number,
                  cvc: $scope.cvc,
                  exp_month: $scope.exp_month,
                  exp_year: $scope.exp_year,
                  address_city: $scope.city,
                  address_country: $scope.country,
                  currency: 'usd'
              }
              Stripe.card.createToken(cardDetails, (status, response) => {
                    if (response.error) { // Problem!
                        console.log(response.error)
                    }
                    else {
                        $('#add-account-button').prop('disabled', false)
                        $mdDialog.hide();
                        Stripe.createToken(cardDetails, (stat, res) => {
                            const user = {
                            external_account: response.id,
                            ///store token ad tos_date short term to get it to server
                            tos_acceptance: {date: res.id},
                            managed: true,
                            legal_entity: {
                                first_name: $scope.firstName,
                                last_name: $scope.lastName,
                                type: 'individual',
                                address: {
                                    city: $scope.city,
                                    country: $scope.country,
                                    line1: $scope.address,
                                    postal_code: $scope.zip
                                },
                                dob: {
                                    day: $scope.birthDay,
                                    month: $scope.birthMonth,
                                    year: $scope.birthYear
                                }
                            }
                        }
                            axios.post('/api/stripe/createUser', user)
                        })
                    }
              })
           }
}

$scope.newAccount = (ev) => {
     var parentEl = angular.element(document.body);
    $mdDialog.show({
        parent: parentEl,
        targetEvent: ev,
        templateUrl: '../partials/new.account.modal.html' ,

           controller: DialogController
    })
}




    $scope.showPrompt = function(ev) {

        var parentEl = angular.element(document.body);
       $mdDialog.show({
         parent: parentEl,
         targetEvent: ev,
         template:
            '<md-dialog aria-label="List dialog">' +
            '  <md-dialog-content>'+
            '<md-tab>'+
            '<md-tab-label>My Tab content</md-tab-label>'+
            '</md-tab>'+
            '<div class="container"'+
            '<form method="POST" ng-model="cardForm">'+
                '  <md-input-container>'+
                    '<label>Card Number</label>'+
                    '<input data-stripe="number" ng-model="number">'+
                '  </md-input-container>'+
                '  <md-input-container>'+
                    '<label>Expiration Month</label>'+
                    '<input data-stripe="exp_month" ng-model="exp_month">'+
                '  </md-input-container>'+
                '  <md-input-container>'+
                    '<label>Expiration Year</label>'+
                    '<input data-stripe="exp_year" ng-model="exp_year">'+
                '  </md-input-container>'+
                '  <md-input-container>'+
                    '<label>CVC</label>'+
                    '<input data-stripe="cvc" ng-model="cvc">'+
                 '  </md-input-container>'+
                 '  <md-input-container>'+
                    '<label>First name</label>'+
                    '<input ng-model="firstName">'+
                 '  </md-input-container>'+
                  '  <md-input-container>'+
                    '<label>Last name</label>'+
                    '<input ng-model="lastName">'+
                 '  </md-input-container>'+
                 '  <md-input-container>'+
                    '<label>Country</label>'+
                    '<input ng-model="country">'+
                 '  </md-input-container>'+
                 '  <md-input-container>'+
                    '<label>Address</label>'+
                    '<input ng-model="address">'+
                 '  </md-input-container>'+
                 '  <md-input-container>'+
                    '<label>Zip Code</label>'+
                    '<input ng-model="zip">'+
                 '  </md-input-container>'+
                 '  <md-input-container>'+
                    '<label>City</label>'+
                    '<input ng-model="city">'+
                 '  </md-input-container>'+
                 '  <md-input-container>'+
                    '<label>Birth Day</label>'+
                    '<input ng-model="birthDay">'+
                 '  </md-input-container>'+
                 '  <md-input-container>'+
                    '<label>Birth Month</label>'+
                    '<input ng-model="birthMonth">'+
                 '  </md-input-container>'+
                 '  <md-input-container>'+
                    '<label>Birth Year</label>'+
                    '<input ng-model="birthYear">'+
                 '  </md-input-container>'+
            '</form>'+
            '</div>'+
             '  </md-dialog-content>' +
           '  <md-dialog-actions>' +
           '    <div id="stripe-agreement">By submitting, you agree to our <a>Service Agreement</a> and the <a href="https://stripe.com/us/legal/">Stripe Connected Account Agreement</a></div>'+
           '    <md-button ng-click="submit()" class="md-primary">' +
           '      Submit' +
           '    </md-button>' +
           '    <md-button ng-click="closeDialog()" class="md-primary">' +
           '      Close Dialog' +
           '    </md-button>' +
           '  </md-dialog-actions>' +
           '</md-dialog>',

         controller: DialogController
      });

  };

})