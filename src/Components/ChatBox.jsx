import React, { useEffect, useState, useRef } from 'react'
import { useCTX } from '../Context/ContextProvider.jsx';
import { BsEmojiSmileFill} from 'react-icons/bs'
import SendIcon from '@mui/icons-material/Send';
import { Tooltip, Avatar,  Button } from '@mui/material';
import EmojiPicker from 'emoji-picker-react';
import CancelIcon from '@mui/icons-material/Cancel';
import ScrollToBottom from "react-scroll-to-bottom";
import { toast} from 'react-toastify'
import { BASE_URL } from '../Services/APIServices.js';
import axios from 'axios';

const ChatBox = ({socket}) => {
    
   const subRef = useRef();
    const {user, room, chatUser, setChatUser, 
      messageList, setMessageList, toastOptions} = useCTX();
    const [ showPicker, setShowPicker] = useState(false)
    const [msg, setMsg] = useState("")
   
    const handlePicker = () => {
        setShowPicker(!showPicker)
    }
    const onEmojiClick = ( emojiObj, event) => {
        //console.log(event, emojiObj)
        setMsg((prev) => prev+emojiObj.emoji )
    }
    const sendChatMsg = async(e) => {
        e.preventDefault(); 
        if(msg.trim()){
           
            const d = new Date(Date.now());
            let year = d.getFullYear()
            let month = d.getMonth()+1
            let dt = d.getDate()
            const date = String(year) + "/" +
                            ( month<10 ? '0'+String(month) : String(month)) + 
                             "/" + ( dt<10 ? '0'+String(dt) : String(dt)) 
              let hr = d.getHours();
              let min = d.getMinutes()
              min = min > 10 ? min : ("0"+min) 
              hr = min > 10 ? hr : ("0"+hr) 
                
            const time = hr + ":" + min
            const msgData = {
                room : room,
                sender: user.email,
                message: msg,
                time,
                date,
            }

             await socket.emit("send_msg", msgData); 
            //console.log(res)
            setMessageList((list) => [...list, msgData]); 
            await addChatMessages(time, date)
            setMsg("")
        }
    } 
    
    const addChatMessages = async(time,date) => {

      try{  
        const newMsg = {
          sender: user.email,
          message: msg,
          time,
          date
        }
       // handleOpen()
        const token = localStorage.getItem('tokenAuth')
        const config = { headers : {"x-auth-token" : token}}
        const response = await axios.post(`${BASE_URL}/auth/user/chat`, 
        {room_ID: room, newMsg }, config )
         //console.log(response)
         
      }
      catch(error){ 
        console.log(error)
        const err = error?.response?.data?.message
        toast.error (
            (err ? err : "Error fetching chat! ".concat(error.response.status)),
            toastOptions
        )
      //  handleClose()
      }  
    }
    // useEffect( ()=> {
    //    setMessageList([])
    // }, [room])

    useEffect(()=> {
      socket.on("receive_msg", (data) => {
        //console.log("recei",data)
         setMessageList((list) => [...list, data]);
      }) 
      
      // socket.on("notification", (data) => {
      //   console.log("rec notif", data)
      // //toast.success(data.message, toastOptions)
      //  })
  },[socket])

  return (
  
    <div className='chat-screen'>
         <div className='flex-start'> 
          <Tooltip title= {<p style={{ color: "white", 
            fontSize: '14px' }}>{chatUser.email} </p>}
            placement="right-end" arrow>
              <Avatar sx={{ width: 50, height: 50 , 
              bgcolor: `#${Math.floor(Math.random()*16777215).toString(16)}` }}  
              alt={chatUser.username} 
              src= {chatUser.pic_URL }
              />
            </Tooltip>
            <p>{chatUser.username}</p> 
            <Button className='flex-end' onClick={() => setChatUser("")}>
                <CancelIcon />
            </Button>

            </div> 
          {/* <div>   */}
          <div className='chat-msgs'>
          <ScrollToBottom className="message-container">
            {messageList.map((messageContent, idx) => {
              return (
                <div  key={idx}
                  className="message"
                  id={user.email === messageContent.sender ? "you" : "other"}
                >
                  <div> 
                    <div className="message-content">
                      <p>{messageContent.message}</p>
                    </div>
                    <div className="message-meta">
                      <p id="time">{messageContent.time}</p>
                      <p id="sender">{messageContent.date}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollToBottom>
          </div>
         {/* </div> */}
         <div className='flex' >  
            <div className='emoji'>
                <BsEmojiSmileFill onClick={handlePicker} /> 
                {
                  showPicker &&
                   <EmojiPicker onEmojiClick={onEmojiClick} />
                }
            </div>
            <form  className='chat-inp' onSubmit={sendChatMsg}>
                <input type="text" value={msg} 
                onChange={(e)=> setMsg(e.target.value)}
                placeholder='write your message'/>

                <button id="sub-btn"  type="submit">
                  <SendIcon/></button>
            </form>
         </div>
    </div>
    
  )
}

export default ChatBox