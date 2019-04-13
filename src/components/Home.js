import React from 'react';
import { Tabs } from 'antd';
import { Order } from './OrderForm'
import { Route } from './Route'
import { Track } from './Track'
import { OrderId } from './OrderId'
import { TrackData } from './TrackData'
import { About } from './About'

// parent to child ==> use props
// child to paren ==> use function

const TabPane = Tabs.TabPane;
function callback(key) {
  console.log(key);
}

export class Home extends React.Component { 
  state = {
    isLoadingTrackedOrders: false,
    isChoosingRoute: false,
    getOrderId: false,
    showTrackData: false,
    error: '',
    routes: {
      robot_time: 24.7,
      robot_distance :29.29,
      robot_price: 2.9290000000000003,
      drone_time: 4.095836559275612,
      drone_distance: 13.652788530918706,
      drone_price: 4.095836559275612,
      pickup: "1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA",
      dropoff: "2086 Newpark Mall, Newark, CA 94560, USA",
    }, // routes to be selected
    // https://mrcoles.com/blog/scroll-sneak-maintain-position-between-page-loads/
    pageOffset: {
      x: 0,
      y: 0
    },
    robType: 'Drone',
    arrival: '0:0:0',
    orderId: 0,
    trackData: '0:0:0',
  }

  componentDidMount(){
    window.scrollTo(this.state.pageOffset.x, this.state.pageOffset.y);
  }
 
  beginChoosingRoute = (begin, routes) => {
    if (begin === true) {
      // convert route to list
      this.setState({ isChoosingRoute: true, routes: routes});
    } else {
      this.setState({ isChoosingRoute: false });
    }
    console.log(routes);
  };

  backToPlaceOrder = () => {
    this.setState({ isChoosingRoute: false, getOrderId: false });
  }

  backToTrackOrder = () => {
    this.setState({ showTrackData: false });
  }

  changePageOffset = (newX, newY) => {
    this.setState({
        pageOffset: {
          x:newX,
          y:newY
        }
      });
  }

  placeAnOrder = () => {
    const isChoosingRoute = this.state.isChoosingRoute;
    // have got order id
    if (this.state.getOrderId) {
        return (
          <div>
          <OrderId
            orderId={this.state.orderId}
            backToPlaceOrder={this.backToPlaceOrder}
            dropoff={this.state.routes.dropoff}
            arrival={this.state.arrival}
            robType={this.state.robType}
          />
          </div>
        )
    }
    if (!isChoosingRoute) {
        return (
          <div>
          <Order 
            userID={this.state.userID} 
            beginChoosingRoute={this.beginChoosingRoute}
            changePageOffset={this.changePageOffset}
            storeSizeWeight={this.storeSizeWeight}
          />
          </div>
          )
    } else if (isChoosingRoute){
        return (<Route routes={this.state.routes}
            chooseRoute={this.chooseRoute}
            backToPlaceOrder={this.backToPlaceOrder}
            changePageOffset={this.changePageOffset}
            />);
    }
  }

  storeSizeWeight = (size, weight) => {
    localStorage.setItem("size", size);
    localStorage.setItem("weight", weight);
  }

  // change this.state.orderId
  chooseRoute = (orderId, robType, arrival) => {
    this.setState({
      getOrderId: true,
      orderId: orderId,
      robType: robType,
      arrival: arrival,
    });
  }

  showTrackData = (orderId, trackData) => {
    this.setState({
      showTrackData: true,
      orderId: orderId,
      trackData: trackData.ArrivalTime,
    });
  }

  trackOrders = () => {
    if(this.state.showTrackData) {
      return (
        <TrackData
          orderId={this.state.orderId}
          trackData={this.state.trackData}
          backToTrackOrder={this.backToTrackOrder}
        />
    )
    } else {
      return (
      <Track
        showTrackData={this.showTrackData}
      />);
    } 
  }

  about = () => {
    return (
      <About

      />
    );
  }

  render() {
    return ( 
      <div className="home">
      <Tabs defaultActiveKey="1">
        <TabPane tab="Place An Order" key="1" className="tabPage">
          {this.placeAnOrder()}
        </TabPane>
        <TabPane tab="Track Orders" key="2" className="tabPage">
          {this.trackOrders()}
        </TabPane>
        <TabPane tab="User Profile" key="3" className="tabPage">
          {this.about()}
        </TabPane>
      </Tabs>
    </div>
    );
  }
}

