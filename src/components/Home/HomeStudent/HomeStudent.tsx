import React, {FC, lazy, ReactNode, Suspense, useCallback, useMemo} from 'react';
import HomeStudentHeader from './HomeStudentHeader';
import InputLabel from '@material-ui/core/InputLabel';
import MenuButton from './MenuButton';
import logo from '../../../assets/logo.png';
import H from 'history';
import {useHistory, useLocation} from 'react-router-dom';
import PathName from '../../../constants/PathName';
import Loading from '../../Common/Loading';
const SearchScreen = lazy(() => import('./Search/SearchScreen'));
const AuthorsScreen = lazy(() => import('./Authors/AuthorScreen'));

const HomeStudent: FC = () => {
	const history = useHistory();
	const location: H.Location<any> = useLocation<any>();
	const goToHome = useCallback((): void => {
		if (location.pathname !== PathName.Home) {
			history.push(PathName.Home);
		}
	}, [history, location.pathname]);
	const goToFindBook = useCallback((): void => {
		if (location.pathname !== PathName.Search) {
			history.push(PathName.Search);
		}
	}, [history, location.pathname]);
	const goToBooksBorrowed = useCallback((): void => {
		if (location.pathname !== PathName.Borrowed) {
			history.push(PathName.Borrowed);
		}
	}, [history, location.pathname]);
	const goToAuthors = useCallback((): void => {
		if (location.pathname !== PathName.Authors) {
			history.push(PathName.Authors);
		}
	}, [history, location.pathname]);
	const goToNotification = useCallback((): void => {
		if (location.pathname !== PathName.Notifications) {
			history.push(PathName.Notifications);
		}
	}, [history, location.pathname]);
	const leftPart = useMemo((): ReactNode => (
		<div style={{display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '15%', backgroundColor: 'ghostwhite', alignItems: 'center'}}>
			<MenuButton text={'Home'} onClick={goToHome} />
			<MenuButton text={'Find a book'} onClick={goToFindBook} />
			<MenuButton text={'Books borrowed'} onClick={goToBooksBorrowed} />
			<MenuButton text={'Genres & Authors'} onClick={goToAuthors} />
			<MenuButton text={'Notifications'} onClick={goToNotification} />
		</div>
	), [goToAuthors, goToBooksBorrowed, goToFindBook, goToHome, goToNotification]);
	const rightPart = useMemo((): ReactNode => {
		if (location.pathname === PathName.Home) {
			return (
				<div style={{flex: 1, display: 'flex', alignItems: 'center', flexDirection: 'column', overflowY: 'auto'}}>
					<InputLabel style={{fontSize: 40, fontWeight: 'bold', textAlign: 'center', color: 'black', marginTop: 10}}>{'Why Swaying ducks library?'}</InputLabel>
					<div style={{width: '100%'}}>
						<InputLabel style={{fontSize: 20, textAlign: 'left', color: 'black', marginLeft: '10%', marginRight: '10%'}}>1. Because this is <strong style={{color: 'red', fontStyle: 'italic'}}>Swaying ducks university</strong>'s library.</InputLabel>
						<InputLabel style={{fontSize: 20, textAlign: 'left', color: 'black', marginLeft: '10%', marginRight: '10%'}}>2. We have about 200,000 titles of 20,000 authors in 100 different fields such as algebra, mechanics, macroeconomics...</InputLabel>
						<InputLabel style={{fontSize: 20, textAlign: 'left', color: 'black', marginLeft: '10%', marginRight: '10%'}}>3. As long as you are students of the <strong style={{color: 'red', fontStyle: 'italic'}}>Swaying ducks university</strong> you can borrow books for free (maximum 10 books at the same time), the deposit has been included in the tuition and will be returned when you graduate.</InputLabel>
						<InputLabel style={{fontSize: 20, textAlign: 'left', color: 'black', marginLeft: '10%', marginRight: '10%'}}>We wish you all a good time in university and enjoy the services of the <strong style={{color: 'red', fontStyle: 'italic'}}>Swaying ducks university</strong>'s library!</InputLabel>
						<InputLabel style={{fontSize: 20, textAlign: 'left', color: 'black', marginLeft: '10%', marginRight: '10%', fontWeight: 'bold'}}>Best regards!</InputLabel>
					</div>
					<img className={'pendulous-animation'} src={logo} style={{width: '25%'}} alt={'logo'} />
					<InputLabel style={{fontSize: 40, fontStyle: 'italic', fontWeight: 'bold', textAlign: 'center', color: 'black'}}>{'Swaying ducks is future :)'}</InputLabel>
				</div>
			);
		}
		if (location.pathname === PathName.Search) {
			return <SearchScreen />;
		}
		if (location.pathname === PathName.Borrowed) {
			return <div>2</div>;
		}
		if (location.pathname.startsWith(PathName.Authors)) {
			return <AuthorsScreen />;
		}
		if (location.pathname === PathName.Notifications) {
			return <div>4</div>;
		}
	}, [location.pathname]);
	return (
		<div style={{display: 'flex', flexDirection: 'column', height: '100vh', flex: 1}}>
			<Suspense fallback={<Loading />}>
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
