import React from 'react';
import clsx from 'clsx';
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

export type AlertType = 'critical' | 'warning' | 'info' | 'success';

interface AlertProps {
  type: AlertType;
  title?: string;
  children: React.ReactNode;
}

const alertStyles: Record<AlertType, { bg: string; border: string; text: string; icon: string }> = {
  critical: {
    bg: 'bg-red-50',
    border: 'border-red-500',
    text: 'text-red-800',
    icon: 'text-red-500',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-500',
    text: 'text-amber-800',
    icon: 'text-amber-500',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-500',
    text: 'text-blue-800',
    icon: 'text-blue-500',
  },
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-500',
    text: 'text-emerald-800',
    icon: 'text-emerald-500',
  },
};

const alertIcons: Record<AlertType, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  critical: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
  success: CheckCircleIcon,
};

export default function Alert({ type, title, children }: AlertProps) {
  const styles = alertStyles[type];
  const Icon = alertIcons[type];

  return (
    <div
      className={clsx(
        'my-6 rounded-lg border-l-4 p-4',
        styles.bg,
        styles.border
      )}
    >
      <div className="flex items-start">
        <Icon className={clsx('h-5 w-5 flex-shrink-0 mt-0.5', styles.icon)} />
        <div className="ml-3">
          {title && (
            <h4 className={clsx('text-sm font-semibold mb-1', styles.text)}>
              {title}
            </h4>
          )}
          <div className={clsx('text-sm', styles.text)}>{children}</div>
        </div>
      </div>
    </div>
  );
}
