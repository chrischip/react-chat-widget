import { createReducer } from '../../utils/createReducer';
import { BehaviorState } from '../types';

import {
  BehaviorActions,
  SET_VOICE_REPLY,
  TOGGLE_CHAT,
  TOGGLE_INPUT_DISABLED,
  TOGGLE_MESSAGE_LOADER,
  RESET_VOICE_REPLY
} from '../actions/types';

const initialState = {
  showChat: false,
  disabledInput: false,
  messageLoader: false,
  voiceReply: false
};

const behaviorReducer = {
  [TOGGLE_CHAT]: (state: BehaviorState) => ({ ...state, showChat: !state.showChat}),

  [TOGGLE_INPUT_DISABLED]: (state: BehaviorState) => ({ ...state, disabledInput: !state.disabledInput }),

  [TOGGLE_MESSAGE_LOADER]: (state: BehaviorState) => ({ ...state, messageLoader: !state.messageLoader }),

  [SET_VOICE_REPLY]: (state: BehaviorState) => ({ ...state, voiceReply: true }),

  [RESET_VOICE_REPLY]: (state: BehaviorState) => ({ ...state, voiceReply: false }),
};

export default (state: BehaviorState = initialState, action: BehaviorActions) => createReducer(behaviorReducer, state, action);
