import { useState, useRef } from "react";
import { Layout } from "@/components/Layout";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCoordinatorSchool,
  useCoordinatorStudents,
  useCoordinatorAnswers,
  useCoordinatorPerformance,
  useCoordinatorClasses,
  useClassStudents,
} from "@/hooks/useCoordinatorData";
import { ClassFilter } from "@/components/coordinator/ClassFilter";
import { ReportClassPerformance } from "@/components/coordinator/reports/ReportClassPerformance";
import { ReportSubjectPerformance } from "@/components/coordinator/reports/ReportSubjectPerformance";
import { ReportAtRiskStudents } from "@/components/coordinator/reports/ReportAtRiskStudents";
import { ReportTemporalEvolution } from "@/components/coordinator/reports/ReportTemporalEvolution";
import { ExportPdfButton } from "@/components/coordinator/reports/ExportPdfButton";
import { PeriodFilter, filterByPeriod, type PeriodOption, type PeriodRange } from "@/components/coordinator/PeriodFilter";

const TAB_TITLES: Record<string, string> = {
  classes: "Relatório - Desempenho por Turma",
  subjects: "Relatório - Desempenho por Matéria",
  risk: "Relatório - Alunos em Risco",
  evolution: "Relatório - Evolução Temporal",
};

const TAB_FILES: Record<string, string> = {
  classes: "relatorio-turmas",
  subjects: "relatorio-materias",
  risk: "relatorio-alunos-risco",
  evolution: "relatorio-evolucao",
};

export default function CoordinatorReports() {
  const { schoolId, schoolName, isLoading: schoolLoading } = useCoordinatorSchool();
  const { data: students, isLoading: studentsLoading } = useCoordinatorStudents(schoolId);
  const { data: answers, isLoading: answersLoading } = useCoordinatorAnswers(schoolId);
  const { data: perfData, isLoading: perfLoading } = useCoordinatorPerformance(schoolId);
  const { data: classes } = useCoordinatorClasses(schoolId);

  const [selectedClassId, setSelectedClassId] = useState("all");
  const [activeTab, setActiveTab] = useState("classes");
  const [period, setPeriod] = useState<PeriodOption>("30d");
  const [customRange, setCustomRange] = useState<PeriodRange>({ from: undefined, to: undefined });

  const { data: classStudentSet } = useClassStudents(
    selectedClassId !== "all" ? selectedClassId : undefined
  );

  const classesRef = useRef<HTMLDivElement>(null);
  const subjectsRef = useRef<HTMLDivElement>(null);
  const riskRef = useRef<HTMLDivElement>(null);
  const evolutionRef = useRef<HTMLDivElement>(null);

  const tabRefs: Record<string, React.RefObject<HTMLDivElement>> = {
    classes: classesRef,
    subjects: subjectsRef,
    risk: riskRef,
    evolution: evolutionRef,
  };

  const isLoading = schoolLoading || studentsLoading || answersLoading || perfLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  const filteredStudents = selectedClassId === "all"
    ? (students || [])
    : (students || []).filter(s => classStudentSet?.has(s.id));

  const filteredStudentIds = new Set(filteredStudents.map(s => s.id));
  const classFilteredAnswers = (answers || []).filter(a => filteredStudentIds.has(a.user_id));
  
  // Filter by period
  const filteredAnswers = filterByPeriod(classFilteredAnswers, a => a.answered_at, period, customRange);
  const filteredPerformance = (perfData?.performance || []).filter(p => filteredStudentIds.has(p.user_id));

  return (
    <Layout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
            <p className="text-muted-foreground">Inteligência pedagógica — {schoolName}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ExportPdfButton
              contentRef={tabRefs[activeTab]}
              fileName={TAB_FILES[activeTab]}
              title={TAB_TITLES[activeTab]}
              schoolName={schoolName}
            />
            <PeriodFilter
              period={period}
              customRange={customRange}
              onPeriodChange={setPeriod}
              onCustomRangeChange={setCustomRange}
            />
            {classes && classes.length > 0 && (
              <ClassFilter
                classes={classes}
                selectedClassId={selectedClassId}
                onClassChange={setSelectedClassId}
              />
            )}
          </div>
        </div>

        <Tabs defaultValue="classes" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="classes">Por Turma</TabsTrigger>
            <TabsTrigger value="subjects">Por Matéria</TabsTrigger>
            <TabsTrigger value="risk">Alunos em Risco</TabsTrigger>
            <TabsTrigger value="evolution">Evolução</TabsTrigger>
          </TabsList>

          <TabsContent value="classes">
            <div ref={classesRef}>
              <ReportClassPerformance
                students={students || []}
                answers={filteredAnswers}
                classes={classes || []}
                performance={filteredPerformance}
                subjects={perfData?.subjects || []}
              />
            </div>
          </TabsContent>

          <TabsContent value="subjects">
            <div ref={subjectsRef}>
              <ReportSubjectPerformance
                students={filteredStudents}
                answers={filteredAnswers}
                performance={filteredPerformance}
                subjects={perfData?.subjects || []}
              />
            </div>
          </TabsContent>

          <TabsContent value="risk">
            <div ref={riskRef}>
              <ReportAtRiskStudents
                students={filteredStudents}
                answers={filteredAnswers}
              />
            </div>
          </TabsContent>

          <TabsContent value="evolution">
            <div ref={evolutionRef}>
              <ReportTemporalEvolution
                students={filteredStudents}
                answers={filteredAnswers}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
