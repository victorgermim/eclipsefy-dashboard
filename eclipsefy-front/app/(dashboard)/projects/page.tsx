"use client"

import { ExternalLink, Rocket, CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ProjectsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Projetos</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Landing Page Card */}
        <Card className="flex flex-col bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden group">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-white">Landing Page</CardTitle>
              <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/50">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Concluído
              </Badge>
            </div>
            <CardDescription className="text-slate-400">
              Página de alta conversão para captura de leads.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <div className="relative aspect-video w-full bg-slate-900/50 border-y border-white/5 flex items-center justify-center overflow-hidden">
              {/* Placeholder for LP Preview - In a real app, this would be an image */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 to-black/80 z-10" />
              <div className="z-20 text-center">
                <p className="text-2xl font-bold text-white tracking-widest uppercase">Darken</p>
                <p className="text-xs text-slate-400 tracking-[0.2em] uppercase mt-1">Intense Black</p>
              </div>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-300">
                Otimizada para performance e SEO. Integrada com ferramentas de analytics.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-violet-600 hover:bg-violet-700 text-white">
              <a href="https://darkenintenseblack.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Acessar Site
              </a>
            </Button>
          </CardFooter>
        </Card>

        {/* ADS Card */}
        <Card className="flex flex-col bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-white">Gestão de Tráfego (ADS)</CardTitle>
              <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border-yellow-500/50">
                <Clock className="mr-1 h-3 w-3" />
                Em Progresso
              </Badge>
            </div>
            <CardDescription className="text-slate-400">
              Campanhas de Google e Meta Ads.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="aspect-video w-full rounded-lg bg-slate-900/50 border border-white/5 flex items-center justify-center mb-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
              <Rocket className="h-12 w-12 text-slate-600 relative z-10" />
            </div>
            <p className="text-sm text-slate-300">
              Estratégia robusta para posicionamento de autoridade e captação de clientes qualificados. Foco em ROI e construção de marca a longo prazo.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white hover:text-white">
              <Link href="/projects/ads-strategy">
                Ver Estratégia Detalhada
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
