import React, {Component} from 'react';
import LocationItem from './LocationItem';

class LocationList extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            'locations': [],
            'flocations':[],
            'query': '',
            'suggestions': true,
        };

        this.filterLocations = this.filterLocations.bind(this);
        this.toggleLocations = this.toggleLocations.bind(this);
    }

    filterLocations(event) {
        this.props.closeInfoWindow();
        const {value} = event.target;
        const locations = [];
        this.state.locations.forEach(function (location) {
            if (location.name.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                location.marker.setVisible(true);
                locations.push(location);
            } else {
                location.marker.setVisible(false);
            }
        });
        console.log(locations);
        this.setState({
            'flocations': locations,
            'query': value
        });
    }

    componentWillReceiveProps(){
        this.setState({
            'locations': this.props.locations
        });
        if(this.state.flocations.length === 0 && this.state.query === ''){
            this.setState({
                'flocations': this.props.locations
            });
        }
    }
    
    toggleLocations() {
        this.setState({
            'suggestions': !this.state.suggestions
        });
    }

    render() {
        const locationlist = this.state.flocations.map((listItem, index) => {
            return (
                <LocationItem key={index} openInfoWindow={this.props.openInfoWindow.bind(this)} data={listItem}/>
            );
        });
        return (
            <div>  
                <input role="search" aria-labelledby="filter" id="search-field" className="search-field" type="text" placeholder="Search Location"
                       value={this.state.query} onChange={this.filterLocations}/>
                
                { this.state.flocations.length === 0 && this.state.query !== '' && (<ul><li>Not Found</li></ul>)}
                
                <ul>
                    {this.state.suggestions && locationlist}
                </ul>
                <button className="button_list" onClick={this.toggleLocations}>Show/Hide Locations</button>
            </div>
        );
    }
}

export default LocationList;