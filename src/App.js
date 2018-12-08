import React, {Component} from 'react';
import LocationList from './js/LocationList';
import axios from 'axios';

import { MAP_API_KEY } from './js/data';
import { FS_CLIENT_ID } from './js/data';
import { FS_CLIENT_SECRET } from './js/data';

import { location } from './js/location';


class App extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            'allLocations': [],
            'map': '',
            'infowindow': '',
            'prevmarker': '',
            'toggle': false
        };

        // retain object instance when used in the function
        this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
    }

    componentDidMount() {
        this.setState({
            allLocations: location
        });
        this.renderMap();
    }

    renderMap(){
        // Connect the initMap() function within this class to the global window context,
        // so Google Maps can invoke it
        window.initMap = this.initMap;
        // Asynchronously load the Google Maps script, passing in the callback reference
        loadJS(`https://maps.googleapis.com/maps/api/js?key=${MAP_API_KEY}&callback=initMap`)
    }

    
    initMap() {

        const mapview = document.getElementById('map');
        mapview.style.height = window.innerHeight + "px";
        const map = new window.google.maps.Map(mapview, {
            center: {lat: 18.5204, lng: 73.856},
            zoom: 12,
            mapTypeControl: false
        });

        const InfoWindow = new window.google.maps.InfoWindow({});

        window.google.maps.event.addListener(InfoWindow, 'closeclick', () => {
            this.closeInfoWindow();
        });

        this.setState({
            'map': map,
            'infowindow': InfoWindow
        });

        window.google.maps.event.addDomListener(window, "resize", () => {
            const center = map.getCenter();
            window.google.maps.event.trigger(map, "resize");
            this.state.map.setCenter(center);
        });

        window.google.maps.event.addListener(map, 'click', () => {
            this.closeInfoWindow();
        });

        const allLocations = [];
        this.state.allLocations.forEach((location) => {
            const marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(location.latitude, location.longitude),
                animation: window.google.maps.Animation.DROP,
                map: map
            });

            marker.addListener('click', () => {
                this.openInfoWindow(marker);
            });

            location.marker = marker;
            allLocations.push(location);
        });
        this.setState({
            'allLocations': allLocations
        });

        
    }
    
    openInfoWindow(marker) {
        this.closeInfoWindow();
        this.state.infowindow.open(this.state.map, marker);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
            'prevmarker': marker
        });
        this.state.infowindow.setContent('Loading Data...');
        this.state.map.setCenter(marker.getPosition());
        this.state.map.panBy(0, -100);
        this.getMarkerInfo(marker);
    }

    
    getMarkerInfo(marker) {
        const API = `https://api.foursquare.com/v2/venues/search?client_id=${FS_CLIENT_ID}&client_secret=${FS_CLIENT_SECRET}&v=20130815&ll=${marker.getPosition().lat()},${marker.getPosition().lng()}&limit=1`;
        axios.get(API)
            .then(response => {
                    if (response.status !== 200) {
                        this.state.infowindow.setContent("No data found!");
                        return;
                    }

                    const data = response.data;
                    const location_data = data.response.venues[0];
                    const verified = '<b>Verified Location: </b>' + (location_data.verified ? 'Yes' : 'No') + '<br>';
                    const checkinsCount = '<b>Number of CheckIn: </b>' + location_data.stats.checkinsCount + '<br>';
                    const usersCount = '<b>Number of Users: </b>' + location_data.stats.usersCount + '<br>';
                    const tipCount = '<b>Number of Tips: </b>' + location_data.stats.tipCount + '<br>';
                    const readMore = '<a href="https://foursquare.com/v/'+ location_data.id +'" target="_blank">Read More on Foursquare Website</a>'
                    this.state.infowindow.setContent(checkinsCount + usersCount + tipCount + verified + readMore);                    
                }
            )
            .catch((err) => {
                this.state.infowindow.setContent("No data found!");
            });
    }

    closeInfoWindow() {
        if (this.state.prevmarker) {
            this.state.prevmarker.setAnimation(null);
        }
        this.setState({
            'prevmarker': ''
        });
        this.state.infowindow.close();
    }

    render() {
        return (
            <main>
                <div className="header">
                    <h3 className="title" >Neighborhood Map</h3>
                    <img onClick={(e) => this.setState({ toggle: !this.state.toggle})} src={require('./img/toggleButton.png')} alt="toggle sidebar" className="toggle" title="Toggle Me" />
                </div>
                <div className={"sidebar " + (this.state.toggle && "sidebar-close")} >
                    <LocationList locations={this.state.allLocations} openInfoWindow={this.openInfoWindow}
                              closeInfoWindow={this.closeInfoWindow}/>
                </div>
                <div id="map"></div>
            </main>
        );
    }
}

export default App;

function loadJS(src) {
    const ref = window.document.getElementsByTagName("script")[0];
    const script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = () => {
        alert("Google Maps can't be loaded");
    };
    ref.parentNode.insertBefore(script, ref);
}