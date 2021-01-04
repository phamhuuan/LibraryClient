import React, {ElementRef, FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import CustomModal from '../../../Common/CustomModal';
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
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
	type ParamsType = {
		bookId: string;
	}
	const {bookId}: ParamsType = useParams();
	const [book, setBook] = useState<BookResponseType | undefined>(undefined);
	const history = useHistory();

	const getBookInfo = useCallback(async () => {
		const result = await Api.getBookInfo(bookId);
		if (result && result.status === 200) {
			if (result.data.status === OK) {
				setBook(result.data.book);
			} else {
				toast('Network error', {type: 'error'});
			}
		} else {
			toast('Network error', {type: 'error'});
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

	const goBack = useCallback((): void => {
		history.goBack();
	}, [history]);

	const backButton = useMemo((): ReactNode => (
		<div>
			<Button onClick={goBack} style={{fontSize: 20}}>Back</Button>
		</div>
	), [goBack]);

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

	return (
		<div style={{display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto'}}>
			{backButton}
			{bookInfo}
			{loadingModal}
			<ToastContainer />
		</div>
	)
};

export default BookScreen;
