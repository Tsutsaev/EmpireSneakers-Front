import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export function parseJwt(token: string): any | null {
  if (token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }
  return null;
}


interface Users {
  login: string;
  password: string;
  name: string;
  
}

interface UsersState {
  users: Users[];
  error:string | null;
  signIn: boolean;
  signUp: boolean;
  token: string | null;
  userId: string | null;
  loading:boolean;
  authSignUp: boolean;
  authSignIn: boolean;
}

const initialState: UsersState = {
  users: [],
  error: null,
  signIn: false,
  signUp: false,
  token: localStorage.getItem("token"),
  userId: localStorage.getItem("token") !== null
  ? parseJwt(localStorage.getItem("token") as string)?.id
  : null,
    loading:false,
    authSignUp: false,
    authSignIn: false
};




export const authSignUp = createAsyncThunk<
{error: string, Users: Users}, // Return type of the async action
{ login: string; password: string; error: string } // Type of the payload

>(
  "auth/signup",
  async ({ login, password }, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:3010/users/signUp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });
      const json: {error: string, Users: Users} = await res.json();

      if (json.error) {
        return thunkAPI.rejectWithValue(json.error);
      }
      return json;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

interface ServerResponse {
  error?: string;
}



export const authSignIn = createAsyncThunk<
  { token: string },
  { login: string; password: string }
>(
  "auth/signin",
  async ({ login, password }, thunkAPI) => {
    try {
      const res = await fetch("http://localhost:3010/users/signIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });
      const json: {token: string, error: string} = await res.json();
      
      if (json.error) {
        return thunkAPI.rejectWithValue(json.error);
      }

      localStorage.setItem("token", json.token);
      return { token: json.token };
    } catch (error) {
      // Обрабатываем ошибку с помощью rejectWithValue
      return thunkAPI.rejectWithValue(error);
    }
  }
);


const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(authSignUp.pending, (state: UsersState) => {
        state.authSignUp = false;
        state.error = null;
        state.loading = true
      })
      .addCase(authSignUp.rejected, (state, action) => {
        const { payload } = action as PayloadAction<string | null>;

        state.authSignUp = false;
        state.error = payload;
        state.loading = false
      })
      .addCase(authSignUp.fulfilled, (state:UsersState) => {
        state.authSignUp = true;
        state.error = null;
        state.loading = false;
      })
      .addCase(authSignIn.pending, (state) => {
        state.authSignIn = false;
        state.error = null;
        state.loading = true
      })
      .addCase(authSignIn.rejected, (state, action) => {
        const { payload } = action as PayloadAction<string | null>;

        state.authSignIn = false;
        state.error = payload;
        state.loading = false
      })
      .addCase(authSignIn.fulfilled, (state, action: PayloadAction<{ token: string }>) => {
        state.authSignIn = true;
        state.error = null;
        state.token = action.payload.token;
        state.loading = false
        
      });
  },
});
export default applicationSlice.reducer;
