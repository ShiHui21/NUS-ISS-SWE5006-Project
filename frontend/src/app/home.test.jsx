import { render, screen } from '@testing-library/react';
import Home from './home'; // Import from 'page.jsx'

describe('Home Page', () => {
  it('renders the initial count correctly', () => {
    render(<Home />);
    const countElement = screen.getByText(/Count: 0/i);
    expect(countElement).toBeInTheDocument();
  });

});