import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Briefcase, 
  GraduationCap, 
  Sparkles, 
  Send, 
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ChevronRight,
  Terminal,
  Cpu,
  Trophy,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateInterviewQuestion, evaluateAnswer, InterviewQuestion, Feedback } from '@/src/lib/gemini';

const COMPANIES = ['Google', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Microsoft', 'OpenAI'];
const ROLES = ['Software Engineer', 'Frontend Engineer', 'Backend Engineer', 'Fullstack Engineer', 'Data Scientist', 'Product Manager', 'System Architect'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function InterviewPrep() {
  const [company, setCompany] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const [question, setQuestion] = useState<InterviewQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    setQuestion(null);
    setUserAnswer('');
    setFeedback(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!company || !role || !level) return;
    setIsLoading(true);
    setFeedback(null);
    setUserAnswer('');
    setError(null);
    try {
      const q = await generateInterviewQuestion(company, role, level);
      setQuestion(q);
    } catch (err: any) {
      console.error('Error generating question:', err);
      setError(err.message || 'An unexpected error occurred while generating the question.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!question || !userAnswer) return;
    setIsEvaluating(true);
    setError(null);
    try {
      const f = await evaluateAnswer(question.question, userAnswer, company, role);
      setFeedback(f);
    } catch (err: any) {
      console.error('Error evaluating answer:', err);
      setError(err.message || 'An unexpected error occurred while evaluating your answer.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#fcfcfc]">
      {/* Sidebar - Technical Control Panel */}
      <aside className="w-full lg:w-[400px] bg-[#0a0a0a] text-white p-8 lg:sticky lg:top-0 lg:h-screen overflow-y-auto border-r border-white/10">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-extrabold tracking-tight uppercase italic">FAANG.AI</h1>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">Interview Intelligence</p>
            </div>
          </div>
          
          <div className="space-y-8 mt-12">
            <section>
              <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-4">Configuration</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 flex items-center gap-2">
                    <Building2 className="w-3 h-3" /> Company
                  </label>
                  <Select onValueChange={setCompany} value={company}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-primary/50">
                      <SelectValue placeholder="Target Company" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                      {COMPANIES.map(c => (
                        <SelectItem key={c} value={c} className="focus:bg-primary focus:text-white">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 flex items-center gap-2">
                    <Briefcase className="w-3 h-3" /> Role
                  </label>
                  <Select onValueChange={setRole} value={role}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-primary/50">
                      <SelectValue placeholder="Target Role" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                      {ROLES.map(r => (
                        <SelectItem key={r} value={r} className="focus:bg-primary focus:text-white">{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 flex items-center gap-2">
                    <Cpu className="w-3 h-3" /> Difficulty
                  </label>
                  <Select onValueChange={setLevel} value={level}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-primary/50">
                      <SelectValue placeholder="Skill Level" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                      {LEVELS.map(l => (
                        <SelectItem key={l} value={l} className="focus:bg-primary focus:text-white">{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            <Button 
              onClick={handleGenerate} 
              disabled={!company || !role || !level || isLoading}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-2xl shadow-primary/20 transition-all active:scale-[0.98] font-display font-bold text-lg"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <Sparkles className="w-5 h-5 mr-2" />
              )}
              {question ? 'Regenerate' : 'Start Session'}
            </Button>

            {question && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Active Target</p>
                    <p className="font-display font-bold text-lg">{company}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <p className="text-[9px] font-mono text-white/30 uppercase mb-1">Category</p>
                    <p className="text-xs font-bold">{question.category}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <p className="text-[9px] font-mono text-white/30 uppercase mb-1">Level</p>
                    <p className="text-xs font-bold">{question.difficulty}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleReset}
                  className="w-full mt-6 text-white/40 hover:text-white hover:bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono uppercase tracking-widest"
                >
                  <RefreshCw className="w-3 h-3 mr-2" />
                  Terminate Session
                </Button>
              </motion.div>
            )}
          </div>
        </div>
        
        <div className="mt-auto pt-8 border-t border-white/10">
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] text-center">Version 2.4.0-Alpha</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600 hover:bg-red-100"
              >
                Dismiss
              </Button>
            </motion.div>
          )}

          {!question ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="h-full min-h-[600px] flex flex-col items-center justify-center text-center max-w-2xl mx-auto"
            >
              <div className="relative mb-12">
                <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full" />
                <div className="relative w-32 h-32 rounded-3xl bg-white shadow-2xl flex items-center justify-center border border-slate-100">
                  <Sparkles className="w-16 h-16 text-primary animate-pulse" />
                </div>
              </div>
              <h2 className="text-5xl font-display font-extrabold tracking-tight text-slate-900 mb-6">
                Your Career, <span className="text-primary italic">Accelerated.</span>
              </h2>
              <p className="text-xl text-slate-500 leading-relaxed mb-12">
                Configure your target profile in the control panel to begin a high-fidelity interview simulation powered by advanced AI.
              </p>
              <div className="grid grid-cols-3 gap-8 w-full">
                {[
                  { icon: Building2, label: 'FAANG Ready' },
                  { icon: Trophy, label: 'Expert Feedback' },
                  { icon: Cpu, label: 'Adaptive AI' }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                      <item.icon className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">{item.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto space-y-12"
            >
              {/* Question Section */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-[1px] flex-1 bg-slate-200" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-slate-400 font-bold">Question Protocol</span>
                  <div className="h-[1px] flex-1 bg-slate-200" />
                </div>
                
                <div className="relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary rounded-full opacity-20" />
                  <h3 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 leading-tight">
                    {question.question}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-3">
                  {question.expectedTopics.map(topic => (
                    <Badge key={topic} variant="outline" className="px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider border-slate-200 text-slate-500 bg-white">
                      {topic}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                    <h4 className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      Strategic Hints
                    </h4>
                    <ul className="space-y-3">
                      {question.hints.map((hint, i) => (
                        <li key={i} className="text-sm text-slate-600 flex gap-3">
                          <span className="text-primary font-bold font-mono">{i + 1}.</span>
                          {hint}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-center items-center text-center">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">Interview Context</p>
                    <p className="text-sm text-slate-600 italic">
                      "This question is designed to test your {question.category.toLowerCase()} reasoning and ability to handle {question.difficulty.toLowerCase()} constraints."
                    </p>
                  </div>
                </div>
              </section>

              {/* Response Section */}
              <section className="space-y-8 pt-12">
                <div className="flex items-center gap-4">
                  <div className="h-[1px] flex-1 bg-slate-200" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-slate-400 font-bold">Candidate Response</span>
                  <div className="h-[1px] flex-1 bg-slate-200" />
                </div>

                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-indigo-500/20 rounded-[2rem] blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                  <Textarea 
                    placeholder="Synthesize your response here... Use the STAR method for behavioral or pseudocode for technical."
                    className="relative min-h-[300px] bg-white border-slate-200 rounded-[1.5rem] p-8 text-lg leading-relaxed focus:ring-primary/20 transition-all shadow-sm"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-[10px] font-mono uppercase tracking-wider">Auto-save active</span>
                  </div>
                  <Button 
                    onClick={handleSubmitAnswer}
                    disabled={!userAnswer || isEvaluating}
                    className="h-14 px-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xl transition-all active:scale-95 font-display font-bold text-lg"
                  >
                    {isEvaluating ? (
                      <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <Send className="w-5 h-5 mr-2" />
                    )}
                    Analyze Response
                  </Button>
                </div>
              </section>

              {/* Feedback Section */}
              {feedback && (
                <motion.section
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8 pt-12 pb-24"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-[1px] flex-1 bg-slate-200" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-slate-400 font-bold">Evaluation Report</span>
                    <div className="h-[1px] flex-1 bg-slate-200" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1 flex flex-col items-center justify-center p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50">
                      <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-slate-100"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={364}
                            strokeDashoffset={364 - (364 * feedback.score) / 100}
                            className="text-primary transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <span className="absolute text-4xl font-display font-black text-slate-900">{feedback.score}</span>
                      </div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Performance Index</p>
                    </div>

                    <div className="lg:col-span-3 space-y-6">
                      <Tabs defaultValue="analysis" className="w-full">
                        <TabsList className="bg-slate-100 p-1 rounded-xl w-fit">
                          <TabsTrigger value="analysis" className="rounded-lg px-8 py-2.5 text-xs font-bold uppercase tracking-wider">Analysis</TabsTrigger>
                          <TabsTrigger value="ideal" className="rounded-lg px-8 py-2.5 text-xs font-bold uppercase tracking-wider">Ideal Answer</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="analysis" className="mt-8 space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h5 className="text-[10px] font-mono uppercase tracking-widest text-green-600 font-bold flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3" /> Strengths
                              </h5>
                              <ul className="space-y-3">
                                {feedback.strengths.map((s, i) => (
                                  <li key={i} className="text-sm text-slate-600 flex gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                    {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="space-y-4">
                              <h5 className="text-[10px] font-mono uppercase tracking-widest text-amber-600 font-bold flex items-center gap-2">
                                <AlertCircle className="w-3 h-3" /> Improvements
                              </h5>
                              <ul className="space-y-3">
                                {feedback.improvements.map((im, i) => (
                                  <li key={i} className="text-sm text-slate-600 flex gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                    {im}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          <Separator className="bg-slate-100" />
                          
                          <div className="p-8 rounded-2xl bg-slate-900 text-white">
                            <h5 className="text-[10px] font-mono uppercase tracking-widest text-white/40 font-bold mb-4">Executive Summary</h5>
                            <p className="text-lg font-display leading-relaxed italic opacity-90">
                              "{feedback.overallFeedback}"
                            </p>
                          </div>
                        </TabsContent>

                        <TabsContent value="ideal" className="mt-8">
                          <div className="relative group">
                            <div className="absolute -inset-1 bg-primary/20 rounded-2xl blur opacity-25" />
                            <div className="relative p-8 rounded-2xl bg-white border border-slate-100 shadow-sm font-mono text-sm leading-relaxed text-slate-700 whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                              {feedback.idealAnswer}
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </motion.section>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
