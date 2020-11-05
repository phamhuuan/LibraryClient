import {Button, InputLabel, MenuItem, Menu} from '@material-ui/core';
import React, {FC} from 'react';
import TextInput from '../../../Common/TextInput';

const authorOptions = [
	'Contain',
	'Does not contain'
];

const SearchScreen: FC = () => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [selectedIndex, setSelectedIndex] = React.useState(0);

	const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
		setSelectedIndex(index);
		setAnchorEl(null);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	return (
		<div style={{display: 'flex', flexDirection: 'column', height: '100vh', flex: 1}}>
			<div style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
				<div style={{display: 'flex', width: '10%', alignItems: 'center', justifyContent: 'center'}}>
					<InputLabel style={{color: 'black'}}>Author</InputLabel>
				</div>
				<div>
					<Button onClick={handleClickListItem}>
						<InputLabel style={{color: 'black'}}>{authorOptions[selectedIndex]}</InputLabel>
					</Button>
					<Menu
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl)}
						onClose={handleClose}>
						{authorOptions.map((option, index) => (
							<MenuItem
								key={option}
								selected={index === selectedIndex}
								onClick={(event) => handleMenuItemClick(event, index)}>
								{option}
							</MenuItem>
						))}
					</Menu>
				</div>
			</div>
		</div>
	)
};

export default SearchScreen;
