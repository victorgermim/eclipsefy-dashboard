"use client"

import { ArrowLeft, Target, Users, Zap, Funnel, Calendar, CheckCircle2 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function AdsStrategyPage() {
    return (
        <div className="flex flex-col gap-6 p-4 pt-0 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/projects">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Estratégia de Marketing: Blackout & Dark Art</h1>
                    <p className="text-slate-400">Construção de Autoridade Técnica e Captação de Clientes High Ticket</p>
                </div>
            </div>

            <div className="grid gap-6">
                {/* O Diagnóstico */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-red-400" />
                            <CardTitle className="text-white">O Diagnóstico</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 text-slate-300">
                        <p>
                            <strong className="text-white">O Problema:</strong> Identificamos que as campanhas passadas focaram na "vitrine" (mostrar a tatuagem) para um público frio. Para serviços caros e definitivos como o Blackout, essa abordagem gera curtidas, mas pouca agenda preenchida. O cliente precisa de segurança antes de entregar a pele.
                        </p>
                        <div className="bg-violet-500/10 border border-violet-500/20 p-4 rounded-lg">
                            <strong className="text-violet-300">A Nova Rota:</strong> Vamos migrar de uma "Venda de Imagem" para uma "Venda de Solução e Autoridade". O foco será provar que você é a única capaz de entregar um preto sólido que não mancha e coberturas que realmente somem com o passado.
                        </div>
                    </CardContent>
                </Card>

                {/* Estratégia de Tráfego */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-yellow-400" />
                            <CardTitle className="text-white">Estratégia de Tráfego (Os Motores)</CardTitle>
                        </div>
                        <CardDescription>Não dependeremos de uma única fonte. Criaremos um ecossistema.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-3">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <Badge variant="outline" className="border-blue-500 text-blue-400">Google Ads</Badge>
                                O Cliente com "Dor"
                            </h3>
                            <p className="text-sm text-slate-400">Focado em captar quem já está procurando solução.</p>
                            <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                                <li><strong>Busca:</strong> "Cobrir tatuagem antiga", "Especialista em cover-up", "Tatuagem blackout".</li>
                                <li><strong>Ação:</strong> Levar para a Landing Page focada em "Antes e Depois".</li>
                                <li><strong>Por que funciona:</strong> Alta taxa de conversão devido à urgência do cliente.</li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <Badge variant="outline" className="border-pink-500 text-pink-400">Meta Ads</Badge>
                                O Cliente de "Desejo"
                            </h3>
                            <p className="text-sm text-slate-400">Focado em criar vontade e provar técnica.</p>
                            <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                                <li><strong>Criativo A (Atração):</strong> Vídeos de processo. Hipnotiza o público.</li>
                                <li><strong>Criativo B (Prova Social):</strong> Fotos de trabalhos CICATRIZADOS.</li>
                                <li><strong>Diferencial:</strong> Mostrar o trabalho curado prova domínio técnico e mata objeções.</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                {/* Funil de Vendas */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Funnel className="h-5 w-5 text-green-400" />
                            <CardTitle className="text-white">O Funil de Vendas</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="relative border-l border-slate-700 ml-3 space-y-6 pb-2">
                            <div className="ml-6 relative">
                                <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-slate-800 border border-slate-600" />
                                <h4 className="font-semibold text-white">1. Atração</h4>
                                <p className="text-sm text-slate-400">Anúncio Segmentado (Interesses: Metal, Rock, Tattoo, Blackout e etc).</p>
                            </div>
                            <div className="ml-6 relative">
                                <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-slate-800 border border-slate-600" />
                                <h4 className="font-semibold text-white">2. Consideração (Landing Page)</h4>
                                <p className="text-sm text-slate-400">Otimização para autoridade. Seção "Dúvidas Frequentes" para quebrar medos.</p>
                            </div>
                            <div className="ml-6 relative">
                                <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-slate-800 border border-slate-600" />
                                <h4 className="font-semibold text-white">3. Conversão (WhatsApp)</h4>
                                <p className="text-sm text-slate-400">Script Consultivo. Triagem do projeto para gerar valor antes de falar de preço.</p>
                            </div>
                            <div className="ml-6 relative">
                                <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-slate-800 border border-slate-600" />
                                <h4 className="font-semibold text-white">4. Resgate (Remarketing)</h4>
                                <p className="text-sm text-slate-400">Anúncios específicos para quem entrou no site e não chamou.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Cronograma */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-cyan-400" />
                            <CardTitle className="text-white">Cronograma de Implementação (7 Dias)</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 h-5 w-5 rounded border border-emerald-500 bg-emerald-500/20 flex items-center justify-center">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-white line-through decoration-slate-500 decoration-2 text-slate-500">Dia 1: Configuração Inicial</h4>
                                <p className="text-xs text-slate-500">Instalação de Pixel, Tag Manager e Google Analytics.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-1 h-5 w-5 rounded border border-slate-600 bg-transparent" />
                            <div>
                                <h4 className="text-sm font-medium text-white">Dia 2: Seleção de Criativos</h4>
                                <p className="text-xs text-slate-400">Curadoria dos melhores vídeos e fotos do Instagram para anúncios.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-1 h-5 w-5 rounded border border-slate-600 bg-transparent" />
                            <div>
                                <h4 className="text-sm font-medium text-white">Dia 3: Criação de Públicos</h4>
                                <p className="text-xs text-slate-400">Segmentação de interesses (Metal, Tattoo, Gótico) e Lookalike.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-1 h-5 w-5 rounded border border-slate-600 bg-transparent" />
                            <div>
                                <h4 className="text-sm font-medium text-white">Dia 4: Setup de Campanhas</h4>
                                <p className="text-xs text-slate-400">Estruturação das campanhas no Gerenciador de Anúncios (Meta & Google).</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-1 h-5 w-5 rounded border border-slate-600 bg-transparent" />
                            <div>
                                <h4 className="text-sm font-medium text-white">Dia 5: Revisão e Aprovação</h4>
                                <p className="text-xs text-slate-400">Validação final dos anúncios e orçamentos com o cliente.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-1 h-5 w-5 rounded border border-slate-600 bg-transparent" />
                            <div>
                                <h4 className="text-sm font-medium text-white">Dia 6: Lançamento (Go Live)</h4>
                                <p className="text-xs text-slate-400">Ativação das campanhas e monitoramento em tempo real.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-1 h-5 w-5 rounded border border-slate-600 bg-transparent" />
                            <div>
                                <h4 className="text-sm font-medium text-white">Dia 7: Primeira Otimização</h4>
                                <p className="text-xs text-slate-400">Análise inicial de métricas e ajustes de lances.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
