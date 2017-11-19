import React, {Component} from 'react';

export default class SideBar extends Component {
    render() {
        return (
            <div style={{zIndex: 99, position: 'absolute', left: '80%', top: '50px', width: '0', height: '0',
                visibility: this.props.visibility}} >
                {this.props.content.map(each => {
                    let coords = { 'lat': each.location.coordinates[1], 'lng': each.location.coordinates[0] };
                    return (
                        <button onClick={(event) => this.props.onClick(coords)} style={{fontSize: 15, width: '200px'}}>
                            {each.name}
                        </button>
                    )
                })}
            </div>
        )
    }
}
