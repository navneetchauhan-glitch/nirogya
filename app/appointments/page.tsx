"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Clock, X, Check, ChevronLeft, ChevronRight, Star, Menu } from "lucide-react"

interface Doctor {
  id: string
  name: string
  specialty: string
  rating: number
  reviews: number
  image: string
  available: boolean
}

interface Appointment {
  id: string
  doctorId: string
  doctorName: string
  specialty: string
  date: string
  time: string
  status: "confirmed" | "pending" | "completed"
  notes?: string
}

const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "General Practitioner",
    rating: 4.8,
    reviews: 124,
    image: "👩‍⚕️",
    available: true,
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Cardiologist",
    rating: 4.9,
    reviews: 98,
    image: "👨‍⚕️",
    available: true,
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialty: "Dermatologist",
    rating: 4.7,
    reviews: 156,
    image: "👩‍⚕️",
    available: false,
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialty: "Orthopedist",
    rating: 4.6,
    reviews: 87,
    image: "👨‍⚕️",
    available: true,
  },
]

const mockAppointments: Appointment[] = [
  {
    id: "1",
    doctorId: "1",
    doctorName: "Dr. Sarah Johnson",
    specialty: "General Practitioner",
    date: "2025-02-15",
    time: "10:00 AM",
    status: "confirmed",
  },
  {
    id: "2",
    doctorId: "2",
    doctorName: "Dr. Michael Chen",
    specialty: "Cardiologist",
    date: "2025-02-20",
    time: "2:30 PM",
    status: "pending",
  },
]

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [notes, setNotes] = useState<string>("")
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
  ]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i))
    }

    return days
  }

  const handleBookAppointment = () => {
    if (selectedDoctor && selectedDate && selectedTime) {
      const newAppointment: Appointment = {
        id: Math.random().toString(36).substr(2, 9),
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        date: selectedDate,
        time: selectedTime,
        status: "pending",
        notes: notes || undefined,
      }
      setAppointments((prev) => [...prev, newAppointment])
      setSelectedDoctor(null)
      setSelectedDate("")
      setSelectedTime("")
      setNotes("")
      setShowBookingForm(false)
    }
  }

  const cancelAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((apt) => apt.id !== id))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const calendarDays = generateCalendarDays()
  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#d4d4c8]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-lg font-semibold text-[#1a1a1a]">Nirogya</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors text-sm font-medium">
                Home
              </Link>
              <Link href="/upload" className="text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors text-sm font-medium">
                Upload
              </Link>
              <Link
                href="/dashboard"
                className="text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link href="/appointments" className="text-[#1a1a1a] font-medium text-sm">
                Appointments
              </Link>
              <Link href="/chat" className="text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors text-sm font-medium">
                AI Chat
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-gray-900" /> : <Menu className="w-6 h-6 text-gray-900" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <Link href="/" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                Home
              </Link>
              <Link
                href="/upload"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Upload
              </Link>
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Dashboard
              </Link>
              <Link href="/appointments" className="block px-4 py-2 text-gray-900 font-medium bg-gray-50 rounded-lg">
                Appointments
              </Link>
              <Link href="/chat" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                AI Chat
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">Appointments</h1>
          <p className="text-[#6b6b6b]">Schedule and manage your medical appointments</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Upcoming Appointments */}
          <div className="lg:col-span-2">
            {/* Upcoming Appointments */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">Upcoming Appointments</h2>
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#d4d4c8]/30 p-6 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-[#1a1a1a]">{apt.doctorName}</h3>
                          <p className="text-sm text-[#6b6b6b]">{apt.specialty}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            apt.status === "confirmed"
                              ? "bg-[#a8b5a0]/20 text-[#1a1a1a]"
                              : apt.status === "pending"
                                ? "bg-[#e8e8e0] text-[#6b6b6b]"
                                : "bg-[#e8e8e0] text-[#6b6b6b]"
                          }`}
                        >
                          {apt.status === "confirmed"
                            ? "Confirmed"
                            : apt.status === "pending"
                              ? "Pending"
                              : "Completed"}
                        </span>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-[#6b6b6b]">
                          <Calendar className="w-5 h-5 text-[#1a1a1a]" />
                          <span className="font-medium">{formatDate(apt.date)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#6b6b6b]">
                          <Clock className="w-5 h-5 text-[#1a1a1a]" />
                          <span className="font-medium">{apt.time}</span>
                        </div>
                      </div>

                      {apt.notes && (
                        <div className="mb-6 p-4 bg-[#f5f5f0] rounded-xl border border-[#d4d4c8]/30">
                          <p className="text-sm text-[#6b6b6b]">
                            <span className="font-semibold">Notes:</span> {apt.notes}
                          </p>
                        </div>
                      )}

                      <button
                        onClick={() => cancelAppointment(apt.id)}
                        className="w-full px-4 py-2 border-2 border-[#d4d4c8] text-[#1a1a1a] hover:bg-white/80 rounded-xl transition-colors font-medium text-sm"
                      >
                        Cancel Appointment
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#d4d4c8]/30 p-12 text-center shadow-lg">
                  <Calendar className="w-16 h-16 text-[#d4d4c8] mx-auto mb-4" />
                  <p className="text-[#6b6b6b] mb-6 text-lg">No upcoming appointments</p>
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="inline-block px-6 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-full font-medium transition-all shadow-lg"
                  >
                    Book an Appointment
                  </button>
                </div>
              )}
            </div>

            {/* Book New Appointment Button */}
            {!showBookingForm && appointments.length > 0 && (
              <button
                onClick={() => setShowBookingForm(true)}
                className="w-full px-6 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-full font-medium transition-all shadow-lg"
              >
                Book Another Appointment
              </button>
            )}
          </div>

          {/* Right Column - Booking Form */}
          {showBookingForm && (
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#d4d4c8]/30 p-6 sticky top-20 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#1a1a1a]">Book Appointment</h2>
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Step 1: Select Doctor */}
                {!selectedDoctor ? (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#1a1a1a] mb-4">Select a Doctor</h3>
                    {mockDoctors.map((doctor) => (
                      <button
                        key={doctor.id}
                        onClick={() => setSelectedDoctor(doctor)}
                        disabled={!doctor.available}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          doctor.available
                            ? "border-[#d4d4c8]/30 hover:border-[#a8b5a0] hover:bg-[#f5f5f0]/50 cursor-pointer"
                            : "border-[#d4d4c8]/30 bg-[#f5f5f0] opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{doctor.image}</span>
                          <div className="flex-1">
                            <p className="font-semibold text-[#1a1a1a]">{doctor.name}</p>
                            <p className="text-xs text-[#6b6b6b]">{doctor.specialty}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-3 h-3 text-[#a8b5a0] fill-[#a8b5a0]" />
                              <p className="text-xs text-[#6b6b6b]">
                                {doctor.rating} ({doctor.reviews} reviews)
                              </p>
                            </div>
                            {!doctor.available && <p className="text-xs text-red-600 mt-1">Not available</p>}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Selected Doctor */}
                    <div className="p-4 bg-[#f5f5f0] rounded-xl border border-[#d4d4c8]/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{selectedDoctor.image}</span>
                          <div>
                            <p className="font-semibold text-[#1a1a1a]">{selectedDoctor.name}</p>
                            <p className="text-xs text-[#6b6b6b]">{selectedDoctor.specialty}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedDoctor(null)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Step 2: Select Date */}
                    <div>
                      <h3 className="font-semibold text-[#1a1a1a] mb-3">Select Date</h3>
                      <div className="bg-[#f5f5f0] rounded-xl p-4 mb-3">
                        <div className="flex items-center justify-between mb-4">
                          <button
                            onClick={() =>
                              setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
                            }
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                          </button>
                          <p className="font-semibold text-[#1a1a1a]">{monthName}</p>
                          <button
                            onClick={() =>
                              setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
                            }
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                            <div key={day} className="text-center text-xs font-semibold text-[#6b6b6b] py-2">
                              {day}
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                          {calendarDays.map((day, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                if (day) {
                                  const dateStr = day.toISOString().split("T")[0]
                                  setSelectedDate(dateStr)
                                }
                              }}
                              disabled={!day}
                              className={`aspect-square rounded-xl text-sm font-medium transition-all ${
                                !day
                                  ? "text-[#d4d4c8]"
                                  : selectedDate === day?.toISOString().split("T")[0]
                                    ? "bg-[#1a1a1a] text-white shadow-md"
                                    : "bg-white border border-[#d4d4c8]/30 hover:border-[#a8b5a0] hover:bg-white/80"
                              }`}
                            >
                              {day?.getDate()}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Select Time */}
                    {selectedDate && (
                      <div>
                        <h3 className="font-semibold text-[#1a1a1a] mb-3">Select Time</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {timeSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                                selectedTime === time
                                  ? "bg-[#1a1a1a] text-white shadow-md"
                                  : "bg-[#e8e8e0] text-[#6b6b6b] hover:bg-[#d4d4c8]"
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 4: Add Notes */}
                    {selectedTime && (
                      <div>
                        <h3 className="font-semibold text-[#1a1a1a] mb-3">Additional Notes (Optional)</h3>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Any symptoms or concerns to discuss..."
                          className="w-full px-3 py-2 bg-[#f5f5f0] border border-[#d4d4c8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a8b5a0] text-sm transition-all"
                          rows={3}
                        />
                      </div>
                    )}

                    {/* Book Button */}
                    {selectedTime && (
                      <button
                        onClick={handleBookAppointment}
                        className="w-full px-4 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-full font-medium transition-all flex items-center justify-center gap-2 shadow-lg"
                      >
                        <Check className="w-5 h-5" />
                        Confirm Booking
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
