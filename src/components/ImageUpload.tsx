import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  questionId?: string;
  onImagesChange?: (images: QuestionImage[]) => void;
  initialImages?: QuestionImage[];
}

export interface QuestionImage {
  id?: string;
  image_url: string;
  image_type?: string;
  display_order?: number;
  file?: File;
}

export function ImageUpload({ questionId, onImagesChange, initialImages = [] }: ImageUploadProps) {
  const [images, setImages] = useState<QuestionImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImages: QuestionImage[] = files.map((file, index) => ({
      image_url: URL.createObjectURL(file),
      image_type: 'question',
      display_order: images.length + index,
      file
    }));

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImagesChange?.(updatedImages);
  };

  const uploadImage = async (file: File, questionId: string, displayOrder: number): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${questionId}/${Date.now()}_${displayOrder}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('question-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('question-images')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleUploadImages = async () => {
    if (!questionId) {
      toast({
        title: "Erro",
        description: "É necessário salvar a questão antes de fazer upload de imagens",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const imagesToUpload = images.filter(img => img.file);
      
      for (const image of imagesToUpload) {
        if (!image.file) continue;

        const publicUrl = await uploadImage(image.file, questionId, image.display_order || 0);
        
        if (publicUrl) {
          const { error } = await supabase
            .from('question_images')
            .insert({
              question_id: questionId,
              image_url: publicUrl,
              image_type: image.image_type || 'question',
              display_order: image.display_order || 0
            });

          if (error) throw error;
        }
      }

      toast({
        title: "Sucesso",
        description: "Imagens carregadas com sucesso"
      });

      // Reload images from database
      const { data: dbImages } = await supabase
        .from('question_images')
        .select('*')
        .eq('question_id', questionId)
        .order('display_order');

      if (dbImages) {
        setImages(dbImages.map(img => ({
          id: img.id,
          image_url: img.image_url,
          image_type: img.image_type || undefined,
          display_order: img.display_order || undefined
        })));
      }

    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload das imagens",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    const image = images[index];
    
    if (image.id && questionId) {
      try {
        // Delete from database
        const { error: dbError } = await supabase
          .from('question_images')
          .delete()
          .eq('id', image.id);

        if (dbError) throw dbError;

        // Delete from storage
        const path = image.image_url.split('/question-images/')[1];
        if (path) {
          await supabase.storage
            .from('question-images')
            .remove([path]);
        }

        toast({
          title: "Sucesso",
          description: "Imagem removida com sucesso"
        });
      } catch (error) {
        console.error('Error removing image:', error);
        toast({
          title: "Erro",
          description: "Erro ao remover imagem",
          variant: "destructive"
        });
        return;
      }
    }

    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange?.(updatedImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="flex-1"
        />
        {questionId && images.some(img => img.file) && (
          <Button
            type="button"
            onClick={handleUploadImages}
            disabled={uploading}
            size="sm"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Enviando...' : 'Enviar'}
          </Button>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                <img
                  src={image.image_url}
                  alt={`Imagem ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="w-4 h-4" />
              </Button>
              {image.file && (
                <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded text-xs">
                  Pendente
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Nenhuma imagem adicionada
          </p>
        </div>
      )}
    </div>
  );
}
