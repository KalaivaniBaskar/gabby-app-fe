import React, { useEffect, useState, useRef } from 'react'
import { useCTX } from '../Context/ContextProvider.jsx';
import { BsEmojiSmileFill} from 'react-icons/bs'
import SendIcon from '@mui/icons-material/Send';
import { Tooltip, Avatar,  Button } from '@mui/material';
import EmojiPicker from 'emoji-picker-react';
import CancelIcon from '@mui/icons-material/Cancel';
import ScrollToBottom from "react-scroll-to-bottom";

const ChatBox = ({socket}) => {
    
   const subRef = useRef();
    const {user, room, chatUser, setChatUser} = useCTX();
    const [ showPicker, setShowPicker] = useState(false)
    const [msg, setMsg] = useState("")
    const [messageList, setMessageList] = useState([]);
    
   
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
            const hr = new Date(Date.now()).getHours();
            let min = new Date(Date.now()).getMinutes()
            min = min > 10 ? min : ("0"+min)

            const msgData = {
                room : room,
                sender: user.email,
                message: msg,
                time: hr + ":" + min
            }

             await socket.emit("send_msg", msgData); 
            //console.log(res)
            setMessageList((list) => [...list, msgData]);
            setMsg("")
        }
    } 
    
    useEffect( ()=> {
       setMessageList([])
    }, [room])

    useEffect(()=> {
      socket.on("receive_msg", (data) => {
        //console.log("recei",data)
         setMessageList((list) => [...list, data]);
      }) 
      
      socket.on("notification", (data) => {
        console.log("rec notif", data)
      //toast.success(data.message, toastOptions)
       })
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
                <div key={idx}
                  className="message"
                  id={user.email === messageContent.sender ? "you" : "other"}
                >
                  <div>
                    <div className="message-content">
                      <p>{messageContent.message}</p>
                    </div>
                    <div className="message-meta">
                      <p id="time">{messageContent.time}</p>
                      <p id="sender">{messageContent.sender}</p>
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

                <button id="sub-btn" ref={subRef}  type="submit">
                  <SendIcon/></button>
            </form>
         </div>
    </div>
    
  )
}

export default ChatBox