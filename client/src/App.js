import logo from './logo.svg';
import './App.css';
import Home from './pages/Home/index';
import Admin from './pages/Admin/index'
import Login from './pages/Login';
import Register from './pages/Register';
import Partner from './pages/Partner';
import Profile from './pages/User';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import ProtectedRoute from './components/protectedRoute';
import {Provider} from 'react-redux';
import store from './redux/store';
import SingleMovie from './pages/Home/SingleMovie';
import BookShow from './pages/Home/BookShow';
import Forget from './pages/User/ForgetPassword';
import Reset from './pages/User/ResetPassword';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Home></Home></ProtectedRoute>}></Route>
            <Route path="/login" element={<Login></Login>}></Route>
            <Route path="/register" element={<Register></Register>}></Route>
            <Route path='/admin' element={<ProtectedRoute><Admin></Admin></ProtectedRoute>}></Route>
            <Route path='/profile' element={<ProtectedRoute><Profile/></ProtectedRoute>}></Route>
            <Route path='/partner' element={<ProtectedRoute><Partner/></ProtectedRoute>}></Route>
            <Route path='/movie/:id' element={<ProtectedRoute><SingleMovie/></ProtectedRoute>}></Route>
            <Route path='/book-show/:id' element={<ProtectedRoute><BookShow></BookShow></ProtectedRoute>}></Route>
            <Route path="/forget" element={<Forget />} />
            <Route path="/reset/:email" element={<Reset />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
