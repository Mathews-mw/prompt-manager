import { IPrompt } from '@/core/domain/prompts/prompt.entity';
import { PromptCard } from './prompt-card';

interface IProps {
	prompts: IPrompt[];
}

export function PromptList({ prompts }: IProps) {
	return (
		<ul>
			{prompts.map((prompt) => {
				return <PromptCard key={prompt.id} prompt={prompt} />;
			})}
		</ul>
	);
}
