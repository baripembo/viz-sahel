$( document ).ready(function() {
	// d3.csv('../data/cadre_harmonise.csv', function(data) {
	// 	let array = new Array();
	// 	array.push(data);
	// 	//let disasterByDecadeType = d3.group(array, d => d.decade, d => d.disaster_type);
	// 	console.log(data);
	// });



      d3.csv('../data/cadre_harmonise.csv').then(function(data) {
      console.log('Data loaded', data);
      let group = d3.group(data, d => d.exercise_label + ' ' + d.exercise_year, d => d.adm0_name);

      // let dataByCountry = d3.nest()
      //   .key(function(d) { return d.adm0_name; })
      //   .object(data[0]);


      console.log(group)
    }
  );
});