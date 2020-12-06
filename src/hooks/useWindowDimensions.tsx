import {useState, useEffect} from 'react';

export interface WindowDimensionsType {
	height: number;
	width: number;
}

const getWindowDimensions = (): WindowDimensionsType => {
	const {innerWidth: width, innerHeight: height} = window;
	return {
		width,
		height,
	};
}

const useWindowDimensions = (): WindowDimensionsType => {
	const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

	useEffect(() => {
		function handleResize() {
			setWindowDimensions(getWindowDimensions());
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return windowDimensions;
}

export default useWindowDimensions;