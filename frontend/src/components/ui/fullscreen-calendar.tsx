import * as React from "react"
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
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
  Sun,
  Moon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import calendarApi from "../../api/calendarApi"
import AddMilestoneModal from "../Calendar/AddMilestoneModal"

interface FullScreenCalendarProps {
  isDark: boolean
  setIsDark: (val: boolean) => void
}

export function FullScreenCalendar({ isDark, setIsDark }: FullScreenCalendarProps) {
  const today = startOfToday()
  const [selectedDay, setSelectedDay] = React.useState(today)
  const [currentMonth, setCurrentMonth] = React.useState(
    format(today, "MMM-yyyy"),
  )
  const [events, setEvents] = React.useState<any[]>([])
  const [activity, setActivity] = React.useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = React.useState(false)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date())

  const days = React.useMemo(() => eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  }), [firstDayCurrentMonth])

  // Fetch events and activity for the current month view
  const fetchCalendarData = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const monthNum = firstDayCurrentMonth.getMonth() + 1
      const yearNum = firstDayCurrentMonth.getFullYear()

      const eventsRes = await calendarApi.getEvents(monthNum, yearNum)
      setEvents(eventsRes.data.data)

      const start = format(days[0], "yyyy-MM-dd")
      const end = format(days[days.length - 1], "yyyy-MM-dd")
      const activityRes = await calendarApi.getActivitySummary(start, end)

      const activityMap: Record<string, number> = {}
      activityRes.data.data.forEach((item: any) => {
        activityMap[item.date] = item.count
      })
      setActivity(activityMap)
    } catch (err) {
      console.error("Failed to fetch calendar data:", err)
    } finally {
      setIsLoading(false)
    }
  }, [currentMonth, days])

  React.useEffect(() => {
    fetchCalendarData()
  }, [fetchCalendarData])

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
    setSelectedDay(today)
  }

  const getActivityLevel = (dateStr: string) => {
    const count = activity[dateStr] || 0
    if (count === 0) return 0
    if (count < 3) return 1
    if (count < 6) return 2
    if (count < 10) return 3
    return 4
  }

  const handleMilestoneSaved = (newEvent: any) => {
    // Optimistically update the events list so it appears immediately
    if (newEvent) {
      setEvents(prev => [...prev, newEvent])
    }
    // Then re-fetch in the background to ensure data consistency
    fetchCalendarData()
  }

  return (
    <div className="flex h-full w-full bg-white dark:bg-neutral-950 p-6 overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-none items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Calendar</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your coding milestones and snippet updates</p>
          </div>
          <div className="flex items-center gap-4">
          </div>
        </div>

        <div className="flex flex-1 flex-col rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden transition-all duration-300">
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
            </div>

          <div className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-neutral-900 border-none">
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 text-center text-xs uppercase tracking-wider font-semibold leading-6 text-gray-500 dark:text-gray-400 py-1.5 flex-none font-bold">
              <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>

            <div className="flex flex-1 overflow-hidden bg-gray-200 dark:bg-neutral-800">
              <div className="w-full grid grid-cols-7 auto-rows-[minmax(100px,1fr)] gap-px bg-gray-200 dark:bg-neutral-800 overflow-y-auto">
                {days.map((day, dayIdx) => {
                  const dateStr = format(day, "yyyy-MM-dd")
                  const level = getActivityLevel(dateStr)
                  const dayEvents = events.filter(e => isSameDay(new Date(e.date), day))

                  return (
                    <div
                      key={dayIdx}
                      onClick={() => setSelectedDay(day)}
                      className={cn(
                        "relative flex flex-col bg-white dark:bg-neutral-900 transition-all cursor-pointer p-2",
                        !isSameMonth(day, firstDayCurrentMonth) && "opacity-40",
                        isEqual(day, selectedDay)
                          ? "ring-2 ring-inset ring-blue-500 z-10"
                          : level > 0
                            ? cn(
                              "ring-2 ring-inset",
                              level === 1 && "ring-emerald-500/20",
                              level === 2 && "ring-emerald-500/40",
                              level === 3 && "ring-emerald-500/70",
                              level === 4 && "ring-emerald-500"
                            )
                            : "hover:bg-gray-50 dark:hover:bg-neutral-800/50"
                      )}
                    >


                      <header className="flex items-center justify-between mb-1 z-10">
                        <span className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                          isToday(day) ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" : "text-gray-900 dark:text-gray-100"
                        )}>
                          {format(day, "d")}
                        </span>
                        {dayEvents.length > 0 && (
                          <div className="flex gap-0.5">
                            {dayEvents.slice(0, 3).map((_, i) => (
                              <div key={i} className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                            ))}
                          </div>
                        )}
                      </header>

                      <div className="flex-1 overflow-y-auto space-y-1 z-10">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div key={event._id} className="truncate rounded-lg bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-[10px] font-bold text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30 shadow-sm shadow-blue-500/5">
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-[10px] font-bold text-gray-400 px-1">
                            + {dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedDay && (
        <div className="w-80 ml-6 flex flex-col gap-6 animate-in slide-in-from-right duration-500">
          <div className="rounded-3xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xl shadow-gray-200/5 dark:shadow-black/40">
            <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-6">
              {format(selectedDay, "EEEE, MMMM do")}
            </h3>

            <div className="space-y-10">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Daily Milestones</h4>
                  <div className="flex h-5 items-center px-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black">
                    {events.filter(e => isSameDay(new Date(e.date), selectedDay)).length}
                  </div>
                </div>
                <div className="space-y-3">
                  {events.filter(e => isSameDay(new Date(e.date), selectedDay)).length > 0 ? (
                    events.filter(e => isSameDay(new Date(e.date), selectedDay)).map(event => (
                      <div key={event._id} className="group relative rounded-2xl border border-gray-100 dark:border-neutral-800 bg-gray-50/30 dark:bg-neutral-950/30 p-4 hover:border-blue-500/40 transition-all cursor-default overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1 leading-tight">{event.title}</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed font-medium">{event.description || "No description provided"}</p>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 border border-dashed border-gray-200 dark:border-neutral-800 rounded-2xl flex flex-col items-center justify-center opacity-60">
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">Quiet Day</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">System Activity</h4>
                  <div className="flex h-5 items-center px-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black">
                    {activity[format(selectedDay, "yyyy-MM-dd")] || 0}
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-gray-50/50 dark:bg-neutral-950/50 border border-gray-100 dark:border-neutral-800 relative overflow-hidden group">
                  <div className={cn(
                    "absolute inset-0 opacity-[0.03] transition-opacity group-hover:opacity-[0.06]",
                    activity[format(selectedDay, "yyyy-MM-dd")] > 0 ? "bg-emerald-500" : "bg-gray-500"
                  )} />

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        activity[format(selectedDay, "yyyy-MM-dd")] >= 10 ? "bg-emerald-500 animate-pulse" :
                          activity[format(selectedDay, "yyyy-MM-dd")] >= 5 ? "bg-emerald-400" :
                            activity[format(selectedDay, "yyyy-MM-dd")] > 0 ? "bg-emerald-300" : "bg-gray-400"
                      )} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {activity[format(selectedDay, "yyyy-MM-dd")] >= 10 ? "Peak Flow" :
                          activity[format(selectedDay, "yyyy-MM-dd")] >= 5 ? "High Output" :
                            activity[format(selectedDay, "yyyy-MM-dd")] > 0 ? "Active" : "Idle"}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed font-bold">
                      {activity[format(selectedDay, "yyyy-MM-dd")]
                        ? (
                          <>
                            Productivity Report: You documented {activity[format(selectedDay, "yyyy-MM-dd")]} code {activity[format(selectedDay, "yyyy-MM-dd")] === 1 ? 'snippet' : 'snippets'} in your workspace.
                          </>
                        )
                        : (
                          <>
                            No developer activity detected for this specific date range.
                          </>
                        )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className={`w-full h-14 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl group border-none ${
              isDark 
                ? "bg-[#d6c7b0] text-black hover:bg-[#c5b4a0]" 
                : "bg-[#8a7a66] text-white hover:bg-[#7a6a56] shadow-neutral-200/50"
            }`}
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
              isDark ? "bg-black/10 group-hover:bg-black/20" : "bg-white/10 group-hover:bg-white/20"
            }`}>
              <PlusCircleIcon size={18} className="stroke-[2.5]" />
            </div>
            <span className="font-bold text-sm tracking-tight">Schedule Milestone</span>
          </button>
        </div>
      )}

      <AddMilestoneModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDay}
        onSave={handleMilestoneSaved}
        isDark={isDark}
      />
    </div>
  )
}