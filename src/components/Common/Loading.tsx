import React, {FC} from 'react';
import logo from '../../assets/logo.png';
import useWindowDimensions, {WindowDimensionsType} from '../../hooks/useWindowDimensions';
import '../../styles/css/index.css';

const Loading: FC = () => {
	const {height, width}: WindowDimensionsType = useWindowDimensions();
	return (
		<div style={{display: 'flex', height: '100%', width: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'center'}}>
			<div className={'spin-animation'} style={{display: 'flex', flexDirection: 'column', height: Math.min(height, width) / 2, width: Math.min(height, width) / 2}}>
				<div style={{display: 'flex', width: '100%', flexDirection: 'row'}}>
					<img className={'spin-animation'} alt={'logo'} src={logo} style={{width: Math.min(height, width) / 8, height: Math.min(height, width) / 8}} />
					<div style={{flex: 1}} />
					<img className={'spin-animation'} alt={'logo'} src={logo} style={{width: Math.min(height, width) / 8, height: Math.min(height, width) / 8}} />
				</div>
				<div style={{flex: 1}} />
				<div style={{display: 'flex', width: '100%', flexDirection: 'row'}}>
					<img className={'spin-animation'} alt={'logo'} src={logo} style={{width: Math.min(height, width) / 8, height: Math.min(height, width) / 8}} />
					<div style={{flex: 1}} />
					<img className={'spin-animation'} alt={'logo'} src={logo} style={{width: Math.min(height, width) / 8, height: Math.min(height, width) / 8}} />
				</div>
			</div>
		</div>
	);
}

export default Loading;
