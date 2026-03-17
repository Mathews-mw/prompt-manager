import { IPrompt } from '@/core/domain/prompts/prompt.entity';
import { IPromptRepository } from '@/core/domain/prompts/prompt-repository';
import { SearchPromptsUseCase } from '@/core/application/prompts/search-prompts-use-case';

describe('Search Prompt Use Case', () => {
	const input: IPrompt[] = [
		{ id: '01', title: 'Title 01', content: 'Content 01', createdAt: new Date(), updatedAt: new Date() },
		{ id: '02', title: 'Title 02', content: 'Content 02', createdAt: new Date(), updatedAt: new Date() },
	];

	const repository: IPromptRepository = {
		findMany: async () => input,
		searchMany: async (term: string) =>
			input.filter(
				(prompt) =>
					prompt.title.toLocaleLowerCase().includes(term?.toLocaleLowerCase()) ||
					prompt.content.toLocaleLowerCase().includes(term?.toLocaleLowerCase())
			),
	};

	it('should return all prompts when the search query is empty', async () => {
		const service = new SearchPromptsUseCase(repository);

		const result = await service.execute('');

		expect(result).toHaveLength(2);
	});

	it('should filter the prompt list by search term', async () => {
		const service = new SearchPromptsUseCase(repository);
		const query = 'title 01';

		const result = await service.execute(query);

		expect(result).toHaveLength(1);
		expect(result[0].id).toEqual('01');
	});
});
