import {PlusNumber} from '../@types/action';
import {Tang,Giam,Reset }from './../actions/ActionType';
import {CountReducerStateType} from '../@types/reducer';

const initialState: CountReducerStateType = {
	number : 0
};

 type ActionType = PlusNumber;

const countReducer = (state = initialState, action: ActionType): CountReducerStateType => {
	switch (action.type) {
		case Tang: 
		 state.number=state.number+1;
		 return {...state};
		default:
			return state;
	}
}

export default countReducer;