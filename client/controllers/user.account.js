angular.module('streamBuddies')
.controller('UserAccountCtrl', function($scope, $routeParams) {
    
    axios.get(`/api/user/accounts/${$routeParams.id}`)
    .then(account => {

    })

    $scope.share = () => {
//                 var url = `https://www.facebook.com/dialog/feed?app_id=975145692596976&name="check out my netflix"&display=popup&amp;caption=check it&description=join streambuddies&link=http://localhost:3000/&redirect_uri=http://localhost:3000/
// &picture=http://coolwildlife.com/wp-content/uploads/galleries/post-3004/Fox%20Picture%20003.jpg`

// let url = `https://www.facebook/dialog/feed?app_id=975145692596976&redirect_uri=http://localhost:3000/`

let url = `https://www.facebook.com/dialog/feed?
app_id=975145692596976
&redirect_uri=http://localhost:3000
&link=http://localhost:3000`

        window.open(url, '_blank');
    }
})