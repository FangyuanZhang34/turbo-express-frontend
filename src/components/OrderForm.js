import React from 'react';
import { Map } from './Map'
import { Form, Input, Button, message } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { API_ROOT, TOKEN_KEY, AUTH_HEADER } from '../constants.js';

class OrderForm extends React.Component {
    state = {
        addressPU: '8116 Lincoln Way, San Francisco, CA 94122, USA',
        addressDO: '2086 Newpark Mall, Newark, CA 94560, USA',
        pickUpMarkerPosition: {
            lat: 0,
            lng: 0,
        },
        droppOffMarkerPosition: {
            lat: 0,
            lng: 0,
        },
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem(TOKEN_KEY);
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const size = (parseFloat(values.length)+parseFloat(values.width)+parseFloat(values.height)).toString();
                const weight = parseFloat(values.weight);
                const pickup = this.state.addressPU;
                const dropoff = this.state.addressDO;
                this.props.storeSizeWeight(size, weight);
                fetch(`${API_ROOT}/search`, {
                    method: 'POST',
                    headers: {
                        "Authorization": `${AUTH_HEADER} ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        size: size,
                        weight: weight,
                        pickup: pickup,
                        dropoff: dropoff,
                    })
                })
                .then((response) => {
                    if (response.ok) {
                        return response.json();  // get routes information
                    }
                    throw new Error(response.statusText);
                })
                .then((routes) => {
                    this.props.beginChoosingRoute(true, routes);               
                })
                .catch((e) => {
                    console.log(e)
                    message.error('Order Failed.');
                });
             }
           });
    }

    needChangePageOffset = (newX, newY) => {
        this.props.changePageOffset(newX, newY);
        // alert(newY);
    }

    changePULoc = (addressPU) => {
        this.setState({
            addressPU: addressPU,
        });
        console.log("Pickup : " + this.state.addressPU);
    }

    changeFOLoc = (addressDO) => {
        this.setState({
            addressDO: addressDO,
        });
        console.log("Droppoff : " + this.state.addressDO);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 8 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 10 },
            },
          };


        return (   
            <Form {...formItemLayout} onSubmit={this.handleSubmit} className="order-form">
                <Form.Item label="size-length">
                    {getFieldDecorator('length', {
                        rules: [{ required: false,}, {
                            validator: this.validateToNextPassword,
                        }],
                    })(
                    <Input type="number" min="0"/>
                    )}
                </Form.Item>
                <Form.Item label="size-width">
                    {getFieldDecorator('width', {
                        rules: [{ required: false,}, {
                            validator: this.validateToNextPassword,
                        }],
                    })(
                    <Input type="number" min="0"/>
                    )}
                </Form.Item>
                <Form.Item label="size-height">
                    {getFieldDecorator('height', {
                        rules: [{ required: false,}, {
                            validator: this.validateToNextPassword,
                        }],
                    })(
                    <Input type="number" min="0"/>
                    )}
                </Form.Item>
                <Form.Item label="weight">
                    {getFieldDecorator('weight', {
                        rules: [{ required: false,}, {
                            validator: this.validateToNextPassword,
                        }],
                    })(
                    <Input type="number" min="0"/>
                    )}
                </Form.Item>
                <Map className="theMap"
                    google={this.props.google}
                    center={{lat: 37.77, lng: -122.43}}
                    height='400px'
                    needChangePageOffset={this.needChangePageOffset}
                    changePULoc={this.changePULoc}
                    changeFOLoc={this.changeFOLoc}
                />
                <FormItem>
                    <Button type="primary" htmlType="submit" className="order-form-button">
                        Place an order
                    </Button>
                </FormItem>
            </Form>
            
        );
    }
}

export const Order = Form.create()(OrderForm);