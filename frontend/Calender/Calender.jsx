import React from "react"
import { FullScreenCalendar } from "@/components/ui/fullscreen-calendar"


export default function CalenderPage() {
    return (
        <div className="flex h-screen flex-1 flex-col py-6 px-4 md:px-8">
            <div className="flex-1 rounded-xl shadow border bg-background overflow-hidden">
                <FullScreenCalendar />
            </div>
        </div>
    )
}
