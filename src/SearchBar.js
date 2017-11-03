import React, {Component} from 'react';

export default class SearchBar extends Component {
    render() {
        return (
            <div style={{zIndex: 99, position: 'absolute', top: 50, left: 20}}>
                <input type={'text'}
                       defaultValue={this.props.defaultValue}
                       onChange={this.props.onChange}
                       style={{height: 30, width: 800}}
                />
                <button
                    onClick={this.props.onClick}
                    style={{zIndex: 200, position: 'absolute', right: 0, height: 35, width: 80}}
                >Search</button>
            </div>
        )
    }
}
