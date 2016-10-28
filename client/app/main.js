angular.module('streamBuddies', ['ngRoute','ngMaterial'])
.config(($routeProvider, $locationProvider) => {

    Stripe.setPublishableKey('pk_test_P7IISvg1rGVep3YH7nihAvka');

    $routeProvider
      .when('/', {
        controller: 'MainCtrl',
        templateUrl: 'partials/main.html',
      })
      .when('/login', {
        controller: 'MainCtrl',
        templateUrl: 'partials/login.html',
      })
      .when('/profile', {
        controller: 'ProfileCtrl',
        templateUrl: 'partials/profile.html',
      })
      .when('/auth/facebook/callback', {
        controller: 'MainCtrl',
        templateUrl: 'partials/login.redirect.html'
      })
       .when('/accounts/add', {
        controller: 'NewAccountCtrl',
        templateUrl: 'partials/new.account.html'
      })
       .when('/user/accounts/:id', {
        controller: 'UserAccountCtrl',
        templateUrl: 'partials/user.account.html'
      })
       .when('/user/accounts/invite/:id', {
         controller: 'AccountInviteCtrl',
         templateUrl: 'partials/account.invite.html'
       })
        .when('/invites', {
         controller: 'InviteRequestsCtrl',
         templateUrl: 'partials/invite.requests.html'
       })


})