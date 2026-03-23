import { Draggable } from "@hello-pangea/dnd";
import { GripVertical, Pencil, Trash2, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Phone } from "@/types/phone";

interface Props {
  phone: Phone;
  index: number;
  onEdit: () => void;
  onRemove: () => void;
}

export default function PhoneCard({ phone, index, onEdit, onRemove }: Props) {
  const titleEl = phone.link ? (
    <a href={phone.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-sm sm:text-base leading-snug truncate hover:underline text-foreground">
      {phone.name}
    </a>
  ) : (
    <h3 className="font-semibold text-sm sm:text-base leading-snug truncate">{phone.name}</h3>
  );

  return (
    <Draggable draggableId={phone.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`drag-card ${snapshot.isDragging ? "drag-card-dragging" : ""} flex items-start gap-3 sm:gap-4 p-3 sm:p-4`}
        >
          <div {...provided.dragHandleProps} className="pt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors">
            <GripVertical className="w-5 h-5" />
          </div>

          <div className="rank-badge mt-0.5">{index + 1}</div>

          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-muted border flex items-center justify-center shrink-0 overflow-hidden">
            {phone.imageUrl ? (
              <img src={phone.imageUrl} alt={phone.name} className="w-full h-full object-contain" />
            ) : (
              <ImageOff className="w-6 h-6 text-muted-foreground/40" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            {titleEl}
            {phone.price && <p className="text-primary font-semibold text-sm mt-0.5">{phone.price}</p>}
            {phone.description && (
              <p className="text-muted-foreground text-xs sm:text-sm mt-1 line-clamp-2 leading-relaxed">{phone.description}</p>
            )}
          </div>

          <div className="flex flex-col gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={onEdit}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={onRemove}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </Draggable>
  );
}
