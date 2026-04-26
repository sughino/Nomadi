const key = '';

var place = localStorage.getItem('place');
var adults = localStorage.getItem('adults');
var children = localStorage.getItem('children');

var start = localStorage.getItem('start');
var end = localStorage.getItem('end');
var price = localStorage.getItem('price');
var hotel = localStorage.getItem('hotel');

//*search details for hotel
$.ajax({
    async: true,
	crossDomain: true,
	url: `https://booking-com.p.rapidapi.com/v2/hotels/details?currency=USD&locale=en-us&checkout_date=${end}&hotel_id=${hotel}&checkin_date=${start}`,
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '',
		'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
	},
    success: function(details) {
        $.ajax({
            async: true,
            crossDomain: true,
            url: `https://booking-com.p.rapidapi.com/v2/hotels/description?hotel_id=${hotel}&locale=en-us`,
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '',
                'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
            },
            success: function(description) {
                $.ajax({
                    async: true,
                    crossDomain: true,
                    url: `https://booking-com.p.rapidapi.com/v1/hotels/reviews?locale=en-us&sort_type=SORT_MOST_RELEVANT&hotel_id=${hotel}`,
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': '',
                        'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
                    },
                    success: function(reviews) {
                        $.ajax({
                            async: true,
                            crossDomain: true,
                            url: `https://booking-com.p.rapidapi.com/v1/hotels/photos?hotel_id=${hotel}&locale=en-us`,
                            method: 'GET',
                            headers: {
                                'X-RapidAPI-Key': '',
                                'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
                            },
                            success: function(photos) { 
                                $('.loader').css('display', 'none');
                                var hotelDetails = `
                                    <article>
                                        <div class="hotel-title">
                                            <h1>${details.hotel_name}</h1>
                                        </div>
                                    
                                        <div class="main-photo">
                                            <div class="benefits-container">
                                                <h2>Benefits</h2>
                                                <div class="benefits"></div>
                                                <div class="info-hotel">
                                                    <h5>${details.city}</h5>
                                                    <h5>${details.timezone}</h5>
                                                    <h5>${details.address}</h5>
                                                </div> 
                                            </div>
                                            <div class="main-photo-container">
                                                <img src="${photos[0].url_max}">
                                            </div>
                                        </div>
                                    
                                        <div class="photo-scroller">
                                            <div class="photo-button-wrapper">
                                                <button type="button" id="prev"><i class="bi bi-chevron-compact-left icon"></i></button>
                                            </div>
                                            <div class="other-photo-container"></div>
                                            <div class="photo-button-wrapper">
                                                <button type="button" id="next"><i class="bi bi-chevron-compact-right icon"></i></button>
                                            </div>
                                        </div>
                                    
                                    </article>
                                    <article>
                                    
                                        <div class="hotel-content">
                                            <div class="description-container">
                                                ${details.district ? '<h3 class="district">' + details.district +'</h3>' : ''}
                                                <h3 class="hotel-description">${description.description}</h3>
                                                <h3 class="lan-spoken"></h3>
                                            </div>
                                            <div class="comment-wrapper">
                                                <h3>Reviews:</h3>
                                                <div class="comment-container"></div>
                                            </div>
                                        </div>
                                    
                                        <div class="price-container">
                                            <div class="price-title"><h2>${price}</h2></div>
                                            <button id="price-button"><h2>Book it</h2></button>
                                        </div>
                                    </article>`;

                                //*benefits
                                $('main').append(hotelDetails);
                                var benefits = details.top_ufi_benefits;
                                benefits.forEach(function(benefit, i) {
                                    var icon = benefitsIcon(benefit.icon);
                                    $('main').find('.benefits').append(`<span class="benefit"><i class="bi ${icon} icon-smaller"></i><h3>${benefit.translated_name}</h3></span>`);
                                })

                                //*language spoken
                                var spokenLanTxt = "Spoken languages: "
                                var spokenLan = details.spoken_languages;
                                spokenLan.forEach(function(lan, i) {
                                    spokenLanTxt += `${lan}${i === spokenLan.length - 1 ? '' : ', '}`;
                                });
                                $('main').find('.lan-spoken').append(spokenLanTxt);

                                //*comments
                                var comments = reviews.result;
                                comments.forEach(function(comment, i) {
                                    $('main').find('.comment-container').append(`
                                    <div class="comment">
                                        <div class="comment-title">
                                            <h3>${comment.author.name}</h3>
                                            <h6>${comment.date}</h6>
                                            <hr>
                                        </div>
                                        <div class="comment-content">
                                            <div class="pros-and-cons"><h3>pros:</h3><br><h4>${comment.pros ? comment.pros : 'none'}</h4></div>
                                            <div class="pros-and-cons"><h3>cons:</h3><br><h4>${comment.cons ? comment.cons : 'none'}</h4></div>
                                        </div>
                                    </div>`);
                                })
                                //*photos
                                photos.forEach(function(photo, i) {
                                    $('main').find('.other-photo-container').append(`<div class="photo ${i === 0 ? 'selected-photo' : ''}"><img src="${photo.url_max}"></div>`);
                                })
                            },
                            error: function(error) {
                                console.error(`error in requesting suggestions: ${error}`);
                                $('.loader').css('display', 'none');
                                $('main').append(`
                                    <div class="hotel-error" style="--delay: .1s">
                                        <h1>Error in hotel photos search</h1>
                                    </div>`);
                            }
                        });
                    },
                    error: function(error) {
                        console.error(`error in requesting suggestions: ${error}`);
                        $('.loader').css('display', 'none');
                        $('main').append(`
                            <div class="hotel-error" style="--delay: .1s">
                                <h1>Error in hotel reviews search</h1>
                            </div>`);
                    }
                });
            },
            error: function(error) {
                console.error(`error in requesting suggestions: ${error}`);
                $('.loader').css('display', 'none');
                $('main').append(`
                    <div class="hotel-error" style="--delay: .1s">
                        <h1>Error in hotel description search</h1>
                    </div>`);
            }
        });
    },
    error: function(error) {
        console.error(`error in requesting suggestions: ${error}`);
        $('.loader').css('display', 'none');
        $('main').append(`
            <div class="hotel-error" style="--delay: .1s">
                <h1>Error in hotel details search</h1>
            </div>`);
    }
});

//*photos settings
$(document).on("click", ".photo", function() {
    $('.main-photo-container').find('img').attr('src', $(this).find('img').attr('src'));
    $('.other-photo-container').children().removeClass('selected-photo');
    $(this).addClass('selected-photo');
})

$(document).on("click", "#next", function() {
    const photocontainer = $('.other-photo-container');
    photocontainer.scrollLeft(photocontainer.scrollLeft() + 1000);
});

$(document).on("click", "#prev", function() {
    const photocontainer = $('.other-photo-container');
    photocontainer.scrollLeft(photocontainer.scrollLeft() - 1000);
});

//*icon adjust
function benefitsIcon(benefit) {
    switch (benefit) {
        case 'spa':
            return 'bi-droplet';
        case 'parking_sign':
            return 'bi-p-circle';
        case 'wifi':
            return 'bi-wifi';
        case 'shuttle':
            return 'bi-bus-front';
        case 'bar':
            return 'bi-cup-straw';
        case 'fitness':
            return 'bi-dribbble';
        case 'nosmoking':
            return 'bi-ban';
        case 'snowflake':
            return 'bi-thermometer-snow';
        case 'garden':
            return 'bi-tree';
        case 'elevator':
            return 'bi-box-arrow-down';
        case 'pawprint':
            return 'bi-emoji-heart-eyes';
        case 'food_and_drink':
            return 'bi-egg-fried';
        case 'family':
            return 'bi-people';
        case 'heater':
            return 'bi-thermometer-sun';
        case 'cabin_trolley':
            return 'bi-suitcase2'
        case 'washer':
            return 'bi-water'
        case 'bath':
            return 'bi-badge-wc'
        default:
            return 'bi-question';
    }
}

//*save hotel
$(document).on('click', '#price-button', function() {
    if ($('.username').text() !== 'login') {
        $.ajax({
            url: `assets/server/insertHotel.php`,
            method: "POST",
            data: {
                hotel: $('.hotel-title').find('h1').text(),
                place: place,
                start: start,
                end: end,
                people: `${adults} adults and ${children} children`,
                photo: $('.other-photo-container').find('.photo:first').find('img').attr('src')
            },
            success: function() {
                localStorage.setItem('myTravels', true);
                window.location.replace("reservedArea.html");
            }
        });
    } else {
        openModalLogin();
    }
})