"use client"

import * as React from "react"
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircleIcon,
  SearchIcon,
  Sun,
  Moon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useMediaQuery } from "@/hooks/use-media-query"

interface Event {
  id: number
  name: string
  time: string
  datetime: string
}

interface CalendarData {
  day: Date
  events: Event[]
}

interface FullScreenCalendarProps {
  data?: CalendarData[]
  isDark: boolean
  setIsDark: (val: boolean) => void
}

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
]

export function FullScreenCalendar({ data = [], isDark, setIsDark }: FullScreenCalendarProps) {
  const today = startOfToday()
  const [selectedDay, setSelectedDay] = React.useState(today)
  const [currentMonth, setCurrentMonth] = React.useState(
    format(today, "MMM-yyyy"),
  )
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date())
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  })

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  function goToToday() {
    setCurrentMonth(format(today, "MMM-yyyy"))
  }

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-neutral-950 p-6 overflow-hidden">
      {/* Calendar Header block wrapping Theme Toggle */}
      <div className="flex flex-none items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Calendar</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your coding milestones and snippet updates</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden transition-all duration-300">
        {/* Calendar Sub-Header */}
        <div className="flex flex-col space-y-4 p-4 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 md:flex-row md:items-center md:justify-between md:space-y-0 lg:flex-none">
          <div className="flex flex-auto">
            <div className="flex items-center gap-4">
              <div className="hidden w-16 flex-col items-center justify-center rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 p-1 md:flex">
                <span className="text-[10px] font-medium tracking-wider uppercase text-gray-500 dark:text-gray-400">
                  {format(today, "MMM")}
                </span>
                <span className="text-lg font-semibold text-primary dark:text-white">
                  {format(today, "d")}
                </span>
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                  {format(firstDayCurrentMonth, "MMMM yyyy")}
                </h2>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {format(firstDayCurrentMonth, "MMM d")} -{" "}
                  {format(endOfMonth(firstDayCurrentMonth), "MMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-4">


            <div className="inline-flex w-full -space-x-px rounded-md shadow-sm md:w-auto rtl:space-x-reverse border border-gray-200 dark:border-neutral-800">
              <Button
                onClick={previousMonth}
                className="h-9 rounded-none rounded-l-md border-0 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800 text-gray-600 dark:text-gray-400"
                variant="ghost"
                size="icon"
                aria-label="Navigate to previous month"
              >
                <ChevronLeftIcon size={16} strokeWidth={2} />
              </Button>
              <Button
                onClick={goToToday}
                className="h-9 w-full rounded-none border-0 border-x border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800 text-gray-900 dark:text-gray-100 font-medium md:w-auto"
                variant="ghost"
              >
                Today
              </Button>
              <Button
                onClick={nextMonth}
                className="h-9 rounded-none rounded-r-md border-0 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800 text-gray-600 dark:text-gray-400"
                variant="ghost"
                size="icon"
                aria-label="Navigate to next month"
              >
                <ChevronRightIcon size={16} strokeWidth={2} />
              </Button>
            </div>

            <Separator orientation="vertical" className="hidden h-6 bg-gray-200 dark:bg-neutral-800 md:block" />
            <Separator
              orientation="horizontal"
              className="block w-full bg-gray-200 dark:bg-neutral-800 md:hidden"
            />

            <Button className="h-9 w-full gap-2 md:w-auto bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black">
              <PlusCircleIcon size={16} strokeWidth={2} aria-hidden="true" />
              <span>Add Milestone</span>
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-neutral-900 border-none">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 text-center text-xs uppercase tracking-wider font-semibold leading-6 text-gray-500 dark:text-gray-400 py-1.5 flex-none">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Calendar Days */}
          <div className="flex flex-1 overflow-hidden bg-gray-200 dark:bg-neutral-800">
            {/* Desktop Grid */}
            <div className="hidden w-full lg:grid lg:grid-cols-7 auto-rows-[minmax(100px,1fr)] gap-px bg-gray-200 dark:bg-neutral-800 overflow-y-auto">
              {days.map((day, dayIdx) => (
                <div
                  key={dayIdx}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "relative flex flex-col bg-white dark:bg-neutral-900 transition-colors cursor-pointer p-2",
                    !isSameMonth(day, firstDayCurrentMonth) && "bg-gray-50/50 dark:bg-neutral-950/50",
                    (isEqual(day, selectedDay) || isToday(day)) ? "bg-blue-50/30 dark:bg-blue-900/10 hover:bg-blue-50/50 dark:hover:bg-blue-900/20" : "hover:bg-gray-50 dark:hover:bg-neutral-800"
                  )}
                >
                  <header className="flex items-center mb-1">
                    <button
                      type="button"
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors",
                        isEqual(day, selectedDay) && "bg-black dark:bg-white text-white dark:text-black",
                        !isEqual(day, selectedDay) && isToday(day) && "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
                        !isEqual(day, selectedDay) && !isToday(day) && isSameMonth(day, firstDayCurrentMonth) && "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-neutral-800",
                        !isEqual(day, selectedDay) && !isToday(day) && !isSameMonth(day, firstDayCurrentMonth) && "text-gray-400 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-neutral-800"
                      )}
                    >
                      <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
                    </button>
                  </header>
                  <div className="flex-1 overflow-y-auto space-y-1">
                    {data.filter((event) => isSameDay(event.day, day)).map((dayData) => (
                      <React.Fragment key={dayData.day.toString()}>
                        {dayData.events.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className="flex flex-col items-start gap-1 rounded bg-gray-100 dark:bg-neutral-800 px-2 py-1 text-xs leading-tight transition-colors hover:bg-gray-200 dark:hover:bg-neutral-700 cursor-pointer"
                          >
                            <p className="font-medium text-gray-900 dark:text-gray-100 truncate w-full">{event.name}</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate w-full">{event.time}</p>
                          </div>
                        ))}
                        {dayData.events.length > 3 && (
                          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-1 py-0.5 hover:text-gray-700 dark:hover:text-gray-300">
                            + {dayData.events.length - 3} more
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Grid */}
            <div className="grid w-full grid-cols-7 auto-rows-[minmax(60px,1fr)] gap-px bg-gray-200 dark:bg-neutral-800 lg:hidden overflow-y-auto">
              {days.map((day, dayIdx) => (
                <button
                  key={dayIdx}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "flex flex-col items-center bg-white dark:bg-neutral-900 p-1 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors focus:z-10",
                    !isSameMonth(day, firstDayCurrentMonth) && "bg-gray-50/50 dark:bg-neutral-950/50"
                  )}
                >
                  <time
                    dateTime={format(day, "yyyy-MM-dd")}
                    className={cn(
                      "mt-1 flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium",
                      isEqual(day, selectedDay) && "bg-black dark:bg-white text-white dark:text-black",
                      !isEqual(day, selectedDay) && isToday(day) && "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
                      !isEqual(day, selectedDay) && !isToday(day) && isSameMonth(day, firstDayCurrentMonth) && "text-gray-900 dark:text-gray-100",
                      !isEqual(day, selectedDay) && !isToday(day) && !isSameMonth(day, firstDayCurrentMonth) && "text-gray-400 dark:text-gray-600"
                    )}
                  >
                    {format(day, "d")}
                  </time>
                  <div className="mt-auto flex flex-wrap justify-center gap-0.5 px-1 pb-1">
                    {data.filter((d) => isSameDay(d.day, day)).map((dayData) =>
                      dayData.events.map((event) => (
                        <span key={event.id} className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      ))
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}