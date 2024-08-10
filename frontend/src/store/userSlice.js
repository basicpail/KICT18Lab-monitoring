import { createSlice } from "@reduxjs/toolkit"
import { authUser, loginUser, logoutUser, registerUser } from "./thunkFunction";
import { toast } from "react-toastify";

const initialState = {
    userData: {
        id: '',
        email: '',
        name: '',
        role: 0,
        image: '',
    },
    isAuth: false,
    isLoading: false,
    error: ''
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state) =>{
                state.isLoading = false;
                toast.info('회원가입을 성공했습니다.')
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) =>{
                state.isLoading = false;
                state.userData = action.payload;
                state.isAuth = true;
                localStorage.setItem('accessToken', action.payload.accessToken);
                toast.info('로그인에 성공했습니다.')
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            .addCase(authUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(authUser.fulfilled, (state, action) =>{
                state.isLoading = false;
                state.userData = action.payload;
                state.isAuth = true;
            })
            .addCase(authUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.isAuth = false;
                localStorage.removeItem('accessToken');
            })
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutUser.fulfilled, (state, action) =>{
                state.isLoading = false;
                state.userData = initialState.userData; //유저데이터 초기화
                state.isAuth = false;
                localStorage.removeItem('accessToken');
                toast.info('로그아웃 성공')
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
    }
})

export default userSlice.reducer; //이 리듀서를 다른 파일에서 받아서 스토어를 생성할 것이다.