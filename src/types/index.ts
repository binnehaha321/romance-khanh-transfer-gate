export type SubjectType = 'piano' | 'organ' | 'guitar' | 'vocal'

export interface IDataValues {
	studentName: string
	subject: SubjectType | string
	amount: number
}
