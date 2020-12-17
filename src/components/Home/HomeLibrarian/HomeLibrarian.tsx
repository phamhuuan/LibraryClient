import React, {FC, lazy, ReactNode, Suspense, useCallback, useMemo} from 'react';
import HomeStudentHeader from './HomeStudentHeader';
import InputLabel from '@material-ui/core/InputLabel';
import MenuButton from './MenuButton';
import logo from '../../../assets/logo.png';
import H from 'history';
import {useHistory, useLocation} from 'react-router-dom';
import PathName from '../../../constants/PathName';
import Loading from '../../Common/Loading';
import {useDispatch} from 'react-redux';
import {GetBooksSaveDataActionType} from '../../../@types/action';
import {GET_BOOKS_SAVE_DATA} from '../../../actions/ActionType';
const SearchScreen = lazy(() => import('./Search/SearchScreen'));
const AuthorsScreen = lazy(() => import('./Authors/AuthorScreen'));
const BookScreen = lazy(() => import('./Book/BookScreen'));

const HomeLibrarian: FC = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const location: H.Location<any> = useLocation<any>();
	const goTo = useCallback((pathName: string): void => {
		if (location.pathname !== pathName) {
			// neu dang tu trong chi tiet sach bam vao nut search sach thi khong xoa data con lai thi xoa
			if (!(location.pathname.startsWith(PathName.Book) && pathName === PathName.Search)) {
				dispatch<GetBooksSaveDataActionType>({type: GET_BOOKS_SAVE_DATA, save: false});
			}
			history.push(pathName);
		}
	}, [dispatch, history, location.pathname]);
	const leftPart = useMemo((): ReactNode => (
		<div style={{display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '15%', backgroundColor: 'ghostwhite', alignItems: 'center'}}>
			<MenuButton text={'Home'} onClick={() => goTo(PathName.Home)} />
			<MenuButton text={'Find a book'} onClick={() => goTo(PathName.Search)} />
			<MenuButton text={'History'} onClick={() => goTo(PathName.Borrowed)} />
			<MenuButton text={'Genres & Authors'} onClick={() => goTo(PathName.Authors)} />
		</div>
	), [goTo]);
	const rightPart = useMemo((): ReactNode => {
		if (location.pathname === PathName.Home) {
			return (
				<div style={{flex: 1, display: 'flex', alignItems: 'center', flexDirection: 'column', overflowY: 'auto'}}>
					<img className={'pendulous-animation'} src={logo} style={{width: '25%'}} alt={'logo'} />
					<InputLabel style={{fontSize: 40, fontStyle: 'italic', fontWeight: 'bold', textAlign: 'center', color: 'black'}}>{'Swaying ducks is future :)'}</InputLabel>
				</div>
			);
		}
		if (location.pathname === PathName.Search) {
			return <SearchScreen />;
		}
		if (location.pathname.startsWith(PathName.Book)) {
			return <BookScreen />;
		}
		if (location.pathname === PathName.Borrowed) {
			return <div>2</div>;
		}
		if (location.pathname.startsWith(PathName.Authors)) {
			return <AuthorsScreen />;
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

export default HomeLibrarian;
