import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Booking {
  id: string;
  bookingNumber: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  totalPrice: number;
  status: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  room: {
    roomNumber: string;
    roomType: {
      name: string;
    };
  };
  payments: {
    method: string;
    status: string;
  }[];
}

interface BookingDraft {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  paymentMethod: "PAY_AT_HOTEL" | "ONLINE";
  specialRequests: string;
}

interface BookingSliceState {
  bookings: Booking[];
  draft: BookingDraft;
  loading: boolean;
  error: string | null;
}

const initialState: BookingSliceState = {
  bookings: [],
  draft: {
    roomId: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    paymentMethod: "PAY_AT_HOTEL",
    specialRequests: "",
  },
  loading: false,
  error: null,
};

export const fetchUserBookings = createAsyncThunk(
  "bookings/fetchUserBookings",
  async (userId: string | undefined, { rejectWithValue }) => {
    try {
      const url = userId ? `/api/bookings?userId=${userId}` : "/api/bookings";
      const res = await fetch(url);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to fetch bookings");
      return data.data as Booking[];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    setBookingDraft: (state, action: PayloadAction<Partial<BookingDraft>>) => {
      state.draft = { ...state.draft, ...action.payload };
    },
    resetBookingDraft: (state) => {
      state.draft = initialState.draft;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setBookingDraft, resetBookingDraft } = bookingSlice.actions;
export default bookingSlice.reducer;
