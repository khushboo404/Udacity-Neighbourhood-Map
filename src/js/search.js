import React, { Component } from 'react';
import { checkGetData } from '../App';

class Search extends Component {
    // Constructor
    constructor(props) {
      super(props);
  
      // Initial states
      this.state = {
        query: '',
        map: {},
        markers: [],
        infowindow: {},
        currentMarkers: []
      }
  
      // Binding functions to this
      this.showSearch = this.showSearch.bind(this);
      this.hideSearch = this.hideSearch.bind(this);
      this.markerSearch = this.markerSearch.bind(this);
      this.openInfoWindow = this.openInfoWindow.bind(this);
    }
  
    componentWillMount() {
      setTimeout(() => {
  
        // Update states with the props
        this.setState({
          map: this.props.map,
          markers: this.props.markers,
          infowindow: this.props.infowindow,
          currentMarkers: this.props.markers
        });
      }, 1000);
    }
  
    /**
    * Opens the search sidebar when click on icon
    * Any infowindow will be closed when the search filter is opened
    */ 
    showSearch() {
      const search = document.querySelector('.search');
      search.classList.add('search_open');
      this.props.infowindow.close();
    }
  
    /**
    * Closes the search sidebar when the icon is clicked
    * Clears the query input and show all markers again
    */ 
    hideSearch() {
      const search = document.querySelector('.search');
      search.classList.remove('search_open');

      this.setState({
        query: '',
        markers: this.state.currentMarkers
      });

      this.state.currentMarkers.forEach((marker) => marker.setVisible(true));
    }
  
    markerSearch(e) {
      const searchedMarkers = [];
      const markers = this.state.currentMarkers;
      const query = e.target.value.toLowerCase();
  
      this.setState({
        query: query
      });
  
      if (query) {
        this.props.infowindow.close();
        markers.forEach((marker) => {
          if (marker.title.toLowerCase().indexOf(query) > -1) {
            marker.setVisible(true);
            searchedMarkers.push(marker);
          } else {
            marker.setVisible(false);
          }
        });
  
        searchedMarkers.sort(this.sortName);
  
        this.setState({
          markers: searchedMarkers
        });
      } else {
        this.setState({
          markers: this.state.currentMarkers
        });
        
        markers.forEach((marker) => marker.setVisible(true));
      }
    }

    openInfoWindow = (e) => {
      console.log(e);
      this.state.markers.forEach((marker) => {
        if (e.name === marker.name) {
          if (checkGetData === true) {
            this.state.infowindow.setContent(
              '<div class="info-wrap">'+
            //   '<img class="info-photo" src='+e.bestPhoto+' alt="Beach photo"><br>'+
              '<h2 class="info-name">'+e.name+'</h2><br>'+
              '<p class="info-position">Latitude: '+e.lat+'</p><br>'+
              '<p class="info-position">Longitude: '+e.lng+'</p><br>'+
              '<p class="info-address">Address: '+e.address+'</p><br>'+
              '<p class="info-rating">Rating: '+e.rating+'</p><br>'+
              '<p class="info-likes">Likes: '+e.likes+'</p><br>'+
              '<p class="info-tips">Tips: "'+e.tips+'"</p><br>'+
            //   '<a class="info-link" href='+e.moreInfo+' target="_blank"><span>For more information<span></a><br>'+
            //   '<img class="info-logo" src='+foursquareLogo+' alt="Powered by Foursquare"><br>'+
              '</div>'
            );
          } else {
            this.state.infowindow.setContent(
              '<div class="error-wrap">'+
              '<p class="error-message">Foursquare data cannot be loaded!</p><br>'+
              '</div>'
            );
          }
  
          this.state.infowindow.open(this.props.map, e);
  
        //   if (e.getAnimation() !== null) {
        //     e.setAnimation(null);
        //   } else {
        //     e.setAnimation(window.google.maps.Animation.BOUNCE);
        //     setTimeout(() => {
        //       e.setAnimation(null);
        //     }, 1000);
        //   }
        }
      });
    }
  
    // Renders the search filter, markers list and header
    render() {
  
      const { query, markers } = this.state;
      const { showSearch, hideSearch, markerSearch, openInfoWindow } = this;
  
      return (
        <div className='wrap-search-filter'>
          <div
            onClick={ showSearch }
            onKeyPress={ showSearch }
            className='sidebar open'
            role='button'
            tabIndex="0"
            title='Open Sidebar'>
            Open Sidebar
          </div>
          <h1 className='app-title'>Explore Neighbourhood</h1>
  
          <div id='search' className='search'>
            <div className='search-top'>
              <div
                onClick={ hideSearch }
                onKeyPress={ hideSearch }
                className='sidebar close'
                role='button'
                tabIndex="0"
                title='Close sidebar'>
                Close Sidebar
              </div>
            </div>
            <input
              onChange={ markerSearch }
              className='search-input'
              type='text'
              role='form'
              aria-labelledby='search'
              tabIndex="0"
              placeholder='Search by Name'
              value={ query }
            />
            <ul className='search-list'>
              {Object.keys(markers).map(i => (
                <li className='search-item' key={ i }>
                  <p 
                    onClick={ () => openInfoWindow(markers[i]) }
                    onKeyPress={ () => openInfoWindow(markers[i]) }
                    // onMouseOver={ () => markers[i].setIcon(markerSelected) }
                    // onMouseOut={ () => markers[i].setIcon(markerDefault) }
                    // onFocus={ () => markers[i].setIcon(markerSelected) }
                    // onBlur={ () => markers[i].setIcon(markerDefault) }
                    className='search-item-action'
                    role='button'
                    tabIndex="0">
                    { markers[i].name }
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
  }
  
  export default Search;