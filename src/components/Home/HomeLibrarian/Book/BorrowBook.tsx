import {Button, DatePicker, Form, Input, InputNumber} from 'antd';
import React, {FC, useState} from 'react';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Api from '../../../../sagas/api';

const BorrowBook: FC = () => {
	const [studentId, setStudentId] = useState<number>();
	const getUserByStudentId = async () => {
		if (studentId) {
			const response = await Api.getUserByStudentId(studentId);
			if (response && response.status === 200) {
				//
			}
		}
	}
	return (
		<div style={{display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto'}}>
			<Form labelCol={{span: 4}} wrapperCol={{span: 14}} layout={'horizontal'}>
				<Form.Item label="Student Id">
					<InputNumber value={studentId} onChange={(value) => setStudentId(typeof value === 'string' ? parseInt(value, 10) : value)} />
				</Form.Item>
				<Form.Item wrapperCol={{offset: 4, span: 16}}>
					<Button onClick={getUserByStudentId}>Get</Button>
				</Form.Item>
				<Form.Item label="Input">
					<Input />
				</Form.Item>
				<Form.Item label="DatePicker">
					<DatePicker />
				</Form.Item>
				<Form.Item label="InputNumber">
					<InputNumber />
				</Form.Item>
				<Form.Item wrapperCol={{offset: 4, span: 16}}>
					<Button>Add</Button>
				</Form.Item>
			</Form>
			<ToastContainer />
		</div>
	);
};

export default BorrowBook;
