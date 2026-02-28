import { Layout } from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, Tag, BarChart3, Calendar, GraduationCap, Filter, Copy, Download, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TopicData {
  id: string;
  name: string;
  content_id: string;
  questionCount: number;
}

interface ContentData {
  id: string;
  name: string;
  subject_id: string;
  topics: TopicData[];
  questionCount: number;
}

interface SubjectData {
  id: string;
  name: string;
  contents: ContentData[];
  questionCount: number;
}

interface QuestionFullData {
  id: string;
  subject_id: string;
  content_id: string;
  exam_id: string;
  year: number;
}

interface ExamData {
  id: string;
  name: string;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(220, 70%, 50%)',
  'hsl(280, 65%, 60%)',
  'hsl(340, 75%, 55%)',
  'hsl(30, 80%, 55%)',
  'hsl(160, 60%, 45%)',
];

const SubjectReport = () => {
  const { toast } = useToast();
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [formattedText, setFormattedText] = useState('');
  const [jsonData, setJsonData] = useState('');

  const fetchTaxonomyExport = async () => {
    setExportLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('export-taxonomy');
      if (error) throw error;
      setFormattedText(data.formatted_text);
      setJsonData(JSON.stringify(data.taxonomy, null, 2));
      toast({ title: "Taxonomia exportada!", description: `${data.total_subjects} matérias, ${data.total_contents} conteúdos, ${data.total_topics} tópicos` });
    } catch (error: any) {
      toast({ title: "Erro ao exportar", description: error.message, variant: "destructive" });
    } finally {
      setExportLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!", description: `${label} copiado para a área de transferência` });
  };

  const downloadAsFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const { data: exams } = useQuery({
    queryKey: ['exams-report'],
    queryFn: async () => {
      const { data } = await supabase.from('exams').select('*').order('name');
      return data as ExamData[] || [];
    },
  });

  const { data: questionsFullData } = useQuery({
    queryKey: ['questions-full-report'],
    queryFn: async () => {
      const { data } = await supabase
        .from('questions')
        .select('id, subject_id, content_id, exam_id, year');
      return data as QuestionFullData[] || [];
    },
  });

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['subject-report'],
    queryFn: async () => {
      const { data: subjects } = await supabase
        .from('subjects')
        .select('*')
        .order('name');

      if (!subjects) return [];

      const { data: contents } = await supabase
        .from('contents')
        .select('*')
        .order('name');

      const { data: topics } = await supabase
        .from('topics')
        .select('*')
        .order('name');

      const { data: questions } = await supabase
        .from('questions')
        .select('id, subject_id, content_id');

      const { data: questionTopics } = await supabase
        .from('question_topics')
        .select('question_id, topic_id');

      const questionsBySubject = (questions || []).reduce((acc, q) => {
        acc[q.subject_id] = (acc[q.subject_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const questionsByContent = (questions || []).reduce((acc, q) => {
        acc[q.content_id] = (acc[q.content_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const questionsByTopic = (questionTopics || []).reduce((acc, qt) => {
        acc[qt.topic_id] = (acc[qt.topic_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const organizedData: SubjectData[] = subjects.map(subject => ({
        ...subject,
        questionCount: questionsBySubject[subject.id] || 0,
        contents: (contents || [])
          .filter(c => c.subject_id === subject.id)
          .map(content => ({
            ...content,
            questionCount: questionsByContent[content.id] || 0,
            topics: (topics || [])
              .filter(t => t.content_id === content.id)
              .map(topic => ({
                ...topic,
                questionCount: questionsByTopic[topic.id] || 0
              }))
          }))
      }));

      return organizedData;
    },
  });

  // Extract unique years from questions
  const availableYears = useMemo(() => {
    if (!questionsFullData) return [];
    const years = [...new Set(questionsFullData.map(q => q.year))].sort((a, b) => b - a);
    return years;
  }, [questionsFullData]);

  // Filter questions based on selections
  const filteredQuestions = useMemo(() => {
    if (!questionsFullData) return [];
    
    return questionsFullData.filter(q => {
      const examMatch = selectedExams.length === 0 || selectedExams.includes(q.exam_id);
      const yearMatch = selectedYears.length === 0 || selectedYears.includes(String(q.year));
      const subjectMatch = selectedSubjects.length === 0 || selectedSubjects.includes(q.subject_id);
      return examMatch && yearMatch && subjectMatch;
    });
  }, [questionsFullData, selectedExams, selectedYears, selectedSubjects]);

  // Data for exam chart
  const chartDataByExam = useMemo(() => {
    const examCounts = filteredQuestions.reduce((acc, q) => {
      acc[q.exam_id] = (acc[q.exam_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(examCounts)
      .map(([examId, count]) => ({
        name: exams?.find(e => e.id === examId)?.name || examId,
        questoes: count,
        examId
      }))
      .sort((a, b) => b.questoes - a.questoes);
  }, [filteredQuestions, exams]);

  // Data for year chart
  const chartDataByYear = useMemo(() => {
    const yearCounts = filteredQuestions.reduce((acc, q) => {
      acc[q.year] = (acc[q.year] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return Object.entries(yearCounts)
      .map(([year, count]) => ({
        name: year,
        questoes: count as number,
        year: Number(year)
      }))
      .sort((a, b) => a.year - b.year);
  }, [filteredQuestions]);

  // Matrix data: exam x year
  const matrixData = useMemo(() => {
    const matrix: Record<string, Record<number, number>> = {};
    
    filteredQuestions.forEach(q => {
      if (!matrix[q.exam_id]) matrix[q.exam_id] = {};
      matrix[q.exam_id][q.year] = (matrix[q.exam_id][q.year] || 0) + 1;
    });

    return matrix;
  }, [filteredQuestions]);

  const toggleExam = (examId: string) => {
    setSelectedExams(prev => 
      prev.includes(examId) 
        ? prev.filter(e => e !== examId)
        : [...prev, examId]
    );
  };

  const toggleYear = (year: string) => {
    setSelectedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId) 
        ? prev.filter(s => s !== subjectId)
        : [...prev, subjectId]
    );
  };

  const clearFilters = () => {
    setSelectedExams([]);
    setSelectedYears([]);
    setSelectedSubjects([]);
  };

  const totalContents = reportData?.reduce((acc, subject) => acc + subject.contents.length, 0) || 0;
  const totalTopics = reportData?.reduce((acc, subject) => 
    acc + subject.contents.reduce((sum, content) => sum + content.topics.length, 0), 0) || 0;
  const totalQuestions = reportData?.reduce((acc, subject) => acc + subject.questionCount, 0) || 0;

  const chartDataBySubject = reportData?.map(subject => ({
    name: subject.name,
    questoes: subject.questionCount
  })).sort((a, b) => b.questoes - a.questoes) || [];

  const allTopicsWithCount = reportData?.flatMap(subject => 
    subject.contents.flatMap(content => 
      content.topics.map(topic => ({
        topicName: topic.name,
        contentName: content.name,
        subjectName: subject.name,
        questionCount: topic.questionCount
      }))
    )
  ).sort((a, b) => b.questionCount - a.questionCount) || [];

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Relatório de Taxonomia</h2>
            <p className="text-muted-foreground">Estrutura completa de matérias, conteúdos e tópicos</p>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Relatório de Taxonomia</h2>
          <p className="text-muted-foreground">Estrutura completa de matérias, conteúdos e tópicos</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Matérias</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conteúdos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalContents}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tópicos</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTopics}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questões</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalQuestions}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="hierarchy" className="space-y-6">
          <TabsList className="grid w-full max-w-3xl grid-cols-6">
            <TabsTrigger value="hierarchy">Hierarquia</TabsTrigger>
            <TabsTrigger value="chart">Por Matéria</TabsTrigger>
            <TabsTrigger value="exams">Por Vestibular</TabsTrigger>
            <TabsTrigger value="years">Por Ano</TabsTrigger>
            <TabsTrigger value="topics">Por Tópicos</TabsTrigger>
            <TabsTrigger value="export">Exportar</TabsTrigger>
          </TabsList>

          <TabsContent value="hierarchy">
            <Card>
              <CardHeader>
                <CardTitle>Estrutura por Matéria</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {reportData?.map((subject, idx) => (
                    <AccordionItem key={subject.id} value={`subject-${idx}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 flex-wrap">
                          <BookOpen className="h-5 w-5 text-primary" />
                          <span className="font-semibold text-lg">{subject.name}</span>
                          <Badge variant="secondary">
                            {subject.contents.length} conteúdos
                          </Badge>
                          <Badge variant="outline">
                            {subject.contents.reduce((sum, c) => sum + c.topics.length, 0)} tópicos
                          </Badge>
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                            {subject.questionCount} questões
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-8 space-y-4 pt-4">
                          {subject.contents.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">
                              Nenhum conteúdo cadastrado
                            </p>
                          ) : (
                            subject.contents.map((content) => (
                              <div key={content.id} className="border-l-2 border-primary/20 pl-4 space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium text-foreground">{content.name}</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {content.topics.length} tópicos
                                  </Badge>
                                  <Badge className="text-xs bg-primary/10 text-primary hover:bg-primary/20">
                                    {content.questionCount} questões
                                  </Badge>
                                </div>
                                {content.topics.length > 0 && (
                                  <div className="pl-6 space-y-1">
                                    {content.topics.map((topic) => (
                                      <div key={topic.id} className="flex items-center gap-2 text-sm justify-between">
                                        <div className="flex items-center gap-2">
                                          <Tag className="h-3 w-3 text-muted-foreground" />
                                          <span className="text-muted-foreground">{topic.name}</span>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                          {topic.questionCount}
                                        </Badge>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chart">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Distribuição de Questões por Matéria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    questoes: {
                      label: "Questões",
                      color: "hsl(var(--primary))",
                    },
                  }}
                  className="h-[500px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartDataBySubject}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={120}
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar 
                        dataKey="questoes" 
                        fill="hsl(var(--primary))" 
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exams">
            <div className="grid gap-6 lg:grid-cols-4">
              {/* Filters Sidebar */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Filter className="h-4 w-4" />
                    Filtros
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm font-medium">Anos</Label>
                      {(selectedExams.length > 0 || selectedYears.length > 0 || selectedSubjects.length > 0) && (
                        <button 
                          onClick={clearFilters}
                          className="text-xs text-primary hover:underline"
                        >
                          Limpar filtros
                        </button>
                      )}
                    </div>
                    <ScrollArea className="h-32">
                      <div className="space-y-2">
                        {availableYears.map(year => (
                          <div key={year} className="flex items-center space-x-2">
                            <Checkbox
                              id={`year-exam-${year}`}
                              checked={selectedYears.includes(String(year))}
                              onCheckedChange={() => toggleYear(String(year))}
                            />
                            <label
                              htmlFor={`year-exam-${year}`}
                              className="text-sm cursor-pointer"
                            >
                              {year}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">Matérias</Label>
                    <ScrollArea className="h-40">
                      <div className="space-y-2">
                        {reportData?.map(subject => (
                          <div key={subject.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`subject-exam-${subject.id}`}
                              checked={selectedSubjects.includes(subject.id)}
                              onCheckedChange={() => toggleSubject(subject.id)}
                            />
                            <label
                              htmlFor={`subject-exam-${subject.id}`}
                              className="text-sm cursor-pointer"
                            >
                              {subject.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      <strong>{filteredQuestions.length}</strong> questões filtradas
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Chart */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Questões por Vestibular
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {chartDataByExam.length === 0 ? (
                    <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                      Nenhuma questão encontrada com os filtros selecionados
                    </div>
                  ) : (
                    <ChartContainer
                      config={{
                        questoes: {
                          label: "Questões",
                          color: "hsl(var(--primary))",
                        },
                      }}
                      className="h-[400px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartDataByExam} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                          <YAxis 
                            dataKey="name" 
                            type="category"
                            width={150}
                            stroke="hsl(var(--muted-foreground))"
                            tick={{ fontSize: 12 }}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="questoes" radius={[0, 8, 8, 0]}>
                            {chartDataByExam.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}

                  {/* Matrix Table */}
                  {Object.keys(matrixData).length > 0 && (
                    <div className="mt-8">
                      <h4 className="font-semibold mb-4">Matriz: Vestibular × Ano</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr>
                              <th className="text-left p-2 border-b border-border font-medium">Vestibular</th>
                              {availableYears
                                .filter(y => selectedYears.length === 0 || selectedYears.includes(String(y)))
                                .map(year => (
                                  <th key={year} className="p-2 border-b border-border font-medium text-center">
                                    {year}
                                  </th>
                                ))}
                              <th className="p-2 border-b border-border font-medium text-center bg-muted/50">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(matrixData).map(([examId, yearCounts]) => {
                              const examName = exams?.find(e => e.id === examId)?.name || examId;
                              const total = Object.values(yearCounts).reduce((sum, count) => sum + count, 0);
                              return (
                                <tr key={examId} className="hover:bg-muted/30">
                                  <td className="p-2 border-b border-border">{examName}</td>
                                  {availableYears
                                    .filter(y => selectedYears.length === 0 || selectedYears.includes(String(y)))
                                    .map(year => (
                                      <td key={year} className="p-2 border-b border-border text-center">
                                        {yearCounts[year] ? (
                                          <Badge variant={yearCounts[year] > 5 ? "default" : "secondary"}>
                                            {yearCounts[year]}
                                          </Badge>
                                        ) : (
                                          <span className="text-muted-foreground">-</span>
                                        )}
                                      </td>
                                    ))}
                                  <td className="p-2 border-b border-border text-center bg-muted/50 font-semibold">
                                    {total}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="years">
            <div className="grid gap-6 lg:grid-cols-4">
              {/* Filters Sidebar */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Filter className="h-4 w-4" />
                    Filtros
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm font-medium">Vestibulares</Label>
                      {(selectedExams.length > 0 || selectedYears.length > 0 || selectedSubjects.length > 0) && (
                        <button 
                          onClick={clearFilters}
                          className="text-xs text-primary hover:underline"
                        >
                          Limpar filtros
                        </button>
                      )}
                    </div>
                    <ScrollArea className="h-40">
                      <div className="space-y-2">
                        {exams?.map(exam => (
                          <div key={exam.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`exam-year-${exam.id}`}
                              checked={selectedExams.includes(exam.id)}
                              onCheckedChange={() => toggleExam(exam.id)}
                            />
                            <label
                              htmlFor={`exam-year-${exam.id}`}
                              className="text-sm cursor-pointer"
                            >
                              {exam.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">Matérias</Label>
                    <ScrollArea className="h-40">
                      <div className="space-y-2">
                        {reportData?.map(subject => (
                          <div key={subject.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`subject-year-${subject.id}`}
                              checked={selectedSubjects.includes(subject.id)}
                              onCheckedChange={() => toggleSubject(subject.id)}
                            />
                            <label
                              htmlFor={`subject-year-${subject.id}`}
                              className="text-sm cursor-pointer"
                            >
                              {subject.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      <strong>{filteredQuestions.length}</strong> questões filtradas
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Chart */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Questões por Ano
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {chartDataByYear.length === 0 ? (
                    <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                      Nenhuma questão encontrada com os filtros selecionados
                    </div>
                  ) : (
                    <ChartContainer
                      config={{
                        questoes: {
                          label: "Questões",
                          color: "hsl(var(--primary))",
                        },
                      }}
                      className="h-[400px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartDataByYear}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis 
                            dataKey="name" 
                            stroke="hsl(var(--muted-foreground))"
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis stroke="hsl(var(--muted-foreground))" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="questoes" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]}>
                            {chartDataByYear.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}

                  {/* Years summary */}
                  <div className="mt-6 grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {chartDataByYear.map((item, idx) => (
                      <div 
                        key={item.year}
                        className="p-3 rounded-lg border border-border bg-card text-center"
                        style={{ borderLeftColor: COLORS[idx % COLORS.length], borderLeftWidth: 4 }}
                      >
                        <div className="text-lg font-bold">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.questoes} questões</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="topics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary" />
                  Questões por Tópico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allTopicsWithCount.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Nenhuma questão cadastrada ainda
                    </p>
                  ) : (
                    allTopicsWithCount.map((topic, idx) => (
                      <div 
                        key={`${topic.topicName}-${idx}`}
                        className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors"
                      >
                        <div className="flex-1 space-y-1">
                          <div className="font-medium text-foreground">{topic.topicName}</div>
                          <div className="text-sm text-muted-foreground">
                            {topic.contentName} • {topic.subjectName}
                          </div>
                        </div>
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-base px-3 py-1">
                          {topic.questionCount} {topic.questionCount === 1 ? 'questão' : 'questões'}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    Exportar Taxonomia para ChatGPT
                  </CardTitle>
                  <CardDescription>
                    Exporte todos os IDs válidos de matérias, conteúdos e tópicos para usar no seu bot do ChatGPT
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={fetchTaxonomyExport} disabled={exportLoading}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${exportLoading ? 'animate-spin' : ''}`} />
                    {exportLoading ? 'Carregando...' : 'Carregar Taxonomia para Exportação'}
                  </Button>
                </CardContent>
              </Card>

              {formattedText && (
                <Card>
                  <CardHeader>
                    <CardTitle>Dados Exportados</CardTitle>
                    <CardDescription>Escolha o formato que deseja usar no seu bot do ChatGPT</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="formatted" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 max-w-md">
                        <TabsTrigger value="formatted">Texto Formatado</TabsTrigger>
                        <TabsTrigger value="json">JSON</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="formatted" className="space-y-4">
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => copyToClipboard(formattedText, 'Texto formatado')}>
                            <Copy className="mr-2 h-4 w-4" /> Copiar
                          </Button>
                          <Button variant="outline" onClick={() => downloadAsFile(formattedText, 'taxonomia-sim-questoes.txt')}>
                            <Download className="mr-2 h-4 w-4" /> Download
                          </Button>
                        </div>
                        <Textarea value={formattedText} readOnly className="font-mono text-xs h-[500px]" />
                        <p className="text-sm text-muted-foreground">💡 Cole este texto nas instruções do seu bot do ChatGPT</p>
                      </TabsContent>
                      
                      <TabsContent value="json" className="space-y-4">
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => copyToClipboard(jsonData, 'JSON')}>
                            <Copy className="mr-2 h-4 w-4" /> Copiar
                          </Button>
                          <Button variant="outline" onClick={() => downloadAsFile(jsonData, 'taxonomia-sim-questoes.json')}>
                            <Download className="mr-2 h-4 w-4" /> Download
                          </Button>
                        </div>
                        <Textarea value={jsonData} readOnly className="font-mono text-xs h-[500px]" />
                        <p className="text-sm text-muted-foreground">💡 Use este JSON se seu bot precisar de dados estruturados</p>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SubjectReport;
