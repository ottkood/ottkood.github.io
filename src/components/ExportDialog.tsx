import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy } from "lucide-react";
import type { Phone } from "@/types/phone";

interface Props {
  open: boolean;
  onClose: () => void;
  phones: Phone[];
}

function generateHTML(phones: Phone[]): string {
  const items = phones
    .map(
      (p, i) => {
        const titleHTML = p.link
          ? `<a href="${p.link}" style="color:#000;text-decoration:none;font-weight:700;" target="_blank" rel="noopener noreferrer">${p.name}</a>`
          : p.name;

        return `<div style="display:flex;gap:16px;align-items:flex-start;padding:16px 0;border-bottom:1px solid #e5e7eb;">
  <div style="background:#37a4b6;color:#fff;font-weight:700;font-size:14px;width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${i + 1}</div>${
          p.imageUrl
            ? `\n  <img src="${p.imageUrl}" alt="${p.name}" style="width:100px;height:100px;object-fit:contain;border-radius:8px;flex-shrink:0;" />`
            : ""
        }
  <div>
    <h3 style="margin:0 0 4px;font-size:20px;font-weight:700;line-height:1.3;">${titleHTML}</h3>${p.price ? `\n    <p style="margin:0 0 4px;color:#37a4b6;font-weight:600;font-size:15px;">${p.price}</p>` : ""}${
          p.description ? `\n    <p style="margin:0;color:#6b7280;font-size:15px;line-height:1.6;">${p.description}</p>` : ""
        }
  </div>
</div>`;
      }
    )
    .join("\n\n");

  return `<div style="font-family:Georgia,'Times New Roman',serif;max-width:720px;margin:0 auto;">\n\n${items}\n\n</div>`;
}

export default function ExportDialog({ open, onClose, phones }: Props) {
  const [copied, setCopied] = useState(false);
  const html = generateHTML(phones);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>HTML eksport</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">Kopeeri see HTML kood ja kleebi WordPressi artiklisse.</p>
        <Textarea value={html} readOnly rows={14} className="font-mono text-xs flex-1 min-h-0" />
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Sulge</Button>
          <Button onClick={handleCopy} className="btn-export border-0">
            {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
            {copied ? "Kopeeritud!" : "Kopeeri"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
