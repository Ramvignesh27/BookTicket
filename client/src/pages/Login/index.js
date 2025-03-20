import React from 'react'
import { Button, Form, Input, message } from "antd";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { LoginUser } from '../../api/users';
import { axiosInstance } from '../../api/index';

function Login() {
    const navigate = useNavigate();
    const onFinish = async (values)=>{
        try {
            const response = await LoginUser(values);
            if(response.success){
                message.success(response.message);
                console.log(response.data);
                
                localStorage.setItem("token", response.data);
                navigate('/');
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
            <h1>Login to BookMyShow</h1>
            <section className='mw-500 text-center px-3'>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item label="Email" htmlFor="email" name="email" className="d-block"
                            rules={[{required: true, message: "Email is required"},{type: "email", message: "Please enter a valid email"}]}>
                            <Input id="email" type="text" placeholder="Enter your Email"></Input>
                    </Form.Item>
                    <Form.Item label="Password" htmlFor="password" name="password" className="d-block"
                            rules={[{required: true, message: "Password is required"}]}>
                            <Input id="password" type="password" placeholder="Enter your Password"></Input>
                    </Form.Item>
                    <Form.Item className='d-block'>
                        <Button type='primary' block htmlType='submit' style={{fontSize: "lrem", fontWeight: "600"}}>Login</Button>
                    </Form.Item>
                </Form>
                <div>
                    <p>New user? <Link to='/register'>Register Here</Link></p>
                    <p> Forgot Password? <Link to="/forget">Click Here</Link> </p>
                </div>
            </section>
        </main>
    </>
  )
}

export default Login