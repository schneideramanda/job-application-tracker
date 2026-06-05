import { AwardIcon, CalendarIcon, CheckCircle2Icon, MicIcon, XCircleIcon } from 'lucide-react';
import { ReactNode } from 'react';

export interface ColConfig {
  color: string;
  icon: ReactNode;
}

export const COLUMN_CONFIG: Array<ColConfig> = [
  {
    color: 'bg-cyan-500',
    icon: <CalendarIcon className="h-4 w-4" />,
  },
  {
    color: 'bg-purple-500',
    icon: <CheckCircle2Icon className="h-4 w-4" />,
  },
  {
    color: 'bg-green-500',
    icon: <MicIcon className="h-4 w-4" />,
  },
  {
    color: 'bg-yellow-500',
    icon: <AwardIcon className="h-4 w-4" />,
  },
  {
    color: 'bg-red-500',
    icon: <XCircleIcon className="h-4 w-4" />,
  },
];
