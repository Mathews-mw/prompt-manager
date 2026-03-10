import userEvent from '@testing-library/user-event';

import { render, screen } from '@/lib/test-utils';
import { ISidebarContentProps, SidebarContent } from '@/components/ui/sidebar/sidebar-content';

let mockSearchParams = new URLSearchParams();

// Esse trecho de código cria um mock do hook useRouter nativo do NextJs.
// Como o componente `SidebarContent` depende desse hook, o `jest.mock` faz um dublê desse hook que imita o funcionalidade, mas não o comportamento, para que seja usado no teste
const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
	useRouter: () => ({ push: pushMock }),
	useSearchParams: () => mockSearchParams,
}));

const initialPrompts = [
	{
		id: '1',
		title: 'Title 01',
		content: 'Content 01',
		createdAt: new Date(),
	},
];

// SUT = System Under Test
// No caso específico desse teste, o que está sendo testado e validado o comportamento é o componente SidebarContent. Portanto, ele é o SUT
const makeSut = ({ prompts = initialPrompts }: ISidebarContentProps = {} as ISidebarContentProps) => {
	return render(<SidebarContent prompts={prompts} />);
};

describe('SidebarContent', () => {
	const user = userEvent.setup();

	it('should render a button which is used to create a new prompt', () => {
		makeSut();

		expect(screen.getByRole('button', { name: 'Novo prompt' })).toBeVisible();
	});

	it('should start with expanded content and show the minimize button', () => {
		makeSut();

		// A tag <aside> possui a role ARIA `complementary` implícito
		const aside = screen.getByRole('complementary');
		expect(aside).toBeVisible();

		const collapseButton = screen.getByRole('button', {
			name: /minimizar sidebar/i, // Regex para identificar o nome do botão. O `i` é para instruir a fazer a analise tudo em lowerCase
		});
		expect(collapseButton).toBeVisible();

		const expandButton = screen.queryByRole('button', {
			name: /expandir sidebar/i,
		});
		expect(expandButton).not.toBeInTheDocument();
	});

	it('should collapse the sidebar and show expand button', async () => {
		makeSut();

		const collapseButton = screen.getByRole('button', {
			name: /minimizar sidebar/i,
		});

		await user.click(collapseButton);

		const expandButton = screen.queryByRole('button', {
			name: /expandir sidebar/i,
		});

		expect(expandButton).toBeInTheDocument();
		expect(collapseButton).not.toBeInTheDocument();
	});

	it('should render the create new prompt button on the collapsed sidebar', async () => {
		makeSut();

		const collapseButton = screen.getByRole('button', {
			name: /minimizar sidebar/i,
		});

		await user.click(collapseButton);

		const newPromptButton = screen.getByRole('button', {
			name: /Novo prompt/i,
		});

		expect(newPromptButton).toBeVisible();
	});

	it('should not render the prompts list on the collapsed sidebar', async () => {
		makeSut();

		const collapseButton = screen.getByRole('button', {
			name: /minimizar sidebar/i,
		});

		await user.click(collapseButton);

		const nav = screen.queryByRole('navigation', { name: 'Lista de prompts' });

		expect(nav).not.toBeInTheDocument();
	});

	it('should redirect user to new prompt page', async () => {
		makeSut();

		const newButton = screen.getByRole('button', {
			name: 'Novo prompt',
		});

		await user.click(newButton);

		expect(pushMock).toHaveBeenCalledWith('/new');
	});

	it('should render the prompt list', () => {
		makeSut();

		expect(screen.getByText(initialPrompts[0].title)).toBeInTheDocument();
	});

	it('should update the search input field when type', async () => {
		const text = 'Search value';
		makeSut();

		const searchInput = screen.getByPlaceholderText('Buscar Prompts...');

		await user.type(searchInput, text);

		expect(searchInput).toHaveValue(text);
	});

	it('should navigate with modified url when type and clean', async () => {
		const text = 'search value';
		makeSut();

		const searchInput = screen.getByPlaceholderText('Buscar Prompts...');

		await user.type(searchInput, text);

		expect(pushMock).toHaveBeenCalled();

		const lastCall = pushMock.mock.calls.at(-1);
		expect(lastCall?.[0]).toBe('/?q=search%20value');

		await user.clear(searchInput);

		const lastClearCall = pushMock.mock.calls.at(-1);
		expect(lastClearCall?.[0]).toBe('/');
	});

	it('should begin with the query parameters defined in the search input field when it is filled in.', () => {
		const text = 'initial';
		const searchParams = new URLSearchParams(`q=${text}`);
		mockSearchParams = searchParams;

		makeSut();

		const searchInput = screen.getByPlaceholderText('Buscar prompts...');

		expect(searchInput).toHaveValue(text);
	});
});
