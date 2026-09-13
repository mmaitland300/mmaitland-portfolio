import type { Metadata } from "next";
import { MainContentAnchor } from "@/components/layout/main-content-anchor";
import { ContactForm } from "@/components/sections/contact-form";
import { Mail, MapPin } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { getPublicContactEmail } from "@/lib/site-contact";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "Contact",
  description:
    "Reach out about a web project, a technical question, the music, or anything else. Open to work conversations and happy to hear from anyone.",
};

export default function ContactPage() {
  const publicEmail = getPublicContactEmail();
  return (
    <div className="py-32">
      <MainContentAnchor />
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeader
          eyebrow="Contact"
          title="Get in Touch"
          description="Whether it's a web project, a technical problem, something about the music, or just a question: send a message and I'll get back to you."
          className="mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info */}
          <div className="space-y-6 lg:col-span-1">
            <div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {
                  "I'm open to web projects: full-stack builds, fixing or improving existing sites, or just talking through an idea. If you're thinking about a role or collaboration, I'm happy to hear it."
                }
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-brand-violet/10 shrink-0">
                <Mail className="h-5 w-5 text-brand-violet" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Email</h3>
                <p className="text-sm text-muted-foreground">{publicEmail}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-brand-cyan/10 shrink-0">
                <MapPin className="h-5 w-5 text-brand-cyan" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Location</h3>
                <p className="text-sm text-muted-foreground">
                  Colorado, USA
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
