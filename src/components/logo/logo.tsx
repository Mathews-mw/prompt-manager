import Link from 'next/link';

import { MessageSquare } from 'lucide-react';

export function Logo() {
	return (
		<Link href="/" className="hover:text-accent-600 flex items-center gap-2 rounded-lg transition-colors">
			<MessageSquare />
			<span className="text-lg font-semibold">PROMPTS</span>
		</Link>
	);
}
