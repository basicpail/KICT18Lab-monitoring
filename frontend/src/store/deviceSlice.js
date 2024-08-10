import { createSlice } from "@reduxjs/toolkit"
import { authUser, loginUser, logoutUser, registerUser, generateTestData, requestAllDeviceData, updateDeviceData, requestSTAirmonitor } from "./thunkFunction";
import { toast } from "react-toastify";

const initialState = {
    graphData: [],
    // graphData: [{
    //     x: Date.now(),
    //     y: Math.random(),
    // }],
    deviceAllData: [],
    //ex){
    //    description: '디퓨저 모드',
    //    value: 3
    //}
    airmonitorData: [],
    dashBoardGraphData: [{x: Date.now(), y: 0}],
    isAuth: false,
    isLoading: false,
    error: ''
}

const userSlice = createSlice({
    name: 'device',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(generateTestData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(generateTestData.fulfilled, (state, action) =>{
                state.isLoading = false;
                state.graphData = [...state.graphData, action.payload]
                state.graphData.length > 100 ? state.graphData = [...state.graphData.slice(1)] : null;
                //toast.info('')
            })
            .addCase(generateTestData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            .addCase(requestAllDeviceData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(requestAllDeviceData.fulfilled, (state, action) =>{
                state.isLoading = false;
                state.deviceAllData = action.payload;
                state.dashBoardGraphData = [...state.dashBoardGraphData, {x: Date.now(), y: action.payload}];
                state.dashBoardGraphData.length > 100 ? state.dashBoardGraphData = [...state.dashBoardGraphData.slice(30)] : null;
                //state.dashBoardGraphData !== undefined ? state.dashBoardGraphData = [...state.dashBoardGraphData, {x: Date.now(), y: action.payload}] : state.dashBoardGraphData = [{x: Date.now(), y: action.payload}]
                //state.dashBoardGraphData.length > 100 ? state.dashBoardGraphData = [...state.dashBoardGraphData.slice(30)] : null;
            })
            .addCase(requestAllDeviceData.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(updateDeviceData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateDeviceData.fulfilled, (state, action) =>{
                state.isLoading = false;
                state.deviceAllData = action.payload;
                state.dashBoardGraphData = [...state.dashBoardGraphData, {x: Date.now(), y: action.payload}];
                state.dashBoardGraphData.length > 100 ? state.dashBoardGraphData = [...state.dashBoardGraphData.slice(30)] : null;
                //state.dashBoardGraphData !== undefined ? state.dashBoardGraphData = [...state.dashBoardGraphData, {x: Date.now(), y: action.payload}] : state.dashBoardGraphData = [{x: Date.now(), y: action.payload}]
                //state.dashBoardGraphData.length > 100 ? state.dashBoardGraphData = [...state.dashBoardGraphData.slice(30)] : null;
            })
            .addCase(updateDeviceData.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(requestSTAirmonitor.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(requestSTAirmonitor.fulfilled, (state, action) =>{
                state.isLoading = false;
                state.airmonitorData = action.payload;
            })
            .addCase(requestSTAirmonitor.rejected, (state, action) => {
                state.isLoading = false;
            })
    }
})

export default userSlice.reducer; //이 리듀서를 다른 파일에서 받아서 스토어를 생성할 것이다.