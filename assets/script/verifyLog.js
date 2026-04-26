//*current page
var currentPage = window.location.href;
var url = new URL(currentPage);
var pathname = url.pathname;
var fileName = pathname.substring(pathname.lastIndexOf('/') + 1);

//*verify logged
checkLog();
function checkLog() {
    $.ajax({
        url: `assets/server/check.php`,
        method: "POST",
        success: function(responseText) {
            $('.username').text(responseText);
        }, error: function() {
            if (fileName == 'reservedArea.html') {
                window.location.replace("index.html");
            }
        }
    });
}

//*logout
function logout() {
    $.ajax({
        url: `assets/server/logout.php`,
        method: "POST",
        success: function() {
            $('.username').text('login');
            if (fileName == 'reservedArea.html') {
                window.location.replace("index.html");
            }
        }
    });
}