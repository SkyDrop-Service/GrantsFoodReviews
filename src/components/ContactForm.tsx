import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactForm() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);
        const form = e.currentTarget;
        const formData = new FormData(form);
        // Prefix subject
        const subject = `[FOOD REVIEW] ${formData.get("subject")}`;
        formData.set("subject", subject);
        // Send to Formspree
        const res = await fetch("https://formspree.io/f/xwkzqgqv", {
            method: "POST",
            body: formData,
            headers: {
                Accept: "application/json",
            },
        });
        const result = await res.json();
        setLoading(false);
        if (result.ok) {
            setSuccess(true);
            form.reset();
        } else {
            setError(result.error || "Failed to send message.");
        }
    }

    return (
        <form className="w-full max-w-md mx-auto mt-4 p-4 border rounded-lg bg-card shadow" onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-2 text-center">Contact Me</h2>
            <div className="mb-2">
                <Input name="name" placeholder="Your Name" required />
            </div>
            <div className="mb-2">
                <Input name="email" type="email" placeholder="Your Email" required />
            </div>
            <div className="mb-2">
                <Input name="subject" placeholder="Subject" required />
            </div>
            <div className="mb-2">
                <Textarea name="message" placeholder="Message" required />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Sending..." : "Send"}
            </Button>
            {success && <div className="text-green-600 mt-2 text-center">Message sent!</div>}
            {error && <div className="text-red-600 mt-2 text-center">{error}</div>}
        </form>
    );
}
