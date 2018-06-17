$(function() {

	$('#unitToKill').focus()

	var upgrades = [

	]

	// var units = [
	// 	{
	// 		id: 1,
	// 		counters: [],
	// 		weakAgainstText: 'Test',
	// 		preevolution: [],
	// 		name: 'Spearmen',
	// 		evolution: [2,3],
	// 		upgrades: []
	// 	},
	// 	{
	// 		id: 2,
	// 		counters: [],
	// 		weakAgainstText: 'Test1',
	// 		preevolution: [1],
	// 		evolution: [3],
	// 		name: 'Pikemen',
	// 		upgrades: []
	// 	},
	// 	{
	// 		id: 3,
	// 		counters: [],
	// 		weakAgainstText: 'Test2',
	// 		preevolution: [1,2],
	// 		evolution: [],
	// 		name: 'Halberdier',
	// 		upgrades: []
	// 	},
	// 	{
	// 		id: 4,
	// 		counters: [],
	// 		weakAgainstText: 'Test3',
	// 		preevolution: [],
	// 		evolution: [5],
	// 		name: 'Militia',
	// 		upgrades: []
	// 	},
	// 	{
	// 		id: 5,
	// 		counters: [6],
	// 		weakAgainstText: 'Test4',
	// 		preevolution: [4],
	// 		evolution: [],
	// 		name: 'Man-at-Arms',
	// 		upgrades: []
	// 	},
	// 	{
	// 		id: 6,
	// 		counters: [7],
	// 		weakAgainstText: 'Test5',
	// 		preevolution: [],
	// 		evolution: [],
	// 		name: 'Archer',
	// 		upgrades: []
	// 	},
	// 	{
	// 		id: 7,
	// 		counters: [],
	// 		weakAgainstText: 'Test6',
	// 		preevolution: [],
	// 		evolution: [],
	// 		name: 'Skirmisher',
	// 		upgrades: []
	// 	}
	// ]

	$('#unitToKill').select();

	$('.highlight').click(function() {
		$('#unitToKill').select()
	})

	$('#unitToKill').blur(function() {
		setTimeout(function() {
			$(this).val('')
		}, 100)
	})

	$('#unitToKill').keyup(function(e) {
		if (e.keyCode === 13)
			return $('#results .option:first-child').trigger('click');

		$('.info_container').attr('data-active', false);

		$('#results').empty();
		$('#results').attr('data-active', false);

		if (!$(this).val())
			return;

		var regex = new RegExp($(this).val(), 'i');

		var returnUnits = [];
		units.forEach(function(unit) {
			if (unit.active && regex.test(unit.name)) {
				returnUnits.push(unit)
			}
		})

		returnUnits.sort(function(a, b) {
			if (a.name < b.name)
				return -1;
			else if (a.name > b.name)
				return 1;
			else
				return 0;
		});

		returnUnits.forEach(function(unit) {
			if (!unit.name)
				console.log(unit)

			var optionClick = "function() {";
			
			if (unit.weakAgainstText)
				optionClick += "$('.info_counter').text('"+unit.weakAgainstText+"');"
			else
				optionClick += "$('.info_counter').text('');"
			
			if (unit.strongAgainstText)
				optionClick += "$('.info_strongagainst').text('"+unit.strongAgainstText+"');"
			else
				optionClick += "$('.info_strongagainst').text('');"
			
			if (unit.strongAgainstText)
				optionClick += "$('.info_strongagainst').text('"+unit.strongAgainstText+"');"
			else
				optionClick += "$('.info_strongagainst').text('');"
			
			if (unit.wood) {
				optionClick += "$('.cost .wood').attr('data-active', 'true');"
				optionClick += "$('.cost .wood .amount').text('"+unit.wood+"');"
			} else {
				optionClick += "$('.cost .wood').attr('data-active', 'false');"
				optionClick += "$('.cost .wood .amount').text('');"
			}
			
			if (unit.food) {
				optionClick += "$('.cost .food').attr('data-active', 'true');"
				optionClick += "$('.cost .food .amount').text('"+unit.food+"');"
			} else {
				optionClick += "$('.cost .food').attr('data-active', 'false');"
				optionClick += "$('.cost .food .amount').text('');"
			}
			
			if (unit.gold) {
				optionClick += "$('.cost .gold').attr('data-active', 'true');"
				optionClick += "$('.cost .gold .amount').text('"+unit.gold+"');"
			} else {
				optionClick += "$('.cost .gold').attr('data-active', 'false');"
				optionClick += "$('.cost .gold .amount').text('');"
			}
			
			if (unit.stone) {
				optionClick += "$('.cost .stone').attr('data-active', 'true');"
				optionClick += "$('.cost .stone .amount').text('"+unit.stone+"');"
			} else {
				optionClick += "$('.cost .stone').attr('data-active', 'false');"
				optionClick += "$('.cost .stone .amount').text('');"
			}

			let placeholder = './images/unit_placeholder.jpg';
			
			if (unit.image) {
				optionClick += "$('.image').empty();"
				optionClick += "$('.image').append(\`<img src=\'"+(unit.image || placeholder)+"\'/>\`);"
			} else {
				optionClick += "$('.image').empty();"
				optionClick += "$('.image').append(\`<img src=\'"+placeholder+"\'/>\`);"
			}

			var evolution = '';
			if (unit.preevolution && unit.preevolution.length) {
				unit.preevolution.forEach(function(ev, i) {
					var divider = '';
					if (i != 0) divider = ' -> ';

					evolution += divider + units[(unit.preevolution[i]-1)].name;
				})
			}

			if (evolution) evolution += ' -> ';

			evolution += '<b>'+unit.name+'</b>';

			if (unit.evolution && unit.evolution.length) {
				unit.evolution.forEach(function(ev, i) {
					evolution += ' -> ' + units[(unit.evolution[i]-1)].name;
				})
			}

			optionClick += "$('.info_evolution').html('"+evolution+"');"

			optionClick += "$('input').val('"+unit.name+"');"
			optionClick += "$('#results').attr('data-active', false);"
			optionClick += "$('.info_container').attr('data-active', true);"
			optionClick += "$('input').attr('data-value', '"+unit.name+"');"
			optionClick += "}"

			$('#results').append('<div data-id="'+unit.id+'" class="option" onclick="('+optionClick+')()">'+unit.name+'</option>')
		})

		$('#results').attr('data-active', true);
	})

})