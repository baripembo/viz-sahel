$( document ).ready(function() {
  let dataArray = [];
  let exerciseArray = [];
  let ipcChart;

  d3.csv('data/ipc.csv').then(function(data) {
    let group = d3.group(data, d => d.exercise_label + ' ' + d.exercise_year, d => d.adm0_name);
    Array.from(group, ([key, values]) => {
  		exerciseArray.push(key);

  		let labels = Array.from(values.keys());
	    let phase3 = [];
	    let phase4 = [];
	    let phase5 = [];
    	Array.from(values, ([k, vals]) => {
  			let p3 = d3.rollup(vals, v => d3.sum(v, d => d.phase3), d => d.adm0_name);
  			let p4 = d3.rollup(vals, v => d3.sum(v, d => d.phase4), d => d.adm0_name);
  			let p5 = d3.rollup(vals, v => d3.sum(v, d => d.phase5), d => d.adm0_name);
  			phase3.push(p3.get(k));
  			phase4.push(p4.get(k));
  			phase5.push(p5.get(k));
    	});
    	dataArray.push({p3: phase3, p4: phase4, p5: phase5, labels: labels});
    });


  	var ipcSelect = d3.select('.ipc-select')
      .selectAll('option')
      .data(exerciseArray)
      .enter().append('option')
        .text(function(d) { return d; })
        .attr('value', function (d, i) { return i; });

    //ipc exercise select event
	  d3.select('.ipc-select').on('change',function(e) {
	    var selected = d3.select('.ipc-select').node().value;
    	updateChart(dataArray[selected]);
	  });

    buildChart(dataArray[0]);
  });

  function updateChart(data) {
  	ipcChart.data.labels = data.labels;
    ipcChart.data.datasets[0].data = data.p3;
    ipcChart.data.datasets[1].data = data.p4;
    ipcChart.data.datasets[2].data = data.p5;
    ipcChart.update();
  }

  function buildChart(data) {
  	var ctx = document.getElementById('ipcChart').getContext('2d');
		ipcChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: data.labels,
				datasets: [
					{
						label: 'Crisis',
						data: data.p3,
						backgroundColor: '#FF9901'
					},
					{
						label: 'Emergency',
						data: data.p4,
						backgroundColor: '#FF0000'
					},
					{
						label: 'Catastrophe/Famine',
						data: data.p5,
						backgroundColor: '#C00001'
					}
				]
			},
			options: {
    		responsive: true,
    		maintainAspectRatio: false,
				scales: {
	        x: {
	          stacked: true,
	          grid: {
	            drawOnChartArea: false
	          }
	        },
	        y: {
		        stacked: true,
	          grid: {
	          	drawBorder: false,
	            drawOnChartArea: true
	          },
	          ticks: {
        			maxTicksLimit: 6
	          }
	        }
				},
				interaction: {
					mode: 'point'
				},
				plugins: {
					legend: {
						position: 'bottom',
						labels: {
							boxWidth: 15,
							boxHeight: 15
						}
					}
				}
			}
		});
  }
});