import { Layout } from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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

const SubjectReport = () => {
  const { data: reportData, isLoading } = useQuery({
    queryKey: ['subject-report'],
    queryFn: async () => {
      // Buscar todas as matérias
      const { data: subjects } = await supabase
        .from('subjects')
        .select('*')
        .order('name');

      if (!subjects) return [];

      // Buscar todos os conteúdos
      const { data: contents } = await supabase
        .from('contents')
        .select('*')
        .order('name');

      // Buscar todos os tópicos
      const { data: topics } = await supabase
        .from('topics')
        .select('*')
        .order('name');

      // Buscar todas as questões
      const { data: questions } = await supabase
        .from('questions')
        .select('id, subject_id, content_id');

      // Buscar relação questões-tópicos
      const { data: questionTopics } = await supabase
        .from('question_topics')
        .select('question_id, topic_id');

      // Contar questões por matéria
      const questionsBySubject = (questions || []).reduce((acc, q) => {
        acc[q.subject_id] = (acc[q.subject_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Contar questões por conteúdo
      const questionsByContent = (questions || []).reduce((acc, q) => {
        acc[q.content_id] = (acc[q.content_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Contar questões por tópico
      const questionsByTopic = (questionTopics || []).reduce((acc, qt) => {
        acc[qt.topic_id] = (acc[qt.topic_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Organizar dados em estrutura hierárquica
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

  const totalContents = reportData?.reduce((acc, subject) => acc + subject.contents.length, 0) || 0;
  const totalTopics = reportData?.reduce((acc, subject) => 
    acc + subject.contents.reduce((sum, content) => sum + content.topics.length, 0), 0) || 0;
  const totalQuestions = reportData?.reduce((acc, subject) => acc + subject.questionCount, 0) || 0;

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
      </div>
    </Layout>
  );
};

export default SubjectReport;
