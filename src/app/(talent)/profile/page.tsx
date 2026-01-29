"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, Image as ImageIcon, Briefcase } from "lucide-react";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ProfileInfoTab } from "@/components/talent/ProfileInfoTab";
import { PortfolioTab } from "@/components/talent/PortfolioTab";
import { ExperienceTab } from "@/components/talent/ExperienceTab";
import { useUser } from "@/hooks/useUser";
import type { Profile, Talent, TalentPortfolio, TalentExperience } from "@/types";

export default function TalentProfilePage() {
  const { user, isLoading: authLoading } = useUser();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [talent, setTalent] = useState<Talent | null>(null);
  const [portfolio, setPortfolio] = useState<TalentPortfolio[]>([]);
  const [experiences, setExperiences] = useState<TalentExperience[]>([]);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/talent/profile");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal memuat profil");
      }

      setProfile(result.data.profile);
      setTalent(result.data.talent);
      setPortfolio(result.data.portfolio);
      setExperiences(result.data.experiences);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal memuat profil");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      fetchProfile();
    }
  }, [user, authLoading, router, fetchProfile]);

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" text="Memuat profil..." />
      </div>
    );
  }

  if (!profile || !talent) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="text-sm text-gray-500">Data profil tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
        <p className="text-muted-foreground">Kelola informasi profil, portfolio, dan pengalaman Anda</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profil" className="space-y-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="profil" className="gap-1.5">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="gap-1.5">
            <ImageIcon className="h-4 w-4" />
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="pengalaman" className="gap-1.5">
            <Briefcase className="h-4 w-4" />
            Pengalaman
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profil">
          <ProfileInfoTab
            profile={profile}
            talent={talent}
            onUpdate={(updatedTalent) => setTalent(updatedTalent)}
          />
        </TabsContent>

        <TabsContent value="portfolio">
          <PortfolioTab
            portfolio={portfolio}
            onAdd={(item) => setPortfolio((prev) => [...prev, item])}
            onDelete={(id) => setPortfolio((prev) => prev.filter((p) => p.id !== id))}
          />
        </TabsContent>

        <TabsContent value="pengalaman">
          <ExperienceTab
            experiences={experiences}
            onAdd={(exp) => setExperiences((prev) => [exp, ...prev])}
            onUpdate={(exp) =>
              setExperiences((prev) =>
                prev.map((e) => (e.id === exp.id ? exp : e))
              )
            }
            onDelete={(id) => setExperiences((prev) => prev.filter((e) => e.id !== id))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
