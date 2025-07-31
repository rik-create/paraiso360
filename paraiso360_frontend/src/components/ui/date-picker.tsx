"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
    date: Date | undefined;
    onDateChange: (date: Date | undefined) => void;
    className?: string;
    buttonClassName?: string;
    id?: string;
    disabled?: boolean;
}

export function DatePicker({
    date,
    onDateChange,
    className,
    buttonClassName,
    id,
    disabled
}: DatePickerProps) {
    return (
        <div className={cn(className)}>
            <Popover>
                <PopoverTrigger asChild disabled={disabled}>
                    <Button
                        variant={"outline"}
                        id={id}
                        disabled={disabled}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground",
                            buttonClassName
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={onDateChange}
                        initialFocus
                        disabled={disabled}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
} 