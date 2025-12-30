import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  Award,
  TrendingUp,
} from "lucide-react";
import { Resume } from "@/types/resume";
import { cn } from "@/lib/utils";

interface ResumeCompletenessProps {
  resume: Resume;
  compact?: boolean;
}

interface CheckItem {
  id: string;
  label: string;
  icon: React.ElementType;
  check: (resume: Resume) => boolean;
  weight: number;
  tip: string;
}

const COMPLETENESS_CHECKS: CheckItem[] = [
  {
    id: "name",
    label: "Full Name",
    icon: User,
    check: (r) => !!r.contact.fullName?.trim(),
    weight: 10,
    tip: "Add your full name",
  },
  {
    id: "email",
    label: "Email Address",
    icon: User,
    check: (r) => !!r.contact.email?.trim(),
    weight: 10,
    tip: "Add your email address",
  },
  {
    id: "phone",
    label: "Phone Number",
    icon: User,
    check: (r) => !!r.contact.phone?.trim(),
    weight: 5,
    tip: "Add your phone number",
  },
  {
    id: "location",
    label: "Location",
    icon: User,
    check: (r) => !!r.contact.location?.trim(),
    weight: 5,
    tip: "Add your location",
  },
  {
    id: "linkedin",
    label: "LinkedIn Profile",
    icon: User,
    check: (r) => !!r.contact.linkedin?.trim(),
    weight: 5,
    tip: "Add your LinkedIn URL",
  },
  {
    id: "summary",
    label: "Professional Summary",
    icon: FileText,
    check: (r) => {
      const stripped = r.summary?.replace(/<[^>]*>/g, "").trim();
      return !!stripped && stripped.length >= 50;
    },
    weight: 15,
    tip: "Write a compelling summary (50+ characters)",
  },
  {
    id: "experience",
    label: "Work Experience",
    icon: Briefcase,
    check: (r) =>
      r.experiences.length > 0 &&
      r.experiences.some((e) => e.company && e.title),
    weight: 20,
    tip: "Add at least one work experience",
  },
  {
    id: "experience_bullets",
    label: "Experience Details",
    icon: Briefcase,
    check: (r) =>
      r.experiences.some((e) => e.bullets.filter((b) => b.trim()).length >= 2),
    weight: 10,
    tip: "Add 2+ bullet points to your experiences",
  },
  {
    id: "education",
    label: "Education",
    icon: GraduationCap,
    check: (r) =>
      r.education.length > 0 &&
      r.education.some((e) => e.institution && e.degree),
    weight: 10,
    tip: "Add your education background",
  },
  {
    id: "skills",
    label: "Skills",
    icon: Wrench,
    check: (r) => r.skills.length >= 5,
    weight: 10,
    tip: "Add at least 5 skills",
  },
];

export function ResumeCompleteness({
  resume,
  compact = false,
}: ResumeCompletenessProps) {
  const completedChecks = COMPLETENESS_CHECKS.filter((check) =>
    check.check(resume)
  );
  const totalWeight = COMPLETENESS_CHECKS.reduce(
    (sum, check) => sum + check.weight,
    0
  );
  const completedWeight = completedChecks.reduce(
    (sum, check) => sum + check.weight,
    0
  );
  const score = Math.round((completedWeight / totalWeight) * 100);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Work";
  };

  // Score levels for display
  const scoreLevels = [
    { min: 90, max: 100, label: "Excellent", color: "bg-green-500" },
    { min: 80, max: 89, label: "Very Good", color: "bg-green-400" },
    { min: 60, max: 79, label: "Good", color: "bg-yellow-500" },
    { min: 40, max: 59, label: "Fair", color: "bg-orange-500" },
    { min: 0, max: 39, label: "Needs Work", color: "bg-red-500" },
  ];

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const incompleteChecks = COMPLETENESS_CHECKS.filter(
    (check) => !check.check(resume)
  );

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
        <div className="relative w-12 h-12 shrink-0">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 48 48"
          >
            <circle
              className="text-muted"
              strokeWidth="3"
              stroke="currentColor"
              fill="transparent"
              r="20"
              cx="24"
              cy="24"
            />
            <circle
              className={getScoreColor(score)}
              strokeWidth="3"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="20"
              cx="24"
              cy="24"
              style={{
                strokeDasharray: `${score * 1.256} 125.6`,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={cn(
                "text-xs font-bold leading-none",
                getScoreColor(score)
              )}
            >
              {score}%
            </span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Resume Completeness</span>
            <Badge
              variant="secondary"
              className={cn("text-xs", getScoreColor(score))}
            >
              {getScoreLabel(score)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {incompleteChecks.length > 0
              ? `Next: ${incompleteChecks[0].tip}`
              : "Your resume is complete!"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Resume Completeness
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {/* Score Display */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Circular Score */}
          <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 64 64"
            >
              <circle
                className="text-muted"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
                r="28"
                cx="32"
                cy="32"
              />
              <circle
                className={getScoreColor(score)}
                strokeWidth="5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="28"
                cx="32"
                cy="32"
                style={{
                  strokeDasharray: `${score * 1.76} 176`,
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={cn(
                  "text-base sm:text-xl font-bold leading-none",
                  getScoreColor(score)
                )}
              >
                {score}%
              </span>
            </div>
          </div>

          {/* Score Levels Legend */}
          <div className="flex-1 space-y-1 sm:space-y-1.5 min-w-0">
            {scoreLevels.map((level) => {
              const isCurrentLevel = score >= level.min && score <= level.max;
              return (
                <div
                  key={level.label}
                  className={cn(
                    "flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs transition-colors",
                    isCurrentLevel && "bg-muted"
                  )}
                >
                  <div
                    className={cn(
                      "w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0",
                      level.color
                    )}
                  />
                  <span
                    className={cn(
                      "flex-1 truncate",
                      isCurrentLevel
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {level.label}
                  </span>
                  <span
                    className={cn(
                      "tabular-nums shrink-0",
                      isCurrentLevel
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {level.min}-{level.max}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="h-2 sm:h-2.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500",
                getProgressColor(score)
              )}
              style={{ width: `${score}%` }}
            />
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
            {completedChecks.length} of {COMPLETENESS_CHECKS.length} items
            complete
          </p>
        </div>

        {/* Checklist - Scrollable on mobile */}
        <div className="grid gap-1 sm:gap-1.5 max-h-[200px] sm:max-h-none overflow-y-auto">
          {COMPLETENESS_CHECKS.map((check) => {
            const isComplete = check.check(resume);
            return (
              <div
                key={check.id}
                className={cn(
                  "flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-md transition-colors",
                  isComplete
                    ? "bg-green-50 dark:bg-green-900/10"
                    : "bg-muted/50"
                )}
              >
                {isComplete ? (
                  <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 shrink-0" />
                ) : (
                  <Circle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                )}
                <span
                  className={cn(
                    "text-xs sm:text-sm truncate",
                    isComplete
                      ? "text-green-700 dark:text-green-400"
                      : "text-muted-foreground"
                  )}
                >
                  {check.label}
                </span>
                {!isComplete && (
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground ml-auto shrink-0">
                    +{check.weight}%
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Tips for improvement */}
        {incompleteChecks.length > 0 && (
          <div className="p-2 sm:p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-amber-800 dark:text-amber-400">
                  Quick Win
                </p>
                <p className="text-[10px] sm:text-xs text-amber-700 dark:text-amber-500 truncate">
                  {incompleteChecks[0].tip} (+{incompleteChecks[0].weight}%)
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
