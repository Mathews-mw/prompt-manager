import { searchPromptAction } from '@/app/actions/prompt.actions';

jest.mock('@/lib/prisma', () => ({ prisma: {} }));

const mockedSearchExecute = jest.fn();

jest.mock('@/core/application/prompts/search-prompts-use-case', () => ({
	SearchPromptsUseCase: jest.fn().mockImplementation(() => ({ execute: mockedSearchExecute })),
}));

describe('Server Actions: Prompts', () => {
	beforeEach(() => {
		mockedSearchExecute.mockReset();
	});

	it('should return success when query term is empty', async () => {
		const input = [{ id: '1', title: 'Prompt Title', content: 'Content', createdAt: new Date() }];
		mockedSearchExecute.mockRejectedValue(input);

		const formData = new FormData();
		formData.append('q', 'Prompt');

		const result = await searchPromptAction({ success: true }, formData);
		console.log('result: ', result);

		expect(result.success).toBe(true);
		expect(result.data?.prompts).toEqual(input);
	});
});
