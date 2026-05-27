import { BriefcaseIcon, CheckCircle2Icon, LucideIcon, TrendingUpIcon } from 'lucide-react';

type Feature = {
  key: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export default function Features() {
  const features: Feature[] = [
    {
      key: 'organize',
      title: 'Organize Applications',
      description:
        'Create custom boards and columns to track your job applications at every stage of the process.',
      icon: BriefcaseIcon,
    },
    {
      key: 'progress',
      title: 'Track Progress',
      description:
        'Monitor your application status from applied to interview to offer with visual Kanban boards.',
      icon: TrendingUpIcon,
    },
    {
      key: 'track',
      title: 'Stay Organized',
      description:
        'Never lose track of an application. Keep all your job search information in one centralized place.',
      icon: CheckCircle2Icon,
    },
  ];

  return (
    <section className="border-t border-border py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-3">
          {features.map(({ key, title, description, icon: Icon }) => (
            <div key={key} className="flex flex-col">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-3 text-2xl font-semibold">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
