import { useState } from "react";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface ContactFormProps {
  /** Prepended to the message so the admin can tell requests apart. */
  subjectTag?: string;
  submitLabel?: string;
  messagePlaceholder?: string;
}

const ContactForm = ({ subjectTag, submitLabel = "Надіслати", messagePlaceholder = "Ваше повідомлення…" }: ContactFormProps) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      message: [subjectTag ? `[${subjectTag}]` : "", form.message].filter(Boolean).join(" ") || null,
    });
    setSending(false);
    if (error) {
      toast({ variant: "destructive", title: "Помилка", description: "Не вдалося надіслати. Спробуйте ще раз." });
      return;
    }
    setSent(true);
    setForm({ name: "", email: "", phone: "", message: "" });
    toast({ title: "Надіслано", description: "Ми зв'яжемося з вами найближчим часом." });
    setTimeout(() => setSent(false), 3000);
  };

  const field =
    "w-full rounded-xl border border-border bg-input px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="Ім'я" value={form.name} onChange={change} className={field} />
        <input name="phone" placeholder="Телефон" value={form.phone} onChange={change} className={field} />
      </div>
      <input name="email" type="email" required placeholder="Email" value={form.email} onChange={change} className={field} />
      <textarea name="message" required rows={4} placeholder={messagePlaceholder} value={form.message} onChange={change} className={`${field} resize-none`} />
      <button
        type="submit"
        disabled={sending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-bold text-primary-foreground disabled:opacity-60"
      >
        {sent ? "Надіслано ✓" : sending ? "Надсилається…" : (<><Send className="h-4 w-4" /> {submitLabel}</>)}
      </button>
    </form>
  );
};

export default ContactForm;
