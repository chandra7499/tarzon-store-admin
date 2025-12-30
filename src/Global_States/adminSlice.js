import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    admin:null,
    isAuthenticated:false
};


const adminSlice = createSlice({
    name:"admin",
    initialState,
    reducers:{
        setAdmin(state,action){
            state.admin = action.payload;
            state.isAuthenticated = true;
        },
        clearAdmin(state){
            state.admin = null;
            state.isAuthenticated = false;
        }
    }
})

export const {setAdmin,clearAdmin} = adminSlice.actions;
export default adminSlice.reducer;