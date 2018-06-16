var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs')

var unitsData = []
var unitByHref = {}

var notdone = 0;

function addUnit(body, $link, image) {
	var $ = cheerio.load(body)

	var $table = $('table.wikitable');
	var $strongAgainst = $table.find('tr:nth-child(2) td:nth-child(2)');
	var $weekAgainst = $table.find('tr:nth-child(3) td:nth-child(2)');

	if ($strongAgainst.text() || $weekAgainst.text()) {
		unitsData[unitByHref[$link.attr('href')]-1].active = true;
		unitsData[unitByHref[$link.attr('href')]-1].image = image;
		unitsData[unitByHref[$link.attr('href')]-1].name = convertToName($link.attr('href'));
		unitsData[unitByHref[$link.attr('href')]-1].strongAgainstText = $strongAgainst.text().trim();
		unitsData[unitByHref[$link.attr('href')]-1].weakAgainstText = $weekAgainst.text().trim();
	}

	if (!--notdone)
		done()
	else
		console.log(notdone)
}

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

request('http://ageofempires.wikia.com/wiki/Unique_unit_(Age_of_Empires_II)', function (error, response, body) {
	var $ = cheerio.load(body)
	$('img[width="22"][height="22"], img[width="22"][height="21"], img[width="21"][height="22"]').each(function() {
		var $img = $(this)
		var $link = $img.parent().next()

		var length = unitsData.length;
		unitsData.push({ id: length+1, href: $link.attr('href') });
		unitByHref[$link.attr('href')] = length+1;

		if ($link.attr('href')) {
			if ($img.attr('data-src')) {
				notdone++;
				download($img.attr('data-src'), '../images/'+$link.attr('href'), function() {
				 	if (!--notdone)
						done()
					else
						console.log(notdone)
				});
			}

			notdone++;
			request('http://ageofempires.wikia.com/'+$link.attr('href'), function (error, response, sub_body) {
				addUnit(sub_body, $link, $img.attr('data-src'))
			})
		}
	})
})

request('http://ageofempires.wikia.com/wiki/Units_(Age_of_Empires_II)', function (error, response, body) {
	var $ = cheerio.load(body)
	$('img[width="22"][height="22"]').each(function() {
		var $img = $(this)
		var $link = $img.parent().next()

		unitsData.push({ id: unitsData.length+1, href: $link.attr('href') });
		var length = unitsData.length
		unitByHref[$link.attr('href')] = length;

		if ($link.attr('href')) {
			if ($img.attr('data-src')) {
				notdone++;
				download($img.attr('data-src'), '../images/'+$link.attr('href'), function() {
				 	if (!--notdone)
						done()
					else
						console.log(notdone)
				});
			}

			notdone++;
			request('http://ageofempires.wikia.com/'+$link.attr('href'), function (error, response, sub_body) {
				addUnit(sub_body, $link, $img.attr('data-src'))
			})
		}
	})
});

function done() {
	fs.writeFile('../units.js', 'var units = '+JSON.stringify(unitsData), function (err) {
		if (err) throw err;
		console.log('Saved!');
	});
}

function convertToName(link) {
	var regex = new RegExp('\/wiki\/(.*)', 'i');
	var name = regex.exec(link)[1];

	name = name.replace('_(Age_of_Empires_II)', '')

	return name.replace(new RegExp('_', 'g'), ' ')
}