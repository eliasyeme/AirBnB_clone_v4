function appendPlace(data) {
  $('.places').empty();
  const places = data.toSorted((placeA, placeB) => {
    return (placeA.name.localeCompare(placeB.name));
  });
  for (const place of places) {
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
                <div class="reviews">
                  <h2><span data-id=${place.id} value="show"></span>Reviews</h2>
                  <ul class="hide" id=${place.id}>
                  </ul>
                </div>
              </article>`;
    $('.places').append(html);

    $.get(`http://localhost:5001/api/v1/places/${place.id}/reviews`,
	  function (reviews, status) {
	    for (const review of reviews) {
	      const date = review['created_at'].split(' ');
	      if (date[0] === '1') {
		review.created_at = `${date[0]}st ${date[1]} ${date[2]}`;
	      } else if (date[0] === '2' || date[0] === '3') {
		review.created_at = `${date[0]}d ${date[1]} ${date[2]}`;
	      } else {
		review.created_at = `${date[0]}th ${date[1]} ${date[2]}`;
	      }
	      const html = `<li>
                              <h3>From ${review.user} the ${review.created_at}</h3>
                              <p>${review.text}</p>
                            </li>`;
	      $(`.reviews ul#${place.id}`).append(html);
	    }
	  });
  }
}

function toggleReviews() {
  // toggle reviews display
  console.log("Toggle reviews display")
  $('.reviews h2 span').click(function () {
    const newClass = $(this).attr('value');
    const id = $(this).attr('data-id');
    const oldClass = $(`ul#${id}`).attr('class');
    $(`ul#${id}`).removeClass(oldClass).addClass(newClass);
    $(this).attr('value', oldClass);
  });
}


$(document).ready(function () {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:5001/api/v1/places_search',
    contentType: 'application/json',
    data: '{}',
    success: appendPlace
  }).done(toggleReviews);

  $('button').click(function () {
    $.ajax({
      type: 'POST',
      url: 'http://localhost:5001/api/v1/places_search',
      contentType: 'application/json',
      data: JSON.stringify({ amenities: Object.keys(amenities),
			     states: Object.keys(states),
			     cities: Object.keys(cities)}),
      success: appendPlace
    }).done(toggleReviews);
  });

  const url = `http://${window.location.hostname}:5001/api/v1/status/`;
  $.get(url, function (data, status) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  // get the amenities list values
  const amenities = {};
  $('.amenities input[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      amenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenities[$(this).attr('data-id')];
    }
    const amenities_names = Object.values(amenities);
    if (amenities_names.length > 0) {
      $('.amenities h4').text(amenities_names.join(', '));
    } else {
      $('.amenities h4').html('&nbsp;');
    }
  });
  let locations_names = [];
  // get the state list values
  const states = {};
  $('.locations h2 > input[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      states[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete states[$(this).attr('data-id')];
      locations_names = locations_names.filter(
	item => item !== $(this).attr('data-name'));
    }
    const states_names = Object.values(states);
    // filter the states_name to prevent dublicated
    // valuse on the locations_names after concatenates
    locations_names = locations_names.concat(states_names.filter(
      item => !locations_names.includes(item)));

    if (locations_names.length > 0) {
      $('.locations h4').text(locations_names.join(', '));
    } else {
      $('.locations h4').html('&nbsp;');
    }
  });
  // get cities list values
  const cities = {};
  $('.locations li > input[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      cities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete cities[$(this).attr('data-id')];
      locations_names = locations_names.filter(
	item => item !== $(this).attr('data-name'));
    }
    const cities_names = Object.values(cities);
    // filter the cities_name to prevent dublicated
    // valuse on the locations_names after concatenates
    locations_names = locations_names.concat(cities_names.filter(
      item => !locations_names.includes(item)));

    if (locations_names.length > 0) {
      $('.locations h4').text(locations_names.join(', '));
    } else {
      $('.locations h4').html('&nbsp;');
    }
  });
});
