import React from 'react';
import { Divider, Button } from 'antd';

export class TrackData extends React.Component {

    getArrival = (arrival) => {
        var res = arrival.split(':');
        if(this.hasArrived(res)) {
            return "Your package has already been delivered at " + res[0] + ':' + res[1] + " today.";
        }
        return "Your package will be delivered at " + res[0] + ':' + res[1] + " today.";
    };

    hasArrived = (res) => {
        var now = new Date();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        var diffHour = hour - res[0];
        var diffMinute = minute - res[1];
        var diffSecond = second - res[2];
        return (diffHour > 0 || (diffHour === 0 && diffMinute > 0) || (diffHour === 0 && diffMinute === 0 && diffSecond > 0));
    };

    render(){
        const message = this.getArrival(this.props.trackData)
        return (
            <div className="routesList">
                <br/>
                <Divider>Order id {this.props.orderId}</Divider>
                {message}
                <Divider dashed />
                <br/>
                <br/>
                <Button onClick={this.props.backToTrackOrder}>OK</Button>
            </div> 
        )
    }
}