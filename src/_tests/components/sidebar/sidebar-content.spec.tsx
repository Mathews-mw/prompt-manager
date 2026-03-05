import userEvent from '@testing-library/user-event';

import { SidebarContent } from '@/components/sidebar/sidebar-content';
import { render, screen } from '@/lib/test-utils';

// Esse trecho de código cria um mock do hook useRouter nativo do NextJs.
// Como o componente `SidebarContent` depende desse hook, o `jest.mock` faz um dublê desse hook que imita o funcionalidade, mas não o comportamento, para que seja usado no teste
const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
	useRouter: () => ({ push: pushMock }),
}));

// SUT = System Under Test
// No caso específico desse teste, o que está sendo testado e validado o comportamento é o componente SidebarContent. Portanto, ele é o SUT
const makeSut = () => {
	return render(<SidebarContent />);
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

	it('should redirect user to new prompt page', async () => {
		makeSut();

		const newButton = screen.getByRole('button', {
			name: 'Novo prompt',
		});

		await user.click(newButton);

		expect(pushMock).toHaveBeenCalledWith('/new');
	});
});
