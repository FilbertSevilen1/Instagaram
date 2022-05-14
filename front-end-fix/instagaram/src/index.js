import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { createStore} from 'redux'
import { Provider } from 'react-redux'

// import main component
import App from './main'
import './css/main.css'
import { ChakraProvider } from '@chakra-ui/react'

const INITIAL_STATE = {
    uid : '',
    fullname : '',
    username : '',
    bio : '',
    email : '',
    profilepicture : '',
    verified : '',
    posts: []
  }
  function Reducer(state = INITIAL_STATE, action){
    if(action.type == 'LOGIN'){
      return {
        ...state,
        uid : action.payload.uid,
        fullname : action.payload.fullname,
        username : action.payload.username,
        bio : action.payload.bio,
        email : action.payload.email,
        profilepicture : action.payload.profilepicture,
        verified : action.payload.verified,
        
      }
    }
  
    else if(action.type == 'LOGOUT'){
      return INITIAL_STATE
    }

    else if(action.type == 'GET_POST'){
      return {
        ...state, posts: action.payload
      };
    }

    else{
      return state;
    }
  }
  const store = createStore(Reducer);

// render main component
ReactDOM.render( 
  <ChakraProvider>
      <BrowserRouter>
          <Provider store = {store}>
              <App/>
          </Provider>
      </BrowserRouter>
    </ChakraProvider>
    ,document.getElementById("root")
)