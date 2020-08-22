import React, { useState } from 'react'
import Axios from 'axios'
import {useDispatch, Provider} from 'react-redux'
import {loginUser} from '../../../_actions/user_action'
import { PromiseProvider } from 'mongoose'

function LoginPage(props){
    const dispatch = useDispatch()
    const [Email,setEmail]=useState("")
    const [Password,setPassword]=useState("")
    const onEmailHandler=(event)=>{
        setEmail(event.currentTarget.value)
    }
    const onPasswordHandler=(event)=>{
        setPassword(event.currentTarget.value)
    }
    const onSubmitHandler=(event)=>{
        event.preventDefault()
        console.log('email',Email)
        console.log('passw',Password)
        let body={
            email:Email,
            password:Password
        }
        dispatch(loginUser(body))
        .then(response=>{
            if(response.payload.loginSuccess){
                props.history.push('/')
            }
            else{
                alert('error')
            }
        })
    }
    return(
        <div style={{
            display:'flex',justifyContent:'center',
            alignItems:"center",width:"100%",height:'100vh'
        }}>
            <form style={{display:'flex',flexDirection:'column'}}
                onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type='email' value={Email} onChange={onEmailHandler}/>
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler}/>
                <br/>
                <button>
                    login
                </button>
            </form>
        </div>
    )
}
export default LoginPage