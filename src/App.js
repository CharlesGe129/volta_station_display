import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

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
                limit: '',
                offset: '',
                orderby: '',
                sortdir: '',
                returns: '',
            },
            data: null,
            loaded: false
        };
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

    render() {
        if (!this.state.loaded) {
            return (
                <p>Loading...</p>
            )
        }
        return (
            <div className="App">
                <div>
                    <p>Hello world</p>
                </div>
                <div>
                    <Map google={this.props.google} zoom={13} initialCenter={{
                        lat: this.state.data[0].location.coordinates[1],
                        lng: this.state.data[0].location.coordinates[0]
                    }}>
                        {this.state.data.map(each => {
                            let lat = each.location.coordinates[1];
                            let lng = each.location.coordinates[0];
                            return (
                                <Marker
                                    title={'The marker`s title will appear as a tooltip.'}
                                    name={'SOMA'}
                                    position={{lat: lat, lng: lng}}
                                    // onMouseover={}
                                    // onClick={}
                                />)
                        })}
                        <InfoWindow onClose={this.onInfoWindowClose}>
                            <div>
                                <h1>{'3333'}</h1>
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

