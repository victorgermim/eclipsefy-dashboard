import { BarChart3, Users, DollarSign, TrendingUp, Activity, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export const kpiData = [
  {
    title: "Investimento Total",
    value: "R$ 124.500",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-emerald-400",
  },
  {
    title: "ROI Estimado",
    value: "385%",
    change: "+4.2%",
    trend: "up",
    icon: TrendingUp,
    color: "text-violet-400",
  },
  {
    title: "Leads Qualificados",
    value: "1,284",
    change: "+18.2%",
    trend: "up",
    icon: Users,
    color: "text-blue-400",
  },
  {
    title: "Custo por Lead",
    value: "R$ 4,50",
    change: "-2.1%",
    trend: "down", // Good for cost
    icon: Activity,
    color: "text-cyan-400",
  },
];

export const salesData = [
  { month: "Jan", value: 4000 },
  { month: "Fev", value: 3000 },
  { month: "Mar", value: 5500 },
  { month: "Abr", value: 4800 },
  { month: "Mai", value: 7000 },
  { month: "Jun", value: 6500 },
  { month: "Jul", value: 8500 },
];

export const activityFeed = [
  {
    id: 1,
    title: "Campanha Black Friday iniciada",
    time: "2 min atrás",
    type: "success",
    icon: CheckCircle2,
  },
  {
    id: 2,
    title: "Novo post aprovado pelo cliente",
    time: "1 hora atrás",
    type: "info",
    icon: CheckCircle2,
  },
  {
    id: 3,
    title: "Alerta de orçamento: 80% atingido",
    time: "3 horas atrás",
    type: "warning",
    icon: AlertCircle,
  },
  {
    id: 4,
    title: "Relatório mensal gerado",
    time: "5 horas atrás",
    type: "info",
    icon: Clock,
  },
];

export const kanbanColumns = [
  {
    id: "backlog",
    title: "Backlog",
    color: "bg-slate-500/20",
    tasks: [
      { id: "t1", title: "Pesquisa de Keywords", tag: "SEO", tagColor: "bg-blue-500/20 text-blue-300" },
      { id: "t2", title: "Briefing Vídeo Institucional", tag: "Vídeo", tagColor: "bg-purple-500/20 text-purple-300" },
    ],
  },
  {
    id: "orbit",
    title: "Em Órbita (Produção)",
    color: "bg-blue-500/20",
    tasks: [
      { id: "t3", title: "Design Landing Page", tag: "Web", tagColor: "bg-cyan-500/20 text-cyan-300" },
      { id: "t4", title: "Copy Email Marketing", tag: "Copy", tagColor: "bg-emerald-500/20 text-emerald-300" },
      { id: "t5", title: "Edição Reels", tag: "Social", tagColor: "bg-pink-500/20 text-pink-300" },
    ],
  },
  {
    id: "mission_control",
    title: "Controle de Missão (Revisão)",
    color: "bg-violet-500/20",
    tasks: [
      { id: "t6", title: "Aprovação Carrossel", tag: "Social", tagColor: "bg-pink-500/20 text-pink-300" },
    ],
  },
  {
    id: "landed",
    title: "Aterrisado (Concluído)",
    color: "bg-emerald-500/20",
    tasks: [
      { id: "t7", title: "Setup Google Ads", tag: "Ads", tagColor: "bg-orange-500/20 text-orange-300" },
      { id: "t8", title: "Integração CRM", tag: "Dev", tagColor: "bg-indigo-500/20 text-indigo-300" },
    ],
  },
];
