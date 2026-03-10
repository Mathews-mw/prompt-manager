import { prisma } from '@/lib/prisma';
import { SidebarContent } from './sidebar-content';

async function getPrompts() {
	const prompts = await prisma.prompt.findMany();

	return prompts;
}

export async function Sidebar() {
	const prompts = await getPrompts();

	return <SidebarContent prompts={prompts} />;
}
