import {PlusNumber,MinusNumber,ResetNumber} from '../@types/action';
import {INCREASE,DECREASE,RESET}from './../actions/ActionType';
import {CountReducerStateType} from '../@types/reducer';

const initialState: CountReducerStateType = {
	number : 0,
	
};

 type ActionType = PlusNumber&MinusNumber&ResetNumber;

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
		default:
			return state;
	}
	
}

export default countReducer;