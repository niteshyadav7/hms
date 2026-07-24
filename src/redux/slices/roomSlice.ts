import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Room {
  id: string;
  roomNumber: string;
  status: string;
  isAvailable: boolean;
  floor?: number;
  roomType: {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    capacity: number;
    amenities: string[];
    images: string[];
  };
}

interface RoomSearchFilter {
  checkIn: string;
  checkOut: string;
  guests: number;
  roomTypeId?: string;
}

interface RoomSliceState {
  rooms: Room[];
  filters: RoomSearchFilter;
  loading: boolean;
  error: string | null;
}

const initialState: RoomSliceState = {
  rooms: [],
  filters: {
    checkIn: "",
    checkOut: "",
    guests: 1,
  },
  loading: false,
  error: null,
};

export const fetchRooms = createAsyncThunk(
  "rooms/fetchRooms",
  async (filters: Partial<RoomSearchFilter>, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (filters.checkIn) query.set("checkIn", filters.checkIn);
      if (filters.checkOut) query.set("checkOut", filters.checkOut);
      if (filters.guests) query.set("guests", filters.guests.toString());
      if (filters.roomTypeId) query.set("roomTypeId", filters.roomTypeId);

      const res = await fetch(`/api/rooms?${query.toString()}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to fetch rooms");

      return data.data as Room[];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<RoomSearchFilter>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, resetFilters } = roomSlice.actions;
export default roomSlice.reducer;
