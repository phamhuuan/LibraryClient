import {PlusNumber,MinusNumber,ResetNumber,SetAttribute} from '../@types/action';
import {INCREASE,DECREASE,RESET,SET}from './../actions/ActionType';
import {CountReducerStateType} from '../@types/reducer';
// import { useState} from 'react';
// import {setInputStateType} from './../@types/componentState/index';
const initialState: CountReducerStateType = {
	number : 0,
	fontSize: 0,
	color: 'red',
};
// const initialState1: SetReducerStateType = {
// 	number : 0,
// };


 type ActionType = PlusNumber&MinusNumber&ResetNumber&SetAttribute;

const countReducer = (state = initialState, action: ActionType): CountReducerStateType => {
	switch (action.type) {
		case INCREASE: 
		// state.number=state.number+1;
		 state.number=state.number+action.value;
		
		 return {...state};
		 case DECREASE: 
		//  state.number=state.number-1;
		state.number=state.number-action.value;
		 return {...state};
		 case RESET: 
		 state.number=0;
		 return {...state};
		case SET: 
		state.color=action.color;
		// //state.fontSize=action.size;
		console.log(state.color);
		//console.log(state.fontSize);
		return {...state};
		
		
		default:
			return state;
	}
	
}

export default countReducer;