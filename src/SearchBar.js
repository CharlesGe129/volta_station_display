import React, {Component} from 'react';

export default class SearchBar extends Component {
    render() {
        return (
            <div>
                <input type={'text'} onChange={this.props.onChange} />
                <button onClick={this.props.onClick}>Search</button>
            </div>
        )
    }
}