import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImagePlus, Link, Upload } from "lucide-react";
import type { Phone } from "@/types/phone";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Phone, "id">) => void;
  initial?: Phone | null;
}

export default function PhoneEditDialog({ open, onClose, onSave, initial }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");
  const [imageMode, setImageMode] = useState<"url" | "file">("url");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setDescription(initial?.description ?? "");
      setPrice(initial?.price ?? "");
      setImageUrl(initial?.imageUrl ?? "");
      setLink(initial?.link ?? "");
      setImageMode("url");
    }
  }, [open, initial]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), description: description.trim(), price: price.trim(), imageUrl: imageUrl.trim(), link: link.trim() });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Muuda telefoni" : "Lisa uus telefon"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="phone-name">Nimi *</Label>
            <Input id="phone-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="nt Samsung Galaxy S25 Ultra" />
          </div>
          <div>
            <Label htmlFor="phone-price">Hind</Label>
            <Input id="phone-price" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="nt 1499 €" />
          </div>
          <div>
            <Label htmlFor="phone-link">Arvustuse link</Label>
            <Input id="phone-link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://digigeenius.ee/arvustus/..." />
          </div>
          <div>
            <Label htmlFor="phone-desc">Kirjeldus</Label>
            <Textarea id="phone-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Lühike kirjeldus telefoni kohta…" />
          </div>
          <div>
            <Label>Pilt</Label>
            <div className="flex gap-2 mb-2">
              <Button type="button" size="sm" variant={imageMode === "url" ? "default" : "outline"} onClick={() => setImageMode("url")}>
                <Link className="w-4 h-4 mr-1" /> URL
              </Button>
              <Button type="button" size="sm" variant={imageMode === "file" ? "default" : "outline"} onClick={() => setImageMode("file")}>
                <Upload className="w-4 h-4 mr-1" /> Fail
              </Button>
            </div>
            {imageMode === "url" ? (
              <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/phone.jpg" />
            ) : (
              <Input ref={fileRef} type="file" accept="image/*" onChange={handleFile} />
            )}
            {imageUrl && (
              <div className="mt-2 rounded-lg overflow-hidden border bg-muted w-24 h-24 flex items-center justify-center">
                <img src={imageUrl} alt="Eelvaade" className="max-w-full max-h-full object-contain" />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Tühista</Button>
            <Button type="submit" disabled={!name.trim()}>
              <ImagePlus className="w-4 h-4 mr-1" />
              {initial ? "Salvesta" : "Lisa"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
