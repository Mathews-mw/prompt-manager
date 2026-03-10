'use client';

import { ChangeEvent, startTransition, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Logo } from '../../logo/logo';
import { Button } from '../button';

import { ArrowLeftToLine, ArrowRightToLine, Plus, X } from 'lucide-react';
import { Input } from '../input';
import { PromptList } from '@/components/prompts/prompt-list';
import { IPrompt } from '@/core/domain/prompts/prompt.entity';

export interface ISidebarContentProps {
	prompts: IPrompt[];
}

export function SidebarContent({ prompts }: ISidebarContentProps) {
	const searchParams = useSearchParams();

	const [isCollapsed, setIsCollapsed] = useState(false);
	const [query, setQuery] = useState(searchParams.get('q') ?? '');

	const router = useRouter();

	function collapseSidebar() {
		setIsCollapsed(true);
	}

	function expandSidebar() {
		setIsCollapsed(false);
	}

	function handleNewPrompt() {
		router.push('/new');
	}

	function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
		const newQuery = event.target.value;
		setQuery(newQuery);

		startTransition(() => {
			const url = newQuery ? `/?q=${encodeURIComponent(newQuery)}` : '/';
			router.push(url, { scroll: false });
		});
	}

	return (
		<aside
			className={`fixed top-0 left-0 z-50 flex h-full w-[80vw] flex-col border-r border-gray-700 bg-gray-800 transition-[transform,width] duration-300 ease-in-out sm:w-[320px] md:relative md:z-auto ${isCollapsed ? 'md:w-[72px]' : 'md:w-[384px]'}`}
		>
			{isCollapsed && (
				<section className="px-2 py-6">
					<header className="mb-6 flex items-center justify-center">
						<Button
							onClick={expandSidebar}
							variant="icon"
							className="focus:ring-accent-500 hidden rounded-lg p-2 transition-colors hover:bg-gray-700 focus:ring-2 focus:outline-none md:inline-flex"
							aria-label="Expandir sidebar"
							title="Expandir sidebar"
						>
							<ArrowRightToLine className="h-5 w-5 text-gray-100" />
						</Button>
					</header>

					<div className="flex flex-col items-center space-y-4">
						<Button onClick={handleNewPrompt} aria-label="Novo prompt" title="Novo prompt">
							<Plus className="size-5 text-white" />
						</Button>
					</div>
				</section>
			)}

			{!isCollapsed && (
				<>
					<section className="p-6">
						<div className="mb-4 md:hidden">
							<div className="flex items-center justify-between">
								<Button variant="secondary">
									<X className="h-5 w-5 text-gray-100" />
								</Button>
							</div>
						</div>
						<div className="mb-6 flex w-full items-center justify-between">
							<header className="flex w-full items-center justify-between">
								<Logo />
								<Button
									onClick={collapseSidebar}
									variant="icon"
									title="Minimizar sidebar"
									aria-label="Minimizar sidebar"
									className="focus:ring-accent-500 hidden rounded-lg p-2 transition-colors hover:bg-gray-700 focus:ring-2 focus:outline-none md:inline-flex"
								>
									<ArrowLeftToLine className="h-5 w-5 text-gray-100" />
								</Button>
							</header>
						</div>

						<section className="mb-5">
							<form>
								<Input
									name="q"
									type="text"
									placeholder="Buscar Prompt..."
									autoFocus
									value={query}
									onChange={handleQueryChange}
								/>
							</form>
						</section>

						<div>
							<Button onClick={handleNewPrompt} className="w-full" size="lg">
								<Plus className="mr-2 h-5 w-5" />
								Novo prompt
							</Button>
						</div>
					</section>

					<nav aria-label="Lista de prompts" className="flex-1 overflow-auto px-6 pb-6">
						<PromptList prompts={prompts} />
					</nav>
				</>
			)}
		</aside>
	);
}
