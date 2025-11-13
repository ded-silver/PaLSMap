export interface EdgeDto {
	id: string
	source: string
	target: string
	sourceHandle?: string | null
	targetHandle?: string | null
	type?: string
	style?: {
		strokeWidth?: number
		stroke?: string
		[key: string]: any
	}
}
