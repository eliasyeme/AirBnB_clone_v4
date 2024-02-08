$(document).ready(function () {
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
});