import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    selectedUser: null,
    messages: [],
  },
  reducers: {
    selectUser: (state, action) => {
      state.selectedUser = action.payload;
      state.messages = [];
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    }
  },
});

export const { selectUser, setMessages, addMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;