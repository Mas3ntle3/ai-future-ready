import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function AIResult({ title, body }: { title: string; body: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 rounded-3xl border border-primary/20 bg-gradient-to-br from-accent/40 to-card p-6 shadow-soft sm:p-8"
    >
      <h3 className="flex items-center gap-2 font-display text-xl font-bold text-primary">
        <Sparkles className="h-5 w-5" /> {title}
      </h3>
      <div className="prose prose-sm mt-4 max-w-none whitespace-pre-wrap text-foreground">
        {body}
      </div>
    </motion.div>
  );
}
