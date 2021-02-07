function showLoader() {
    document.getElementById('loader').classList.add("active");
}

function hideLoader() {
    document.getElementById('loader').classList.remove("active");
}


document.getElementById('logout').addEventListener('click', function (e) {
    firebase.auth().signOut().then(function () {
        window.location.href = 'login';
    }, function (error) {
        $('body')
            .toast({
                message: "Error trying to log out. Please refresh the page.",
                class: 'red',  //cycle through all colors
                showProgress: 'bottom'
            });
    });
})