export interface Note {
	id: string; // UUID
	title: string;
	description: string;
	backgroundColor?: string;
	endDate?: {
		date: number;
		hour: number;
		minute: number;
	};
}
