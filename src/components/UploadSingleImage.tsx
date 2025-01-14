import { cn } from "@/lib/utils";
import { User2 } from "lucide-react";
import Image from "next/image";
import {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";

interface UploadSingleImage {
  profileImage?: string;
  className?: string;
  textHeader?: string;
  setProfileImageFile?: Dispatch<SetStateAction<File | null>>;
}

export function UploadSingleImage({
  profileImage,
  className,
  textHeader,
  setProfileImageFile,
}: UploadSingleImage) {
  const [imagePreview, setImagePreview] = useState("");
  const { toast } = useToast();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Upload Error",
          description: "Please upload a valid image type",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Upload Error",
          description: "File size must be less than 2MB.",
          variant: "destructive",
        });
        return;
      }

      setProfileImageFile?.(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const renderImagePreview = () => {
    if (imagePreview) {
      return (
        <Image
          src={imagePreview}
          alt="Profile Image"
          fill
          priority
          className="size-full object-cover"
        />
      );
    } else if (profileImage) {
      return (
        <Image
          src={profileImage}
          alt="Profile Image"
          fill
          priority
          className="size-full object-cover"
        />
      );
    } else {
      return <User2 className="text-muted-foreground" />;
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      inputRef.current?.click();
    }
  };

  return (
    <div className="space-y-2">
      {textHeader && (
        <p className="text-sm text-muted-foreground">{textHeader}</p>
      )}

      <div
        className={cn(
          "group relative flex size-20 items-center justify-center overflow-hidden rounded-full border border-muted-foreground bg-background p-3",
          className,
        )}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        aria-label="Upload profile image"
      >
        {renderImagePreview()}

        <Input
          type="file"
          accept="image/*"
          className="hidden"
          ref={inputRef}
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
}
