import axios from 'axios';

import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

// Define your data types
interface RegisterData { name: string; email: string; password: string; }
interface OtpData      { email: string; otp: string; }
interface LoginData    { email: string; password: string; }
interface User         { id: string; name: string; email: string; }
interface ForgotPasswordData {
  email: string;
}
interface BorrowedBook {
  bookId:       string;
  returned:     boolean;
  bookTitle:    string;
  borrowedDate: string;
  dueDate:      string;
  _id:          string;
}
interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}
interface User {
  id:    string;
  name:  string;
  email: string;
  role: 'Admin' | 'User';
}
interface ApiUser {
  _id:                string;
  name:               string;
  email:              string;
  role:               'Admin' | 'User';
  accountVerified:    boolean;
  borrowedBooks:      BorrowedBook[];
  createdAt:          string;
  updatedAt:          string;
  __v:                number;
  verificationCode:   string | null;
  verificationCodeExpire: string | null;
}
interface GetUserApiResponse {
  success: boolean;
  data: ApiUser;
}
interface AuthState {
  loading: boolean;
  error:   string | null;
  message: string | null;
  user:    User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  loading:       false,
  error:         null,
  message:       null,
  user:          null,
  isAuthenticated: false,
};
interface UpdatePasswordData {
  currentPassword:    string;
  newPassword:        string;
  confirmNewPassword: string;
}

// ----------------------------------------------------------------------------
// Thunks
// ----------------------------------------------------------------------------

export const register = createAsyncThunk<
  { message: string },
  RegisterData,
  { rejectValue: string }
>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        'http://localhost:4000/api/v1/auth/register',
        userData,
        { withCredentials: true }
      );
      return data;
    } catch (err: unknown) {
      let message = 'Registration failed';
      if (axios.isAxiosError(err) && err.response?.data) {
        message = (err.response.data as { message?: string }).message || message;
      }
      return rejectWithValue(message);
    }
  }
);

export const otpVerification = createAsyncThunk<
  { message: string; user: User },
  OtpData,
  { rejectValue: string }
>(
  'auth/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        'http://localhost:4000/api/v1/auth/verify-otp',
        { email, otp },
        { withCredentials: true }
      );
      return data;
    } catch (err: unknown) {
      let message = 'OTP verification failed';
      if (axios.isAxiosError(err) && err.response?.data) {
        message = (err.response.data as { message?: string }).message || message;
      }
      return rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk<
  { message: string; user: User },
  LoginData,
  { rejectValue: string }
>(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        'http://localhost:4000/api/v1/auth/login',
        { email, password },
        { withCredentials: true }
      );
      return data;
    } catch (err: unknown) {
      let message = 'Login failed';
      if (axios.isAxiosError(err) && err.response?.data) {
        message = (err.response.data as { message?: string }).message || message;
      }
      return rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk<
  { message: string },
  void,
  { rejectValue: string }
>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        'http://localhost:4000/api/v1/auth/logout',
        {},
        { withCredentials: true }
      );
      return data;
    } catch (err: unknown) {
      let message = 'Logout failed';
      if (axios.isAxiosError(err) && err.response?.data) {
        message = (err.response.data as { message?: string }).message || message;
      }
      return rejectWithValue(message);
    }
  }
);

//  getUser thunk
// 1) Change your thunk to unwrap and remap the API:
//    We only pick the fields our application actually needs.
export const getUser = createAsyncThunk<
  { message: string; user: User }, // now returns our `User` shape
  void,
  { rejectValue: string }
>(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<GetUserApiResponse>(
        'http://localhost:4000/api/v1/auth/me',
        { withCredentials: true }
      );

      // Remap `_id` → `id`
      const apiUser = response.data.data;
      const user: User = {
        id: apiUser._id,
        name: apiUser.name,
        email: apiUser.email,
        role:  apiUser.role,
      };

      return { message: 'User fetched', user };
    } catch (err: unknown) {
      let message = 'User detail failed to fetch';
      if (axios.isAxiosError(err) && err.response?.data) {
        message = (err.response.data as { message?: string }).message || message;
      }
      return rejectWithValue(message);
    }
  }
);


export const forgotPassword = createAsyncThunk<
  { message: string },           // what we resolve with
  ForgotPasswordData,            // the argument type
  { rejectValue: string }        // thunkAPI type
>(
  'auth/forgotPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        'http://localhost:4000/api/v1/auth/password/forgot',
        { email },
        { withCredentials: true }
      );
      return data;
    } catch (err: unknown) {
      let message = 'Request failed';
      if (axios.isAxiosError(err) && err.response?.data) {
        message = (err.response.data as { message?: string }).message || message;
      }
      return rejectWithValue(message);
    }
  }
);


export const resetPassword = createAsyncThunk<
  { message: string },            // what we return
  ResetPasswordData,               // thunk argument
  { rejectValue: string }          // thunkAPI shape
>(
  'auth/resetPassword',
  async ({ token, password,confirmPassword }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/auth/password/reset/${token}`,
        { password,confirmPassword },
        { withCredentials: true }
      );
      return data;
    } catch (err: unknown) {
      let message = 'Password reset failed';
      if (axios.isAxiosError(err) && err.response?.data) {
        message = (err.response.data as { message?: string }).message || message;
      }
      return rejectWithValue(message);
    }
  }
);

export const updatePassword = createAsyncThunk<
  { message: string },             // response shape
  UpdatePasswordData,              // argument type
  { rejectValue: string }          // thunkAPI
>(
  'auth/updatePassword',
  async (
    { currentPassword, newPassword, confirmNewPassword },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.put(
        'http://localhost:4000/api/v1/auth/password/update',
        { currentPassword, newPassword, confirmNewPassword },
        { withCredentials: true }
      );
      return data;
    } catch (err: unknown) {
      let message = 'Password update failed';
      if (axios.isAxiosError(err) && err.response?.data) {
        message =
          (err.response.data as { message?: string }).message || message;
      }
      return rejectWithValue(message);
    }
  }
);

// ----------------------------------------------------------------------------
// Slice
// ----------------------------------------------------------------------------

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthSlice(state) {
      state.loading        = false;
      state.error          = null;
      state.message        = null;
      state.user           = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error   = null;
        state.message = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload ?? 'Registration failed';
      })

      // OTP Verification
      .addCase(otpVerification.pending, (state) => {
        state.loading = true;
        state.error   = null;
        state.message = null;
      })
      .addCase(
        otpVerification.fulfilled,
        (state, action: PayloadAction<{ message: string; user: User }>) => {
          state.loading        = false;
          state.message        = action.payload.message;
          state.user           = action.payload.user;
          state.isAuthenticated = true;
          
        }
      )
      .addCase(otpVerification.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload ?? 'OTP verification failed';
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error   = null;
        state.message = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ message: string; user: User }>) => {
          state.loading        = false;
          state.message        = action.payload.message;
          state.user           = action.payload.user;
          state.isAuthenticated = true;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload ?? 'Login failed';
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error   = null;
        state.message = null;
      })
      .addCase(logout.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
        state.loading        = false;
        state.message        = action.payload.message;
        state.user           = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload ?? 'Logout failed';
      })

      // **getUser cases**
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error   = null;
        state.message = null;
      })
      .addCase(
        getUser.fulfilled,
        (state, action: PayloadAction<{ message: string; user: User }>) => {
          state.loading         = false;
          state.message         = action.payload.message;
          state.user            = action.payload.user;   // matches `User`
          state.isAuthenticated = true;
        }
      )
      
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload ?? "User detail failed to fetch";
      })
          // Forgot Password
    .addCase(forgotPassword.pending, (state) => {
      state.loading = true;
      state.error   = null;
      state.message = null;
    })
    .addCase(
      forgotPassword.fulfilled,
      (state, action: PayloadAction<{ message: string }>) => {
        state.loading = false;
        state.message = action.payload.message;
      }
    )
    .addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
      state.error   = action.payload ?? 'Password reset request failed';
    })
        // Reset Password
        .addCase(resetPassword.pending, (state) => {
          state.loading = true;
          state.error   = null;
          state.message = null;
        })
        .addCase(
          resetPassword.fulfilled,
          (state, action: PayloadAction<{ message: string }>) => {
            state.loading = false;
            state.message = action.payload.message;
          }
        )
        .addCase(resetPassword.rejected, (state, action) => {
          state.loading = false;
          state.error   = action.payload ?? 'Password reset failed';
        })
        // Update Password
.addCase(updatePassword.pending, (state) => {
  state.loading = true;
  state.error   = null;
  state.message = null;
})
.addCase(
  updatePassword.fulfilled,
  (state, action: PayloadAction<{ message: string }>) => {
    state.loading = false;
    state.message = action.payload.message;
  }
)
.addCase(updatePassword.rejected, (state, action) => {
  state.loading = false;
  state.error   = action.payload ?? 'Password update failed';
})

    
  },
});



// Export the reset action alongside thunks
export const { resetAuthSlice } = authSlice.actions;
export default authSlice.reducer;
