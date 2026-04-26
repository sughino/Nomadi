$('.search-bar-form').append(`
    <div class="place-input-container">
        <input type="text" id="place" required/>
        <span><h4>where do you want to go?</h4></span>
        <div class="input-suggestion-container"></div>
    </div>

    <div class="date-input-container">
        <input type="date" id="start-trip" required/> <span><p>from</p></span>
        <input type="date" id="end-trip" required/> <span><p>to</p></span>
    </div>

    <div class="person-input-container">
        <button id="person"><p><span id="adults-span">1</span> adults - <span id="children-span">0</span> children - <span id="rooms-span">1</span> rooms</p><i class="bi bi-chevron-down"></i></button>

        <div class="person-select-container person-select-container-close">
            <div class="person-select-option">
                <h4>adults</h4>
                <div class="count-option-container">
                    <button id="adults-decrement-button" class="not-allowed" onclick="decrement('adults', 1)"><i class="bi bi-dash"></i></button>
                    <input type="number" value="1" id="adults" readonly/>
                    <button id="adults-increment-button" onclick="increment('adults')"><i class="bi bi-plus"></i></button>
                </div>
            </div>
            <hr>
            <div class="person-select-option">
                <h4>children</h4>
                <div class="count-option-container">
                    <button id="children-decrement-button" class="not-allowed" onclick="decrement('children', 0)"><i class="bi bi-dash"></i></button>
                    <input type="number" value="0" id="children" readonly/>
                    <button id="children-increment-button" onclick="increment('children')"><i class="bi bi-plus"></i></button>
                </div>
            </div>
            <div class="children-age"></div>
            <hr>
            <div class="person-select-option">
                <h4>rooms</h4>
                <div class="count-option-container">
                    <button id="rooms-decrement-button" class="not-allowed" onclick="decrement('rooms', 1)"><i class="bi bi-dash"></i></button>
                    <input type="number" value="1" id="rooms" readonly/>
                    <button id="rooms-increment-button" onclick="increment('rooms')"><i class="bi bi-plus"></i></button>
                </div>
            </div>
        </div>
        
    </div>

    <button type="submit" id="search-button"><p>submit</p></button>
`);
//*preventDefault form button    
$('.person-input-container').on('click', 'button', function(event) {
    event.preventDefault();
});

//*place input
$('.place-input-container').find('span').click(function(event) {
    $('#place').focus();
});

const key = 'AIzaSyB53BPMK6J4o0lFVX5RJFB_TTsI7x3J8CM';
$('#place').on('input', function() {
    if ($(this).val() === '') {
        $('.place-input-container').find('span').show();
        $('.input-suggestion-container').empty();
    } else {
        $('.place-input-container').find('span').hide();
        var inputTerm = $(this).val();
        $.ajax({
            url: "",
            method: "GET",
            dataType: "json",
            data: {
                input: inputTerm,
                types: "locality",
                key: key
            },
            success: function(response) {
                var predictions = response.predictions;
                var resultList = $('.input-suggestion-container');
                resultList.empty();
                predictions.forEach(function(prediction, i) {
                    var structure = predictions[i].structured_formatting;
                    (predictions.length <= 3) ? resultList.css('height', 'fit-content') : resultList.css('height', '12.5rem');
                    resultList.append(`<div class="input-suggestion-result" data-locality="${structure.main_text}" onclick="localitySelected(this);"><i class="bi bi-geo icon-smaller"></i><div><h4>${structure.main_text}</h4><h6>${structure.secondary_text}</h6></div></div>`);
                    if (i < predictions.length-1) {resultList.append('<hr>');}
                });
            },
            error: function(error) {
                console.error(`error in requesting suggestions: ${error}`);
            }
        });
    }
});
function localitySelected(e) {
    $('#place').val($(e).data('locality'));
    $('.input-suggestion-container').empty();
}

//*start-end-trip date controll  
var todayDate = new Date();
$('#start-trip').on('change', function() {
    var startDate = new Date($(this).val());
    if (startDate < todayDate) {
        var day = ('0' + todayDate.getDate()).slice(-2);
        var month = ('0' + (todayDate.getMonth() + 1)).slice(-2);
        var year = todayDate.getFullYear();
        var todayDateString = year + '-' + month + '-' + day;
        $('#start-trip').val(todayDateString);
    }
    if ($('#end-trip').val() !== '') { 
        tomorrowDay();
    }
    $(this).val(formatDate(startDate));
});
$('#end-trip').on('change', function() {
    tomorrowDay();
});
function tomorrowDay() {
    var startDate = new Date($('#start-trip').val());
    var endDate = new Date($('#end-trip').val());
    if (endDate <= startDate) {
        var nextDay = new Date(startDate);
        nextDay.setDate(startDate.getDate() + 1);
        var day = ('0' + nextDay.getDate()).slice(-2);
        var month = ('0' + (nextDay.getMonth() + 1)).slice(-2);
        var year = nextDay.getFullYear();
        var nextDayString = year + '-' + month + '-' + day;
        $('#end-trip').val(nextDayString);
    }
}

//*person select open
$('#person').on('click', function() {
    setTimeout(function() {
        togglePerson();
    }, 1);
})
$(document).click(function(event) {
    if (!$(event.target).closest('.person-select-container').length && !$('.person-select-container').hasClass('person-select-container-close') && !$(event.target).closest('#person').length) {
        togglePerson();
    }
});
function togglePerson() {
    $('.person-select-container').toggleClass('person-select-container-close');
    $('#person').find('i').toggleClass('person-icon-close');
}

//*increment-decrement
function decrement(categories, min) {
    if (parseInt($(`#${categories}`).val()) > min){
        $(`#${categories}`).val(parseInt($(`#${categories}`).val()) - 1);
        $(`#${categories}-span`).text($(`#${categories}`).val());
        $(`#${categories}-increment-button`).removeClass(`not-allowed`);
        if (parseInt($(`#${categories}`).val()) === min) {
            $(`#${categories}-decrement-button`).addClass(`not-allowed`);
        }
    }
    if (categories === 'children') {
        $('.children-age-container:last').remove();
    }
}
function increment(categories) {
    if (parseInt($(`#${categories}`).val()) < 20) {
        $(`#${categories}`).val(parseInt($(`#${categories}`).val()) + 1);
        $(`#${categories}-span`).text($(`#${categories}`).val());
        $(`#${categories}-decrement-button`).removeClass(`not-allowed`);
        if (parseInt($(`#${categories}`).val()) === 20) {
            $(`#${categories}-increment-button`).addClass(`not-allowed`);
        }
    }
    if (categories === 'children') {
        childrenAge();
    }  
}

function childrenAge() {
    $('.children-age').append(`
    <div class="children-age-container">
        <h4>age of the child</h4>
        <select name="child-age">
            <option value="select" selected disabled>select</option>
            <option value="0">0 years</option>
            <option value="1">1 years</option>
            <option value="2">2 years</option>
            <option value="3">3 years</option>
            <option value="4">4 years</option>
            <option value="5">5 years</option>
            <option value="6">6 years</option>
            <option value="7">7 years</option>
            <option value="8">8 years</option>
            <option value="9">9 years</option>
            <option value="10">10 years</option>
            <option value="11">11 years</option>
            <option value="12">12 years</option>
            <option value="13">13 years</option>
            <option value="14">14 years</option>
            <option value="15">15 years</option>
            <option value="16">16 years</option>
            <option value="17">17 years</option>
        </select>
    </div>`);
}