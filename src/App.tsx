import { useCallback, useState } from 'react'
import { Button, Flex, Form, FormProps, Input, Select } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import QrScanner from 'qr-scanner'

import { IDataValues } from './types'
import { capitalizeText, getFeeBySubject, subjectOptions } from './lib/utils'
import { ACCOUNT_NAME, ACCOUNT_NUMBER, BANK_ID, TEMPLATE } from './constants'

function App() {
	const [formTransfer] = Form.useForm()
	const [feeByDuration, setFeeByDuration] = useState<DefaultOptionType[]>([])
	const [desc, setDesc] = useState('')
	const [schemeUrl, setSchemeUrl] = useState('')

	const handleSubmit: FormProps<IDataValues>['onFinish'] = async (values) => {
		await generateSchemeUrl(values)
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

	const handleStudentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const capitalizedValue = capitalizeText(e.currentTarget.value)
		formTransfer.setFieldsValue({ studentName: capitalizedValue })
	}

	const handleFormBlur = async () => {
		const dataValues = formTransfer.getFieldsValue() as IDataValues
		await generateSchemeUrl(dataValues)
	}

	const generateSchemeUrl = useCallback(async (values: IDataValues) => {
		if (values?.studentName && values?.subject && values?.amount) {
			const { studentName, subject, amount } = values

			const description = `${studentName} dong hoc phi ${subject}`

			const encodedDescription = encodeURIComponent(description)
			const bankSchemeUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NUMBER}-${TEMPLATE}.png?amount=${amount}&addInfo=${encodedDescription}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`

			setDesc(description)
			setSchemeUrl(bankSchemeUrl)

			const imageFile = await fetch(
				`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${bankSchemeUrl}`
			).then((resp) => resp.blob())

			const result = await QrScanner.scanImage(imageFile, {
				returnDetailedScanResult: true
			})
			console.log(result.data)
			window.location.href = result.data
		}
	}, [])

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
				onBlur={handleFormBlur}
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
						readOnly
						placeholder='Nội dung chuyển khoản...'
						value={desc}
					/>
				</Form.Item>
				<Button
					type='primary'
					htmlType='submit'
					className='w-full'
				>
					<a
						href={schemeUrl}
						target='_blank'
					>
						Xác nhận
					</a>
				</Button>
				{/* <a href='https://dl.vietqr.io/pay?app=tpb'>bam vo</a> */}
			</Form>
		</Flex>
	)
}

export default App
