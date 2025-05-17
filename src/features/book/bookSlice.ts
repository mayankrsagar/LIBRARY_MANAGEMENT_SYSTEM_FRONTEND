import axios from 'axios';

import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

// Base book input
export interface Books {
  title: string;
  author: string;
  description: string;
  price: number;
  quantity: number;
}

// Book returned from API
export interface BookAdditionalData extends Books {
  availability: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// State shape
interface BookState {
  message: string;
  loading: boolean;
  error: string | null;
  books: BookAdditionalData[];
}

const initialState: BookState = {
  message: '',
  loading: false,
  error: null,
  books: [],
};



// Thunk to add a book
export const addBook = createAsyncThunk<
  { message: string; addedBook: BookAdditionalData },
  Books,
  { rejectValue: string }
>(
  'books/addBook',
  async (bookData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'https://library-management-system-backend-fhdy.onrender.com/api/v1/book/admin/add',
        bookData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      const { message, addedBook } = response.data as {
        message: string;
        addedBook: BookAdditionalData;
      };
      return { message, addedBook };
    } catch (err: unknown) {
      let message = 'Failed to add book';
      if (axios.isAxiosError(err) && err.response?.data) {
        message = (err.response.data as { message?: string }).message || message;
      }
      return rejectWithValue(message);
    }
  }
);

// Thunk to get all books
export const getAllBooks = createAsyncThunk<
  { message: string; data: BookAdditionalData[] },
  void,
  { rejectValue: string }
>(
  'books/getAllBooks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://library-management-system-backend-fhdy.onrender.com/api/v1/book/all', { withCredentials: true });
      const { message, data } = response.data as {
        message: string;
        data: BookAdditionalData[];
      };
      return { message, data };
    } catch (error: unknown) {
      let message = 'Could not fetch all books';
      if (axios.isAxiosError(error) && error.response?.data) {
        message = (error.response.data as { message?: string }).message || message;
      }
      return rejectWithValue(message);
    }
  }
);

// Thunk to delete a book
export const deleteBook = createAsyncThunk<
  { message: string; data?: BookAdditionalData },
  string,
  { rejectValue: string }
>(
  'books/deleteBook',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`https://library-management-system-backend-fhdy.onrender.com/api/v1/book/delete/${id}`, {
        withCredentials: true,
      });
      const { message, data } = response.data as {
        message: string;
        data?: BookAdditionalData;
      };
      return { message, data };
    } catch (error: unknown) {
      let message = 'Cannot delete the book';
      if (axios.isAxiosError(error) && error.response?.data) {
        message = (error.response.data as { message?: string }).message || message;
      }
      return rejectWithValue(message);
    }
  }
);

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    resetBookSlice:(state)=>{
      state.error=null;
      state.loading=false;
      state.message="";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addBook.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = '';
      })
      .addCase(
        addBook.fulfilled,
        (state, action: PayloadAction<{ message: string; addedBook: BookAdditionalData }>) => {
          state.loading = false;
          state.message = action.payload.message;
          state.books.push(action.payload.addedBook);
        }
      )
      .addCase(addBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Add book failed';
      })
      .addCase(getAllBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = '';
      })
      .addCase(
        getAllBooks.fulfilled,
        (state, action: PayloadAction<{ message: string; data: BookAdditionalData[] }>) => {
          state.loading = false;
          state.message = action.payload.message;
          state.books = action.payload.data;
        }
      )
      .addCase(getAllBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Fetch all books failed';
      })
      .addCase(deleteBook.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = '';
      })
      .addCase(
        deleteBook.fulfilled,
        (state, action: PayloadAction<{ message: string; data?: BookAdditionalData }>) => {
          state.loading = false;
          state.message = action.payload.message;
          if (action.payload.data) {
            state.books = state.books.filter(book => book._id !== action.payload.data!._id);
          }
        }
      )
      .addCase(deleteBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Delete book failed';
      });
  },
});
export const {resetBookSlice} = bookSlice.actions;
export default bookSlice.reducer;
