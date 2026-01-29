"use client";

import { User, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleSelectorProps {
  value: string;
  onChange: (value: "talent" | "client") => void;
}

const roles = [
  {
    value: "talent" as const,
    label: "Talent",
    description: "Saya ingin bekerja sebagai SPG/Usher",
    icon: User,
  },
  {
    value: "client" as const,
    label: "Client / Perusahaan",
    description: "Saya ingin mencari talent untuk event",
    icon: Building2,
  },
];

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {roles.map((role) => {
        const Icon = role.icon;
        const isSelected = value === role.value;
        return (
          <button
            key={role.value}
            type="button"
            onClick={() => onChange(role.value)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition-all",
              isSelected
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            )}
          >
            <Icon className={cn("h-8 w-8", isSelected ? "text-brand-500" : "text-gray-400")} />
            <span className="text-sm font-semibold">{role.label}</span>
            <span className="text-xs text-muted-foreground">{role.description}</span>
          </button>
        );
      })}
    </div>
  );
}
