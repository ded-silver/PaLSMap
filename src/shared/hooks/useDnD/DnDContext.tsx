import {
	Dispatch,
	ReactNode,
	SetStateAction,
	createContext,
	useContext,
	useMemo,
	useState
} from 'react'

// Тип для состояния
type DnDType = string | null

// Тип контекста
interface DnDContextType {
	type: DnDType
	setType: Dispatch<SetStateAction<DnDType>>
}

// Создание контекста с начальным значением
export const DnDContext = createContext<DnDContextType | undefined>(undefined)

// Провайдер контекста
export const DnDProvider = ({ children }: { children: ReactNode }) => {
	const [type, setType] = useState<DnDType>(null)

	const value = useMemo(() => ({ type, setType }), [type, setType])
	return <DnDContext.Provider value={value}>{children}</DnDContext.Provider>
}

// Хук для использования контекста
export const useDnD = () => {
	const context = useContext(DnDContext)

	if (!context) {
		throw new Error('useDnD must be used within a DnDProvider')
	}

	return context
}
