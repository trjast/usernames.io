var username;

$(document).ready(function () {
	username = $('#username').text();
	console.log(username);

	var servicesList = $('.loading');
	$.each(servicesList, function(service) {
		fetchAvailability(servicesList[service].id);
	});
});

function fetchAvailability(service) {
	console.log(service);
}