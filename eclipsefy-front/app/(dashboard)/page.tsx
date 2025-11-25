"use client";

import { motion } from "framer-motion";
import { kpiData, salesData, activityFeed } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, DollarSign, TrendingUp, Activity, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function DashboardPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
            Bem vindo(a), <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Darken</span>
          </h1>
          <p className="text-slate-400">Aqui está o relatório da sua galáxia de marketing.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1">
            Sistemas Operacionais
          </Badge>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Investimento Total",
            value: "R$ 1.500",
            change: "R$ 230 em andamento",
            trend: "up",
            icon: DollarSign,
            color: "text-emerald-400",
          },
          {
            title: "Impressões",
            value: "29k",
            change: "",
            trend: "up",
            icon: TrendingUp,
            color: "text-violet-400",
          },
          {
            title: "Oportunidades",
            value: "138",
            change: "",
            trend: "up",
            icon: Activity,
            color: "text-blue-400",
          },
          {
            title: "Leads",
            value: "89",
            change: "",
            trend: "up",
            icon: Users,
            color: "text-cyan-400",
          },
        ].map((kpi, index) => (
          <Card key={index} className="glass-card hover:bg-white/[0.05] transition-colors border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                {kpi.title}
              </CardTitle>
              <kpi.icon className={cn("h-4 w-4", kpi.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{kpi.value}</div>
              <div className="flex items-center text-xs mt-1">
                {kpi.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-400 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-rose-400 mr-1" />
                )}
                <span className={kpi.trend === "up" ? "text-emerald-400" : "text-rose-400"}>
                  {kpi.change}
                </span>
                {/* <span className="text-slate-500 ml-1">vs mês anterior</span> */}
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Charts and Feed Commented Out */}
      {/* 
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <motion.div variants={item} className="lg:col-span-4 xl:col-span-5">
          <Card className="glass-card h-full border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Crescimento de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full flex items-end justify-between gap-2 pt-8">
                {salesData.map((data, i) => {
                  const height = (data.value / 10000) * 100;
                  return (
                    <div key={i} className="group relative flex-1 flex flex-col justify-end items-center gap-2 h-full">
                      <div 
                        className="w-full bg-gradient-to-t from-violet-600/50 to-cyan-500/50 rounded-t-sm transition-all duration-300 group-hover:from-violet-500 group-hover:to-cyan-400 relative overflow-hidden"
                        style={{ height: `${height}%` }}
                      >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-xs text-slate-500 group-hover:text-white transition-colors">
                        {data.month}
                      </span>
                      <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-xs px-2 py-1 rounded border border-white/10 whitespace-nowrap z-10">
                        R$ {data.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-3 xl:col-span-2">
          <Card className="glass-card h-full border-white/10 flex flex-col">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MoreHorizontal className="w-5 h-5 text-violet-400" />
                Últimas Atualizações
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-6">
                  {activityFeed.map((activity) => (
                    <div key={activity.id} className="flex gap-4 relative">
                      <div className="absolute left-[11px] top-8 bottom-[-24px] w-[2px] bg-white/5 last:hidden" />
                      
                      <div className={cn(
                        "relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border border-white/10",
                        activity.type === "success" && "bg-emerald-500/20 text-emerald-400",
                        activity.type === "warning" && "bg-amber-500/20 text-amber-400",
                        activity.type === "info" && "bg-blue-500/20 text-blue-400"
                      )}>
                        <activity.icon className="w-3 h-3" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-white leading-none">
                          {activity.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      */}
    </motion.div>
  );
}
