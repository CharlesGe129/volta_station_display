import React, {Component} from 'react';

export default class SearchItem extends Component {
    render() {
        return (
            <div style={{zIndex: 99, position: 'absolute', top: 100, left: 20, backgroundColor: 'white',
                visibility: this.props.visibility}}>
                <text>available:</text>
                <input type={'text'}
                       defaultValue={this.props.defaultValue}
                       onChange={this.props.onChange}
                />
            </div>
        )
    }
}
