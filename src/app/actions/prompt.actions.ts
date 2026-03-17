'use server';

import { prisma } from '@/lib/prisma';
import { IPrompt } from '@/core/domain/prompts/prompt.entity';
import { PrismaPromptRepository } from '@/infra/repository/prisma-prompt-repository';
import { SearchPromptsUseCase } from '@/core/application/prompts/search-prompts-use-case';

interface ISearchFormState {
	success: boolean;
	data?: { prompts: IPrompt[] };
	message?: string;
}

export async function searchPromptAction(_prev: ISearchFormState, formData: FormData): Promise<ISearchFormState> {
	const term = String(formData.get('q') ?? '').trim();

	const repository = new PrismaPromptRepository(prisma);
	const service = new SearchPromptsUseCase(repository);

	try {
		const prompts = await service.execute(term);

		return { success: true, data: { prompts } };
	} catch (error) {
		console.log('error: ', error);
		return { success: false, message: 'Falha ao buscar prompts' };
	}
}
