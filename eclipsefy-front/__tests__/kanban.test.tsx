import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import ProjectsPage from '../app/(dashboard)/projects/page'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, layoutId, whileHover, initial, animate, transition, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}))

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Plus: () => <div data-testid="icon-plus" />,
  MoreHorizontal: () => <div data-testid="icon-more" />,
  Calendar: () => <div data-testid="icon-calendar" />,
  Paperclip: () => <div data-testid="icon-paperclip" />,
}))

describe('ProjectsPage', () => {
  it('renders the page title', () => {
    render(<ProjectsPage />)
    expect(screen.getByText('Projetos em Órbita')).toBeInTheDocument()
  })

  it('renders all kanban columns', () => {
    render(<ProjectsPage />)
    expect(screen.getByText('Backlog')).toBeInTheDocument()
    expect(screen.getByText('Em Órbita (Produção)')).toBeInTheDocument()
    expect(screen.getByText('Controle de Missão (Revisão)')).toBeInTheDocument()
    expect(screen.getByText('Aterrisado (Concluído)')).toBeInTheDocument()
  })

  it('renders tasks', () => {
    render(<ProjectsPage />)
    expect(screen.getByText('Pesquisa de Keywords')).toBeInTheDocument()
    expect(screen.getByText('Design Landing Page')).toBeInTheDocument()
  })
})
