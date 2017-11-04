import React, {Component} from 'react';

export default class SearchItem extends Component {
    render() {
        return (
            <div style={{zIndex: 99, position: 'absolute', top: this.props.top,
                left: this.props.left, backgroundColor: 'white', visibility: this.props.visibility}}>
                <text>{this.props.label}:</text>
                <input type={'text'}
                       defaultValue={this.props.defaultValue}
                       onChange={this.props.onChange}
                />
            </div>
        )
    }
}
