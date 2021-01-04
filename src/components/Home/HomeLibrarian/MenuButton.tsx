import React, {FC} from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';

interface MenuButtonPropsType {
	onClick: () => void;
	text: string;
}

const MenuButton: FC<MenuButtonPropsType> = (props) => {
	return (
		<Button 
			onClick={props.onClick} 
			style={{backgroundColor: 'wheat', display: 'flex', paddingTop: 10, paddingBottom: 5, width: '95%', marginTop: 10, borderRadius: 20, alignItems: 'center'}}>
			<div style={{display: 'flex', textAlign: 'left', width: '100%'}}>
				<InputLabel style={{fontSize: '2vw', color: 'black', maxLines: 1}}>{props.text}</InputLabel>
			</div>
		</Button>
	);
};

export default MenuButton;
