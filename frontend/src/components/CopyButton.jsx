import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button className="btn btn-link copy-btn" onClick={onCopy}>
      {copied ? <Check size={15} /> : <Copy size={15} />}
      <span>{copied ? "Copied!" : label}</span>
    </button>
  );
}
