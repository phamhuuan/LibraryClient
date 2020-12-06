export const checkValidEmail = (str: string): boolean => {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(str);
}

export const getCurrentMillisecond = (): number => {
	return new Date().getTime();
}

export const parseDate = (data: string): string => {
	const dateData = new Date(data);
	const date = dateData.getDate();
	const month = dateData.getMonth() + 1;
	const year = dateData.getFullYear();
	return date + '/' + month + '/' + year;
};
