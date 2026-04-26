//*take data and put in search bar
var place = localStorage.getItem('place');
var start = localStorage.getItem('start');
var end = localStorage.getItem('end');
var adults = localStorage.getItem('adults');
var children = localStorage.getItem('children');
var rooms = localStorage.getItem('rooms');

$('#place').val(place);
$('.place-input-container').find('span').hide();
$('#start-trip').val(start);
$('#end-trip').val(end);
$('#adults').val(adults);   
$('#adults-span').text(adults);
$('#children').val(children);   
$('#children-span').text(children);
$('#rooms').val(rooms); 
$('#rooms-span').text(rooms);

if (children > 0) {
    var childrenAges = localStorage.getItem('childrenAges');
    const ageValues = childrenAges.split(',');
    for (var i = 0; i < ageValues.length; i++) {
        childrenAge();
    }
    const selects = $("select[name='child-age']");
    selects.each((index, select) => {
    $(select).val(ageValues[index]);
    });
}

//*controll of the person value
const persons = {
    adults: {
        min: 1,
        class: 'adults'
    },
    children: {
        min: 0,
        class: 'children'
    },
    rooms: {
        min: 1,
        class: 'rooms'
    }
};
for (const person in persons) {
    const personData = persons[person];
    if ($(`#${personData.class}`).val() > personData.min) {
        $(`#${personData.class}-decrement-button`).removeClass('not-allowed');
    }
    if ($(`#${personData.class}`).val() == 20) { 
        $(`#${personData.class}-increment-button`).addClass('not-allowed');
    }
}


//*order check
var order = $('input[name="radioGroup"]:checked').val();
$("input[name='radioGroup']").change(function() {
    $('.loader').css('display', 'flex');
    order = $(this).val();
    search();
});

//*searching hotel
search();
function search() {
    $('.hotels-container').empty();
    $.ajax({
        async: true,
        crossDomain: true,
        url: `https://booking-com.p.rapidapi.com/v1/hotels/locations?name=${place}&locale=en-us`,
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '0062aea783mshc68ceef135c880ap15e630jsnfc9dd8af30d6',
            'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
        },
        success: function(location) {
            const hotelSearchUrl = (children > 0) ? `https://booking-com.p.rapidapi.com/v2/hotels/search?locale=en-us&filter_by_currency=USD&checkin_date=${start}&dest_type=city&dest_id=${location[0].dest_id}&adults_number=${adults}&checkout_date=${end}&order_by=${order}&room_number=${rooms}&units=metric&children_number=${children}&children_ages=${childrenAges}&include_adjacency=true` : `https://booking-com.p.rapidapi.com/v2/hotels/search?locale=en-us&filter_by_currency=USD&checkin_date=${start}&dest_type=city&dest_id=${location[0].dest_id}&adults_number=${adults}&checkout_date=${end}&order_by=${order}&room_number=${rooms}&units=metric&include_adjacency=true`;
            $.ajax({
                async: true,
                crossDomain: true,
                url: hotelSearchUrl,
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': '0062aea783mshc68ceef135c880ap15e630jsnfc9dd8af30d6',
                    'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
                },
                success: function(response) {
                    $('.search-container').addClass('search-container-animation');
                    $('.filters-container').addClass('filters-container-animation');
                    $('.loader').css('display', 'none');
                    var results = response.results;
                    results.forEach(function(result, i) {
                        var hotelData = result;
                        var additionals = hotelData.additionalLabels;             
                        var additionalHtml = '';
                        if (additionals && additionals.length > 0) {
                            additionals.forEach(function(additional) {
                                additionalHtml += `<p>${additional}</p>`;
                            });
                        }
                        var hotelContainer = `
                        <div class="hotel-container" id="${hotelData.id}" style="--delay: 2.${i}s">
                            <div class="hotel-img">
                                <img src="${hotelData.photoMainUrl}" alt="${hotelData.name}">
                            </div>
                            <div class="hotel-content">
                                <div class="hotel-title">
                                    <h1>${hotelData.name}</h1>    
                                    <div class="rating">
                                        <span><h3>${hotelData.reviewScoreWord}</h3><p>${hotelData.reviewCount} reviews</p></span>
                                        <div class="vote">
                                            <h3>${hotelData.reviewScore}</h3>
                                        </div>
                                    </div>
                                </div>
                                <div class="hotel-description">
                                    <hr>
                                    <div class="hotel-additional">
                                        <p>${hotelData.proposedAccommodation[0]}${hotelData.proposedAccommodation[1]}</p>
                                        ${additionalHtml}
                                    </div>
                                </div>
                                <div class="hotel-price">
                                    <h4>${hotelData.priceDetails.info}</h4>
                                    <h3 class="price">${hotelData.priceDetails.gross}</h3>
                                </div>
                            </div>
                        </div>`;
                        $('.hotels-container').append(hotelContainer);
                    });
                },
                error: function(error) {
                    console.error(`error in requesting suggestions: ${error}`);
                    $('.loader').css('display', 'none');
                    $('.hotels-container').append(`
                        <div class="hotel-container-error" style="--delay: .1s">
                            <h1>Error in hotel search</h1>
                        </div>`);
                }
            });
        },
        error: function(error) {
            console.error(`error in requesting suggestions: ${error}`);
            $('.loader').css('display', 'none');
            $('.hotels-container').append(`
                <div class="hotel-container-error" style="--delay: .1s">
                    <h1>Error in city search</h1>
                </div>`);
        }
    });
}

//*title page
document.title = `${place} • Nomadi`;

//*send data hotel
$(document).on("click", ".hotel-container", function() {
    localStorage.setItem('price', `${$(this).find('.hotel-price').find('h4').text()}: ${$(this).find('.hotel-price').find('.price').text()}`);
    localStorage.setItem('hotel', $(this).attr('id'));
    window.location.replace("hotelDetails.html");
});