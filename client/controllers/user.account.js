angular.module('streamBuddies')
.controller('UserAccountCtrl', function($scope, $routeParams, $location) {
    $scope.message = 'Sorry, you cant access this account. Redirecting to invite page'
    $scope.ownsAccount = false

    axios.get(`/api/user/accounts/${$routeParams.id}`)
    .then(({data}) => {
        $scope.myAccount = data;
        $scope.$apply()
        if(data.message === null){
            setTimeout(function() {
                console.log('fuck')
                $location.url(`/`)
            }, 2000);
        }
    })


    $scope.share = () => {
//                 var url = `https://www.facebook.com/dialog/feed?app_id=975145692596976&name="check out my netflix"&display=popup&amp;caption=check it&description=join streambuddies&link=http://localhost:3000/&redirect_uri=http://localhost:3000/
// &picture=http://coolwildlife.com/wp-content/uploads/galleries/post-3004/Fox%20Picture%20003.jpg`

// let url = `https://www.facebook/dialog/feed?app_id=975145692596976&redirect_uri=http://localhost:3000/`

let url = `https://www.facebook.com/dialog/feed?
app_id=975145692596976
&redirect_uri=https://still-ocean-92666.herokuapp.com/
&link=https://still-ocean-92666.herokuapp.com/
&picture=https://lh4.googleusercontent.com/BbqN8GpAephpCNwTBuB8SiFTPT1zFccYyuPd4qRRQRTQPXU5d4F1wuVWfEJh3L4RL3wIKc6BeQ=s640-h400-e365
&caption=Join%20my%20Netflix%20account
&description=Checkout%20the%20description
&actions={name:"streambuddies",link:"https://still-ocean-92666.herokuapp.com/"}`

        window.open(url, '_blank');
    }
})