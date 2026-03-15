import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StudentProfile {
  user_id: string;
  full_name: string | null;
  cpf: string | null;
  whatsapp: string | null;
}

interface EditStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentProfile | null;
  schoolId: string;
}

export function EditStudentModal({ open, onOpenChange, student, schoolId }: EditStudentModalProps) {
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    if (student) {
      setFullName(student.full_name || "");
      setCpf(student.cpf || "");
      setWhatsapp(student.whatsapp || "");
    }
  }, [student]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!student) return;
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName || null,
          cpf: cpf || null,
          whatsapp: whatsapp || null,
        })
        .eq("id", student.user_id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-students", schoolId] });
      toast.success("Cadastro atualizado com sucesso!");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Erro ao atualizar: " + error.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Aluno</DialogTitle>
          <DialogDescription>Atualize os dados cadastrais do aluno</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nome Completo</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nome do aluno" />
          </div>
          <div className="space-y-2">
            <Label>CPF</Label>
            <Input value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp</Label>
            <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="(00) 00000-0000" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
