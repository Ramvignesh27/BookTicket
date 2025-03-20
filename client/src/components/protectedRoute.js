import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {HomeOutlined, LogoutOutlined, ProfileOutlined, UserOutlined} from "@ant-design/icons"
import Home from '../pages/Home/index';
import { HideLoading, ShowLoading } from '../redux/loaderSlice';
import { SetUser } from '../redux/userSlice';
import { message, Layout, Menu } from 'antd';
import { GetCurrentUser } from '../api/users';

const ProtectedRoute = ({children}) => {
    const {user} =  useSelector(state => state.users);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {Header, Content, Footer, Sider} = Layout;
    const navItems = [{
        label: (<span onClick={()=>{navigate("/")}}>Home</span>),
        icon: <HomeOutlined />,
    },
    {
        label: `${user ? user.name : ""}`,
        icon: <UserOutlined />,
        children: [
            {
                label: (<span onClick={()=>{
                    if(user.role === 'admin'){
                        navigate("/admin");
                    }
                    else if(user.role === 'partner'){
                        navigate("/partner");
                    }
                    else{
                        navigate("/profile");
                    }
                }}>My Profile</span>),
                icon: <ProfileOutlined />,
            },
            {
                label: (<Link to="/login" onClick={()=>{
                    localStorage.removeItem("token");
                }}>Log Out</Link>),
                icon: <LogoutOutlined />,
            },
        ],
    },
    ];
    const getValidUser = async ()=>{
        try {
            dispatch(ShowLoading());
            const response  =await GetCurrentUser();
            console.log(response.data);
            dispatch(SetUser(response.data));
            dispatch(HideLoading());
            
        } catch (error) {
            dispatch(SetUser(null));
            message.error(error.message);
        }
    };
    useEffect(()=>{
        if(localStorage.getItem("token")){
            getValidUser();
        }
        else{
            navigate("/login");
        }
    },[])
    // console.log("protected route enabled", user);
    
    return(user && (
        <>
            <Layout>
                <Header
                className='d-flex justify-content-between'
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                }}
                >
                    <h3 className='demo-logo text-white m-0' style={{color: "white"}}>Book My Show</h3>
                    <Menu theme='dark' mode='horizontal' items={navItems}></Menu>
                </Header>
                <div style={{padding: 24, minHeight: 380, background: "#fff"}}>{children}</div>
            </Layout>
        </>
    ))
}

export default ProtectedRoute;
