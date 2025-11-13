import {
	Dispatch,
	ReactNode,
	SetStateAction,
	createContext,
	useContext,
	useMemo,
	useState
} from 'react'

type DnDType = string | null

interface DnDContextType {
	type: DnDType
	setType: Dispatch<SetStateAction<DnDType>>
}

export const DnDContext = createContext<DnDContextType | undefined>(undefined)

export const DnDProvider = ({ children }: { children: ReactNode }) => {
	const [type, setType] = useState<DnDType>(null)

	const value = useMemo(() => ({ type, setType }), [type, setType])
	return <DnDContext.Provider value={value}>{children}</DnDContext.Provider>
}

export const useDnD = () => {
	const context = useContext(DnDContext)

	if (!context) {
		throw new Error('useDnD must be used within a DnDProvider')
	}

	return context
}
