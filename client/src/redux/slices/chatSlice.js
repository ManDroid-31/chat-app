import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { socket } from '../../socket';

const API_BASE = 'http://localhost:5000';

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages', 
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/messages/${userId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch messages');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendMessageToServer = createAsyncThunk(
  'chat/sendMessage',
  async (messageData, {rejectWithValue }) => {
    // console.log(messageData)
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/messages/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      });
      
      const data = await response.json();
      console.log(data); //wors and directy sends object
      socket.emit("send-message", data);
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to send message');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    selectedUser: null,
    messages: [],
    loading: false,
    sendingMessage: false,
    error: null,
  },
  reducers: {
    selectUser: (state, action) => {
      state.selectedUser = action.payload;
      state.messages = [];
      state.error = null;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessageToServer.pending, (state) => {
        state.sendingMessage = true;
      })
      .addCase(sendMessageToServer.fulfilled, (state, action) => {
        state.sendingMessage = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessageToServer.rejected, (state, action) => {
        state.sendingMessage = false;
        state.error = action.payload;
      });
  }
});

export const { selectUser, setMessages, addMessage, clearMessages, clearError } = chatSlice.actions;
export default chatSlice.reducer;