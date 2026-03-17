import { IPromptRepository } from '@/core/domain/prompts/prompt-repository';
import { IPrompt } from '@/core/domain/prompts/prompt.entity';
import { PrismaClient } from '@/generated/prisma/client';

export class PrismaPromptRepository implements IPromptRepository {
	constructor(private prisma: PrismaClient) {}

	async findMany(): Promise<IPrompt[]> {
		const prompts = await this.prisma.prompt.findMany();

		return prompts;
	}

	async searchMany(term?: string): Promise<IPrompt[]> {
		const q = term?.trim() ?? '';

		const prompts = await this.prisma.prompt.findMany({
			where: q
				? {
						OR: [{ title: { contains: q, mode: 'insensitive' } }, { content: { contains: q, mode: 'insensitive' } }],
					}
				: undefined,
			orderBy: { createdAt: 'desc' },
		});

		return prompts;
	}
}
