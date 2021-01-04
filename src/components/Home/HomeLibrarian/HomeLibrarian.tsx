import React, {FC, lazy, ReactNode, Suspense, useCallback, useMemo} from 'react';
import HomeStudentHeader from './HomeStudentHeader';
import InputLabel from '@material-ui/core/InputLabel';
import 'antd/dist/antd.css';
import logo from '../../../assets/logo.png';
import H from 'history';
import {Redirect, useHistory, useLocation} from 'react-router-dom';
import PathName from '../../../constants/PathName';
import Loading from '../../Common/Loading';
import {useDispatch} from 'react-redux';
import {GetBooksSaveDataActionType} from '../../../@types/action';
import {GET_BOOKS_SAVE_DATA} from '../../../actions/ActionType';
import {Menu} from 'antd';
const SearchScreen = lazy(() => import('./Search/SearchScreen'));
const AuthorsScreen = lazy(() => import('./Authors/AuthorScreen'));
const BookScreen = lazy(() => import('./Book/BookScreen'));
const AddBook = lazy(() => import('./Book/AddBook'));
const BorrowBook = lazy(() => import('./Book/BorrowBook'));

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
		<Menu mode="inline" style={{width: '15%'}} defaultSelectedKeys={['1']}>
			<Menu.Item onClick={() => goTo(PathName.Home)} key={'1'}>{'Home'}</Menu.Item>
			<Menu.Item onClick={() => goTo(PathName.Search)} key={'2'}>{'Find a book'}</Menu.Item>
			<Menu.Item onClick={() => goTo(PathName.AddBook)} key={'3'}>{'Create new book'}</Menu.Item>
			<Menu.Item onClick={() => goTo(PathName.BorrowBook)} key={'4'}>{'Borrow book'}</Menu.Item>
			<Menu.Item onClick={() => goTo(PathName.History)} key={'5'}>{'History'}</Menu.Item>
			<Menu.Item onClick={() => goTo(PathName.Authors)} key={'6'}>{'Genres & Authors'}</Menu.Item>
		</Menu>
	), [goTo]);
	const home = useMemo((): ReactNode => (
		<div style={{flex: 1, display: 'flex', alignItems: 'center', flexDirection: 'column', overflowY: 'auto'}}>
			<img className={'pendulous-animation'} src={logo} style={{width: '25%'}} alt={'logo'} />
			<InputLabel style={{fontSize: 40, fontStyle: 'italic', fontWeight: 'bold', textAlign: 'center', color: 'black'}}>{'Swaying ducks is future :)'}</InputLabel>
		</div>
	), []);
	const rightPart = useMemo((): ReactNode => {
		if (location.pathname === PathName.Home) {
			return home;
		}
		if (location.pathname === PathName.Search) {
			return <SearchScreen />;
		}
		if (location.pathname === PathName.AddBook) {
			return <AddBook />;
		}
		if (location.pathname.startsWith(PathName.Book)) {
			return <BookScreen />;
		}
		if (location.pathname.startsWith(PathName.Authors)) {
			return <AuthorsScreen />;
		}
		if (location.pathname === PathName.BorrowBook) {
			return <BorrowBook />;
		}
		return <Redirect to={PathName.Home} />;
	}, [home, location.pathname]);
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
