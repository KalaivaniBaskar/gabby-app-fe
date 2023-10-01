import React from 'react'
import ContactPanel from './ContactPanel'

const ContactPanelSide = ({socket}) => {
  return (
    <div style={{width: '260px'}}>
       <ContactPanel socket={socket} />
    </div>
  )
}

export default ContactPanelSide