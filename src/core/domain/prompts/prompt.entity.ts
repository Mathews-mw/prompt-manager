export interface IPrompt {
	id: string;
	title: string;
	content: string;
	createdAt: Date;
	updatedAt?: Date | null;
}
