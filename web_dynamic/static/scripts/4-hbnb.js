function appendPlace(data) {
  $('.places').empty();
  for (const place of data) {
    const html = `<article>
                <div class="title_box">
                  <h2>${place.name}</h2>
                  <div class="price_by_night">$${place.price_by_night}</div>
                </div>
                <div class="information">
                  <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                  <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                  <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
                </div>
                <div class="description">
                  ${place.description}
                </div>
              </article>`;
    $('.places').append(html);
  }
}

$(document).ready(function () {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:5001/api/v1/places_search',
    contentType: 'application/json',
    data: '{}',
    success: appendPlace
  });

  $('button').click(function () {
    $.ajax({
      type: 'POST',
      url: 'http://localhost:5001/api/v1/places_search',
      contentType: 'application/json',
      data: JSON.stringify({ amenities: Object.keys(window.amenities).map(Number) }),
      success: appendPlace
    });

    const url = `http://${window.location.hostname}:5001/api/v1/status/`;
    $.get(url, function (data, status) {
      if (status === 'success') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    });

    const amenities = {};
    $('input[type="checkbox"]').change(function () {
      if ($(this).is(':checked')) {
        amenities[$(this).attr('data-id')] = $(this).attr('data-name');
      } else {
        delete amenities[$(this).attr('data-id')];
      }
      const names = Object.values(amenities);
      if (names.length > 0) {
        $('.amenities h4').text(names.join(', '));
      } else {
        $('.amenities h4').html('&nbsp;');
      }
    });
  })
});