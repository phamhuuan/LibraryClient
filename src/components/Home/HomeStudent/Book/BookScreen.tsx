import React, {ElementRef, FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import CustomModal from '../../../Common/CustomModal';
import NetworkErrorModal from '../../../Common/NetworkErrorModal';
import Loading from '../../../Common/Loading';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {useParams, useHistory} from 'react-router-dom';
import Api from '../../../../sagas/api';
import {OK} from '../../../../constants/Constant';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import {Carousel} from 'react-responsive-carousel';
import {BookResponseType} from '../../../../@types/entity';
import {Button} from '@material-ui/core';
import {parseDate} from '../../../../utils/Utils';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date';
import {useSelector} from 'react-redux';
import {RootReducerType} from '../../../../@types/reducer';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		paper: {
			position: 'absolute',
			width: '100%',
			height: '100%',
		},
	}),
);

const BookScreen: FC = () => {
	const style = useStyles();
	type ModalHandleType = ElementRef<typeof CustomModal>;
	const loadingModalRef = useRef<ModalHandleType>(null);
	const networkErrorModalRef = useRef<ModalHandleType>(null);
	type ParamsType = {
		bookId: string;
	}
	const {bookId}: ParamsType = useParams();
	const [book, setBook] = useState<BookResponseType | undefined>(undefined);
	const userId = useSelector<RootReducerType, string>((state) => (state.userReducer.user?._id || ''));
	const history = useHistory();
	const [selectedDate, setSelectedDate] = useState<MaterialUiPickersDate>(new Date());
	const [showRequestButton, setShowRequestButton] = useState<boolean>(true);

	const handleDateChange = (date: MaterialUiPickersDate) => {
		setSelectedDate(date);
	};

	const getBookInfo = useCallback(async () => {
		const result = await Api.getBookInfo(bookId);
		if (result && result.status === 200) {
			if (result.data.status === OK) {
				setBook(result.data.book);
			}
		}
	}, [bookId]);

	useEffect(() => {
		loadingModalRef.current?.closeModal();
		getBookInfo();
	}, [getBookInfo]);

	const loadingModal = useMemo((): ReactNode => (
		<CustomModal ref={loadingModalRef} open className={style.paper}>
			<Loading />
		</CustomModal>
	), [style.paper]);

	const networkErrorModal = useMemo((): ReactNode => (
		<NetworkErrorModal ref={networkErrorModalRef} />
	), []);

	const goBack = useCallback((): void => {
		history.goBack();
	}, [history]);

	const backButton = useMemo((): ReactNode => (
		<div>
			<Button onClick={goBack} style={{fontSize: 20}}>Back</Button>
		</div>
	), [goBack]);

	// const onAskToBorrow = useCallback(async () => {
	// 	const result = await Api.requestBorrow(userId, bookId, new Date(), (selectedDate || new Date()));
	// 	if (result && result.status === 200) {
	// 		if (result.data.status === OK) {
	// 			setShowRequestButton(false);
	// 		}
	// 	}
	// }, [bookId, selectedDate, userId]);

	const bookInfo = useMemo((): ReactNode => {
		if (book) {
			return (
				<div style={{marginLeft: 20, marginRight: 20}}>
					<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<p style={{fontSize: 40}}>{book.name}</p>
					</div>
					<div>
						<p>
							<strong>1. Genre:</strong> {book.genre[0].name}
							<br />
							<strong>2. Publish date:</strong> {parseDate(book.publishDate)}
							<br />
							<strong>3. Location:</strong> Room {book.location}
							<br />
							<strong>4. Authors:</strong>
							{book.authors.map((author) => (
								<li key={author._id}>{author.name}</li>
							))}
							<strong>5. Images:</strong>
						</p>
					</div>
					<div>
						<Carousel autoPlay infiniteLoop interval={5000}>
							{book.images.map((image, index) => <img key={index} alt={book.name} src={image} />)}
						</Carousel>
					</div>
				</div>
			);
		}
		return <div />;
	}, [book]);

	// const askToBorrow = useMemo((): ReactNode => {
	// 	if (showRequestButton) {
	// 		return (
	// 			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
	// 				<div style={{width: 200, marginRight: 20}}>
	// 					<MuiPickersUtilsProvider utils={DateFnsUtils}>
	// 						<KeyboardDatePicker
	// 							margin="normal"
	// 							id="date-picker-dialog"
	// 							label="Choose end date"
	// 							format="MM/dd/yyyy"
	// 							value={selectedDate}
	// 							onChange={handleDateChange}
	// 							KeyboardButtonProps={{
	// 								'aria-label': 'change date',
	// 							}}
	// 						/>
	// 					</MuiPickersUtilsProvider>
	// 				</div>
	// 				<Button variant={'contained'} color={'primary'} onClick={onAskToBorrow}>
	// 					Ask to borrow
	// 				</Button>
	// 			</div>
	// 		);
	// 	} else {
	// 		return <div />;
	// 	}
	// }, [onAskToBorrow, selectedDate, showRequestButton]);

	return (
		<div style={{display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto'}}>
			{backButton}
			{bookInfo}
			{loadingModal}
			{networkErrorModal}
		</div>
	)
};

export default BookScreen;
