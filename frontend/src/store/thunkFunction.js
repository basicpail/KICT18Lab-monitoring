import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axios";

export const registerUser = createAsyncThunk(
    "user/registerUser",
    async (body, thunkAPI) => { //payload creator
        try {
            const response = await axiosInstance.post(
                `/users/register`,
                body
            )
            return response.data; //action payload
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)

export const loginUser = createAsyncThunk(
    "user/loginUser",
    async (body, thunkAPI) => { //payload creator
        try {
            const response = await axiosInstance.post(
                `/users/login`,
                body
            )
            return response.data; //action payload
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)

export const authUser = createAsyncThunk(
    "user/authUser",
    async (_, thunkAPI) => { //payload creator
        try {
            const response = await axiosInstance.get(
                `/users/auth`,
            )
            return response.data; //action payload
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)

export const logoutUser = createAsyncThunk(
    "user/logoutUser",
    async (_, thunkAPI) => { //payload creator
        try {
            const response = await axiosInstance.post(
                `/users/logout`,
            )
            return response.data; //action payload
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)


export const generateTestData = createAsyncThunk(
    "device/generateTestData",
    async (body, thunkAPI) => { //payload creator
        try {
            return body; //action payload
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const requestAllDeviceData = createAsyncThunk(
    "device/requestAllDeviceData",
    async (_, thunkAPI) => { //payload creator
        try {
            let prevResponse = null;
            const response = await axiosInstance.get(
                `/devices/requestAllDeviceData`,
            )
            console.log('thunkFunction_requestAllDeviceData: ', response.data);
            if (response.data !== undefined) { //timeout으로 response.data 가 없는 경우 이전값 저장 해놨다가 return
                prevResponse = response.data;
                return response.data; //action payload
            }
            else return prevResponse
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const updateDeviceData = createAsyncThunk(
    "device/updateDeviceData",
    async (data, thunkAPI) => {
      // 웹소켓으로 받은 데이터를 그대로 반환
      return data;
    }
  );

export const requestSTAirmonitor = createAsyncThunk(
    "device/requestSTAirmonitor",
    async (_, thunkAPI) => { //payload creator
        try {
            const response = await axiosInstance.get(
                `/devices/requestSTAirmonitor`,
            )
            console.log('thunkFunction_requestSTAirmonitor: ', response.data.data);
            return response.data.data
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)