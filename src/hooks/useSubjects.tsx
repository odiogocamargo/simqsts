import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Topic {
  id: string;
  name: string;
  content_id: string;
}

export interface Content {
  id: string;
  name: string;
  subject_id: string;
  topics?: Topic[];
}

export interface Subject {
  id: string;
  name: string;
  contents?: Content[];
}

export const useSubjects = () => {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Subject[];
    },
  });
};

export const useContents = (subjectId?: string) => {
  return useQuery({
    queryKey: ['contents', subjectId],
    queryFn: async () => {
      let query = supabase
        .from('contents')
        .select('*')
        .order('name');
      
      if (subjectId) {
        query = query.eq('subject_id', subjectId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Content[];
    },
    enabled: !!subjectId,
  });
};

export const useTopics = (contentId?: string) => {
  return useQuery({
    queryKey: ['topics', contentId],
    queryFn: async () => {
      let query = supabase
        .from('topics')
        .select('*')
        .order('name');
      
      if (contentId) {
        query = query.eq('content_id', contentId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Topic[];
    },
    enabled: !!contentId,
  });
};

export const useExams = () => {
  return useQuery({
    queryKey: ['exams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
};
