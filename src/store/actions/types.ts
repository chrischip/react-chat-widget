import { ElementType } from 'react';

import { LinkParams, FullscreenPreviewState } from '../types';

export const TOGGLE_CHAT = 'BEHAVIOR/TOGGLE_CHAT';
export const TOGGLE_INPUT_DISABLED = 'BEHAVIOR/TOGGLE_INPUT_DISABLED';
export const TOGGLE_MESSAGE_LOADER = 'BEHAVIOR/TOGGLE_MSG_LOADER';
export const SET_BADGE_COUNT = 'BEHAVIOR/SET_BADGE_COUNT';
export const ADD_NEW_USER_MESSAGE = 'MESSAGES/ADD_NEW_USER_MESSAGE';
export const ADD_NEW_RESPONSE_MESSAGE = 'MESSAGES/ADD_NEW_RESPONSE_MESSAGE';
export const ADD_NEW_LINK_SNIPPET = 'MESSAGES/ADD_NEW_LINK_SNIPPET';
export const ADD_COMPONENT_MESSAGE = 'MESSAGES/ADD_COMPONENT_MESSAGE';
export const DROP_MESSAGES = 'MESSAGES/DROP_MESSAGES';
export const HIDE_AVATAR = 'MESSAGES/HIDE_AVATAR';
export const DELETE_MESSAGES = 'MESSAGES/DELETE_MESSAGES';
export const MARK_ALL_READ = 'MESSAGES/MARK_ALL_READ';
export const SET_QUICK_BUTTONS = 'SET_QUICK_BUTTONS';
export const OPEN_FULLSCREEN_PREVIEW = 'FULLSCREEN/OPEN_PREVIEW';
export const CLOSE_FULLSCREEN_PREVIEW = 'FULLSCREEN/CLOSE_PREVIEW';
export const SET_VOICE_REPLY = 'SET_VOICE_REPLY';
export const RESET_VOICE_REPLY = 'RESET_VOICE_REPLY';
export const SET_LISTENING = 'SET_LISTENING';
export const RESET_LISTENING = 'RESET_LISTENING';
export const SET_RECOGNITION_OBJECT = 'SET_RECOGNITION_OBJECT';

export interface ToggleChat {
  type: typeof TOGGLE_CHAT;
}

export interface ToggleInputDisabled {
  type: typeof TOGGLE_INPUT_DISABLED;
}

export interface SetVoiceReply {
  type: typeof SET_VOICE_REPLY;
}

export interface ResetVoiceReply {
  type: typeof RESET_VOICE_REPLY;
}

export interface Set_Listening {
  type: typeof SET_LISTENING;
}

export interface Reset_Listening {
  type: typeof RESET_LISTENING;
}

export interface Set_Recognition_Object {
  type: typeof SET_RECOGNITION_OBJECT;
  recognitionObject: any;
}

export interface AddUserMessage {
  type: typeof ADD_NEW_USER_MESSAGE;
  text: string;
  id?: string;
}

export interface AddResponseMessage {
  type: typeof ADD_NEW_RESPONSE_MESSAGE;
  text: string;
  id?: string;
}

export interface ToggleMsgLoader {
  type: typeof TOGGLE_MESSAGE_LOADER;
}

export interface AddLinkSnippet {
  type: typeof ADD_NEW_LINK_SNIPPET;
  link: LinkParams;
  id?: string;
}

export interface RenderCustomComponent {
  type: typeof ADD_COMPONENT_MESSAGE;
  component: ElementType;
  props: any;
  showAvatar: boolean;
  id?: string;
}

export interface DropMessages {
  type: typeof DROP_MESSAGES;
}

export interface HideAvatar {
  type: typeof HIDE_AVATAR;
  index: number;
}

export interface DeleteMessages {
  type: typeof DELETE_MESSAGES;
  count: number;
  id?: string;
}

export interface SetQuickButtons {
  type: typeof SET_QUICK_BUTTONS;
  buttons: Array<{ label: string, value: string | number }>;
}

export interface SetBadgeCount {
  type: typeof SET_BADGE_COUNT;
  count: number;
}

export interface MarkAllMessagesRead {
  type: typeof MARK_ALL_READ;
}

export type BehaviorActions = ToggleChat | ToggleInputDisabled | ToggleMsgLoader | SetVoiceReply | ResetVoiceReply;

export type MessagesActions = AddUserMessage | AddResponseMessage | AddLinkSnippet | RenderCustomComponent
                              | DropMessages | HideAvatar | DeleteMessages | MarkAllMessagesRead | SetBadgeCount;

export type QuickButtonsActions = SetQuickButtons;

export interface openFullscreenPreview {
  type: typeof OPEN_FULLSCREEN_PREVIEW;
  payload: FullscreenPreviewState
}

export interface closeFullscreenPreview {
  type: typeof CLOSE_FULLSCREEN_PREVIEW;
}

export type FullscreenPreviewActions = openFullscreenPreview | closeFullscreenPreview;