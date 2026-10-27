'use client';

import { useState, useTransition, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { savePost } from '../actions';

export default function DraftForm({ children }: { children: ReactNode }) {
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return <form onSubmit={event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError('');
    startTransition(async () => {
      try {
        const result = await savePost(form);
        if (result.error) setError(result.error);
        else { router.push('/admin/conteudo?post='+result.id+'&saved=1'); router.refresh(); }
      } catch {
        setError('A conexão falhou. Seu texto foi mantido; confira se a revisão foi salva antes de tentar novamente.');
      }
    });
  }}>
    {error && <p role="alert" className="studio-notice">{error}</p>}
    <fieldset disabled={pending} style={{border:0,padding:0,margin:0,minWidth:0}}>{children}</fieldset>
    {pending && <p role="status">Salvando revisão…</p>}
  </form>;
}
