import { useEffect, useState } from "react";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import { getProfile } from "../services/auth.js";
import { User, Pencil, CameraIcon } from "lucide-react";


export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const data = await getProfile();
        if (isMounted) {
          setProfile(data);
        }
      } catch (err) {
        const message = err.response?.data?.message || "Falha ao carregar perfil";
        if (isMounted) {
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-text-body">Carregando...</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-red-400" role="alert">
        {error}
      </p>
    );
  }

  if (!profile) {
    return <p className="text-sm text-text-body">Perfil nao encontrado.</p>;
  }

  const displayName = (profile.name || "").trim() || profile.email || "Usuario";

  return (
    <section className="space-y-6">
      <PageHeader title="Perfil" subtitle="Informacoes da sua conta." icon={User} />
      <Card className="flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-lg">
            <User className="h-full w-full text-primary" aria-hidden="true" />
          </span>
          <h3 className="font-semibold text-text-titles">Informações Pessoais</h3>
        </div>
        <div className="flex gap-4 flex-col sm:flex-row sm:gap-6 items-start">
          <div className="relative">
            <button
              type="button"
              className="h-20 w-20 rounded-xl bg-background border border-text-body/30 overflow-hidden flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer"
              aria-label="Alterar foto"
            >
              <CameraIcon className="h-6 w-6 text-text-body" aria-hidden="true" />
            </button>
            <button
              type="button"
              disabled
              className="absolute opacity-80 left-16 -bottom-2 h-6 w-6 rounded-full bg-primary-hover text-slate-900 flex items-center justify-center shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Editar foto"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
            <div className="space-y-2 ">
              <label className="text-xs uppercase">
                Nome Completo
              </label>
              <Input
                placeholder={displayName}
                disabled
                className="h-10 bg-background text-text-body"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase">
                Email
              </label>
              <Input
                placeholder={profile.email}
                disabled
                className="h-10 bg-background text-text-body"
              />
            </div>
          </div>
        </div>
        <button
          type="button"
          disabled
          className="mt-4 self-end rounded-xl bg-primary-hover px-5 py-2 text-sm font-semibold font-display text-background disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Salvar Alterações
        </button>
      </Card>
      <Card className="flex flex-col sm:w-[50%] gap-3 p-4">
        <h3 className="uppercase text-xs text-center">Uso de créditos da IA</h3>

        <div className="flex justify-center">
          <div className="relative h-36 w-36 flex items-center justify-center">
            {/* Círculo de fundo + progresso */}
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
              {/* trilha/fundo */}
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="8"
              />

              {/* progresso */}
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 44}
                strokeDashoffset={
                  (2 * Math.PI * 44) *
                  (1 - profile.creditsRemaining / profile.freeCreditsTotal)
                }
                className="text-primary transition-all duration-500 ease-out"
              />
            </svg>

            {/* Seu conteúdo original */}
            <div className="flex flex-col items-center">
              <span className="text-text-titles text-4xl font-bold">
                {profile.creditsRemaining}
              </span>
              <span className="text-sm">de {profile.freeCreditsTotal}</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-text-titles text-center">Plano Free</p>
          <p className="text-xs text-center">
            Criado {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        </div>
      </Card>
    </section>
  );
}
