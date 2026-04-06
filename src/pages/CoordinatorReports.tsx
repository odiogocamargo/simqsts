import { useState } from "react";
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

export default function CoordinatorReports() {
  const { schoolId, schoolName, isLoading: schoolLoading } = useCoordinatorSchool();
  const { data: students, isLoading: studentsLoading } = useCoordinatorStudents(schoolId);
  const { data: answers, isLoading: answersLoading } = useCoordinatorAnswers(schoolId);
  const { data: perfData, isLoading: perfLoading } = useCoordinatorPerformance(schoolId);
  const { data: classes } = useCoordinatorClasses(schoolId);

  const [selectedClassId, setSelectedClassId] = useState("all");
  const { data: classStudentSet } = useClassStudents(
    selectedClassId !== "all" ? selectedClassId : undefined
  );

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
  const filteredAnswers = (answers || []).filter(a => filteredStudentIds.has(a.user_id));
  const filteredPerformance = (perfData?.performance || []).filter(p => filteredStudentIds.has(p.user_id));

  return (
    <Layout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
            <p className="text-muted-foreground">Inteligência pedagógica — {schoolName}</p>
          </div>
          {classes && classes.length > 0 && (
            <ClassFilter
              classes={classes}
              selectedClassId={selectedClassId}
              onClassChange={setSelectedClassId}
            />
          )}
        </div>

        <Tabs defaultValue="classes" className="w-full">
          <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="classes">Por Turma</TabsTrigger>
            <TabsTrigger value="subjects">Por Matéria</TabsTrigger>
            <TabsTrigger value="risk">Alunos em Risco</TabsTrigger>
            <TabsTrigger value="evolution">Evolução</TabsTrigger>
          </TabsList>

          <TabsContent value="classes">
            <ReportClassPerformance
              students={students || []}
              answers={answers || []}
              classes={classes || []}
              performance={perfData?.performance || []}
              subjects={perfData?.subjects || []}
            />
          </TabsContent>

          <TabsContent value="subjects">
            <ReportSubjectPerformance
              students={filteredStudents}
              answers={filteredAnswers}
              performance={filteredPerformance}
              subjects={perfData?.subjects || []}
            />
          </TabsContent>

          <TabsContent value="risk">
            <ReportAtRiskStudents
              students={filteredStudents}
              answers={filteredAnswers}
            />
          </TabsContent>

          <TabsContent value="evolution">
            <ReportTemporalEvolution
              students={filteredStudents}
              answers={filteredAnswers}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
