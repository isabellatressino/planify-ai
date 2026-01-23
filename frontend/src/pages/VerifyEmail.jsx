import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle, Mail, RefreshCw } from "lucide-react";
import { reload, sendEmailVerification } from "firebase/auth";

import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import useAuth from "../hooks/useAuth.js";
import { auth } from "../services/firebase.js";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const { user, isVerified } = useAuth();
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (isVerified) {
      navigate("/dashboard", { replace: true });
    }
  }, [isVerified, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;

    const timer = setInterval(() => {
      setCooldown((value) => Math.max(value - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const canResend = Boolean(user);

  async function handleResend() {
    setError("");
    setStatusMessage("");

    if (!auth.currentUser) {
      setError("Faca login novamente para reenviar o e-mail de verificacao.");
      return;
    }
    setResendLoading(true);
    try {
      await sendEmailVerification(auth.currentUser);
      setStatusMessage("E-mail de verificacao reenviado.");
      setCooldown(30);
    } catch {
      setError("Nao foi possivel reenviar o e-mail. Tente novamente.");
    } finally {
      setResendLoading(false);
    }
  }

  async function handleCheckVerification() {
    setError("");
    setStatusMessage("");

    if (!auth.currentUser) {
      setError("Entre novamente para confirmar sua verificacao.");
      return;
    }

    setChecking(true);
    try {
      await reload(auth.currentUser);
      if (auth.currentUser.emailVerified) {
        navigate("/dashboard");
        return;
      }
      setStatusMessage("Seu e-mail ainda nao foi verificado.");
    } catch {
      setError("Nao foi possivel confirmar a verificacao.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <section className="relative min-h-screen bg-background text-text-titles">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 right-6 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      </div>
      <div className="z-10 mx-auto flex min-h-screen w-full max-w-6xl px-4 py-18 items-center">
        <div className="flex w-full items-center justify-center">
          <div className="mx-auto w-full max-w-md">
            <Card className="bg-surface/85 p-8 shadow-xl">
              <div className="text-center">
                <h1 className="font-display text-3xl font-semibold text-text-titles">Verifique seu e-mail</h1>
                <p className="mt-2 text-sm text-text-body">
                  Enviamos um link para confirmar sua conta. Abra seu e-mail e clique no link.
                </p>
                {user?.email ? (
                  <p className="mt-2 text-xs text-text-body">
                    Conta: <span className="text-text-titles font-semibold">{user.email}</span>
                  </p>
                ) : null}
              </div>

              {error ? (
                <div className="mt-6 flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  <AlertTriangle className="mt-0.5 h-4 w-4" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              ) : null}
              {statusMessage ? (
                <div className="mt-6 flex items-start gap-2 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                  <CheckCircle className="mt-0.5 h-4 w-4" aria-hidden="true" />
                  <span>{statusMessage}</span>
                </div>
              ) : null}

              <div className="mt-8 space-y-4">
                <Button
                  type="button"
                  size="lg"
                  disabled={!canResend || resendLoading || cooldown > 0}
                  onClick={handleResend}
                  className="w-full"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {resendLoading ? "Reenviando..." : "Reenviar e-mail"}
                  </span>
                </Button>
                {!canResend ? (
                  <p className="text-xs text-text-body text-center">
                    Entre novamente para reenviar o e-mail.
                  </p>
                ) : null}
                {cooldown > 0 ? (
                  <p className="text-xs text-text-body text-center">
                    Aguarde {cooldown}s para reenviar.
                  </p>
                ) : null}
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleCheckVerification}
                  disabled={checking}
                  className="w-full"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <RefreshCw className={`h-4 w-4 ${checking ? "animate-spin" : ""}`} aria-hidden="true" />
                    {checking ? "Verificando..." : "Ja verifiquei"}
                  </span>
                </Button>
              </div>

              <p className="mt-6 text-center text-sm text-text-body">
                Voltar para{" "}
                <Link to="/login" className="font-medium text-primary hover:text-primary-hover transition-all duration-300 ease-out cursor-pointer">
                  login
                </Link>
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
