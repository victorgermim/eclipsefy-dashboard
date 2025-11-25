import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import DashboardPage from '@/app/(dashboard)/page'

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, variants, initial, animate, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ArrowUpRight: () => <div data-testid="icon-arrow-up" />,
  ArrowDownRight: () => <div data-testid="icon-arrow-down" />,
  MoreHorizontal: () => <div data-testid="icon-more" />,
  DollarSign: () => <div data-testid="icon-dollar" />,
  TrendingUp: () => <div data-testid="icon-trending" />,
  Users: () => <div data-testid="icon-users" />,
  Activity: () => <div data-testid="icon-activity" />,
  CheckCircle2: () => <div data-testid="icon-check" />,
  Clock: () => <div data-testid="icon-clock" />,
  AlertCircle: () => <div data-testid="icon-alert" />,
}))

jest.mock('@/lib/mock-data', () => ({
  kpiData: [
    { title: 'Investimento Total', value: 'R$ 124.500', change: '+12.5%', trend: 'up', icon: () => null, color: 'text-emerald-400' },
    { title: 'ROI Estimado', value: '385%', change: '+4.2%', trend: 'up', icon: () => null, color: 'text-violet-400' },
    { title: 'Leads Qualificados', value: '1,284', change: '+18.2%', trend: 'up', icon: () => null, color: 'text-blue-400' },
    { title: 'Custo por Lead', value: 'R$ 4,50', change: '-2.1%', trend: 'down', icon: () => null, color: 'text-cyan-400' },
  ],
  salesData: [],
  activityFeed: [
    { id: 1, title: 'Campanha Black Friday iniciada', time: '2 min atrás', type: 'success', icon: () => null },
  ],
}))

describe('DashboardPage', () => {
  it('renders the welcome message', () => {
    render(<DashboardPage />)
    expect(screen.getByText(/Bem-vindo a bordo/i)).toBeInTheDocument()
    expect(screen.getByText(/Comandante/i)).toBeInTheDocument()
  })

  it('renders all KPI cards', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Investimento Total')).toBeInTheDocument()
    expect(screen.getByText('ROI Estimado')).toBeInTheDocument()
    expect(screen.getByText('Leads Qualificados')).toBeInTheDocument()
    expect(screen.getByText('Custo por Lead')).toBeInTheDocument()
  })

  it('renders the sales growth chart area', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Crescimento de Vendas')).toBeInTheDocument()
  })

  it('renders the activity feed', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Últimas Atualizações')).toBeInTheDocument()
    expect(screen.getByText('Campanha Black Friday iniciada')).toBeInTheDocument()
  })
})
