$( document ).ready(function() {
	d3.csv('../data/disastersByTypeDecadeSahelSummary.csv', function(data) {
		let array = new Array();
		array.push(data);
		let disasterByDecadeType = d3.group(array, d => d.decade, d => d.disaster_type);
		console.log(disasterByDecadeType.get('Drought'));
	});
	var ctx = document.getElementById('droughtsFloodsByDecade').getContext('2d');
	var myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: ['1960s', '1970s', '1980s', '1990s', '2000s', '2010s'],
			datasets: [
				{
					label: 'Drought',
					data: [1875000, 842000, 11950000, 5479690, 18709558, 21168228, 13400000],
					backgroundColor: ['#F2645A']
				},
				{
					label: 'Flood',
					data: [0, 16900, 495029, 1243487, 1705765, 14199403, 978724],
					backgroundColor: ['#79AFE7']
				}
			]
		},
		options: {
			scales: {
        x: {
          grid: {
            drawOnChartArea: false,
            drawBorder: false,
            display: false
          }
        },
        y: {
          title: {
            display: true,
            text: 'Number of People Affected'
          },
          ticks: {
          	callback: function(value, index, values) {
              return d3.format('.2s')(value);
            }
          },
          grid: {
            drawBorder: false
          } 
        }
			},
			plugins: {
				legend: {
					position: 'right',
					align: 'start',
					labels: {
						boxWidth: 15,
						boxHeight: 15
					}
				}
			}
		}
	});
});