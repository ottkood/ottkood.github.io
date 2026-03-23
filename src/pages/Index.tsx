import { useState, useRef } from "react";
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { Plus, FileCode, Smartphone, Save, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import PhoneCard from "@/components/PhoneCard";
import PhoneEditDialog from "@/components/PhoneEditDialog";
import ExportDialog from "@/components/ExportDialog";
import { usePhoneList } from "@/hooks/usePhoneList";
import type { Phone } from "@/types/phone";

export default function Index() {
  const { phones, addPhone, updatePhone, removePhone, reorder, loadPhones, lastSaved } = usePhoneList();
  const [editOpen, setEditOpen] = useState(false);
  const [editPhone, setEditPhone] = useState<Phone | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorder(result.source.index, result.destination.index);
  };

  const handleEdit = (phone: Phone) => {
    setEditPhone(phone);
    setEditOpen(true);
  };

  const handleAdd = () => {
    setEditPhone(null);
    setEditOpen(true);
  };

  const handleSave = (data: Omit<Phone, "id">) => {
    if (editPhone) {
      updatePhone(editPhone.id, data);
    } else {
      addPhone(data);
    }
  };

  const handleExportProject = () => {
    const json = JSON.stringify(phones, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "telefonid.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as Phone[];
        if (Array.isArray(data)) {
          loadPhones(data);
        }
      } catch {
        // invalid file
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-lg border-b">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">Telefonide paremusjärjestus</h1>
              <p className="text-xs text-muted-foreground">
                {phones.length} telefoni{lastSaved && (
                  <span> · <Save className="w-3 h-3 inline -mt-0.5" /> salvestatud {lastSaved.toLocaleTimeString("et-EE", { hour: "2-digit", minute: "2-digit" })}</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} title="Impordi projekt">
              <Upload className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleExportProject} disabled={phones.length === 0} title="Salvesta projekt">
              <Download className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleAdd}>
              <Plus className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Lisa</span>
            </Button>
            <Button size="sm" onClick={() => setExportOpen(true)} disabled={phones.length === 0} className="btn-export border-0">
              <FileCode className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Ekspordi</span>
            </Button>
          </div>
          <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImportProject} />
        </div>
      </header>

      {/* List */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {phones.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h2 className="font-semibold text-lg mb-1">Nimekiri on tühi</h2>
            <p className="text-muted-foreground text-sm mb-4">Lisa esimene telefon, et alustada paremusjärjestuse koostamist.</p>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-1" /> Lisa telefon
            </Button>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="phone-list">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                  {phones.map((phone, index) => (
                    <PhoneCard
                      key={phone.id}
                      phone={phone}
                      index={index}
                      onEdit={() => handleEdit(phone)}
                      onRemove={() => removePhone(phone.id)}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </main>

      {/* Dialogs */}
      <PhoneEditDialog open={editOpen} onClose={() => setEditOpen(false)} onSave={handleSave} initial={editPhone} />
      <ExportDialog open={exportOpen} onClose={() => setExportOpen(false)} phones={phones} />
    </div>
  );
}
