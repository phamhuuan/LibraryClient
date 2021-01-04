import React, {ChangeEvent, ElementRef, FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Button, Avatar, IconButton} from '@material-ui/core';
import PathName from '../../../../constants/PathName';
import {useHistory, useParams} from 'react-router';
import {AuthorType} from '../../../../@types/entity';
import Api from '../../../../sagas/api';
import {OK} from '../../../../constants/Constant';
import CustomModal from '../../../Common/CustomModal';
import Loading from '../../../Common/Loading';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import ERROR_CODE from '../../../../constants/ErrorCode';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextInput from '../../../Common/TextInput';
import {AddCircleOutline} from '@material-ui/icons';
import {checkValidURL} from '../../../../utils/Utils';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		paper: {
			position: 'absolute',
			width: '100%',
			height: '100%',
		},
	}),
);

const AuthorDetail: FC = () => {
	const style = useStyles();
	const divElementRef = useRef<HTMLDivElement>(null);
	const history = useHistory();
	type ModalHandleType = ElementRef<typeof CustomModal>;
	type TextInputHandleType = ElementRef<typeof TextInput>;
	const avatarInputModalRef = useRef<TextInputHandleType>(null);
	const loadingModalRef = useRef<ModalHandleType>(null);
	type ParamsType = {
		genreId: string;
		authorId: string;
	}
	const {genreId, authorId}: ParamsType = useParams();
	type StateType = {
		author: AuthorType | undefined;
		author2: AuthorType | undefined;
		genreName: string;
	};
	const [state, setState] = useState<StateType>({author: undefined, author2: undefined, genreName: ''});
	const [isShowEditAuthorView, setIsShowEditAuthorView] = useState<boolean>(false);

	const getAuthorInfo = useCallback(async (): Promise<void> => {
		const response = await Api.getAuthorInfo(authorId);
		loadingModalRef.current?.closeModal();
		if (response && response.data) {
			if (response.data.status === OK) {
				setState({author: response.data.author, author2: response.data.author, genreName: response.data.genreName});
			} else {
				if (response.data.errorCode === ERROR_CODE.GET_AUTHOR_INFO_ERROR.AUTHOR_NOT_EXSIST) {
					history.replace(PathName.Authors + '/' + genreId);
				} else {
					toast('Network error', {type: 'error'});
				}
			}
		} else {
			toast('Network error', {type: 'error'});
		}
	}, [authorId, genreId, history]);

	useEffect(() => {
		getAuthorInfo();
	}, [getAuthorInfo]);

	const goBack = useCallback((): void => {
		history.goBack();
	}, [history]);

	const openEditForm = () => {
		setIsShowEditAuthorView(true);
	};

	const closeEditForm = useCallback(() => {
		setIsShowEditAuthorView(false);
		setState({...state, author: state.author2});
	}, [state]);

	const saveAuthorInfo = useCallback(async () => {
		if (state.author) {
			if (state.author.name.trim() === '') {
				toast('Author name should not be an empty string!', {type: 'error'});
				return;
			}
			if (state.author.avatar.length === 0) {
				toast('Author must have avatar!', {type: 'error'});
				return;
			}
			if (state.author.biography.trim() === '') {
				toast('Author biography should not be an empty string!', {type: 'error'});
				return;
			}
		}
		const response = await Api.editAuthor(state.author);
		if (response && response.status === 200) {
			if (response.data.status === OK) {
				setIsShowEditAuthorView(false);
				setState({...state, author2: state.author});
				toast('Update author success!', {type: 'success'});
			} else {
				if (response.data.errorCode === ERROR_CODE.UPDATE_AUTHOR_ERROR.AUTHOR_NOT_FOUND) {
					goBack();
					toast('Author not found!', {type: 'error'});
				} else {
					toast('Network error', {type: 'error'});
				}
			}
		} else {
			toast('Network error', {type: 'error'});
		}
	}, [goBack, state]);

	const backButton = useMemo((): ReactNode => (
		<div style={{display: 'flex', flexDirection: 'row'}}>
			{!isShowEditAuthorView ? <Button onClick={goBack} style={{fontSize: 20}}>Back</Button> : <Button onClick={closeEditForm} style={{fontSize: 20}}>Cancel</Button>}
			<div style={{flex: 1}} />
			{!isShowEditAuthorView ? <Button onClick={openEditForm} style={{fontSize: 20}}>Edit</Button> : <Button onClick={saveAuthorInfo} style={{fontSize: 20}}>Save</Button>}
		</div>
	), [closeEditForm, goBack, isShowEditAuthorView, saveAuthorInfo]);

	const setBiographyValue = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		if (state.author) {
			setState({...state, author: {...state.author, biography: event.target.value}});
		}
	}, [state]);

	const setNameValue = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		if (state.author) {
			setState({...state, author: {...state.author, name: event.target.value}});
		}
	}, [state]);

	const setAvatarValue = useCallback(() => {
		if (state.author && avatarInputModalRef.current) {
			if (checkValidURL(avatarInputModalRef.current.getTextInputState().value.trim())) {
				avatarInputModalRef.current.setTextInputState({value: ''});
				setState({...state, author: {...state.author, avatar: [avatarInputModalRef.current.getTextInputState().value.trim()]}})
			} else {
				toast('You must enter a valid image url!', {type: 'warning'});
			}
		}
	}, [state]);

	const authorInfo = useMemo((): ReactNode => {
		if (state.author) {
			return (
				<>
					<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<Avatar style={{height: 200, width: 200}} alt={state.author.name} src={state.author.avatar[0]} />
						{isShowEditAuthorView && <div style={{display: 'flex', flexDirection: 'row'}}>
							<TextInput ref={avatarInputModalRef} label={''} placeholder={'Author\'s avatar'} style={{width: '100%'}} />
							<IconButton onClick={setAvatarValue}>
								<AddCircleOutline />
							</IconButton>
						</div>}
						{isShowEditAuthorView ? <TextInput label={''} placeholder={'Author\'s name'} value={state.author.name} onChange={setNameValue} style={{width: '100%'}} /> : <p style={{fontSize: 30, marginTop: 10, fontWeight: 'bold'}}>{state.author.name}</p>}
					</div>
					<div style={{alignSelf: 'left'}}>
						<p style={{fontSize: 30, marginLeft: 10, fontWeight: 'bold'}}>1. Biography</p>
						{isShowEditAuthorView ? <TextInput label={''} placeholder={'Biography'} value={state.author.biography} onChange={setBiographyValue} style={{width: '100%'}} multiline /> : <p style={{textAlign: 'justify', marginLeft: 20, marginRight: 50, whiteSpace: 'pre-line'}}>{state.author.biography}</p>}
						<p style={{fontSize: 30, marginLeft: 10, fontWeight: 'bold'}}>2. Speciality</p>
						<p style={{textAlign: 'justify', marginLeft: 20, marginRight: 50}}>{state.genreName}</p>
					</div>
				</>
			);
		}
		return <div />;
	}, [isShowEditAuthorView, setAvatarValue, setBiographyValue, setNameValue, state.author, state.genreName]);

	const loadingModal = useMemo((): ReactNode => (
		<CustomModal ref={loadingModalRef} open className={style.paper}>
			<Loading />
		</CustomModal>
	), [style.paper]);

	return (
		<div style={{display: 'flex', flex: 1, height: '100%', overflowY: 'auto'}}>
			<div 
				ref={divElementRef}
				style={{display: 'flex', flex: 1, marginLeft: 20, marginRight: 20, flexDirection: 'column'}}>
				{backButton}
				{authorInfo}
				{loadingModal}
				<ToastContainer />
			</div>
		</div>
	);
}

export default AuthorDetail;
