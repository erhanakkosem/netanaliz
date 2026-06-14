"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { TrendingUp, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirm) {
      setError("Şifreler eşleşmiyor");
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${name} ${surname}`.trim(),
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Kayıt başarısız");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/archive");
      } else {
        router.push("/login");
      }
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md border-border bg-card">
      <CardContent className="p-8">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <TrendingUp className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-foreground">
            Oran<span className="text-primary">Analiz</span>
          </span>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Hesap Oluşturun
          </h1>
          <p className="mt-1 text-sm text-muted">
            Ücretsiz hesap oluşturun, hemen başlayın
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                Ad
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Ad"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-border bg-background text-foreground placeholder:text-muted"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="surname"
                className="text-sm font-medium text-foreground"
              >
                Soyad
              </label>
              <Input
                id="surname"
                type="text"
                placeholder="Soyad"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
                className="border-border bg-background text-foreground placeholder:text-muted"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              E-posta
            </label>
            <Input
              id="email"
              type="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-border bg-background text-foreground placeholder:text-muted"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Şifre
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="border-border bg-background pr-10 text-foreground placeholder:text-muted"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="passwordConfirm"
              className="text-sm font-medium text-foreground"
            >
              Şifre Tekrar
            </label>
            <div className="relative">
              <Input
                id="passwordConfirm"
                type={showPasswordConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                minLength={6}
                className="border-border bg-background pr-10 text-foreground placeholder:text-muted"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                tabIndex={-1}
              >
                {showPasswordConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? "Kaydediliyor..." : "Kayıt Ol"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Zaten hesabın var mı?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary-dark"
          >
            Giriş Yap
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
