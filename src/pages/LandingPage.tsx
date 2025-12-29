import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FilePenLine,
  ScanSearch,
  Wand2,
  ScanLine,
  Eye,
  MessagesSquare,
  TrendingUp,
  ArrowRight,
  Zap,
  Shield,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/aceternity/spotlight";
import { FlipWords } from "@/components/ui/aceternity/flip-words";
import { BentoGrid, BentoGridItem } from "@/components/ui/aceternity/bento-grid";
import { LampContainer } from "@/components/ui/aceternity/lamp";
import { CardSpotlight } from "@/components/ui/aceternity/card-spotlight";
import { MovingBorderButton } from "@/components/ui/aceternity/moving-border";
import { BackgroundBeams } from "@/components/ui/aceternity/background-beams";
import { HoverEffect } from "@/components/ui/aceternity/card-hover-effect";

const features = [
  {
    title: "Resume Editor",
    description:
      "Create stunning, ATS-optimized resumes with our intuitive drag-and-drop editor. Multiple templates, real-time preview, and PDF export.",
    icon: <FilePenLine className="h-6 w-6 text-primary" />,
    className: "md:col-span-2",
    header: (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
    ),
  },
  {
    title: "Job Tailoring",
    description:
      "Paste any job description and get personalized suggestions to tailor your resume for maximum impact.",
    icon: <ScanSearch className="h-6 w-6 text-primary" />,
    className: "md:col-span-1",
    header: (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-secondary/20 via-secondary/5 to-transparent" />
    ),
  },
  {
    title: "Achievement Transformer",
    description:
      "Transform bland bullet points into powerful, quantified achievements that grab attention.",
    icon: <Wand2 className="h-6 w-6 text-primary" />,
    className: "md:col-span-1",
    header: (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-muted/30 via-muted/10 to-transparent" />
    ),
  },
  {
    title: "ATS Analysis",
    description:
      "Get instant feedback on your resume's ATS compatibility score and actionable recommendations.",
    icon: <ScanLine className="h-6 w-6 text-primary" />,
    className: "md:col-span-2",
    header: (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/15 via-secondary/10 to-transparent" />
    ),
  },
  {
    title: "Recruiter Heatmap",
    description:
      "See exactly where recruiters focus their attention on your resume with AI-powered eye-tracking simulation.",
    icon: <Eye className="h-6 w-6 text-primary" />,
    className: "md:col-span-1",
    header: (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-destructive/10 via-destructive/5 to-transparent" />
    ),
  },
  {
    title: "Interview Coach",
    description:
      "Practice with AI-generated interview questions tailored to your target role and experience.",
    icon: <MessagesSquare className="h-6 w-6 text-primary" />,
    className: "md:col-span-1",
    header: (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-secondary/15 via-muted/10 to-transparent" />
    ),
  },
  {
    title: "Salary Negotiation",
    description:
      "Get data-driven salary insights and negotiation scripts to maximize your compensation.",
    icon: <TrendingUp className="h-6 w-6 text-primary" />,
    className: "md:col-span-1",
    header: (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/10 via-muted/5 to-transparent" />
    ),
  },
];

const steps = [
  {
    number: "01",
    title: "Upload or Create",
    description: "Import your existing resume or start fresh with our professional templates.",
  },
  {
    number: "02",
    title: "Optimize & Tailor",
    description: "AI analyzes and enhances your resume for any job description.",
  },
  {
    number: "03",
    title: "Practice & Prepare",
    description: "Use our interview coach and salary tools to prepare for success.",
  },
  {
    number: "04",
    title: "Land Your Dream Job",
    description: "Apply with confidence using your optimized, ATS-ready resume.",
  },
];

export default function LandingPage() {
  const words = ["Create", "Optimize", "Tailor", "Perfect"];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-32 md:pt-20">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
        <BackgroundBeams className="absolute inset-0" />

        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-6 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center">
              <img src="/logo.svg" alt="CareerPro Logo" className="h-10 w-10" />
            </div>
            <span className="text-xl font-bold text-foreground">CareerPro</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/editor" className="hidden md:block">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link to="/editor">
              <MovingBorderButton
                borderRadius="0.5rem"
                className="px-4 py-2 text-sm font-medium"
                containerClassName="h-10 w-auto"
              >
                <span className="hidden sm:inline">Get Started Free</span>
                <span className="sm:hidden">Get Started</span>
              </MovingBorderButton>
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 mt-8 md:mt-0"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm text-sm text-muted-foreground text-center">
              <Wand2 className="h-4 w-4 text-primary shrink-0" />
              AI-Powered Resume Building Tool
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6"
          >
            <FlipWords words={words} className="text-primary" />
            <br />
            Your Resume with AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            The complete AI toolkit for building ATS-optimized resumes, tailoring for any job,
            and preparing for interviews. Everything you need in one powerful platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/editor">
              <Button size="lg" className="text-lg px-8 py-6 group">
                Open Resume Editor
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/analysis">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Analyze My Resume
              </Button>
            </Link>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {[
              { icon: Zap, label: "Instant ATS Analysis" },
              { icon: Target, label: "Job-Specific Tailoring" },
              { icon: Shield, label: "Interview Preparation" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-sm text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Complete Resume Toolkit
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Seven powerful AI tools to create, optimize, and perfect your resume for any opportunity.
            </p>
          </motion.div>

          <HoverEffect items={features.map(f => ({
            title: f.title,
            description: f.description,
            icon: f.icon
          }))} />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to create a job-winning resume.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <CardSpotlight className="h-full">
                  <div className="text-5xl font-bold text-primary/20 mb-4">{step.number}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardSpotlight>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <LampContainer>
        <motion.h2
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-8 bg-gradient-to-br from-foreground to-muted-foreground py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >
          Ready to Build Your <br /> Perfect Resume?
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link to="/editor">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Building Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </LampContainer>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center">
              <img src="/logo.svg" alt="CareerPro Logo" className="h-8 w-8" />
            </div>
            <span className="font-semibold text-foreground">CareerPro</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/editor" className="hover:text-foreground transition-colors">
              Resume Editor
            </Link>
            <Link to="/analysis" className="hover:text-foreground transition-colors">
              ATS Analysis
            </Link>
            <Link to="/interview" className="hover:text-foreground transition-colors">
              Interview Coach
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 CareerPro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
