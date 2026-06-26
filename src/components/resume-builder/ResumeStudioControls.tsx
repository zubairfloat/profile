"use client";

import { ArrowDown, ArrowUp, Palette, Plus, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projectLibrary } from "@/lib/resume-studio-generator";
import type { ResumeStore } from "@/types/resume-builder";

const optionalSections = [
  "Languages",
  "Awards",
  "Achievements",
  "References",
  "Volunteer",
  "Open Source",
  "Hackathons",
  "Publications",
  "Research",
  "Talks",
  "Courses",
  "Blogs",
  "Leadership",
  "Interests",
  "Patents",
  "Certifications",
];

const accentColors = ["#2563eb", "#7c3aed", "#059669", "#dc2626", "#ea580c", "#0f172a"];

export function ResumeStudioControls({ store }: { store: ResumeStore }) {
  function updateThemeNumber(key: "borderRadius" | "sidebarWidth" | "paperMargin" | "lineHeight", value: number) {
    if (key === "borderRadius") store.updateTheme({ borderRadius: value });
    if (key === "sidebarWidth") store.updateTheme({ sidebarWidth: value });
    if (key === "paperMargin") store.updateTheme({ paperMargin: value });
    if (key === "lineHeight") store.updateTheme({ lineHeight: value });
  }

  function moveSection(index: number, direction: -1 | 1) {
    const next = [...store.sectionOrder];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    store.setSectionOrder(next);
  }

  function addProjectFromLibrary(project: (typeof projectLibrary)[number]) {
    store.loadResume({
      ...store,
      projects: [
        ...store.projects,
        {
          id: `library-${Date.now()}`,
          name: project.name,
          role: "Lead Contributor",
          techStack: project.technologies,
          url: "",
          description: `${project.description} Architecture: ${project.architecture}`,
          achievements: `${project.responsibilities}\n${project.impact}\n${project.businessValue}`,
        },
      ],
    });
  }

  return (
    <div className="rounded-lg border border-white/10 bg-card/45 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="mb-5 flex items-center gap-3">
        <Palette className="h-5 w-5 text-primary" />
        <div>
          <h2 className="text-xl font-bold">Builder Controls</h2>
          <p className="text-sm text-muted-foreground">Customize design, sections, and AI content.</p>
        </div>
      </div>

      <Tabs defaultValue="theme" className="space-y-4">
        <TabsList className="grid h-auto grid-cols-2 gap-2 rounded-lg border border-white/10 bg-background/55 p-2">
          <TabsTrigger value="inline" className="min-h-10 border border-white/10 data-[state=active]:bg-primary/20">Inline</TabsTrigger>
          <TabsTrigger value="theme" className="min-h-10 border border-white/10 data-[state=active]:bg-primary/20">Theme</TabsTrigger>
          <TabsTrigger value="sections" className="min-h-10 border border-white/10 data-[state=active]:bg-primary/20">Sections</TabsTrigger>
          <TabsTrigger value="library" className="min-h-10 border border-white/10 data-[state=active]:bg-primary/20">Projects</TabsTrigger>
          <TabsTrigger value="ai" className="min-h-10 border border-white/10 data-[state=active]:bg-primary/20">AI</TabsTrigger>
        </TabsList>

        <TabsContent value="inline" className="space-y-3">
          <label className="space-y-2 text-sm">
            Name
            <input value={store.personalInfo.fullName} onChange={(event) => store.updatePersonalInfo({ fullName: event.target.value })} className="w-full rounded-md border border-white/10 bg-background/60 p-2" />
          </label>
          <label className="space-y-2 text-sm">
            Title
            <input value={store.personalInfo.jobTitle} onChange={(event) => store.updatePersonalInfo({ jobTitle: event.target.value })} className="w-full rounded-md border border-white/10 bg-background/60 p-2" />
          </label>
          <label className="space-y-2 text-sm">
            Summary
            <textarea value={store.summary} onChange={(event) => store.updateSummary(event.target.value)} className="min-h-28 w-full rounded-md border border-white/10 bg-background/60 p-2" />
          </label>
          {store.skills[0] && (
            <label className="space-y-2 text-sm">
              Primary Skills
              <input
                value={store.skills[0].skills.join(", ")}
                onChange={(event) =>
                  store.updateSkills(store.skills[0].id, {
                    skills: event.target.value.split(",").map((skill) => skill.trim()).filter(Boolean),
                  })
                }
                className="w-full rounded-md border border-white/10 bg-background/60 p-2"
              />
            </label>
          )}
        </TabsContent>

        <TabsContent value="theme" className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-semibold">Accent Color</p>
            <div className="flex flex-wrap gap-2">
              {accentColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => store.updateTheme({ accentColor: color })}
                  className="h-8 w-8 rounded-full border border-white/20"
                  style={{ backgroundColor: color }}
                  aria-label={color}
                />
              ))}
            </div>
          </div>
          <div className="grid gap-3">
            <label className="space-y-2 text-sm">
              Font Family
              <select className="w-full rounded-md border border-white/10 bg-background/60 p-2" value={store.theme.fontFamily} onChange={(event) => store.updateTheme({ fontFamily: event.target.value as typeof store.theme.fontFamily })}>
                {["Inter", "Arial", "Georgia", "System"].map((font) => <option key={font}>{font}</option>)}
              </select>
            </label>
            <label className="space-y-2 text-sm">
              Header Style
              <select className="w-full rounded-md border border-white/10 bg-background/60 p-2" value={store.theme.headerStyle} onChange={(event) => store.updateTheme({ headerStyle: event.target.value as typeof store.theme.headerStyle })}>
                {["classic", "centered", "sidebar", "executive"].map((style) => <option key={style}>{style}</option>)}
              </select>
            </label>
            {[
              ["Border Radius", "borderRadius", 0, 18],
              ["Sidebar Width", "sidebarWidth", 24, 42],
              ["Paper Margin", "paperMargin", 20, 48],
              ["Line Height", "lineHeight", 1.25, 1.75],
            ].map(([label, key, min, max]) => (
              <label key={key as string} className="space-y-2 text-sm">
                {label}
                <input
                  type="range"
                  min={min as number}
                  max={max as number}
                  step={key === "lineHeight" ? 0.05 : 1}
                  value={store.theme[key as keyof typeof store.theme] as number}
                  onChange={(event) => updateThemeNumber(key as "borderRadius" | "sidebarWidth" | "paperMargin" | "lineHeight", Number(event.target.value))}
                  className="w-full"
                />
              </label>
            ))}
            <label className="flex items-center justify-between rounded-md border border-white/10 bg-background/50 p-3 text-sm">
              Icons
              <Switch checked={store.theme.showIcons} onCheckedChange={(checked) => store.updateTheme({ showIcons: checked })} />
            </label>
          </div>
        </TabsContent>

        <TabsContent value="sections" className="space-y-4">
          <div className="space-y-2">
            {store.sectionOrder.map((section, index) => (
              <div key={`${section}-${index}`} className="flex items-center justify-between rounded-md border border-white/10 bg-background/50 p-3 text-sm">
                <span>{section.replace("extra:", "")}</span>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => moveSection(index, -1)}><ArrowUp className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => moveSection(index, 1)}><ArrowDown className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {optionalSections.map((section) => (
              <Button key={section} type="button" variant="outline" size="sm" className="rounded-full border-white/10" onClick={() => store.addExtraSection(section)}>
                <Plus className="mr-1 h-3.5 w-3.5" />
                {section}
              </Button>
            ))}
          </div>
          {store.extraSections.map((section) => (
            <div key={section.id} className="rounded-md border border-white/10 bg-background/50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <input value={section.title} onChange={(event) => store.updateExtraSection(section.id, { title: event.target.value })} className="w-full bg-transparent font-semibold outline-none" />
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => store.removeExtraSection(section.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
              <textarea value={section.content} onChange={(event) => store.updateExtraSection(section.id, { content: event.target.value })} className="min-h-20 w-full rounded-md border border-white/10 bg-background/60 p-2 text-sm" />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="library" className="max-h-[520px] space-y-3 overflow-auto pr-1">
          {projectLibrary.map((project) => (
            <button key={project.id} type="button" onClick={() => addProjectFromLibrary(project)} className="w-full rounded-md border border-white/10 bg-background/50 p-3 text-left transition-colors hover:border-primary/40">
              <p className="font-semibold">{project.name}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{project.description}</p>
              <p className="mt-2 text-xs font-semibold text-primary">{project.technologies}</p>
            </button>
          ))}
        </TabsContent>

        <TabsContent value="ai" className="space-y-3">
          {["Improve Writing", "ATS Optimize", "Rewrite", "Make More Professional", "Add Metrics", "Make Concise", "Google Style", "Microsoft Style", "Amazon Style"].map((action) => (
            <Button key={action} variant="outline" className="w-full justify-start rounded-md border-white/10">
              <Sparkles className="mr-2 h-4 w-4" />
              {action}
            </Button>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
