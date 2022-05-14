import React, { useEffect } from 'react'

import { Routes, Route} from 'react-router-dom'

import Navigationbar from './components/navbar'
import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register';
import Profile from './pages/profile'
import PostPage from './pages/postpage'
import Forget from './pages/forget'
import ResetPassword from './pages/reset-password'

import  Axios  from 'axios';
import { useDispatch, useSelector } from 'react-redux';
function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state)

  useEffect(()=>{
    const uid = localStorage.getItem("token")
    Axios.get(`http://localhost:5000/api/users/${uid}`)
    .then((respond)=>{
      dispatch({type:'LOGIN', payload:respond.data[0]})
    })
    .catch((error)=>{
      console.log(error.response.data)
    })
  },[])
  return (
    <div>
      <Navigationbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/postpage' element={<PostPage/>}/>
        <Route path='/forget' element={<Forget/>}/>
        <Route path='/reset-password/:uid' element={<ResetPassword/>}/>
      </Routes>
    </div>
  )
}

export default App;