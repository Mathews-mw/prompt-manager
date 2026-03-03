import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Sidebar } from '@/components/sidebar';

export const metadata: Metadata = {
	title: 'Prompt Manager App',
	description: 'Gerencie seus prompts',
};

const inter = Inter({
	variable: '--font-sans',
	subsets: ['latin'],
	weight: ['400', '500', '700'],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR">
			<body className={`${inter.variable} bg-gray-900 text-white antialiased`}>
				<section className="flex h-screen">
					<Sidebar />
					<main className="relative min-w-0 flex-1 overflow-auto">
						<div className="mx-auto h-full max-w-full p-4 sm:p-6 md:max-w-3xl md:p-8">{children}</div>
					</main>
				</section>
			</body>
		</html>
	);
}
