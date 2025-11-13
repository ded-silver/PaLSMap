import i18n from 'i18next'
import { toast } from 'react-toastify'

interface ErrorResponse {
	response?: {
		status?: number
		data?: {
			message?: string
		}
	}
}

interface ErrorHandlerOptions {
	defaultErrorKey: string
	namespace: string
	successKey?: string
	onSuccess?: () => void
}

export const handleMutationError = (
	error: ErrorResponse,
	options: Pick<ErrorHandlerOptions, 'defaultErrorKey' | 'namespace'>
) => {
	let errorMessage = i18n.t(options.defaultErrorKey, { ns: options.namespace })

	if (error?.response?.data?.message) {
		errorMessage = error.response.data.message
	} else if (error?.response?.status === 409) {
		errorMessage = i18n.t('messages.duplicateError', {
			ns: options.namespace
		})
	} else if (error?.response?.status === 403) {
		errorMessage = i18n.t('messages.forbiddenError', {
			ns: options.namespace
		})
	} else if (error?.response?.status === 401) {
		errorMessage = i18n.t('messages.unauthorizedError', {
			ns: options.namespace
		})
	} else if (error?.response?.status === 404) {
		errorMessage = i18n.t('messages.notFoundError', {
			ns: options.namespace
		})
	}

	toast.error(errorMessage)
}

export const handleMutationSuccess = (
	options: Pick<ErrorHandlerOptions, 'successKey' | 'namespace' | 'onSuccess'>
) => {
	if (options.successKey) {
		toast.success(i18n.t(options.successKey, { ns: options.namespace }))
	}
	options.onSuccess?.()
}
