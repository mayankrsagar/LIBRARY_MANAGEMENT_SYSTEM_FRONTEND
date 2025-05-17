import axios from 'axios';

import {
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';

interface UserBorrowedBook {
  bookId: string;
  returned: boolean;
  bookTitle: string;
  borrowedDate: string;
  dueDate: string;
  _id: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface AllBorrowedBook {
  user: User;
  _id: string;
  price: number;
  dueDate: string;
  returnDate: string | null;
  fine: number;
  notified: boolean;
  borrowDate: string;
  createdAt: string;
  updatedAt: string;
  book:string;
}

interface BorrowState {
  loading: boolean;
  message: string;
  error: string | null;
  userBorrowedBooks: UserBorrowedBook[];
  allBorrowedBooks: AllBorrowedBook[];
}

const initialState: BorrowState = {
  loading: false,
  message: '',
  error: null,
  userBorrowedBooks: [],
  allBorrowedBooks: [],
};

// 1. Fetch user's borrowed books
export const borrowedBookByUser = createAsyncThunk<
  { message: string; data: UserBorrowedBook[] },
  void,
  { rejectValue: string }
>(
  'borrow/byUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        'http://localhost:4000/api/v1/borrow/my-borrowed-books',
        { withCredentials: true }
      );
      const { message, data } = response.data as {
        message: string;
        data: UserBorrowedBook[];
      };
      return { message, data };
    } catch (err: unknown) {
      let msg = 'Failed to fetch borrowed books';
      if (axios.isAxiosError(err) && err.response?.data) {
        msg =
          (err.response.data as { message?: string }).message || msg;
      }
      return rejectWithValue(msg);
    }
  }
);

// 2. Fetch all borrowed books (admin)
export const getAllBorrowedBooks = createAsyncThunk<
  { message: string; data: AllBorrowedBook[] },
  void,
  { rejectValue: string }
>(
  'borrow/all',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        'http://localhost:4000/api/v1/borrow/borrowed-books-by-users',
        { withCredentials: true }
      );
      const { message, data } = response.data as {
        message: string;
        data: AllBorrowedBook[];
      };
      return { message, data };
    } catch (err: unknown) {
      let msg = 'Failed to fetch all borrowed books';
      if (axios.isAxiosError(err) && err.response?.data) {
        msg =
          (err.response.data as { message?: string }).message || msg;
      }
      return rejectWithValue(msg);
    }
  }
);

// 3. Record a new borrow action
export const recordBorrowedBook = createAsyncThunk<
  { message: string; data: AllBorrowedBook },
  { email: string; id: string },
  { rejectValue: string }
>(
  'borrow/record',
  async ({ email, id }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/v1/borrow/record-borrow-book/${id}`,
        { email },
        { withCredentials: true }
      );
      const { message, data } = response.data as {
        message: string;
        data: AllBorrowedBook;
      };
      return { message, data };
    } catch (err: unknown) {
      let msg = 'Failed to record borrowed book';
      if (axios.isAxiosError(err) && err.response?.data) {
        msg =
          (err.response.data as { message?: string }).message || msg;
      }
      return rejectWithValue(msg);
    }
  }
);

// 4. Return a borrowed book
export const returnBorrowedBook = createAsyncThunk<
  { message: string;  },
  { email: string; id: string },
  { rejectValue: string }
>(
  'borrow/return',
  async ({ email, id }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/v1/borrow/return-borrowed-book/${id}`,
        { email },
        { withCredentials: true }
      );
      const { message } = response.data as {
        message: string;
      };
      return { message };
    } catch (err: unknown) {
      let msg = 'Failed to return borrowed book';
      if (axios.isAxiosError(err) && err.response?.data) {
        msg =
          (err.response.data as { message?: string }).message || msg;
      }
      return rejectWithValue(msg);
    }
  }
);


const borrowSlice = createSlice({
  name: 'borrow',
  initialState,
  reducers: {
    resetBorrowSlice: (state)=>{
      state.error=null;
      state.loading=false;
      state.message="";
    },
  },
  extraReducers: (builder) => {
    builder
      // user
      .addCase(borrowedBookByUser.pending, (s) => {
        s.loading = true; s.error = null; s.message = '';
      })
      .addCase(borrowedBookByUser.fulfilled, (s, a) => {
        s.loading = false; s.message = a.payload.message; s.userBorrowedBooks = a.payload.data;
      })
      .addCase(borrowedBookByUser.rejected, (s, a) => {
        s.loading = false; s.error = a.payload || 'Could not fetch borrowed books';
      })
      // all
      .addCase(getAllBorrowedBooks.pending, (s) => {
        s.loading = true; s.error = null; s.message = '';
      })
      .addCase(getAllBorrowedBooks.fulfilled, (s, a) => {
        s.loading = false; s.message = a.payload.message; s.allBorrowedBooks = a.payload.data;
      })
      .addCase(getAllBorrowedBooks.rejected, (s, a) => {
        s.loading = false; s.error = a.payload || 'Could not fetch all borrowed books';
      })
      // record
      .addCase(recordBorrowedBook.pending, (s) => {
        s.loading = true; s.error = null; s.message = '';
      })
      .addCase(recordBorrowedBook.fulfilled, (s, a) => {
        s.loading = false; s.message = a.payload.message; s.allBorrowedBooks.push(a.payload.data);
      })
      .addCase(recordBorrowedBook.rejected, (s, a) => {
        s.loading = false; s.error = a.payload || 'Failed to record borrowed book';
      })
      // return
      .addCase(returnBorrowedBook.pending, (s) => {
        s.loading = true; s.error = null; s.message = '';
      })
      .addCase(returnBorrowedBook.fulfilled, (s, a) => {
        s.loading = false; s.message = a.payload.message;
      })
      .addCase(returnBorrowedBook.rejected, (s, a) => {
        s.loading = false; s.error = a.payload || 'Failed to return borrowed book';
      });
  },
});
export const { resetBorrowSlice } = borrowSlice.actions;
export default borrowSlice.reducer;
