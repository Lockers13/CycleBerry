function dailyChart (dataSet, stationName){
                var ctx = document.getElementById("myChart").getContext("2d");
                if(window.bar != undefined)
                    window.bar.destroy(); 
                dailyAvgs = [dataSet.monday, dataSet.tuesday, dataSet.wednesday, dataSet.thursday, dataSet.friday, dataSet.saturday, dataSet.sunday]
                window.bar = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                        datasets: [{
                            label: stationName,
                            /// Pass this variable in ///
                            data: dailyAvgs,
                            backgroundColor: [
                            'rgba(255, 255, 255, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 255, 255, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 255, 255, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 255, 255, 0.2)'
                        ],
                                        borderColor: [
                            'rgba(255, 255, 255, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 255, 255, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 255, 255, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 255, 255, 1)'
                        ],
                                        borderWidth: 1
                    }]
                    },
                    options: {
                        legend: {
                            //Switch to false to remove station name
                            display: true,
                            position: 'top',
                            labels: {
                                fontColor: "white",
                                boxWidth: 0
                            }
                        },
                        scales: {
                            xAxes: [{
                                ticks: {
                                    fontColor:"white"
                                }
                            }],
                            tooltips: {
                                tooltips: {enabled: false},
                                hover: {mode: null}
                            },
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    fontColor:"white"
                                }
                            }]
                        }
                    }
                });
            }

            function hourlyChart (dataSet, stationName){
                    var ctx = document.getElementById("myChart").getContext("2d");
                    if(window.bar != undefined)
                        window.bar.destroy(); 
                    window.bar = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['00:00','01:00','02:00','03:00','04:00',
                        	'05:00','06:00','07:00','08:00','09:00',
                        	'10:00','11:00','12:00','13:00','14:00',
                        	'15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],
                        datasets: [{
                            label: stationName,
                            /// Pass this variable in ///
                            data: dataSet,
                            backgroundColor: [
                            'rgba(255, 255, 255, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 255, 255, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 255, 255, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 255, 255, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 255, 255, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 255, 255, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 255, 255, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 255, 255, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 255, 255, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 255, 255, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 255, 255, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 255, 255, 0.2)',
                            'rgba(54, 162, 235, 0.2)'   
                        ],
                                        borderColor: [
                            'rgba(255, 255, 255, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 255, 255, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 255, 255, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 255, 255, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 255, 255, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 255, 255, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 255, 255, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 255, 255, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 255, 255, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 255, 255, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 255, 255, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 255, 255, 1)',
                            'rgba(54, 162, 235, 1)'
                        ],
                                        borderWidth: 1
                    }]
                    },
                    options: {
                        legend: {
                            //Switch to false to remove station name
                            display: true,
                            position: 'top',
                            labels: {
                                fontColor: "white",
                                boxWidth: 0
                            }
                        },
                        scales: {
                            xAxes: [{
                                ticks: {
                                    fontColor:"white"
                                }
                            }],
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    fontColor:"white"
                                }
                            }]
                        }
                    }
                });
            }


function showLoader (){
    document.getElementById('chartContainer').style.display= 'none' ;
    document.getElementById('chartLoad').style.display= 'block' ;
}

function hideLoader (){
    document.getElementById('chartLoad').style.display= 'none' ;
    document.getElementById('chartContainer').style.display= 'block' ;
}