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
  SET_RECOGNITION_OBJECT

} from '../actions/types';

const initialState = {
  showChat: false,
  disabledInput: false,
  messageLoader: false,
  voiceReply: false,
  isListening: false,
  recognitionObject: null

};

const behaviorReducer = {
  [TOGGLE_CHAT]: (state: BehaviorState) => ({ ...state, showChat: !state.showChat}),

  [TOGGLE_INPUT_DISABLED]: (state: BehaviorState) => ({ ...state, disabledInput: !state.disabledInput }),

  [TOGGLE_MESSAGE_LOADER]: (state: BehaviorState) => ({ ...state, messageLoader: !state.messageLoader }),

  [SET_VOICE_REPLY]: (state: BehaviorState) => ({ ...state, voiceReply: true }),

  [RESET_VOICE_REPLY]: (state: BehaviorState) => ({ ...state, voiceReply: false }),
  [SET_LISTENING]: (state: BehaviorState) => {
    if (state.recognitionObject) {
      //try to start listening, if exception occurs, enter retry loop for 3 times. If still fails, set isListening to false
      try {
        state.recognitionObject.start();
      } catch (error) {
       
        console.log(error);
        let retryCount = 0;
        while (retryCount < 3) {
          try {
            state.recognitionObject.start();
            break;
          } catch (error) {
            console.log(error);
            retryCount++;
          }
        }
        if (retryCount === 3) {
          return { ...state, isListening: false }         
        }
      }

      return { ...state, isListening: true, voiceReply: true }
      
    }else {
      return { ...state, isListening: false }
    }    
  },
  [RESET_LISTENING]: (state: BehaviorState) => {
    if (state.recognitionObject) {
      try {
      state.recognitionObject.stop();
      } catch (error) {
        console.log(error);
      }
    }
    
    return { ...state, isListening: false, voiceReply: false }
  },
  [SET_RECOGNITION_OBJECT]: (state: BehaviorState, { recognitionObject }) => ({ ...state, recognitionObject })
};

export default (state: BehaviorState = initialState, action: BehaviorActions) => createReducer(behaviorReducer, state, action);
