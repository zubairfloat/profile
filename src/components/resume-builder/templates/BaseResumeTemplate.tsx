import type { ReactNode } from "react";
import type { ResumeData } from "@/types/resume-builder";
import { cn } from "@/lib/utils";

type BaseResumeTemplateProps = {
  resume: ResumeData;
  variant: "modern" | "ats" | "minimal" | "senior" | "consultant";
};

function splitLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="break-inside-avoid">
      <h2 className="mb-2 border-b border-slate-300 pb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-700">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function BaseResumeTemplate({ resume, variant }: BaseResumeTemplateProps) {
  const { personalInfo } = resume;
  const fontFamily = resume.theme.fontFamily === "System" ? "system-ui, sans-serif" : resume.theme.fontFamily;
  const hasContact = [personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin, personalInfo.github, personalInfo.portfolio].some(Boolean);
  const hasSkills = resume.skills.some((category) => category.skills.length > 0);
  const hasCertifications = resume.certifications.some((certification) => certification.name || certification.issuer);
  const isTwoColumn = variant === "modern";

  const content = (
    <>
      {resume.summary && (
        <ResumeSection title={variant === "senior" ? "Leadership Summary" : "Professional Summary"}>
          <p className="text-[12px] leading-5 text-slate-700">{resume.summary}</p>
        </ResumeSection>
      )}

      {hasSkills && (
        <ResumeSection title="Skills">
          <div className="space-y-2">
            {resume.skills
              .filter((category) => category.skills.length > 0)
              .map((category) => (
                <p key={category.id} className="text-[12px] leading-5 text-slate-700">
                  <span className="font-bold text-slate-900">{category.name}:</span> {category.skills.join(", ")}
                </p>
              ))}
          </div>
        </ResumeSection>
      )}

      {resume.experience.length > 0 && (
        <ResumeSection title={variant === "consultant" ? "Enterprise Delivery Experience" : "Work Experience"}>
          <div className="space-y-4">
            {resume.experience.map((entry) => (
              <article key={entry.id} className="break-inside-avoid">
                <div className="flex flex-col justify-between gap-1 sm:flex-row">
                  <div>
                    <h3 className="text-[13px] font-bold text-slate-950">{entry.jobTitle || "Job Title"}</h3>
                    <p className="text-[12px] font-semibold text-slate-700">
                      {entry.company || "Company"}{entry.location ? ` · ${entry.location}` : ""}
                    </p>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-500">
                    {[entry.startDate, entry.currentlyWorking ? "Present" : entry.endDate].filter(Boolean).join(" - ")}
                  </p>
                </div>
                {splitLines(entry.description).length > 0 && (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[12px] leading-5 text-slate-700">
                    {splitLines(entry.description).map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </ResumeSection>
      )}

      {resume.projects.length > 0 && (
        <ResumeSection title={variant === "senior" ? "Architecture Projects" : "Projects"}>
          <div className="space-y-4">
            {resume.projects.map((project) => (
              <article key={project.id} className="break-inside-avoid">
                <div className="flex flex-col justify-between gap-1 sm:flex-row">
                  <h3 className="text-[13px] font-bold text-slate-950">{project.name || "Project Name"}</h3>
                  <p className="text-[11px] font-semibold text-slate-500">{project.role}</p>
                </div>
                {project.techStack && <p className="text-[11px] font-semibold text-slate-600">{project.techStack}</p>}
                {project.description && <p className="mt-1 text-[12px] leading-5 text-slate-700">{project.description}</p>}
                {project.achievements && (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[12px] leading-5 text-slate-700">
                    {splitLines(project.achievements).map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </ResumeSection>
      )}

      {resume.education.length > 0 && (
        <ResumeSection title="Education">
          <div className="space-y-3">
            {resume.education.map((entry) => (
              <article key={entry.id}>
                <h3 className="text-[13px] font-bold text-slate-950">{entry.institution || "Institution"}</h3>
                <p className="text-[12px] leading-5 text-slate-700">
                  {[entry.degree, entry.fieldOfStudy].filter(Boolean).join(", ")}
                  {[entry.startYear, entry.endYear].some(Boolean) ? ` · ${[entry.startYear, entry.endYear].filter(Boolean).join(" - ")}` : ""}
                  {entry.grade ? ` · ${entry.grade}` : ""}
                </p>
              </article>
            ))}
          </div>
        </ResumeSection>
      )}

      {hasCertifications && (
        <ResumeSection title="Certifications">
          <div className="space-y-2">
            {resume.certifications
              .filter((certification) => certification.name || certification.issuer)
              .map((certification) => (
                <p key={certification.id} className="text-[12px] leading-5 text-slate-700">
                  <span className="font-bold text-slate-900">{certification.name}</span>
                  {certification.issuer ? ` · ${certification.issuer}` : ""}
                  {certification.year ? ` · ${certification.year}` : ""}
                </p>
              ))}
          </div>
        </ResumeSection>
      )}
    </>
  );

  function renderSection(section: string) {
    if (section === "summary" && resume.summary) {
      return (
        <ResumeSection key={section} title={variant === "senior" ? "Leadership Summary" : "Professional Summary"}>
          <p className="text-[12px] leading-5 text-slate-700">{resume.summary}</p>
        </ResumeSection>
      );
    }

    if (section === "skills" && hasSkills) {
      return (
        <ResumeSection key={section} title="Skills">
          <div className="space-y-2">
            {resume.skills
              .filter((category) => category.skills.length > 0)
              .map((category) => (
                <p key={category.id} className="text-[12px] leading-5 text-slate-700">
                  <span className="font-bold text-slate-900">{category.name}:</span> {category.skills.join(", ")}
                </p>
              ))}
          </div>
        </ResumeSection>
      );
    }

    if (section === "experience" && resume.experience.length > 0) {
      return (
        <ResumeSection key={section} title={variant === "consultant" ? "Enterprise Delivery Experience" : "Work Experience"}>
          <div className="space-y-4">
            {resume.experience.map((entry) => (
              <article key={entry.id} className="break-inside-avoid">
                <h3 className="text-[13px] font-bold text-slate-950">{entry.jobTitle || "Job Title"}</h3>
                <p className="text-[12px] font-semibold text-slate-700">
                  {entry.company || "Company"}{entry.location ? ` · ${entry.location}` : ""}
                </p>
                {splitLines(entry.description).length > 0 && (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[12px] leading-5 text-slate-700">
                    {splitLines(entry.description).map((line) => <li key={line}>{line}</li>)}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </ResumeSection>
      );
    }

    if (section === "projects" && resume.projects.length > 0) {
      return (
        <ResumeSection key={section} title={variant === "senior" ? "Architecture Projects" : "Projects"}>
          <div className="space-y-4">
            {resume.projects.map((project) => (
              <article key={project.id} className="break-inside-avoid">
                <h3 className="text-[13px] font-bold text-slate-950">{project.name || "Project Name"}</h3>
                {project.techStack && <p className="text-[11px] font-semibold text-slate-600">{project.techStack}</p>}
                {project.description && <p className="mt-1 text-[12px] leading-5 text-slate-700">{project.description}</p>}
                {project.achievements && (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[12px] leading-5 text-slate-700">
                    {splitLines(project.achievements).map((line) => <li key={line}>{line}</li>)}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </ResumeSection>
      );
    }

    if (section === "education" && resume.education.length > 0) {
      return (
        <ResumeSection key={section} title="Education">
          <div className="space-y-3">
            {resume.education.map((entry) => (
              <article key={entry.id}>
                <h3 className="text-[13px] font-bold text-slate-950">{entry.institution || "Institution"}</h3>
                <p className="text-[12px] leading-5 text-slate-700">{[entry.degree, entry.fieldOfStudy].filter(Boolean).join(", ")}</p>
              </article>
            ))}
          </div>
        </ResumeSection>
      );
    }

    if (section === "certifications" && hasCertifications) {
      return (
        <ResumeSection key={section} title="Certifications">
          <div className="space-y-2">
            {resume.certifications
              .filter((certification) => certification.name || certification.issuer)
              .map((certification) => (
                <p key={certification.id} className="text-[12px] leading-5 text-slate-700">
                  <span className="font-bold text-slate-900">{certification.name}</span>
                  {certification.issuer ? ` · ${certification.issuer}` : ""}
                  {certification.year ? ` · ${certification.year}` : ""}
                </p>
              ))}
          </div>
        </ResumeSection>
      );
    }

    if (section.startsWith("extra:")) {
      const title = section.replace("extra:", "");
      const extra = resume.extraSections.find((item) => item.title === title);
      if (!extra) return null;
      return (
        <ResumeSection key={extra.id} title={extra.title}>
          <p className="text-[12px] leading-5 text-slate-700">{extra.content}</p>
        </ResumeSection>
      );
    }

    return null;
  }

  return (
    <div
      className={cn(
        "resume-preview min-h-[1120px] w-full bg-white p-8 text-slate-950 shadow-2xl shadow-black/20",
        variant === "minimal" && "p-10",
        variant === "consultant" && "border-t-8 border-slate-900",
        variant === "senior" && "border-l-8 border-slate-900",
      )}
      style={{
        borderRadius: resume.theme.borderRadius,
        padding: resume.theme.paperMargin,
        fontFamily,
        lineHeight: resume.theme.lineHeight,
      }}
    >
      <header className={cn("mb-6", (variant === "minimal" || resume.theme.headerStyle === "centered") && "text-center")}>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950" style={{ color: resume.theme.headerStyle === "executive" ? resume.theme.accentColor : undefined }}>
          {personalInfo.fullName || "Your Name"}
        </h1>
        <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-slate-600" style={{ color: resume.theme.accentColor }}>
          {personalInfo.jobTitle || "Professional Title"}
        </p>
        {hasContact && (
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-600">
            {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin, personalInfo.github, personalInfo.portfolio]
              .filter(Boolean)
              .map((item) => (
                <span key={item}>{item}</span>
              ))}
          </div>
        )}
      </header>

      {isTwoColumn ? (
        <div className="grid grid-cols-[0.34fr_0.66fr] gap-8">
          <aside className="space-y-5" style={{ width: `${resume.theme.sidebarWidth}%` }}>
            {hasSkills && (
              <ResumeSection title="Skills">
                <div className="space-y-3">
                  {resume.skills
                    .filter((category) => category.skills.length > 0)
                    .map((category) => (
                      <div key={category.id}>
                        <p className="text-[12px] font-bold text-slate-900">{category.name}</p>
                        <p className="text-[12px] leading-5 text-slate-700">{category.skills.join(", ")}</p>
                      </div>
                    ))}
                </div>
              </ResumeSection>
            )}
            {resume.education.length > 0 && (
              <ResumeSection title="Education">
                <div className="space-y-3">
                  {resume.education.map((entry) => (
                    <div key={entry.id}>
                      <p className="text-[12px] font-bold text-slate-900">{entry.institution}</p>
                      <p className="text-[12px] leading-5 text-slate-700">{[entry.degree, entry.fieldOfStudy].filter(Boolean).join(", ")}</p>
                    </div>
                  ))}
                </div>
              </ResumeSection>
            )}
            {hasCertifications && (
              <ResumeSection title="Certifications">
                {resume.certifications.map((certification) => (
                  <p key={certification.id} className="text-[12px] leading-5 text-slate-700">
                    {certification.name}
                  </p>
                ))}
              </ResumeSection>
            )}
          </aside>
          <main className="space-y-5">
            {resume.summary && (
              <ResumeSection title="Professional Summary">
                <p className="text-[12px] leading-5 text-slate-700">{resume.summary}</p>
              </ResumeSection>
            )}
            {resume.experience.length > 0 && (
              <ResumeSection title="Work Experience">
                <div className="space-y-4">
                  {resume.experience.map((entry) => (
                    <article key={entry.id}>
                      <h3 className="text-[13px] font-bold text-slate-950">{entry.jobTitle}</h3>
                      <p className="text-[12px] font-semibold text-slate-700">{entry.company}</p>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-[12px] leading-5 text-slate-700">
                        {splitLines(entry.description).map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </ResumeSection>
            )}
            {resume.projects.length > 0 && (
              <ResumeSection title="Projects">
                <div className="space-y-4">
                  {resume.projects.map((project) => (
                    <article key={project.id}>
                      <h3 className="text-[13px] font-bold text-slate-950">{project.name}</h3>
                      <p className="text-[12px] text-slate-700">{project.description}</p>
                    </article>
                  ))}
                </div>
              </ResumeSection>
            )}
            {resume.extraSections.map((section) => (
              <ResumeSection key={section.id} title={section.title}>
                <p className="text-[12px] leading-5 text-slate-700">{section.content}</p>
              </ResumeSection>
            ))}
          </main>
        </div>
      ) : (
        <main className="space-y-5">
          {(resume.sectionOrder.length > 0 ? resume.sectionOrder : ["summary", "skills", "experience", "projects", "education", "certifications"]).map(renderSection)}
        </main>
      )}
    </div>
  );
}
