import React, { useState } from 'react';
import { Textarea } from './ui/textarea.tsx';
import { Input } from './ui/input.tsx';
import { Button } from './ui/button.tsx'; // Supondo que você tenha um componente Button
import { z } from 'zod';

const createPostSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  images: z.instanceof(FileList).optional(),
});

// Definindo o tipo de dados do formulário
type FormData = {
  title: string;
  content: string;
  images: FileList | null;
};

export default function CreatePost() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    images: null,
  });
  const [errors, setErrors] = useState<z.ZodError | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    // Type assertion para garantir que o target é um HTMLInputElement
    const inputElement = event.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'images' ? inputElement.files : value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      console.log('Post criado!', formData);
      createPostSchema.parse(formData);
      // Aqui você pode adicionar a lógica para enviar os dados do formulário
      console.log('Post criado!', formData);
      setErrors(null); // Limpa os erros
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error); // Salva os erros no estado
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-black/20 p-3 flex flex-col gap-3 rounded-lg shadow-lg"
    >
      <h2 className="font-semibold text-lg">Create Post</h2>
      <div className="flex items-center gap-4">
        <Input
          type="text"
          name="title"
          placeholder="Título do post"
          className="w-1/3"
          onChange={handleChange}
        />
        <Input type="file" name="images" className="w-1/3" onChange={handleChange} />
      </div>
      {errors?.issues.find((err) => err.path[0] === 'title') && (
        <p className="text-red">
          {errors.issues.find((err) => err.path[0] === 'title')?.message}
        </p>
      )}
      <Textarea
        name="content"
        placeholder="Conteúdo do post"
        className="resize-none"
        onChange={handleChange}
      />
      {errors?.issues.find((err) => err.path[0] === 'content') && (
        <p className="text-red">
          {errors.issues.find((err) => err.path[0] === 'content')?.message}
        </p>
      )}
      <div className="flex justify-end">
        <Button type="submit" className="bg-green text-white rounded-lg p-2">
          Postar
        </Button>
      </div>
    </form>
  );
}
