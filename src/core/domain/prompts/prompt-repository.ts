import { IPrompt } from './prompt.entity';

export interface IPromptRepository {
	findMany(): Promise<IPrompt[]>;
	searchMany(term?: string): Promise<IPrompt[]>;
}
