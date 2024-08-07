import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Flex, Form, FormProps, Input, Select } from 'antd'
import { DefaultOptionType } from 'antd/es/select'

import { IDataValues } from './types'
import { capitalizeText, getFeeBySubject, subjectOptions } from './lib/utils'
import { ACCOUNT_NAME, ACCOUNT_NUMBER, BANK_ID, TEMPLATE } from './constants'

function App() {
	const [feeByDuration, setFeeByDuration] = useState<DefaultOptionType[]>([])
	const [desc, setDesc] = useState('')
	const [schemeUrl, setSchemeUrl] = useState('')
	const [formTransfer] = Form.useForm<IDataValues>()
	const studentName = Form.useWatch('studentName', formTransfer)
	const subject = Form.useWatch('subject', formTransfer)
	const amount = Form.useWatch('amount', formTransfer)
	const enoughData = useMemo(
		() => !!(studentName && subject && amount),
		[studentName, subject, amount]
	)

	const handleSubmit: FormProps<IDataValues>['onFinish'] = (values) => {
		generateSchemeUrl(values)
	}

	const handleSubmitFailed: FormProps<IDataValues>['onFinishFailed'] = (
		errorInfo
	) => {
		console.log('Failed:', errorInfo)
	}

	const handleFieldsChange: FormProps<IDataValues>['onFieldsChange'] = (
		fields
	) => {
		const { name, value } = fields[0]
		if (name[0] === 'subject') {
			setFeeByDuration(getFeeBySubject(value))
		}
	}

	const handleStudentNameChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const capitalizedValue = capitalizeText(e.currentTarget.value)
			formTransfer.setFieldsValue({ studentName: capitalizedValue })
		},
		[formTransfer]
	)

	const generateSchemeUrl = useCallback(
		(values: IDataValues) => {
			if (values?.studentName && values?.subject && values?.amount) {
				const { studentName, subject, amount } = values

				const description = desc || `${studentName} dong hoc phi ${subject}`

				const encodedDescription = encodeURIComponent(description)
				const bankSchemeUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NUMBER}-${TEMPLATE}.png?amount=${amount}&addInfo=${encodedDescription}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`

				setDesc(description)
				setSchemeUrl(bankSchemeUrl)
			}
		},
		[desc]
	)

	useEffect(() => {
		if (studentName && subject && amount) {
			const val = { studentName, subject, amount }
			generateSchemeUrl(val)
		}
	}, [studentName, subject, amount, generateSchemeUrl])

	return (
		<Flex
			vertical
			justify='center'
			align='center'
			className='w-[300px] h-screen mx-auto'
		>
			<Form
				onFinish={handleSubmit}
				onFinishFailed={handleSubmitFailed}
				onFieldsChange={handleFieldsChange}
				layout='vertical'
				autoComplete='off'
				form={formTransfer}
				className='w-full'
			>
				<Form.Item
					label='Tên học viên (KHÔNG DẤU)'
					rules={[{ required: true, message: 'Vui lòng nhập tên học viên!' }]}
					name='studentName'
				>
					<Input
						autoFocus
						placeholder='Tieu Vy'
						onChange={handleStudentNameChange}
					/>
				</Form.Item>
				<Form.Item
					label='Môn học'
					rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
					name='subject'
				>
					<Select
						options={subjectOptions}
						placeholder='Chọn môn học'
					/>
				</Form.Item>
				<Form.Item
					label='Học phí'
					rules={[
						{ required: true, message: 'Vui lòng chọn độ dài khóa học!' }
					]}
					name='amount'
				>
					<Select
						options={feeByDuration}
						placeholder='Chọn độ dài khóa học'
					/>
				</Form.Item>
				<Form.Item label='Nội dung chuyển khoản'>
					<Input
						readOnly={!enoughData}
						placeholder='Nội dung chuyển khoản...'
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
					/>
				</Form.Item>
				<Button
					type='primary'
					htmlType='submit'
					className='w-full'
					disabled={!schemeUrl}
				>
					<a
						href={schemeUrl}
						target='_blank'
						className='block w-full h-full text-center'
					>
						Xác nhận
					</a>
				</Button>
			</Form>
		</Flex>
	)
}

export default App
