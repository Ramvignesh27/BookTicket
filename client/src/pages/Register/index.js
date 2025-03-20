import React from 'react'
import { Alert, Button, Form, Input, message, Radio } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { RegisterUser } from '../../api/users';

function Register() {
    const navigate = useNavigate();
    const onFinish = async (values)=>{
        try {
            const response = await RegisterUser(values);
            if(response.success){
                message.success(response.message);
                console.log(response.message);
                
                navigate("/login");
            }
            else{
                message.error(response.message);
            }
        } catch (error) {
            message.error(error.message);
        }
    }
  return (
    <>
    <main className='App-header'>
        <h1>Register to BookMyShow</h1>
        <section className='mw-500 text-center px-3'>
            <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="Name" htmlFor="name" name="name" className="d-block"
                        rules={[{required: true, message: "Name is required"}]}>
                        <Input id="name" type="text" placeholder="Enter your Name"></Input>
                </Form.Item>
                <Form.Item label="Email" htmlFor="email" name="email" className="d-block"
                        rules={[{required: true, message: "Email is required"},{type: "email", message: "Please enter a valid email"}]}>
                        <Input id="email" type="text" placeholder="Enter your Email"></Input>
                </Form.Item>
                <Form.Item label="Password" htmlFor="password" name="password" className="d-block"
                        rules={[{required: true, message: "Password is required"}]}>
                        <Input id="password" type="password" placeholder="Enter your Password"></Input>
                </Form.Item>
                <Form.Item className='d-block'>
                    <Button type='primary' block htmlType='submit' style={{fontSize: "lrem", fontWeight: "600"}}>Register</Button>
                </Form.Item>
                <Form.Item label="Register as partner" htmlFor="role" name="role" className='d-block text center' initialValue={false}
                    rules={[{required: true, message: "Please select an option!"}]}>
                        <div className='d-flex justify-content-start'>
                            <Radio.Group name="radiogroup" className="flex-start">
                                <Radio value={"partner"}>Yes</Radio>
                                <Radio value={"user"}>No</Radio>
                            </Radio.Group>
                        </div>

                </Form.Item>
            </Form>
            <div>
                <p>Already a user? <Link to='/login'>Login Now</Link></p>
            </div>
        </section>
    </main>
    </>
  )
}

export default Register