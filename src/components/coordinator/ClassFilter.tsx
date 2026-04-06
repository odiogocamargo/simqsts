import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ClassFilterProps {
  classes: { id: string; name: string; year: number; shift: string | null }[];
  selectedClassId: string;
  onClassChange: (classId: string) => void;
}

export function ClassFilter({ classes, selectedClassId, onClassChange }: ClassFilterProps) {
  return (
    <Select value={selectedClassId} onValueChange={onClassChange}>
      <SelectTrigger className="w-full sm:w-[220px]">
        <SelectValue placeholder="Filtrar por turma" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todas as turmas</SelectItem>
        {classes.map(c => (
          <SelectItem key={c.id} value={c.id}>
            {c.name} ({c.year}{c.shift ? ` - ${c.shift}` : ""})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
