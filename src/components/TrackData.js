import React from 'react';
import { Avatar, Divider, Button } from 'antd';

export class OrderId extends React.Component {

    getArrival = (arrival) => {
        var res = arrival.split(':')
        return res[0] + ':' + res[1]
    };

    render(){
        const pic = (this.props.robType == 'Drone') ? "http://img14.360buyimg.com/n7/jfs/t15265/50/2015250726/150052/1996ee0c/5a675125N4ad6dc92.jpg":"http://i.epochtimes.com/assets/uploads/2016/03/%E6%9C%BA%E5%99%A8%E4%BA%BA-600x400.jpg"
        const arrival = this.getArrival(this.props.arrival)
        return (
            <div className="routesList">
                <br/>
                <h1><Avatar src={pic} /></h1>
                <Divider>Your order id is {this.props.orderId}</Divider>
                <p>Woooo! Your package will be on the way!</p>
                <p>It will arrive {this.props.dropoff} at {arrival} today. 
                Please use this order id to track your order in tag "Track Orders".</p>
                <Divider dashed />
                <br/>
                <br/>
                <Button onClick={this.backToTrackOrder}>Back to track an order</Button>
                </div> 
        )
    }
}