/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-types */
import { useCallback, useEffect, useMemo, useRef } from 'react'

export const debounce = <F extends Function>(f: F, ms: number) => {
	let timeout: NodeJS.Timeout | null = null

	const clear = () => {
		if (timeout) {
			clearTimeout(timeout)
			timeout = null
		}
	}

	const call = (...args: any[]) => {
		clear()

		timeout = setTimeout(() => {
			f(...args)
		}, ms)
	}
	call.clear = clear

	return call as unknown as F & { clear: () => void }
}

const useRefCallback = <F extends Function>(f: F) => {
	const cb = useRef(f)
	useEffect(() => {
		cb.current = f
	})

	return useCallback((...args: any[]) => cb.current(...args), [cb])
}

export const useDebouncedCallback = <F extends Function>(f: F, ms: number) => {
	const cb = useRefCallback(f)
	return useMemo(() => debounce(cb, ms), [cb, ms])
}
