import React, {FC, lazy, ReactNode, Suspense, useMemo, useState} from 'react';
import HomeStudentHeader from './HomeStudentHeader';
import InputLabel from '@material-ui/core/InputLabel';
import MenuButton from './MenuButton';
import logo from '../../../assets/logo.png';
import {HomeStudentStateType} from '../../../@types/componentState/Home';
const StartScreen = lazy(() => import('./Search/SearchScreen'));

const HomeStudent: FC = () => {
	const [state, setState] = useState<HomeStudentStateType>({selected: 0});
	const goToHome = (): void => {
		setState({selected: 0});
	};
	const goToFindBook = (): void => {
		setState({selected: 1});
	};
	const goToBooksBorrowed = (): void => {
		setState({selected: 2});
	};
	const goToAuthors = (): void => {
		setState({selected: 3});
	};
	const goToNotification = (): void => {
		setState({selected: 4});
	}
	const leftPart = useMemo((): ReactNode => (
		<div style={{display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '15%', backgroundColor: 'ghostwhite', alignItems: 'center'}}>
			<MenuButton text={'Home'} onClick={goToHome} />
			<MenuButton text={'Find a book'} onClick={goToFindBook} />
			<MenuButton text={'Books borrowed'} onClick={goToBooksBorrowed} />
			<MenuButton text={'Authors'} onClick={goToAuthors} />
			<MenuButton text={'Notifications'} onClick={goToNotification} />
		</div>
	), []);
	const rightPart = useMemo((): ReactNode => {
		if (state.selected === 0) {
			return (
				<div style={{flex: 1, display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center'}}>
					<img className={'pendulous-animation'} src={logo} style={{width: '30%'}} alt={'logo'} />
					<InputLabel style={{fontSize: 40, fontStyle: 'italic', fontWeight: 'bold', textAlign: 'center', color: 'black', marginLeft: 10}}>{'Three ducks one future :)'}</InputLabel>
				</div>
			);
		}
		if (state.selected === 1) {
			return <StartScreen />;
		}
		if (state.selected === 2) {
			return <div>2</div>;
		}
		if (state.selected === 3) {
			return <div>3</div>;
		}
		if (state.selected === 4) {
			return <div>4</div>;
		}
	}, [state]);
	return (
		<div style={{display: 'flex', flexDirection: 'column', height: '100vh', flex: 1}}>
			<Suspense fallback={<div>Loading...</div>}>
				<HomeStudentHeader />
				<div style={{display: 'flex', overflow: 'hidden', flexDirection: 'row', flex: 1}}>
					{leftPart}
					{rightPart}
				</div>
			</Suspense>
		</div>
	);
}

export default HomeStudent;
