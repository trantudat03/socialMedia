import { createSlice } from "@reduxjs/toolkit";

const initialState={
    theme: JSON.parse(window?.localStorage.getItem("theme"))??"dark",//dark,light
};

const themSlice = createSlice({
    name: "theme",
    initialState,
    reducers:{
        setTheme(state,action){
            state.theme = action.payload;
            localStorage.setItem("theme",JSON.stringify(action.payload));
        },
    },
});

export default themSlice.reducer;

export function SetTheme(value){
    return (dispatch) =>{
        dispatch(themSlice.actions.setTheme(value));
    };
}