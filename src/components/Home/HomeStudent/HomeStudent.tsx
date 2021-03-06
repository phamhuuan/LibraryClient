import React, {FC, lazy, ReactNode, Suspense, useCallback, useMemo} from 'react';
import HomeStudentHeader from './HomeStudentHeader';
import InputLabel from '@material-ui/core/InputLabel';
import logo from '../../../assets/logo.png';
import H from 'history';
import {Redirect, useHistory, useLocation} from 'react-router-dom';
import PathName from '../../../constants/PathName';
import Loading from '../../Common/Loading';
import {useDispatch} from 'react-redux';
import {GetBooksSaveDataActionType} from '../../../@types/action';
import {GET_BOOKS_SAVE_DATA} from '../../../actions/ActionType';
import {Menu} from 'antd';
import 'antd/dist/antd.css';
const SearchScreen = lazy(() => import('./Search/SearchScreen'));
const AuthorsScreen = lazy(() => import('./Authors/AuthorScreen'));
const BookScreen = lazy(() => import('./Book/BookScreen'));

const HomeStudent: FC = () => {
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
			<Menu.Item onClick={() => goTo(PathName.AddBook)} key={'3'}>{'Book borrowed'}</Menu.Item>
			<Menu.Item onClick={() => goTo(PathName.Authors)} key={'4'}>{'Genres & Authors'}</Menu.Item>
		</Menu>
	), [goTo]);

	const home = useMemo((): ReactNode => (
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
	), []);
	const rightPart = useMemo((): ReactNode => {
		if (location.pathname === PathName.Home) {
			return home;
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

export default HomeStudent;
