import React, { Component }from 'react';
import { API_ROOT, TOKEN_KEY, AUTH_HEADER } from '../constants.js';
  
import { List, Avatar, Button, message } from 'antd';


export class Route extends Component {

    
    clickOrder = (item) => {
        const token = localStorage.getItem(TOKEN_KEY);
        const size = localStorage.getItem(size);
        const weight = localStorage.getItem(weight);
        var now = new Date();
        var time = now.getTime() + (1000 * 60 * item.Duration);
        var newDate = new Date(time);
        const arrival = newDate.getHours().toString() + ":"+ newDate.getMinutes().toString() + ":"+ newDate.getSeconds().toString()
        alert(arrival)
        fetch(`${API_ROOT}/order`, {
        method: 'POST',
        headers: {
            "Authorization": `${AUTH_HEADER} ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            size: size,
            weight: weight,
            arrival: arrival,
            pickup: item.pickup,
            dropoff: item.dropoff,
        }),  
        }).then((response) => {
            if (response.ok) {
                return response.json();  // get routes information
            }
            throw new Error(response.statusText);
            })
            .then((order) => {
                console.log(order.OrderId);
                this.props.chooseRoute(order.OrderId, item.RobotType, arrival);               
            })
            .catch((e) => {
                console.log(e)
                message.error('Order Failed.');
            });
    }
    render(){
        const data = [
            {
                RobotType: 'Drone',
                RobotId: '1',
                Dist: this.props.routes.drone_distance,
                Cost: this.props.routes.drone_price,
                Duration: this.props.routes.drone_time  
            },
            {
                RobotType: 'Robot',
                RobotId: '1',
                Dist: this.props.routes.robot_distance,
                Cost: this.props.routes.robot_price,
                Duration: this.props.routes.robot_time  
            },
          ];
        return (
            <div className="routesList">
                <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                        avatar={<Avatar src= {item.RobotType == 'Drone' ? "http://img14.360buyimg.com/n7/jfs/t15265/50/2015250726/150052/1996ee0c/5a675125N4ad6dc92.jpg":"http://i.epochtimes.com/assets/uploads/2016/03/%E6%9C%BA%E5%99%A8%E4%BA%BA-600x400.jpg"} />}
                        title={item.RobotType+' '+item.RobotId}
                        description={'Cost : $'+item.Cost.toFixed(2)+'; Distance : '+item.Dist.toFixed(2)+'km; Estimated Duration: '+item.Duration.toFixed(2)+'min'}
                        />
                        <Button onClick={() => {this.clickOrder(item)}}>Order</Button>
                    </List.Item>                  
                )}
                />
                <br/>
                <Button onClick={this.props.backToPlaceOrder}>Back to place an order</Button>
            </div> 
        )
    }
};