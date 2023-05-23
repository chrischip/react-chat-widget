import { is } from 'date-fns/locale';
import { timeout } from 'rxjs/operators';
import { createReducer } from '../../utils/createReducer';
import { BehaviorState } from '../types';

import {
  BehaviorActions,
  SET_VOICE_REPLY,
  TOGGLE_CHAT,
  TOGGLE_INPUT_DISABLED,
  TOGGLE_MESSAGE_LOADER,
  RESET_VOICE_REPLY,
  SET_LISTENING,
  RESET_LISTENING,
  SET_RECOGNITION_OBJECT,
  SET_USER_INTENDED_LISTENING,
  RESET_USER_INTENDED_LISTENING

} from '../actions/types';

const initialState = {
  showChat: false,
  disabledInput: false,
  messageLoader: false,
  voiceReply: false,
  isRecognitionListening: false,
  recognitionObject: null,
  isUserIntendedListening: false

};

const behaviorReducer = {
  [TOGGLE_CHAT]: (state: BehaviorState) => ({ ...state, showChat: !state.showChat}),

  [TOGGLE_INPUT_DISABLED]: (state: BehaviorState) => ({ ...state, disabledInput: !state.disabledInput }),

  [TOGGLE_MESSAGE_LOADER]: (state: BehaviorState) => ({ ...state, messageLoader: !state.messageLoader }),

  [SET_VOICE_REPLY]: (state: BehaviorState) => ({ ...state, voiceReply: true }),

  [RESET_VOICE_REPLY]: (state: BehaviorState) => ({ ...state, voiceReply: false }),

  [SET_USER_INTENDED_LISTENING]: (state: BehaviorState) => ({ ...state, isUserIntendedListening: true }),

  [RESET_USER_INTENDED_LISTENING]: (state: BehaviorState) => ({ ...state, isUserIntendedListening: false }),
  
  [SET_LISTENING]: (state: BehaviorState) => {
    if (state.recognitionObject) {
      if (!state.isRecognitionListening) {
      //try to start listening, if exception occurs, enter retry loop for 3 times. If still fails, set isListening to false
      try {
        console.log("start listening....");
     
        
          state.recognitionObject.start();
       
        
      } catch (error) {
    //   debugger;
      //  console.log(error);
        let retryCount = 0;
        while (retryCount < 3) {
          try {
            state.recognitionObject.start();
            break;
          } catch (error) {
      //      console.log(error);
            retryCount++;
          }
        }
        if (retryCount === 3) {
          return { ...state, isRecognitionListening: false }         
        }
      }
    }else{
        console.log("already in listening state");
    }

      return { ...state, isRecognitionListening: true, voiceReply: true }
      
    }else {
      console.log("recognitionObject is null, cannot start listening");
      return { ...state, isRecognitionListening: false }
    }    
  },
  [RESET_LISTENING]: (state: BehaviorState) => {
    if (state.recognitionObject) {
      if (state.isRecognitionListening) {
        console.log("stop listening....");      
        const currentObject = state.recognitionObject;
          currentObject.onend = () => {
            console.log("Speech recognition service disconnected");
          };
          
          try {
            setTimeout(() => {
              currentObject.stop();
            }, 1000);
          } catch (error) {
          //  console.log(error);
          }
       
     }else{
        console.log("already in stop state");
     }
    }else{
      console.log("cannot stop listening, recognitionObject is null");
    }
    
    return { ...state, isRecognitionListening: false, voiceReply: false }
  },
  [SET_RECOGNITION_OBJECT]: (state: BehaviorState, { recognitionObject }) => {
    console.log("set recognition object");
    return { ...state, recognitionObject }
  }
};

export default (state: BehaviorState = initialState, action: BehaviorActions) => createReducer(behaviorReducer, state, action);
