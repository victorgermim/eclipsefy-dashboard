"use client";

import { motion } from "framer-motion";
import { kanbanColumns } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, MoreHorizontal, Calendar, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Projetos em Órbita</h1>
          <p className="text-slate-400">Gerencie suas missões e lançamentos.</p>
        </div>
        <Button className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white border-0 shadow-[0_0_20px_rgba(124,58,237,0.3)]">
          <Plus className="w-4 h-4 mr-2" />
          Nova Missão
        </Button>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 h-full min-w-[1000px]">
          {kanbanColumns.map((column, colIndex) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: colIndex * 0.1 }}
              className="flex-1 flex flex-col min-w-[280px] h-full"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]", column.color.split(" ")[1])} />
                  <h3 className="font-semibold text-slate-200">{column.title}</h3>
                  <Badge variant="secondary" className="bg-white/5 text-slate-400 ml-2">
                    {column.tasks.length}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {/* Tasks Container */}
              <div className="flex-1 rounded-xl bg-white/[0.02] border border-white/5 p-3 space-y-3 overflow-y-auto custom-scrollbar">
                {column.tasks.map((task, taskIndex) => (
                  <motion.div
                    key={task.id}
                    layoutId={task.id}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                    className="group relative p-4 rounded-lg bg-[#0a0a0a]/40 border border-white/10 backdrop-blur-sm cursor-grab active:cursor-grabbing shadow-lg"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <Badge 
                        variant="outline" 
                        className={cn("border-0 font-medium", task.tagColor)}
                      >
                        {task.tag}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2 text-slate-500 hover:text-white">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <h4 className="text-sm font-medium text-white mb-3 leading-snug">
                      {task.title}
                    </h4>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex -space-x-2">
                        <Avatar className="w-6 h-6 border-2 border-[#0a0a0a]">
                          <AvatarFallback className="bg-violet-500 text-[10px] text-white">V</AvatarFallback>
                        </Avatar>
                        <Avatar className="w-6 h-6 border-2 border-[#0a0a0a]">
                          <AvatarFallback className="bg-cyan-500 text-[10px] text-white">M</AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <div className="flex items-center gap-3 text-slate-500 text-xs">
                        <div className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
                          <Paperclip className="w-3 h-3" />
                          <span>2</span>
                        </div>
                        <div className="flex items-center gap-1 hover:text-violet-400 transition-colors">
                          <Calendar className="w-3 h-3" />
                          <span>2d</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </motion.div>
                ))}
                
                <Button variant="ghost" className="w-full justify-start text-slate-500 hover:text-white hover:bg-white/5 border border-dashed border-white/10 hover:border-white/20 h-10">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Tarefa
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
