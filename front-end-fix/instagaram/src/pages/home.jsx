import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
import Post from './post.jsx'
import '../css/home.css'
function Home () {
    const user = useSelector((state) => state)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let posts = user.posts;

    useEffect(()=>{
        Axios.get("http://localhost:5000/api/post")
        .then((respond)=>{
            console.log(respond.data)
            dispatch({type:'GET_POST', payload:respond.data})
        })
        .catch((error)=>{
            console.log(error.response.data)
        })
    },[])
    
    const renderGaram = () =>{
        if(posts){
            console.log('post : ',posts)
            return posts.map((post, index) => {
                return <Post 
                    key = {post.id}
                    post = {post}
                />
            })
        }
    }

    return (
        <div className='homeContainer'>
            {
                user.username?
                <div className='homeContent'>
                    {renderGaram()}
                </div>
                :
                <div>
                    <div className='homeHeader'>
                        <h1>Welcome To Instagaram</h1>
                    </div>
                    <div className='homeNotLoggedContent'>
                        Join with other salty people to create salty community
                        <div className='homeNotLoggedContentInputBox'>
                            <button className='homeButton' onClick={()=>navigate("/login")}>Login</button>
                            <button className='homeButton' onClick={()=>navigate("/register")}>Register</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
export default Home;