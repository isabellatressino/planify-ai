import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import { registerWithEmail } from "../services/firebase.js";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerWithEmail(name, email, password);
      navigate("/verify-email");
    } catch (err) {
      setError(err?.message || "Falha no cadastro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative min-h-screen bg-background text-text-titles">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 right-6 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      </div>
      <div className="z-10 mx-auto flex min-h-screen w-full max-w-6xl px-4 pt-18 items-center">
        <div className="flex w-full gap-10 lg:items-center">
          <div className="hidden lg:flex flex-col justify-center pr-10">
            <div
              className="w-fit text-xs text-primary bg-primary/20 py-1 px-3 rounded-full border border-primary flex items-center gap-2 before:content-[''] before:w-2 before:h-2 before:rounded-full before:bg-primary"
            >
              Novidade: IA GPT-4o mini integrada
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-text-titles font-display mt-4">
              Crie seu plano de estudos com ajuda de IA
            </h2>
            <p className="mt-4 text-base text-text-body">
              Preencha seus dados para gerar seus primeiros planos personalizados e acompanhar sua evolucao.
            </p>
          </div>
          <div className="mx-auto w-full max-w-md">
            <Card className="bg-surface/85 p-8 shadow-xl">
              <div className="text-center">
                <h1 className="font-display text-3xl font-semibold text-text-titles">Criar conta</h1>
                <p className="mt-2 text-sm text-text-body">
                  Comece a montar seus planos agora.
                </p>
              </div>
              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="text-sm font-medium text-text-body">
                    Nome
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-2 border-surface bg-background/60"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-text-body">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-2 border-surface bg-background/60"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="text-sm font-medium text-text-body">
                    Senha
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="mt-2 border-surface bg-background/60"
                    placeholder="********"
                  />
                </div>
                {error ? (
                  <p className="text-sm text-red-500" role="alert" aria-live="polite" id="register-error">
                    {error}
                  </p>
                ) : null}
                <Button
                  type="submit"
                  disabled={loading}
                  aria-describedby={error ? "register-error" : undefined}
                  size="lg"
                  className="w-full cursor-pointer"
                >
                  {loading ? "Criando..." : "Criar conta"}
                </Button>
              </form>
              <p className="mt-6 text-center text-sm text-text-body">
                Ja tem conta?{" "}
                <Link to="/login" className="font-medium text-primary hover:text-primary-hover transition-all duration-300 ease-out cursor-pointer">
                  Entrar
                </Link>
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
