import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Target,
  Sparkles,
  BarChart3,
  Flame,
  MessageSquare,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/aceternity/spotlight";
import { FlipWords } from "@/components/ui/aceternity/flip-words";
import { BentoGrid, BentoGridItem } from "@/components/ui/aceternity/bento-grid";
import { InfiniteMovingCards } from "@/components/ui/aceternity/infinite-moving-cards";
import { LampContainer } from "@/components/ui/aceternity/lamp";
import { CardSpotlight } from "@/components/ui/aceternity/card-spotlight";
import { MovingBorderButton } from "@/components/ui/aceternity/moving-border";
import { SparklesCore } from "@/components/ui/aceternity/sparkles";
import { BackgroundBeams } from "@/components/ui/aceternity/background-beams";

const features = [
  {
    title: "Resume Editor",
    description:
      "Create stunning, ATS-optimized resumes with our intuitive drag-and-drop editor. Multiple templates, real-time preview, and PDF export.",
    icon: <FileText className="h-6 w-6 text-primary" />,
    className: "md:col-span-2",
    header: (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
    ),
  },
  {
    title: "Job Tailoring",
    description:
      "Paste any job description and get personalized suggestions to tailor your resume for maximum impact.",
    icon: <Target className="h-6 w-6 text-primary" />,
    className: "md:col-span-1",
    header: (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-secondary/20 via-secondary/5 to-transparent" />
    ),
  },
  {
    title: "Achievement Transformer",
    description:
      "Transform bland bullet points into powerful, quantified achievements that grab attention.",
    icon: <Sparkles className="h-6 w-6 text-primary" />,
    className: "md:col-span-1",
    header: (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-muted/30 via-muted/10 to-transparent" />
    ),
  },
  {
    title: "ATS Analysis",
    description:
      "Get instant feedback on your resume's ATS compatibility score and actionable recommendations.",
    icon: <BarChart3 className="h-6 w-6 text-primary" />,
    className: "md:col-span-2",
    header: (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/15 via-secondary/10 to-transparent" />
    ),
  },
  {
    title: "Recruiter Heatmap",
    description:
      "See exactly where recruiters focus their attention on your resume with AI-powered eye-tracking simulation.",
    icon: <Flame className="h-6 w-6 text-primary" />,
    className: "md:col-span-1",
    header: (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-destructive/10 via-destructive/5 to-transparent" />
    ),
  },
  {
    title: "Interview Coach",
    description:
      "Practice with AI-generated interview questions tailored to your target role and experience.",
    icon: <MessageSquare className="h-6 w-6 text-primary" />,
    className: "md:col-span-1",
    header: (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-secondary/15 via-muted/10 to-transparent" />
    ),
  },
  {
    title: "Salary Negotiation",
    description:
      "Get data-driven salary insights and negotiation scripts to maximize your compensation.",
    icon: <DollarSign className="h-6 w-6 text-primary" />,
    className: "md:col-span-1",
    header: (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/10 via-muted/5 to-transparent" />
    ),
  },
];

const testimonials = [
  {
    quote:
      "This tool helped me land my dream job at Google. The ATS optimization alone is worth its weight in gold!",
    name: "Sarah Chen",
    title: "Software Engineer at Google",
  },
  {
    quote:
      "I went from getting zero callbacks to 5 interviews in my first week. The job tailoring feature is a game-changer.",
    name: "Michael Roberts",
    title: "Product Manager at Meta",
  },
  {
    quote:
      "The achievement transformer took my boring resume and made it pop. Recruiters now actually read my applications!",
    name: "Emily Watson",
    title: "Marketing Director at Stripe",
  },
  {
    quote:
      "Finally, a resume tool that actually understands what ATS systems want. My application success rate tripled.",
    name: "David Park",
    title: "Data Scientist at Netflix",
  },
  {
    quote:
      "The interview coach prepared me for questions I never would have thought of. Landed a 40% salary increase!",
    name: "Jessica Martinez",
    title: "Senior Designer at Apple",
  },
];

const steps = [
  {
    number: "01",
    title: "Upload or Create",
    description: "Start with your existing resume or build one from scratch with our templates.",
  },
  {
    number: "02",
    title: "Optimize & Tailor",
    description: "Let AI analyze and enhance your resume for your target role.",
  },
  {
    number: "03",
    title: "Practice & Prepare",
    description: "Use our interview coach and salary tools to prepare for success.",
  },
  {
    number: "04",
    title: "Land Your Dream Job",
    description: "Apply with confidence and watch the interviews roll in.",
  },
];

export default function LandingPage() {
  const words = ["Build", "Perfect", "Tailor", "Transform"];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
        <BackgroundBeams className="absolute inset-0" />
        
        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-6 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">CareerPro</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/editor">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link to="/editor">
              <MovingBorderButton
                borderRadius="0.5rem"
                className="px-4 py-2 text-sm font-medium"
                containerClassName="h-10 w-auto"
              >
                Get Started Free
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
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-primary" />
              Trusted by 10,000+ job seekers worldwide
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
            The all-in-one AI-powered platform to create, optimize, and tailor your resume 
            for any job. Land more interviews and negotiate better offers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/editor">
              <Button size="lg" className="text-lg px-8 py-6 group">
                Start Building for Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/analysis">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Analyze My Resume
              </Button>
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {[
              { value: "10K+", label: "Resumes Created" },
              { value: "95%", label: "ATS Pass Rate" },
              { value: "3x", label: "More Interviews" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
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
              Everything You Need to Land Your Dream Job
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From resume creation to salary negotiation, we've got you covered at every step.
            </p>
          </motion.div>

          <BentoGrid>
            {features.map((feature, i) => (
              <BentoGridItem
                key={i}
                title={feature.title}
                description={feature.description}
                header={feature.header}
                icon={feature.icon}
                className={feature.className}
              />
            ))}
          </BentoGrid>
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
              Your Path to Success
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to transform your job search and career trajectory.
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

      {/* Testimonials Section */}
      <section className="py-24 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12 px-4"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Loved by Job Seekers Everywhere
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of professionals who've transformed their careers with CareerPro.
          </p>
        </motion.div>

        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
        />
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
          Ready to Transform <br /> Your Career?
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link to="/editor">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </LampContainer>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">CareerPro</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/editor" className="hover:text-foreground transition-colors">
              Dashboard
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
