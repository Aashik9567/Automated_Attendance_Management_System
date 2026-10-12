import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2 } from "lucide-react";
import logo from "../assets/Logo.svg";
import { ThemeToggle } from "../components/dashboard/HeaderMenus";

// Shared shell for sign-in and sign-up, styled like the landing page.
export const AuthLayout = ({ title, subtitle, children, footer }) => {
  const reduce = useReducedMotion();
  return (
    <div className="flex min-h-screen flex-col bg-surface font-sans text-ink antialiased">
      <header className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="focus-ring flex items-center gap-2 rounded-lg">
          <img src={logo} alt="" className="h-7 w-7" />
          <span className="text-[15px] font-semibold tracking-tight">AttendEase</span>
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pb-16 pt-10 sm:items-center sm:pt-0">
        <motion.div
          className="w-full max-w-[400px]"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.6 }}
        >
          <img src={logo} alt="" className="mx-auto h-14 w-14" />
          <h1 className="mt-6 text-center text-[1.75rem] font-semibold leading-tight tracking-[-0.025em]">{title}</h1>
          {subtitle && <p className="mt-2 text-center text-[15px] text-ink-2">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <p className="mt-8 text-center text-[14px] text-ink-2">{footer}</p>}
        </motion.div>
      </main>
    </div>
  );
};

const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-[15px] text-ink placeholder:text-ink-3 transition-[border-color,box-shadow] focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15 aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/15";

// Labeled input that works with react-hook-form's register() (needs the ref).
export const AuthField = forwardRef(({ id, label, error, ...input }, ref) => (
  <div>
    <label htmlFor={id} className="block text-[13px] font-medium text-ink">
      {label}
    </label>
    <input
      ref={ref}
      id={id}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      className={inputClass}
      {...input}
    />
    {error && (
      <p id={`${id}-error`} role="alert" className="mt-1.5 text-[13px] text-danger">
        {error}
      </p>
    )}
  </div>
));
AuthField.displayName = "AuthField";

export const SubmitButton = ({ loading, loadingText, children }) => (
  <button
    type="submit"
    disabled={loading}
    className="focus-ring inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-medium text-canvas transition-[background-color,transform] duration-150 hover:bg-ink/85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
  >
    {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
    {loading ? loadingText : children}
  </button>
);

export const AuthLink = ({ to, children }) => (
  <Link to={to} className="focus-ring rounded font-medium text-brand hover:underline">
    {children}
  </Link>
);
