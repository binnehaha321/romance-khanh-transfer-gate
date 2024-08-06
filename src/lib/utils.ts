import { DefaultOptionType } from 'antd/es/select'
import { SubjectType } from '../types'

interface ISubjectFee {
	name: SubjectType
	month: number
	quarter: number
	halfYear: number
	year: number
}

type IDuration = keyof Omit<ISubjectFee, 'name'>

export const subjectsFee: ISubjectFee[] = [
	{
		name: 'piano',
		month: 1590000,
		quarter: 4608000,
		halfYear: 8856000,
		year: 16992000
	},
	{
		name: 'organ',
		month: 1440000,
		quarter: 4248000,
		halfYear: 8352000,
		year: 16128000
	},
	{
		name: 'guitar',
		month: 1440000,
		quarter: 4248000,
		halfYear: 8352000,
		year: 16128000
	},
	{
		name: 'vocal',
		month: 1980000,
		quarter: 5760000,
		halfYear: 11160000,
		year: 21600000
	}
]

export const capitalizeText = (str: string) => {
	return str.replace(/\b\w/g, (char) => char.toUpperCase())
}

const translateDuration = (duration: IDuration): string => {
	switch (duration) {
		case 'year':
			return 'năm'
		case 'halfYear':
			return '6 tháng'
		case 'quarter':
			return '3 tháng'
		case 'month':
			return 'tháng'
		default:
			return ''
	}
}

const formatVnd = (amount: number) =>
	amount.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })

export const subjectOptions: DefaultOptionType[] = subjectsFee.map(
	(subject) => ({
		label:
			subject.name === 'vocal' ? 'Thanh nhạc' : capitalizeText(subject.name),
		value: subject.name
	})
)

export const getFeeBySubject = (subjectType: SubjectType) => {
	if (!subjectType) return []

	const subjectFee = subjectsFee.find((subject) => {
		return subject.name === subjectType
	})

	const feeByDuration: DefaultOptionType[] = Object.entries(subjectFee!)
		.slice(1)
		.map(([duration, price]) => ({
			label: `${formatVnd(price)}/${translateDuration(duration as IDuration)}`,
			value: price
		}))

	return feeByDuration
}
