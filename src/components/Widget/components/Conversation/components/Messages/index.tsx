import { useEffect, useRef, useState, ElementRef, ImgHTMLAttributes, MouseEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import format from 'date-fns/format';

import { scrollToBottom } from '../../../../../../utils/messages';
import { MessageTypes, Link, CustomCompMessage, GlobalState } from '../../../../../../store/types';
import { setBadgeCount, markAllMessagesRead, resetVoiceReply, resetListening, setListening } from '../../../../../../store/actions';
import { MESSAGE_SENDER } from '../../../../../../constants';

import Loader from './components/Loader';
import './styles.scss';


type Props = {
  showTimeStamp: boolean,
  profileAvatar?: string;
  profileClientAvatar?: string;
}

function Messages({ profileAvatar, profileClientAvatar, showTimeStamp }: Props) {
  const dispatch = useDispatch();
  const { messages, typing, showChat, badgeCount, voiceReply, isListening } = useSelector((state: GlobalState) => ({
    messages: state.messages.messages,
    badgeCount: state.messages.badgeCount,
    typing: state.behavior.messageLoader,
    showChat: state.behavior.showChat,
    voiceReply: state.behavior.voiceReply,
    isListening: state.behavior.isListening,
    
  }));

  const messageRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // @ts-ignore
    scrollToBottom(messageRef.current);
    if (showChat && badgeCount) dispatch(markAllMessagesRead());
    else dispatch(setBadgeCount(messages.filter((message) => message.unread).length));

    //get the last message
    const lastMessage = messages[messages.length - 1];
 
    if (lastMessage && lastMessage.sender === MESSAGE_SENDER.RESPONSE && voiceReply) {
      const text = (lastMessage as MessageTypes).text;
      //alert((lastMessage as MessageTypes).text + " resetting");
     
      if (isListening){
        console.log('temporary stop listening to avoid double reply');
        dispatch(resetListening());
      }

   //   setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
       
        
        if (isListening){
          utterance.onend = () => {
          console.log('resume listening...');
          dispatch(setListening());
          }
        
        }else {
          //not listening, so do not do speech syntheseis next time
          dispatch(resetVoiceReply());
        
        }

        window.speechSynthesis.speak(utterance);
    //  } , 1000);
     
    }

  }, [messages, badgeCount, showChat]);
    
  const getComponentToRender = (message: MessageTypes | Link | CustomCompMessage) => {
    const ComponentToRender = message.component;
    if (message.type === 'component') {
      return <ComponentToRender {...message.props} />;
    }
    return <ComponentToRender message={message} showTimeStamp={showTimeStamp} />;
  };

  // TODO: Fix this function or change to move the avatar to last message from response
  // const shouldRenderAvatar = (message: Message, index: number) => {
  //   const previousMessage = messages[index - 1];
  //   if (message.showAvatar && previousMessage.showAvatar) {
  //     dispatch(hideAvatar(index));
  //   }
  // }

  const isClient = (sender) => sender === MESSAGE_SENDER.CLIENT;

  return (
    <div id="messages" className="rcw-messages-container" ref={messageRef}>
      {messages?.map((message, index) =>
        <div className={`rcw-message ${isClient(message.sender) ? 'rcw-message-client' : ''}`} 
          key={`${index}-${format(message.timestamp, 'hh:mm')}`}>
          {((profileAvatar && !isClient(message.sender)) || (profileClientAvatar && isClient(message.sender))) &&
            message.showAvatar && 
            <img 
              src={isClient(message.sender) ? profileClientAvatar : profileAvatar} 
              className={`rcw-avatar ${isClient(message.sender) ? 'rcw-avatar-client' : ''}`} 
              alt="profile"
            />
          }
          {getComponentToRender(message)}       
        
        </div>
     
      )}
      <Loader typing={typing} />
    </div>
  );
}

export default Messages;
