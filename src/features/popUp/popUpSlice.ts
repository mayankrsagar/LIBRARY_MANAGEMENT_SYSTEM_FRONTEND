// src/features/popup/popUpSlice.ts
import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

export interface PopUpState {
  settingPopup:      boolean;
  addBookPopup:      boolean;
  readBookPopup:     boolean;
  recordPopup:       boolean;
  returnPopup:       boolean;
  addNewAdminPopup:  boolean;
}

const initialState: PopUpState = {
  settingPopup:     false,
  addBookPopup:     false,
  readBookPopup:    false,
  recordPopup:      false,
  returnPopup:      false,
  addNewAdminPopup: false,
};

export const popUpSlice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    toggleSettingPopup(state) {
      state.settingPopup = !state.settingPopup;
    },
    toggleAddBookPopup(state) {
      state.addBookPopup = !state.addBookPopup;
    },
    toggleReadBookPopup(state) {
      state.readBookPopup = !state.readBookPopup;
    },
    toggleRecordPopup(state) {
      state.recordPopup = !state.recordPopup;
    },
    toggleReturnPopup(state) {
      state.returnPopup = !state.returnPopup;
    },
    toggleAddNewAdminPopup(state) {
      state.addNewAdminPopup = !state.addNewAdminPopup;
    },
    // Reset all popups to false
    closeAllPopups(state) {
      (Object.keys(state) as Array<keyof PopUpState>).forEach((key) => {
        state[key] = false;
      });
    },
    // If you need to explicitly set a specific popup:
    setPopupState(
      state,
      action: PayloadAction<{ popup: keyof PopUpState; value: boolean }>
    ) {
      const { popup, value } = action.payload;
      state[popup] = value;
    },
  },
});

export const {
  toggleSettingPopup,
  toggleAddBookPopup,
  toggleReadBookPopup,
  toggleRecordPopup,
  toggleReturnPopup,
  toggleAddNewAdminPopup,
  closeAllPopups,
  setPopupState,
} = popUpSlice.actions;

export default popUpSlice.reducer;
