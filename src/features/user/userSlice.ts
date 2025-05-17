import axios from 'axios';

import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

// Define types
interface BorrowedBook {
  bookId: string;
  returned: boolean;
  bookTitle: string;
  borrowedDate: string;
  dueDate: string;
  _id: string;
}

interface AdminData{
  avatar: File | null;
  name: string;
  email: string;
  password: string;
}

interface AdminAvatar {
  public_id: string;
  url: string;
}

interface Admin {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'User';
  accountVerified: boolean;
  avatar: AdminAvatar;
  borrowedBooks: BorrowedBook[];
  createdAt: string;
  updatedAt: string;
}

export interface UserItem {
  _id: string;
  name: string;
  role: 'Admin' | 'User';
  email: string;
  // accountVerified: boolean;
  borrowedBooks: BorrowedBook[];
  createdAt: string;
  // updatedAt: string;
}

interface GetAllUsersResponse {
  success: boolean;
  gotAllUser: UserItem[];
  message: string;
}

export interface UsersState {
  users: UserItem[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

// Thunk to fetch all users
export const getAllUsers = createAsyncThunk<
  { users: UserItem[]; message: string },
  void,
  { rejectValue: string }
>(
  'users/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<GetAllUsersResponse>(
        'http://localhost:4000/api/v1/user/all',
        { withCredentials: true }
      );
      const { gotAllUser, message } = response.data;
      return { users: gotAllUser, message };
    } catch (err: unknown) {
      let message = 'Failed to fetch users';
      if (axios.isAxiosError(err) && err.response?.data) {
        message = (err.response.data as { message?: string }).message || message;
      }
      return rejectWithValue(message);
    }
  }
);

// Thunk to add a new admin
export const addNewAdmin = createAsyncThunk<
  { admin: Admin; message: string },
  AdminData,
  { rejectValue: string }
>(
  'users/addNewAdmin',
  async (adminData, { rejectWithValue }) => {
      const { avatar, name, email, password } = adminData;
    if (!avatar) {
      return rejectWithValue('Avatar file is required');
    }
    try {
      const formData = new FormData();
      formData.append('avatar', avatar);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);

      const response = await axios.post(
        'http://localhost:4000/api/v1/user/add/new-admin',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      const { message, admin } = response.data;
      return { message, admin };
    } catch (error: unknown) {
      let message = 'Failed to Add Admin';
      if (axios.isAxiosError(error) && error.response?.data) {
        message = (error.response.data as { message?: string }).message || message;
      }
      return rejectWithValue(message);
    }
  }
);

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllUsers.fulfilled,
        (state, action: PayloadAction<{ users: UserItem[]; message: string }>) => {
          state.loading = false;
          state.users = action.payload.users;
        }
      )
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unable to fetch users';
      })
      .addCase(addNewAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addNewAdmin.fulfilled,
        (state,action:PayloadAction<{message:string, admin:Admin}>) => {
          state.loading = false;
          state.users.push(action.payload.admin);
        }
      )
      .addCase(addNewAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unable to add admin';
      });
  },
});

export default usersSlice.reducer;
