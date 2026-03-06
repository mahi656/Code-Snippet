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
    <div className="flex flex-1 flex-col bg-gray-50 dark:bg-black p-6 overflow-auto">
      {/* Calendar Header block wrapping Theme Toggle */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Calendar</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all your upcoming events</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors shadow-sm"
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col rounded-2xl shadow-sm border border-border/40 bg-card overflow-hidden transition-all duration-300">
        {/* Calendar Sub-Header */}
        <div className="flex flex-col space-y-4 p-4 border-b border-border/40 bg-muted/20 md:flex-row md:items-center md:justify-between md:space-y-0 lg:flex-none">
          <div className="flex flex-auto">
            <div className="flex items-center gap-4">
              <div className="hidden w-20 flex-col items-center justify-center rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm p-1 shadow-sm transition-all md:flex">
                <h1 className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground pb-1">
                  {format(today, "MMM")}
                </h1>
                <div className="flex w-full items-center justify-center rounded-lg bg-background py-1 text-xl font-bold shadow-sm">
                  <span className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">{format(today, "d")}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  {format(firstDayCurrentMonth, "MMMM yyyy")}
                </h2>
                <p className="text-sm font-medium text-muted-foreground">
                  {format(firstDayCurrentMonth, "MMM d")} -{" "}
                  {format(endOfMonth(firstDayCurrentMonth), "MMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
            <Button variant="outline" size="icon" className="hidden lg:flex">
              <SearchIcon size={16} strokeWidth={2} aria-hidden="true" />
            </Button>

            <Separator orientation="vertical" className="hidden h-6 lg:block" />

            <div className="inline-flex w-full -space-x-px rounded-lg shadow-sm shadow-black/5 md:w-auto rtl:space-x-reverse">
              <Button
                onClick={previousMonth}
                className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
                variant="outline"
                size="icon"
                aria-label="Navigate to previous month"
              >
                <ChevronLeftIcon size={16} strokeWidth={2} aria-hidden="true" />
              </Button>
              <Button
                onClick={goToToday}
                className="w-full rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 md:w-auto"
                variant="outline"
              >
                Today
              </Button>
              <Button
                onClick={nextMonth}
                className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
                variant="outline"
                size="icon"
                aria-label="Navigate to next month"
              >
                <ChevronRightIcon size={16} strokeWidth={2} aria-hidden="true" />
              </Button>
            </div>

            <Separator orientation="vertical" className="hidden h-6 md:block" />
            <Separator
              orientation="horizontal"
              className="block w-full md:hidden"
            />

            <Button className="w-full gap-2 md:w-auto">
              <PlusCircleIcon size={16} strokeWidth={2} aria-hidden="true" />
              <span>New Event</span>
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="lg:flex lg:flex-auto lg:flex-col bg-background/40">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 border-b border-border/40 bg-muted/10 text-center text-[11px] uppercase tracking-wider font-semibold leading-6 text-muted-foreground lg:flex-none">
            <div className="border-r py-2.5">Sun</div>
            <div className="border-r py-2.5">Mon</div>
            <div className="border-r py-2.5">Tue</div>
            <div className="border-r py-2.5">Wed</div>
            <div className="border-r py-2.5">Thu</div>
            <div className="border-r py-2.5">Fri</div>
            <div className="py-2.5">Sat</div>
          </div>

          {/* Calendar Days */}
          <div className="flex text-sm leading-6 lg:flex-auto">
            <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-5">
              {days.map((day, dayIdx) =>
                !isDesktop ? (
                  <button
                    onClick={() => setSelectedDay(day)}
                    key={dayIdx}
                    type="button"
                    className={cn(
                      isEqual(day, selectedDay) && "text-primary-foreground",
                      !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      isSameMonth(day, firstDayCurrentMonth) &&
                      "text-foreground",
                      !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      !isSameMonth(day, firstDayCurrentMonth) &&
                      "text-muted-foreground",
                      (isEqual(day, selectedDay) || isToday(day)) &&
                      "font-semibold",
                      "flex h-14 flex-col border-b border-r px-3 py-2 hover:bg-muted focus:z-10",
                    )}
                  >
                    <time
                      dateTime={format(day, "yyyy-MM-dd")}
                      className={cn(
                        "ml-auto flex size-6 items-center justify-center rounded-full",
                        isEqual(day, selectedDay) &&
                        isToday(day) &&
                        "bg-primary text-primary-foreground",
                        isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        "bg-primary text-primary-foreground",
                      )}
                    >
                      {format(day, "d")}
                    </time>
                    {data.filter((date) => isSameDay(date.day, day)).length >
                      0 && (
                        <div>
                          {data
                            .filter((date) => isSameDay(date.day, day))
                            .map((date) => (
                              <div
                                key={date.day.toString()}
                                className="-mx-0.5 mt-auto flex flex-wrap-reverse"
                              >
                                {date.events.map((event) => (
                                  <span
                                    key={event.id}
                                    className="mx-0.5 mt-1 h-1.5 w-1.5 rounded-full bg-muted-foreground"
                                  />
                                ))}
                              </div>
                            ))}
                        </div>
                      )}
                  </button>
                ) : (
                  <div
                    key={dayIdx}
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      dayIdx === 0 && colStartClasses[getDay(day)],
                      !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      !isSameMonth(day, firstDayCurrentMonth) &&
                      "bg-accent/50 text-muted-foreground",
                      "relative flex flex-col border-b border-r hover:bg-muted focus:z-10",
                      !isEqual(day, selectedDay) && "hover:bg-accent/75",
                    )}
                  >
                    <header className="flex items-center justify-between p-2.5">
                      <button
                        type="button"
                        className={cn(
                          isEqual(day, selectedDay) && "text-primary-foreground",
                          !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          isSameMonth(day, firstDayCurrentMonth) &&
                          "text-foreground",
                          !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          !isSameMonth(day, firstDayCurrentMonth) &&
                          "text-muted-foreground",
                          isEqual(day, selectedDay) &&
                          isToday(day) &&
                          "border-none bg-primary",
                          isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          "bg-foreground",
                          (isEqual(day, selectedDay) || isToday(day)) &&
                          "font-semibold",
                          "flex h-7 w-7 items-center justify-center rounded-full text-xs hover:border",
                        )}
                      >
                        <time dateTime={format(day, "yyyy-MM-dd")}>
                          {format(day, "d")}
                        </time>
                      </button>
                    </header>
                    <div className="flex-1 p-2.5">
                      {data
                        .filter((event) => isSameDay(event.day, day))
                        .map((day) => (
                          <div key={day.day.toString()} className="space-y-1.5">
                            {day.events.slice(0, 1).map((event) => (
                              <div
                                key={event.id}
                                className="flex flex-col items-start gap-1 rounded-md border border-border/40 bg-background/60 backdrop-blur-md p-2 text-xs leading-tight shadow-sm transition-all hover:bg-muted/80 hover:shadow-md cursor-pointer group"
                              >
                                <p className="font-semibold text-foreground group-hover:text-primary transition-colors leading-none tracking-tight">
                                  {event.name}
                                </p>
                                <p className="leading-none text-muted-foreground">
                                  {event.time}
                                </p>
                              </div>
                            ))}
                            {day.events.length > 1 && (
                              <div className="text-xs text-muted-foreground">
                                + {day.events.length - 1} more
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                ),
              )}
            </div>

            <div className="isolate grid w-full grid-cols-7 grid-rows-5 border-x lg:hidden">
              {days.map((day, dayIdx) => (
                <button
                  onClick={() => setSelectedDay(day)}
                  key={dayIdx}
                  type="button"
                  className={cn(
                    isEqual(day, selectedDay) && "text-primary-foreground",
                    !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    isSameMonth(day, firstDayCurrentMonth) &&
                    "text-foreground",
                    !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    !isSameMonth(day, firstDayCurrentMonth) &&
                    "text-muted-foreground",
                    (isEqual(day, selectedDay) || isToday(day)) &&
                    "font-semibold",
                    "flex h-14 flex-col border-b border-r px-3 py-2 hover:bg-muted focus:z-10",
                  )}
                >
                  <time
                    dateTime={format(day, "yyyy-MM-dd")}
                    className={cn(
                      "ml-auto flex size-6 items-center justify-center rounded-full",
                      isEqual(day, selectedDay) &&
                      isToday(day) &&
                      "bg-primary text-primary-foreground",
                      isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      "bg-primary text-primary-foreground",
                    )}
                  >
                    {format(day, "d")}
                  </time>
                  {data.filter((date) => isSameDay(date.day, day)).length > 0 && (
                    <div>
                      {data
                        .filter((date) => isSameDay(date.day, day))
                        .map((date) => (
                          <div
                            key={date.day.toString()}
                            className="-mx-0.5 mt-auto flex flex-wrap-reverse"
                          >
                            {date.events.map((event) => (
                              <span
                                key={event.id}
                                className="mx-0.5 mt-1 h-1.5 w-1.5 rounded-full bg-muted-foreground"
                              />
                            ))}
                          </div>
                        ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
