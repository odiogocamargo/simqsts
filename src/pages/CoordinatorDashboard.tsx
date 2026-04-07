import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Loader2 } from "lucide-react";
import {
  useCoordinatorSchool,
  useCoordinatorStudents,
  useCoordinatorAnswers,
  useCoordinatorPerformance,
  useCoordinatorClasses,
  useClassStudents,
} from "@/hooks/useCoordinatorData";
import { DashboardMetrics } from "@/components/coordinator/DashboardMetrics";
import { DailyEvolutionChart } from "@/components/coordinator/DailyEvolutionChart";
import { StudentRanking } from "@/components/coordinator/StudentRanking";
import { SubjectPerformanceChart } from "@/components/coordinator/SubjectPerformanceChart";
import { StudentPerformanceTable } from "@/components/coordinator/StudentPerformanceTable";
import { ClassFilter } from "@/components/coordinator/ClassFilter";
import { PerformanceHeatmap } from "@/components/coordinator/PerformanceHeatmap";
import { useContentTopicHeatmap } from "@/hooks/useContentTopicPerformance";

export default function CoordinatorDashboard() {
  const navigate = useNavigate();
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

  // Filter by class (computed before hooks to keep hook order stable)
  const filteredStudents = selectedClassId === "all"
    ? (students || [])
    : (students || []).filter(s => classStudentSet?.has(s.id));

  const filteredStudentIds = new Set(filteredStudents.map(s => s.id));
  const filteredAnswers = (answers || []).filter(a => filteredStudentIds.has(a.user_id));
  const filteredPerformance = (perfData?.performance || []).filter(p => filteredStudentIds.has(p.user_id));

  const { data: heatmapData } = useContentTopicHeatmap(filteredAnswers);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  const subjectCount = new Set(filteredPerformance.filter(p => p.total_questions > 0).map(p => p.subject_id)).size;

  const handleStudentClick = (studentId: string) => {
    navigate(`/coordinator/student/${studentId}`);
  };

  return (
    <Layout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{schoolName}</h1>
            <p className="text-muted-foreground">Painel do Coordenador</p>
          </div>
          {classes && classes.length > 0 && (
            <ClassFilter
              classes={classes}
              selectedClassId={selectedClassId}
              onClassChange={setSelectedClassId}
            />
          )}
        </div>

        <DashboardMetrics
          students={filteredStudents}
          answers={filteredAnswers}
          subjectCount={subjectCount}
        />

        <DailyEvolutionChart answers={filteredAnswers} />

        <StudentRanking
          students={filteredStudents}
          answers={filteredAnswers}
          onStudentClick={handleStudentClick}
        />

        {heatmapData && (
          <PerformanceHeatmap
            contentData={heatmapData.contentData}
            topicData={heatmapData.topicData}
            title="Mapa de Calor — Desempenho por Conteúdo/Tópico"
          />
        )}

        <SubjectPerformanceChart
          performance={filteredPerformance}
          subjects={perfData?.subjects || []}
        />

        <StudentPerformanceTable
          students={filteredStudents}
          answers={filteredAnswers}
          onStudentClick={handleStudentClick}
        />
      </div>
    </Layout>
  );
}
