$( document ).ready(function() {
	// d3.csv('../data/disastersByTypeDecadeSahelSummary.csv', function(data) {
	// 	let array = new Array();
	// 	array.push(data);
	// 	let disasterByDecadeType = d3.group(array, d => d.decade, d => d.disaster_type);
	// 	console.log(disasterByDecadeType.get('Drought'));
	// });
	var ctx = document.getElementById('droughtsFloodsByDecade').getContext('2d');
	var myChart = new Chart(ctx, {
		data: {
			labels: ['1960s', '1970s', '1980s', '1990s', '2000s', '2010s'],
			datasets: [
				{
					backgroundColor: '#FFF',
					borderColor: '#007CE1',
					borderWidth: 1,
					data: [6, 3, 7, 9, 11, 10, 3],
					fill: false,
					label: 'Drought Events',
					pointBackgroundColor: '#FFF',
          pointRadius: 4,
          tension: 0,
					type: 'line',
      		yAxisID: 'y1'
				},
				{
					backgroundColor: '#FFF',
					borderColor: '#F2645A',
					borderWidth: 1,
					data: [0, 2, 11, 22, 65, 60, 11],
					fill: false,
					label: 'Flood Events',
					pointBackgroundColor: '#FFF',
          pointRadius: 4,
          tension: 0,
					type: 'line',
      		yAxisID: 'y1'
				},
				{
					backgroundColor: '#66B0EC',
					data: [1875000, 842000, 11950000, 5479690, 18709558, 21168228, 13400000],
					label: 'Droughts',
					type: 'bar',
      		yAxisID: 'y'
				},
				{
					backgroundColor: '#F7A29C',
					data: [0, 16900, 495029, 1243487, 1705765, 14199403, 978724],
					label: 'Floods',
					type: 'bar',
      		yAxisID: 'y'
				}
			]
		},
		options: {
    	responsive: true,
			scales: {
        x: {
          grid: {
            drawOnChartArea: false
          }
        },
        y: {
	        position: 'left',
          grid: {
            drawOnChartArea: false,
          },
          title: {
            display: true,
            text: 'Number of People Affected'
          },
          ticks: {
          	callback: function(value, index, values) {
              return d3.format('.2s')(value);
            }
          }
        },
        y1: {
	        position: 'right',
	        grid: {
	          drawOnChartArea: false,
	        },
          title: {
            display: true,
            text: 'Number of Drought/Flood Events'
          }
        }
			},
			plugins: {
				legend: {
					fillStyle: 'transparent',
					position: 'bottom',
					labels: {
						boxWidth: 15,
						boxHeight: 15
					}
				}
			}
		}
	});
});