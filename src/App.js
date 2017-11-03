import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import SearchBar from './SearchBar'

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchParam: {
                s: '',
                available: '',
                bounding: '',
                to: '',
                from: '',
                status: '',
                limit: '5',
                offset: '',
                orderby: '',
                sortdir: '',
                returns: '',
            },
            data: null,
            loaded: false,
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
        };
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMapClicked = this.onMapClicked.bind(this);
        this.gen_url = this.gen_url.bind(this);
        this.fetch_data = this.fetch_data.bind(this);
        this.test = this.test.bind(this);
    }

    componentWillMount() {
        this.fetch_data();
    }

    gen_url() {
        let url = "https://api.voltaapi.com/v1/stations";
        let param = '';
        for (let key in this.state.searchParam) {
            let value = this.state.searchParam[key];
            if (value === '') {
                continue;
            }
            param += param === '' ? '?'  : '&';
            param += key + '=' + value;
        }
        url += param;
        console.log(url);
        return url;
    }

    fetch_data() {
        this.setState({
            loaded: false
        });
        fetch(this.gen_url(), {
            Method: 'GET'
        })
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    data: responseData,
                    loaded: true,
                });
            });
    }

    onMarkerClick(props, marker, e) {
        console.log(props);
        this.setState({
            selectedPlace: props.data,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }

    onMapClicked(props) {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            })
        }
    }

    test() {
        console.log(123);
    }

    render() {
        if (!this.state.loaded) {
            return (
                <p>Loading...</p>
            )
        }
        return (
            <div className="App">
                <div>
                    <SearchBar
                        onClick={this.fetch_data}
                        onChange={event => {
                            console.log(event.target.value);
                            this.setState({
                                searchParam: {
                                    s: event.target.value,
                                    limit: '5'
                                }
                            })
                        }}
                        defaultValue={this.state.searchParam.s}
                    />
                </div>
                <div>
                    <Map
                        google={this.props.google}
                        zoom={13}
                        initialCenter={{
                            lat: this.state.data[0].location.coordinates[1],
                            lng: this.state.data[0].location.coordinates[0]
                        }}
                        onClick={this.onMapClicked}
                    >
                        {this.state.data.map(each => {
                            let lat = each.location.coordinates[1];
                            let lng = each.location.coordinates[0];
                            return (
                                <Marker
                                    data={each}
                                    name={'SOMA'}
                                    position={{lat: lat, lng: lng}}
                                    onClick={this.onMarkerClick}
                                />)
                        })}
                        <InfoWindow
                            marker={this.state.activeMarker}
                            visible={this.state.showingInfoWindow}>
                            <div>
                                <h1>Name: {this.state.selectedPlace.name}</h1>
                                <p>Status: {this.state.selectedPlace.status}</p>
                                <p>Address: {this.state.selectedPlace.street_address}</p>
                            </div>
                        </InfoWindow>
                    </Map>
                </div>
            </div>

        );
    }
}

export default GoogleApiWrapper({
    apiKey: ('AIzaSyBMGothypP_77NOELNp_-kTejVXmXgIeII')
})(App)

