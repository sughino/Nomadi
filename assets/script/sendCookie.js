$(document).on('submit', '.search-bar-form', function(event) {
    event.preventDefault();
    localStorage.setItem('place', $('#place').val());
    localStorage.setItem('start', $('#start-trip').val());
    localStorage.setItem('end', $('#end-trip').val());
    localStorage.setItem('adults', $('#adults').val());
    localStorage.setItem('children', $('#children').val());
    localStorage.setItem('rooms', $('#rooms').val());
    if ($('#children').val() > 0) {
        var childrenAges = "";
        $("select[name='child-age']").each(function(index, element) {
            var childAge = $(this).val();
            if (index !== $("select[name='child-age']").length - 1) {
                childrenAges += childAge + ",";
            } else {
                childrenAges += childAge;
            }
        });
        localStorage.setItem('childrenAges', childrenAges);
    }
    window.location.replace("hotelPage.html");
});