import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setVoiceReply, setRecognitionObject, setListening, resetListening, resetUserIntendedListening, setUserIntendedListening } from '../../../../../../store/actions';
import store from '../../../../../../store';

import cn from 'classnames';

import { GlobalState } from 'src/store/types';

import { getCaretIndex, isFirefox, updateCaret, insertNodeAtCaret, getSelection } from '../../../../../../utils/contentEditable'
const send = require('../../../../../../../assets/send_button.svg') as string;
const emoji = require('../../../../../../../assets/icon-smiley.svg') as string;
const mic = require('../../../../../../../assets/mic.svg') as string;
const mute = require('../../../../../../../assets/mute.svg') as string;
const brRegex = /<br>/g;

import './style.scss';
import { set } from 'date-fns';
import { is } from 'date-fns/locale';

type Props = {
  placeholder: string;
  disabledInput: boolean;
  autofocus: boolean;
  sendMessage: (event: any) => void;
  buttonAlt: string;
  onPressEmoji: () => void;
  onChangeSize: (event: any) => void;
  onTextInputChange?: (event: any) => void;
}

function Sender({ sendMessage, placeholder, disabledInput, autofocus, onTextInputChange, buttonAlt, onPressEmoji, onChangeSize }: Props, ref) {
  const dispatch = useDispatch();
  const showChat = useSelector((state: GlobalState) => state.behavior.showChat);
  const inputRef = useRef<HTMLDivElement>(null!);
  const refContainer = useRef<HTMLDivElement>(null);
  const [enter, setEnter]= useState(false)
  const [firefox, setFirefox] = useState(false);
  const [height, setHeight] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [recognitionStateObject, setRecognitionStateObject] = useState(Object);
  const isListeningGlobalState =  useSelector((state: GlobalState) => state.behavior.isRecognitionListening);

  // @ts-ignore
  useEffect(() => { if (showChat && autofocus) inputRef.current?.focus(); }, [showChat]);
  useEffect(() => { setFirefox(isFirefox())}, [])
  useEffect(() => {
    if (isListening) {
      dispatch(setListening());
    var recognitionObject = recognitionStateObject;
    console.log("recognitionObject" , recognitionObject);
   // console.log(Object.getOwnPropertyNames(Object.getPrototypeOf( recognitionObject)));

   // debugger;
    if (!recognitionObject?.lang) {
      console.log("recognition not initialized, creating new one");
      recognitionObject = new window.webkitSpeechRecognition();
      recognitionObject.lang = 'en-US';
      recognitionObject.continuous = true;
     
      const grammar =  "#JSGF V1.0; grammar words; public <words> = NFT | Artfundi;";
      //const speechRecognitionList = new window.webkitSpeechGrammarList
    
      setRecognitionStateObject(recognitionObject);
      dispatch(setRecognitionObject(recognitionObject));
    }else {
      console.log("recognition object already exists");
    }

    //update recongition object to use the latest sendMessage function
    recognitionObject.onresult = (event) => {
      //   const el = inputRef.current;
      const text = event.results[event.results.length-1][0].transcript;
      //  el.innerHTML = text;
        sendMessage(text);
        dispatch(setVoiceReply());
    };
    recognitionObject.onend = () => {
      console.log("recognition ended by itself, restarting")
      recognitionObject?.start();
    };
  }else{
    console.log("dispatching reset listening");
    dispatch(resetListening());
  }
   
  }, [isListening, recognitionStateObject]);

  useEffect(() => {
    if (isListeningGlobalState){
      console.log("is listening global state changed to true");
    var recognitionObject = recognitionStateObject;
    if (recognitionObject?.lang){
      console.log("resetting recognition result event");
      recognitionObject.onresult = (event) => {
        //   const el = inputRef.current;
        const text = event.results[event.results.length-1][0].transcript;
        //  el.innerHTML = text;
          sendMessage(text);
          dispatch(setVoiceReply());
      };
      recognitionObject.onend = () => {
        console.log("recognition ended by itself, determining current listen state")
        if (store.getState().behavior.isUserIntendedListening){
          console.log("restarting recognition");
          recognitionObject?.start();
        }else{
          console.log("skipping recognition restart");
        }
      };

    }else {
      console.log("recognition object not initialized, ignoring effect");
    }
  }else{
    console.log("is listening global state changed to false");

  }
  }
  , [isListeningGlobalState]);

  useImperativeHandle(ref, () => {
    return {
      onSelectEmoji: handlerOnSelectEmoji,
    };
  });

  const handlerOnChange = (event) => {
    onTextInputChange && onTextInputChange(event)
  }

  const handlerSendMessage = () => {
    const el = inputRef.current;
    if(el.innerHTML) {
      sendMessage(el.innerText);
      el.innerHTML = ''
    }
  }

  const handlerOnSelectEmoji = (emoji) => {
    const el = inputRef.current;
    const { start, end } = getSelection(el)
    if(el.innerHTML) {
      const firstPart = el.innerHTML.substring(0, start);
      const secondPart = el.innerHTML.substring(end);
      el.innerHTML = (`${firstPart}${emoji.native}${secondPart}`)
    } else {
      el.innerHTML = emoji.native
    }
    updateCaret(el, start, emoji.native.length)
  }

  const handlerOnKeyPress = (event) => {
    const el = inputRef.current;

    if(event.charCode == 13 && !event.shiftKey) {
      event.preventDefault()
      handlerSendMessage();
    }
    if(event.charCode === 13 && event.shiftKey) {
      event.preventDefault()
      insertNodeAtCaret(el);
      setEnter(true)
    }
  }

  // TODO use a context for checkSize and toggle picker
  const checkSize = () => {
    const senderEl = refContainer.current
    if(senderEl && height !== senderEl.clientHeight) {
      const {clientHeight} = senderEl;
      setHeight(clientHeight)
      onChangeSize(clientHeight ? clientHeight -1 : 0)
    }
  }

  const handlerOnKeyUp = (event) => {
    const el = inputRef.current;
    if(!el) return true;
    // Conditions need for firefox
    if(firefox && event.key === 'Backspace') {
      if(el.innerHTML.length === 1 && enter) {
        el.innerHTML = '';
        setEnter(false);
      }
      else if(brRegex.test(el.innerHTML)){
        el.innerHTML = el.innerHTML.replace(brRegex, '');
      }
    }
    checkSize();
  }

  const handlerOnKeyDown= (event) => {
    const el = inputRef.current;
    
    if( event.key === 'Backspace' && el){
      const caretPosition = getCaretIndex(inputRef.current);
      const character = el.innerHTML.charAt(caretPosition - 1);
      if(character === "\n") {
        event.preventDefault();
        event.stopPropagation();
        el.innerHTML = (el.innerHTML.substring(0, caretPosition - 1) + el.innerHTML.substring(caretPosition))
        updateCaret(el, caretPosition, -1)
      }
    }
  }

  const handlerPressEmoji = () => {
    onPressEmoji();
    checkSize();
  }

  return (
    <div ref={refContainer} className="rcw-sender">
      <button className='rcw-picker-btn' type="submit" onClick={handlerPressEmoji}>
        <img src={emoji} className="rcw-picker-icon" alt="" />
      </button>
      <button className='rcw-picker-btn' type="submit" onClick={() => {

      console.log("is listening: " + isListening);
      if (isListening) {
        setIsListening(false);
        dispatch(resetUserIntendedListening());
        } else {
        setIsListening(true);
        dispatch(setUserIntendedListening());
            
      }
   

     
    }}>
       {/* {!isListening && <img src={mic} className="rcw-picker-icon" alt="" width='24' height='24' />}
       {isListening && <img src={mute} className="rcw-picker-icon" alt="" width='24' height='24' />} */}
       <img src={isListening? mute : mic} className="rcw-picker-icon" title={isListening? "Stop Listening" : "Start Listening"} alt={isListening? "Stop Listening" : "Start Listening"} width='24' height='24' />
      </button>
      <div className={cn('rcw-new-message', {
          'rcw-message-disable': disabledInput,
        })
      }>
        <div
          spellCheck
          className="rcw-input"
          role="textbox"
          contentEditable={!disabledInput} 
          ref={inputRef}
          placeholder={placeholder}
          onInput={handlerOnChange}
          onKeyPress={handlerOnKeyPress}
          onKeyUp={handlerOnKeyUp}
          onKeyDown={handlerOnKeyDown}
        />
        
      </div>
      <button type="submit" className="rcw-send" onClick={handlerSendMessage}>
        <img src={send} className="rcw-send-icon" alt={buttonAlt} />
      </button>
    </div>
  );
}

export default forwardRef(Sender);
