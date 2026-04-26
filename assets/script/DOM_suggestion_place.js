$.getJSON('assets/json/suggestion_data.json', function(response) {
  const data = response.data;
  let slideList = $('.slideshow-card-container');
  let currentSlideIndex = 0;

  function createCard(slideData, cardClass, slideId) {
    const cardHTML = `
      <div class="card ${cardClass}" id="${slideId}">
        <div class="card-img">
          <img src="${slideData.img}" alt="${slideData.city}">
        </div>
        <div class="card-content">
          <div class="card-content-title">
            <h1>${slideData.city}</h1>
            <i class="bi ${slideData.thermometer} icon-smaller"><span><h3>${slideData.temperature}</h3></span></i>
          </div>
          <div class="card-content-description">
            <h3>${slideData.description}</h3>
          </div>
        </div>
      </div>
    `;
    slideList.append(cardHTML);
  }

  createCard(data[data.length - 1], 'before-card', data.length);
  createCard(data[0], 'main-card', 1);
  createCard(data[1], 'after-card', 2);

  $('#next-button').click(function() {
    if (currentSlideIndex === data.length - 1) {
      currentSlideIndex = 0;
    } else {
      currentSlideIndex++;
    }
    updateSlides();
  });

  $('#previous-button').click(function() {
    if (currentSlideIndex === 0) {
      currentSlideIndex = data.length - 1;
    } else {
      currentSlideIndex--;
    }
    updateSlides();
  });

  function updateSlides() {
    const prevSlideId = currentSlideIndex === 0 ? data.length - 1 : currentSlideIndex - 1;
    const currentSlideId = currentSlideIndex;
    const nextSlideId = (currentSlideIndex + 1) % data.length;

    slideList.empty();

    createCard(data[prevSlideId], 'before-card', prevSlideId + 1);
    createCard(data[currentSlideId], 'main-card', currentSlideId + 1);
    createCard(data[nextSlideId], 'after-card', nextSlideId + 1);
  }
});

$(document).on('mouseenter', '.main-card', function() {
  $('.before-card').css({'transform': 'scale(.88)','opacity': '.5'});
  $('.after-card').css({'transform': 'scale(.88)','opacity': '.5'});
});
$(document).on('mouseleave', '.main-card', function() {
  $('.before-card').css({'transform': '','opacity': ''});
  $('.after-card').css({'transform': '','opacity': ''});
});

$(document).on('click', '.main-card', function() {
  $('#place').val($(this).find('.card-content-title').find('h1').text());
  $('.place-input-container').find('span').hide();
  $(window).scrollTop(0);
})