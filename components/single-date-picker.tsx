// components/DatePicker.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { Controller } from "react-hook-form";

interface DatePickerProps {
  name: string;
  control: any;
  error?: string;
  label?: string;
  isRequired?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  name,
  control,
  error,
  label,
  isRequired = false,
}) => {
  return (
    <div className="flex flex-col gap-2 z-[999]">
      {label && (
        <label htmlFor={name} className="flex items-center gap-1">
          {label}
          {isRequired && <span className="text-destructive">*</span>}
        </label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className="w-[240px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2" />
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <>
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </>
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                initialFocus
              />
            )}
          />
        </PopoverContent>
      </Popover>
      {error && <span className="text-red-500 text-base">{error}</span>}
    </div>
  );
};
