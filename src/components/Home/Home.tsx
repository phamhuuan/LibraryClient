import React, {FC} from 'react';
import {useSelector} from 'react-redux';
import {UserType} from '../../@types/entity';
import {RootReducerType} from '../../@types/reducer';
import {ROLE_ADMIN, ROLE_LIBRARIAN, ROLE_STUDENT} from '../../constants/Constant';
import HomeAdmin from './HomeAdmin';
import HomeLibrian from './HomeLibrarian/HomeLibrarian';
import HomeStudent from './HomeStudent/HomeStudent';

const Home: FC = () => {
	const user = useSelector<RootReducerType, UserType | undefined>((state) => state.userReducer.user);
	if (!user) {
		return <div />
	} else {
		if (user.role === ROLE_ADMIN) {
			return <HomeAdmin />;
		} else if (user.role === ROLE_STUDENT) {
			return <HomeStudent />;
		} else if (user.role === ROLE_LIBRARIAN) {
			return <HomeLibrian />;
		} else {
			return <div />;
		}
	}
}

export default Home;
