//*check for the user gui or the travels
var myTravels = localStorage.getItem('myTravels');
if (myTravels) {
    $('#myTravels').prop('checked', true);
    localStorage.removeItem('myTravels');
    domTravels();
} else {
    $('#myAccount').prop('checked', true);
    domAccount();
}
$('input[name="menuReserved"]').change(function() {
    if ($(this).val() === 'myAccount') {
        domAccount();
    } else if ($(this).val() === 'myTravels') {
        domTravels();
    }
});

//*DOM of the page
function domAccount() {
    $('article').empty();
    $('article').append(`
        <div class='aricle-container'>
            <div class="title-account">
                <i class="bi bi-person-circle big-icon"></i>
                <h1 class="username"></h1>
            </div>

            <form class="content-account" autocomplete="off">
                <div class="login-input">
                    <label for="name"><h4>Name</h4></label>
                    <input type="name" name="name" id="name" minlength="3" maxlength="30" pattern="^[a-zA-Z]+$" required disabled>
                </div>
                <div class="login-input">
                    <label for="surname"><h4>Surname</h4></label>
                    <input type="name" name="surname" id="surname" minlength="3" maxlength="30" pattern="^[a-zA-Z]+$" required disabled>
                </div>
                <div class="login-input">
                    <label for="email"><h4>E-mail</h4></label>
                    <input type="email" name="email" id="email" required disabled>
                </div>
                <div class="login-input">
                    <label for="psw"><h4>Password</h4></label>
                    <input type="password" name="psw" id="psw" minlength="8" maxlength="15" required disabled>
                    <i class="bi bi-eye-slash icon-smaller" id="show-psw"></i>
                </div>
                <button type="submit" id="done"><h4>Done</h4><i class="bi bi-check icon-smaller"></i></button>
            </form>

            <div class="button-account-container">
                <button type="button" onclick="modify()"><h4>Modify</h4><i class="bi bi-pencil icon-smaller"></i></button>
                <button type="button" onclick="deleteAccount()" class="delete"><h4>Delete account</h4><i class="bi bi-trash icon-smaller"></i></button>
            </div>
        </div>
    `);
    getData();
}
function domTravels() {
    $('article').empty();
    $('article').append(`
        <div class='aricle-container'>
            <div class="title-account">
                <i class="bi bi-luggage big-icon"></i>
                <h1>My travels</h1>
                <h5>(click the hotel booked to see the etinerary)</h5>
            </div>
            <div class="travels-content"></div>
        </div>
    `);
    getTravels();
}

//*get data of the user
function getData() {
    $.ajax({
        url: `assets/server/pickUserData.php`,
        method: "POST",
        dataType: "json",
        success: function(response) {
            checkLog();
            $('#name').val(response.name);
            $('#surname').val(response.surname);
            $('#email').val(response.email);
            $('#psw').val(response.password);
        }
    });  
}
function getTravels() {
    $.ajax({
        url: `assets/server/pickUserTravels.php`,
        method: "POST",
        dataType: "json",
        success: function(hotels) {
            hotels.forEach(function(hotel, i) {
                $('.travels-content').append(`
                    <div class="trip-container">
                        <div class="trip-photo">
                            <img src="${hotel.hotel_photo}">
                        </div>
                        <div class="trip-content">
                            <div class="place-info">
                                <h1 class="hotel">${hotel.hotel}</h1>
                                <h2 class="location">${hotel.location}</h2>
                            </div>
                            <div class="start-end">
                                <h3>Check in: ${hotel.start_date}</h3>
                                <h3>Check out: ${hotel.end_date}</h3>
                            </div>
                            <div class="people-trip">
                                <h3>${hotel.people}</h3>
                                <button id="deleteTrip" data-id="${hotel.id}"><i class="bi bi-trash icon-smaller"></i></button>
                            </div>
                        </div>
                    </div>
                `);
            })
        }, error: function(error) {
            console.error(`error in requesting suggestions: ${error}`);
            $('.travels-content').append(`<div class="no-result"><h1>No hotel booked</h1><h5>(click to search for a hotel)</h5></div>`);
        }
    });  
}

//*modify the user information
function modify() {
    $('.content-account input').prop('disabled', false);
    $('#email').prop('disabled', true)
    $('#name').focus();
    $('.button-account-container').hide();
    $('#done').css('display', 'flex');
}
$('.content-account').on('submit', function(event) {
    event.preventDefault();
    $.ajax({
        url: `assets/server/modify.php`,
        method: "POST",
        data: {
            name: $('#name').val(),
            surname: $('#surname').val(),
            psw: $('#psw').val()
        },
        success: function() {
            getData();
            $('.content-account input').prop('disabled', true);
            $('.button-account-container').css('display', 'flex');
            $('#done').hide();
        }
    });
})

//*return to index
function home() {
    window.location.replace("index.html");
};
$(document).on('click', '.no-result', function() {
    home();
})

//*delete the account
function deleteAccount() {
    $.ajax({
        url: `assets/server/delete.php`,
        method: "POST",
        success: function() {
            home();
        }
    });
}

//*details settings
var openDetails = 0;
$(document).on('click', 'details', function() {
    if (openDetails % 2 == 0) {
       $('.arrow').css('transform', 'rotate(90deg)'); 
    } else {
        $('.arrow').css('transform', '');
    }
    openDetails++
});

//*delete travels
$(document).on('click', '#deleteTrip', function() {
    deleting = true;
    console.log('funziono');
    $.ajax({
        url: `assets/server/removeTrip.php`,
        method: "POST",
        data: {
            id : $(this).data('id')
        },
        success: function() {
            domTravels();
            deleting = false;
        }
    });
})

//*open modal
var hours = {
    0: '9:00 AM',
    1: '10:00 AM',
    2: '12:00 PM',
    3: '3:00 PM',
    4: '5:00 PM'
};
var deleting = false;
$(document).on('click', '.trip-container', function(event) {
    if (!deleting) {
        openModalLogin();
        $('.modal-container').empty();
        $('.modal-container').append(`
            <h2>monuments to see in</h2>
            <h1 class="location">${$(this).find('.location').text()}</h1>
            <h5>(click on the monument for more information)</h5>
            <i class="bi bi-x icon" id="close-modal"></i>
        `);
        var apiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?key=AIzaSyC-cr4WB040peE5Flybbv7RXfx33wYfzBo&query=tourist+attractions+near+${$(this).find('.location').text()}&language=en`;
        $.ajax({
            url: apiUrl,
            dataType: "json",
            success: function(data) {
                console.log(data);
                var result = data.results;
                for (var i = 0; i < 5; i++) {
                    $('.modal-container').append(`
                        <div class="monument-container">
                            <div class="hour">
                                <i class="bi bi-clock icon-smaller"></i>
                                <h3>${hours[i]}</h3>
                            </div>
                            <h3 class="monument-title">${result[i].name}</h3>
                        </div>`);
                    if (i < 4) {
                        $('.modal-container').append(`<hr>`);
                    } 
                }
            },
            error: function(error) {
                console.error(`error in requesting suggestions: ${error}`);
                $('.modal-container').append(`
                    <div class="monument-container">
                        <h3 class="error">error in etinerary search</h3>
                    </div>`);
            }
        });
    }
})

//*open google page
$(document).on('click', '.monument-container', function() {
    window.open(`https://www.google.com/search?q=${$(this).find('.monument-title').text()}`, "_blank");
})