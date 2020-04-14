//Styling used to make the make white + grey
var mapStyle = [
                {
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#f5f5f5"
      }
    ]
  },
                {
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
      }
    ]
  },
                {
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#616161"
      }
    ]
  },
                {
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "color": "#f5f5f5"
      }
    ]
  },
                {
                    "featureType": "administrative.land_parcel",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#bdbdbd"
      }
    ]
  },
                {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#eeeeee"
      }
    ]
  },
                {
                    "featureType": "poi",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#757575"
      }
    ]
  },
                {
                    "featureType": "poi.park",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#e5e5e5"
      }
    ]
  },
                {
                    "featureType": "poi.park",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#9e9e9e"
      }
    ]
  },
                {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#ffffff"
      }
    ]
  },
                {
                    "featureType": "road.arterial",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#757575"
      }
    ]
  },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#dadada"
      }
    ]
  },
                {
                    "featureType": "road.highway",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#616161"
      }
    ]
  },
                {
                    "featureType": "road.local",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#9e9e9e"
      }
    ]
  },
                {
                    "featureType": "transit.line",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#e5e5e5"
      }
    ]
  },
                {
                    "featureType": "transit.station",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#eeeeee"
      }
    ]
  },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#28A7E8"
      }
    ]
  },
                {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#28A7E8"
      }
    ]
  }
]

//Used for zoom out circles
var circles = {
      heuston_south: {
        center: {lat: 53.341979, lng: -6.301860},
        size: 600,
        stations: [97,83,96,85,84,81,80,82,95],
      },
      heuston_north: {
        center: {lat: 53.347594, lng: -6.294095},
        size: 240,
        stations: [93,94,86,92,100],
      },
      liberties: {
        center: {lat: 53.343415, lng: -6.288256},
        size: 200,
        stations: [75,76],
      },
      ncad: {
        center: {lat: 53.343901, lng: -6.277697},
        size: 300,
        stations: [73,74,7,72],
      },
      smithfield: {
        center: {lat: 53.349532, lng: -6.282445},
        size: 310,
        stations: [87,88,42,50]
      },
      king_st: {
        center: {lat: 53.350305, lng: -6.273684},
        size: 100,
        stations: [101]
      },
      greek_st: {
        center: {lat: 53.346903, lng: -6.272976},
        size: 100,
        stations: [4]
      },
      temple_bar: {
        center: {lat: 53.344202, lng: -6.266997},
        size: 310,
        stations: [29,10,6,9]
      },
      stephens_green: {
        center: {lat: 53.338873, lng: -6.264765},
        size: 370,
        stations: [17,51,71,54,53,37,52]
      },
      iveagh_gardens: {
        center: {lat: 53.332794, lng: -6.262103},
        size: 330,
        stations: [18,55,11,41,5]
      },
      portobello: {
        center: {lat: 53.330332, lng: -6.266076},
        size: 200,
        stations: [43,34]
      },
      trinity: {
        center: {lat: 53.341944, lng: -6.256239},
        size: 180,
        stations: [27,98,21]
      },
      odonoughues: {
        center: {lat: 53.337520, lng: -6.252032},
        size: 300,
        stations: [36,26,113,89,13]
      },
      merrion_east: {
        center: {lat: 53.340355, lng: -6.243740},
        size: 300,
        stations: [63,25,57,56,58]
      },
      ballsbridge_north: {
        center: {lat: 53.334568, lng: -6.245914},
        size: 200,
        stations: [114,19,47]
      },
      leeson_st: {
        center: {lat: 53.332173, lng: -6.252946},
        size: 100,
        stations: [39]
      },
      grand_canal_dock: {
        center: {lat: 53.343417, lng: -6.235406},
        size: 370,
        stations: [69,91,68,90,117]
      },
      custom_house: {
        center: {lat: 53.347858, lng: -6.254458},
        size: 270,
        stations: [23,22,16]
      },
      famine_memorial: {
        center: {lat: 53.347105, lng: -6.245245},
        size: 270,
        stations: [8,48,99,64,62]
      },
      pearse_st: {
        center: {lat: 53.344338, lng: -6.250715},
        size: 100,
        stations: [32]
      },
      three_arena: {
        center: {lat: 53.347376, lng: -6.232889},
        size: 200,
        stations: [66,67]
      },
      north_wall: {
        center: {lat: 53.348388, lng: -6.239290},
        size: 150,
        stations: [65,49]
      },
      jervis: {
        center: {lat: 53.349826, lng: -6.267826},
        size: 300,
        stations: [3,31,77,40]
      },
      arran_quay: {
        center: {lat: 53.355971, lng: -6.278976},
        size: 200,
        stations: [105,103,104]
      },
      cabra: {
        center: {lat: 53.360089, lng: -6.278639},
        size: 250,
        stations: [107,106,108]
      },
      mater: {
        center: {lat:53.356944, lng: -6.268241},
        size: 450,
        stations: [110,102,30,2,15,61,79,12,79]
      },
      mountjoy: {
        center: {lat: 53.357193, lng: -6.258799},
        size: 250,
        stations: [44,59,28,111 ]
      },
      croke_park: {
        center: {lat: 53.357738, lng: -6.251297},
        size: 100,
        stations: [112]
      },
      killarney_st: {
        center: {lat: 53.354837, lng: -6.249084},
        size: 230,
        stations: [115,109]
      },
      gpo: {
        center: {lat: 53.349260, lng: -6.260159},
        size: 100,
        stations: [33]
      },
      fibbers: {
        center: {lat: 53.352115, lng: -6.260852},
        size: 100,
        stations: [24]
      },
      talbot_st: {
        center: {lat: 53.352098, lng: -6.254326},
        size: 150,
        stations: [38,45]
      },
      
  };



