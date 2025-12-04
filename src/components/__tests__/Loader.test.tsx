import React from 'react';
import { render, screen } from '@testing-library/react';
import { Loader } from '../Loader';

declare const describe: any;
declare const it: any;
declare const expect: any;

describe('Loader Component', () => {
  it('renders with default text', () => {
    render(<Loader />);
    expect(screen.getByText('Processando...')).toBeInTheDocument();
    expect(screen.queryByText('Sincronizando Neural')).not.toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<Loader text="Carregando áudio..." />);
    expect(screen.getByText('Carregando áudio...')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Loader className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});