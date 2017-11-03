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
                limit: '5',
                offset: '',
                orderby: '',
                sortdir: '',
                returns: '',
            }
        }
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
                console.log(responseData)
            });
        return 'hello';
    }

    render() {
        return (
            <div className="App">
                <div>
                    <Map google={this.props.google} zoom={14}>

                        <Marker onClick={this.onMarkerClick}
                                name={'Current location'} />

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

