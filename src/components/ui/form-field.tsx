import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  subLabel?: string;
  required?: boolean;
}

export function FormField({
  label,
  helperText,
  subLabel,
  required,
  className,
  id,
  ...props
}: FormFieldProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-start">
      <div className="pt-2">
        <Label
          htmlFor={id}
          className="text-base font-medium dark:text-slate-200"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {subLabel && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {subLabel}
          </p>
        )}
      </div>
      <div className="space-y-1.5">
        <Input
          id={id}
          className={cn(
            "h-12 border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:border-indigo-500 focus:ring-indigo-500",
            className,
          )}
          {...props}
        />
        {helperText && (
          <p className="text-xs text-slate-500 dark:text-slate-400 px-1 italic">
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
}
