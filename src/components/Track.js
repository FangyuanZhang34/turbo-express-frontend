import React from 'react';
import {
    Form, Input, Button, message, 
} from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { API_ROOT, TOKEN_KEY, AUTH_HEADER } from '../constants.js';

class TrackForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem(TOKEN_KEY);
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const url = API_ROOT+'/track?orderid='+values.orderId;
                fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `${AUTH_HEADER} ${token}`,
                    },
                }).then((response) => {
                        if (response.ok) {
                            return response.json();  // get routes information
                        }
                        throw new Error(response.statusText);
                }).then((trackData) => {
                    console.log(trackData);
                    this.props.showTrackData(values.orderId, trackData);               
                })
                .catch((e) => {
                    console.log(e)
                    message.error('Order Failed.');
                });
             }
           });
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
          const tailFormItemLayout = {
            wrapperCol: {
              xs: {
                span: 24,
                offset: 0,
              },
              sm: {
                span: 16,
                offset: 8,
              },
            },
          };


        return (   
            <Form {...formItemLayout} onSubmit={this.handleSubmit} className="order-form">
                <Form.Item label="Order ID">
                    {getFieldDecorator('orderId', {
                        rules: [{ required: false,}, {
                            validator: this.validateToNextPassword,
                        }],
                    })(
                    <Input type="number" min="0"/>
                    )}
                </Form.Item>
                <FormItem>
                    <Button type="primary" htmlType="submit" className="order-form-button">
                        Track an order
                    </Button>
                </FormItem>
            </Form>
            
        );
    }
}

export const Track = Form.create()(TrackForm);