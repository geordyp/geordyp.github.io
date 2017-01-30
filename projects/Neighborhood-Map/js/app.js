var restaurants = [
  {
    name: "Starbucks",
    zomato_id: 17428829,
    type: "Coffee and Tea",
    lat: 39.186427,
    lng: -96.575871
  },
  {
    name: "Varsity Donuts",
    zomato_id: 17430348,
    type: "Coffee and Tea",
    lat: 39.185952,
    lng: -96.576194
  },
  {
    name: "Coco Bolos",
    zomato_id: 17428739,
    type: "Mexican",
    lat: 39.186609,
    lng: -96.576065
  },
  {
    name: "Fuzzy's Taco Shop",
    zomato_id: 17430547,
    type: "Mexican",
    lat: 39.185043,
    lng: -96.574734
  },
  {
    name: "Bi Bim Bap",
    zomato_id: 17430631,
    type: "Asian",
    lat: 39.186027,
    lng: -96.572866
  },
  {
    name: "Buffalo Wild Wings",
    zomato_id: 17428731,
    type: "Bar Food",
    lat: 39.185548,
    lng: -96.576225
  },
  {
    name: "Dancing Ganesha",
    zomato_id: 17430638,
    type: "Indian",
    lat: 39.186346,
    lng: -96.576268
  },
  {
    name: "Chipotle Mexican Grill",
    zomato_id: 17428737,
    type: "Mexican",
    lat: 39.185103,
    lng: -96.576080
  },
  {
    name: "Tubby's Sports Bar",
    zomato_id: 17428847,
    type: "Bar Food",
    lat: 39.185486,
    lng: -96.574546
  },
  {
    name: "Kite's Grille & Bar",
    zomato_id: 17428778,
    type: "Bar Food",
    lat: 39.185353,
    lng: -96.574970
  }
];

var Restaurant = function(data) {
  this.name = data.name;
  this.zomato_id = data.zomato_id;
  this.type = data.type;
  this.lat = data.lat;
  this.lng = data.lng;
}

var ViewModel = function() {
  var self = this;

  // complete list of restaurants
  this.allRsrtList = ko.observableArray([]);

  // list of restaurants to display
  this.displayRsrtList = ko.observableArray([]);

  // list of cuisine options, used for filter
  this.filterOptions = ko.observableArray([]);

  // the filter the user has selected
  this.selectedOption = ko.observable();

  // adds cuisine options to filterOptions list
  this.addToFilterOptions = function(type) {
    var found = false;
    this.filterOptions().forEach(function(option) {
      if (option == type) {
        found = true;
      }
    });

    // insuring there are no repeats in the list
    if (found === false) {
      this.filterOptions.push(type);
    }
  };

  // using the initial data to create Restaurant objects
  restaurants.forEach(function(rsrt) {
    // restaurants get added to rsrtList
    self.allRsrtList.push(new Restaurant(rsrt));

    // cuisine types get added to the filterOptions list
    self.addToFilterOptions(rsrt.type);
  });

  // by default, all restaurants will be visible
  this.displayRsrtList(this.allRsrtList());

  // handles when the user selects a restaurant from the list
  this.rsrtClicked = function(clickedRsrt) {
    toggleBounce(clickedRsrt.zomato_id);
    openInfoWindow(getMarkerById(clickedRsrt.zomato_id));
  };

  // handles when the user clicks the filter button
  this.filterBtnClicked = function() {
    // remove all markers
    clearMarkers();

    // filter the restaurant list and markers
    this.displayRsrtList(this.allRsrtList().filter(this.checkRsrtList));
    filterMarkers(this.selectedOption());
    showMarkers();
  };

  // handles when the user clicks the clear filter button
  this.clearFilterBtnClicked = function() {
    // reset the restaurant list and markers so they display all
    this.displayRsrtList(this.allRsrtList());
    this.displayMarkers = this.allMarkers;
    showAllMarkers();
  };

  // check if restaurant list item is of the selected type
  this.checkRsrtList = function(rsrt) {
    return rsrt.type == self.selectedOption();
  };
}

ko.applyBindings(new ViewModel());

// the google map
var map = {};

// complete list of markers
var allMarkers = [];

// list of markers to display
var displayMarkers = [];

var infowindow = {};

// sets up the Google Map
initMap = function() {
  var loc = {lat: 39.185353, lng: -96.574970};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17,
    center: loc
  });

  infowindow = new google.maps.InfoWindow({content: ""});

  createMarkers();
  showAllMarkers();
};

mapsFailedToLoad = function() {
  map = document.getElementById('map');
  map.className += 'error';
  map.innerHTML = 'Failed to load Google Maps';
};

// creates markers for the map
createMarkers = function() {
  restaurants.forEach(function(restaurant) {
    var marker = new google.maps.Marker({
      position: {lat: restaurant.lat, lng: restaurant.lng},
      map: null,
      zomato_id: restaurant.zomato_id,
      type: restaurant.type
    });

    marker.addListener('click', function() {
      openInfoWindow(marker);
    });

    allMarkers.push(marker);
  });
};

// filters the markers that will be displayed
filterMarkers = function(option) {
  displayMarkers = [];
  allMarkers.forEach(function(marker) {
    if (marker.type == option) {
      displayMarkers.push(marker);
    }
  });
};

// clears the markers from the map
clearMarkers = function() {
  setMapOnAll(null);
};

// shows all the markers on the map
showAllMarkers = function() {
  displayMarkers = allMarkers;
  showMarkers();
};

// shows the markers in the displayMarkers list
showMarkers = function() {
  setMapOnAll(map);
};

// set the map property of each marker, displaying it on the map
setMapOnAll = function(map) {
  for (var i = 0; i < displayMarkers.length; i++) {
    displayMarkers[i].setMap(map);
  }
};

// returns a marker with the given unique id
getMarkerById = function(id) {
  var m = null;
  displayMarkers.forEach(function (marker) {
    if (marker.zomato_id === id) {
      m = marker;
    }
  });

  return m;
}

// opens an info window above the given marker
openInfoWindow = function(marker) {
  var zomatoUrl = "https://developers.zomato.com/api/v2.1/restaurant?res_id=" +
                  marker.zomato_id;
  var reviewData = {};
  $.ajax({
    url: zomatoUrl,
    beforeSend: function(xhr) {
         xhr.setRequestHeader("user-key", "a421d04cada88f728243c4ad9924a9dd");
    }, success: function(data) {
        !!data.name ? name = data.name : name = "No name available";
        !!data.user_rating.aggregate_rating ?
          agg_rating = data.user_rating.aggregate_rating :
          agg_rating = "No aggregate rating available";
        !!data.user_rating.rating_text ?
          rating_text = "(" + data.user_rating.rating_text + ")" :
          rating_text = "";
        if (!!data.price_range) {
          price_range = "";
          for (i = 0; i < data.price_range; i++) {
            price_range += "$";
          }
        }
        else {
          price_range = "No price range available";
        }


        var contentString = '<div id="infowindow>"' +
                            '<p><b>' + name + '</b></p>' +
                            '<p><b>Aggregate Rating:&nbsp;&nbsp;</b>' +
                            agg_rating + '&nbsp;' + rating_text + '</p>' +
                            '<p><b>Price Range:&nbsp;&nbsp;</b>' +
                            price_range + '</p></div>';

        infowindow.setContent(contentString);
        infowindow.open(map, marker);
    }, error: function() {
        var contentString = '<div id="infowindow>"' +
                            '<p style="color:red;"><b>' +
                            'Failed to load restaurant data from Zomato.' +
                            '</b></p></div>';

        infowindow.setContent(contentString);
        infowindow.open(map, marker);
    }
  });

  toggleBounce(marker.zomato_id);
};

// animates the marker selected marker
toggleBounce = function(rsrtClicked) {
  // stop any other markers from animating
  displayMarkers.forEach(function (marker) {
    marker.setAnimation(null);
  });

  var marker = getMarkerById(rsrtClicked);
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
};

openNav = function() {
    document.getElementById("sidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.getElementById("menu").style.left = "260px";
    document.getElementById("menu").style.visibility = "hidden";
}

closeNav = function() {
    document.getElementById("sidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    document.getElementById("menu").style.left = "10px";
    document.getElementById("menu").style.visibility = "visible";
}
