import React, {Component} from 'react';
import './App.css';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import SearchBar from './SearchBar'
import SearchItem from './SearchItem'
import SideBar from './SideBar'

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
            initCoords: {
                lat: 121,
                lng: -31
            },
            data: null,
            loaded: false,
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            searchItemVisible: 'hidden',
            reload: false,
            sidebarVisible: ''
        };
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMapClicked = this.onMapClicked.bind(this);
        this.genUrl = this.genUrl.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.showAdvancedSearch = this.showAdvancedSearch.bind(this);
        this.onSideBarClick = this.onSideBarClick.bind(this);
        this.showSideBar = this.showSideBar.bind(this);
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
            param += param === '' ? '?' : '&';
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
                if (responseData['errorMessage']) {
                    alert("Wrong search parameters!");
                    this.setState({
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
                        searchItemVisible: 'hidden',
                    });
                    this.fetchData();
                }
                else {
                    let coords = responseData.length === 0 ? {coordinates: [31, 121]} : responseData[0].location;
                    this.setState({
                        data: responseData,
                        loaded: true,
                        searchItemVisible: 'hidden',
                        initCoords: {
                            lat: coords.coordinates[1],
                            lng: coords.coordinates[0]
                        }
                    });
                }
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
            searchItemVisible: 'hidden',
            sidebarVisible: 'hidden'
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
            searchItemVisible: ''
        })
    }

    onSideBarClick(coords) {
        this.setState({
            initCoords: coords,
            reload: true
        });
    }

    showSideBar() {
        // this.setState({
        //     sidebarVisible: ''
        // });
    }

    render() {
        if (!this.state.loaded) {
            return (
                <p>Loading...</p>
            )
        }
        if (this.state.reload) {
            console.log(this.state.reload);
            this.setState({
                reload: false
            });
            return (
                <p>Loading...</p>
            )
        }
        let top = 100;
        let left = -225;
        let searchItems = [];
        for (let key in this.state.searchParam) {
            if (key === 's') continue;
            searchItems.push([key, this.state.searchParam[key]])
        }
        return (
            <div className="App">
                <div>
                    <SearchBar
                        onClick={this.fetchData}
                        onChange={event => {
                            let newParam = this.state.searchParam;
                            newParam.s = event.target.value;
                            this.setState({searchParam: newParam});
                        }}
                        onFocus={this.showAdvancedSearch}
                        defaultValue={this.state.searchParam.s}
                    />
                </div>
                <div>
                    {/*<button style={{position: 'absolute', left: '80%', fontSize: '20px', zIndex: '99'}}*/}
                            {/*onclick={this.showSideBar()}>Station List</button>*/}
                    <SideBar content={this.state.data}
                             onClick={(coords) => this.onSideBarClick(coords)}
                             visibility={this.state.sidebarVisible}
                    />
                </div>
                <div>
                    <Map
                        google={this.props.google}
                        zoom={13}
                        initialCenter={{
                            lat: this.state.initCoords.lat,
                            lng: this.state.initCoords.lng
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
                    <label style={{
                        zIndex: 50, position: 'absolute', top: 50, left: 22, backgroundColor: 'white',
                        height: 170, width: 803, visibility: this.state.searchItemVisible
                    }}>Hello world</label>
                    {searchItems.map(each => {
                        left += 250;
                        if (left > 525) {
                            left = 25;
                            top += 30;
                        }
                        console.log(left + "-" + top);
                        return (
                            <SearchItem visibility={this.state.searchItemVisible}
                                        defaultValue={each[1]}
                                        onChange={event => {
                                            let newParam = this.state.searchParam;
                                            newParam[each[0]] = event.target.value;
                                            this.setState({searchParam: newParam});
                                        }}
                                        top={top}
                                        left={left}
                                        label={each[0]}
                            />)
                    })}
                </div>
            </div>

        );
    }
}

export default GoogleApiWrapper({
    apiKey: ('AIzaSyBMGothypP_77NOELNp_-kTejVXmXgIeII')
})(App)

