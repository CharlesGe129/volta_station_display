import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import SearchBar from './SearchBar'
import SearchItem from './SearchItem'

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
            advanced_search_visible: 'hidden'
        };
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMapClicked = this.onMapClicked.bind(this);
        this.genUrl = this.genUrl.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.showAdvancedSearch = this.showAdvancedSearch.bind(this);
    }

    componentWillMount() {
        this.fetchData();
    }

    genUrl() {
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

    fetchData() {
        this.setState({
            loaded: false
        });
        fetch(this.genUrl(), {
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
        this.setState({
            advanced_search_visible: 'hidden'
        });
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            })
        }
    }

    showAdvancedSearch() {
        this.setState({
            advanced_search_visible: ''
        })
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
                        onClick={this.fetchData}
                        onChange={event => {
                            console.log(event.target.value);
                            this.setState({
                                searchParam: {
                                    s: event.target.value,
                                    limit: '5'
                                }
                            })
                        }}
                        onFocus={this.showAdvancedSearch}
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
                <div>
                    {/*<div style={{zIndex: 99, position: 'absolute', top: 100, left: 20, backgroundColor: 'white',*/}
                        {/*visibility: this.state.advanced_search_visible}}>*/}
                        {/*<text>available:</text>*/}
                        {/*<input type={'text'}*/}
                               {/*defaultValue={this.state.searchParam.available}*/}
                               {/*onChange={event => {*/}
                                   {/*let newParam = this.state.searchParam;*/}
                                   {/*newParam.available = event.target.value;*/}
                                   {/*this.setState({searchParam: newParam});*/}
                               {/*}}*/}
                        {/*/>*/}
                    {/*</div>*/}
                    <SearchItem visibility={this.state.advanced_search_visible}
                                defaultValue={this.state.searchParam.available}
                                onChange={event => {
                                    let newParam = this.state.searchParam;
                                    newParam.available = event.target.value;
                                    this.setState({searchParam: newParam});
                                }}
                    />

                </div>
            </div>

        );
    }
}

export default GoogleApiWrapper({
    apiKey: ('AIzaSyBMGothypP_77NOELNp_-kTejVXmXgIeII')
})(App)

