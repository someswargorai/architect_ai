"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, X, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Form } from "@/app/(app)/projects/page";

interface FilterModalProps {
  form: Form;
  setForm: React.Dispatch<React.SetStateAction<Form>>;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
}

export default function FilterModal({
  form,
  setForm,
  setRefetch,
  isLoading,
}: FilterModalProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (Object.values(form).every((item) => item === undefined)) {
      toast.error("Please select at least one filter");
      return;
    }
    setRefetch((prev) => !prev);
    setOpen(false);
  };

  const Reset = () => {
    setForm({
      priority: undefined,
      startDate: undefined,
      appearance: undefined,
    });
      setRefetch((prev) => !prev);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-sm border-white/5 bg-zinc-900/50 h-10 px-4 hover:bg-amber-500 hover:text-black cursor-pointer"
          disabled={isLoading}
        >
          <Filter className="size-4 text-white hover:text-black" />
          Filter
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader className="relative pb-4">
          <DialogTitle className="text-xl font-semibold text-white">
            Filter Projects
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Apply filters to narrow down your project list
          </DialogDescription>

         
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label className="text-zinc-300">Priority</Label>
            <RadioGroup
              value={form.priority}
              onValueChange={(val) =>
                setForm({
                  ...form,
                  priority: val as "high" | "medium" | "low",
                })
              }
              className="flex flex-row gap-8"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="high"
                  id="high"
                  className="border-zinc-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                />
                <Label htmlFor="high" className="cursor-pointer text-zinc-300">
                  High
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="medium"
                  id="medium"
                  className="border-zinc-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                />
                <Label
                  htmlFor="medium"
                  className="cursor-pointer text-zinc-300"
                >
                  Medium
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="low"
                  id="low"
                  className="border-zinc-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                />
                <Label htmlFor="low" className="cursor-pointer text-zinc-300">
                  Low
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label className="text-zinc-300">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800",
                    !form.startDate && "text-zinc-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-zinc-400" />
                  {form.startDate ? (
                    format(form.startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-zinc-950 border-zinc-800">
                <Calendar
                  mode="single"
                  selected={form.startDate}
                  onSelect={(date) => setForm({ ...form, startDate: date })}
                  initialFocus
                  className="bg-zinc-950 text-zinc-100"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label className="text-zinc-300">Visibility</Label>
            <Select
              value={form.appearance}
              onValueChange={(val) =>
                setForm({
                  ...form,
                  appearance: val as "public" | "private",
                })
              }
            >
              <SelectTrigger className="border-zinc-700 bg-zinc-900/50 text-zinc-200 hover:bg-zinc-800 w-full">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-200">
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-2">
          <Button
            variant="outline"
            className="border-zinc-700 text-zinc-600 hover:bg-zinc-800 hover:text-white cursor-pointer"
            onClick={Reset}
            disabled={isLoading}
          >
            Reset
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-amber-500 hover:bg-amber-600 text-black min-w-[110px] cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Applying...
              </>
            ) : (
              "Apply Filter"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
