import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

test('Button increases counter', async () => {
  // arrange
  userEvent.setup();
  render(<Counter />);
  const button = screen.getByRole('button', { name: 'Increase' });

  // Assert (initial state) - check initial counter value
  const counter = screen.getByText('Button clicks: 0');
  expect(counter).toBeInTheDocument();

  // Act
  await userEvent.click(button);

  // Assert (after action)
  expect(screen.getByText('Button clicks: 1')).toBeInTheDocument();
});
