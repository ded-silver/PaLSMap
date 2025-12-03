import { isAxiosError } from 'axios'

export const getErrorMessage = (
	error: unknown,
	defaultMessage: string
): string => {
	if (isAxiosError(error) && error.response?.data?.message) {
		return error.response.data.message
	}
	return defaultMessage
}
