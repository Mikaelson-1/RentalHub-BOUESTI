"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { BookingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Type for booking with relations
export interface BookingWithRelations {
  id: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
  studentId: string;
  propertyId: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
  property: {
    id: string;
    title: string;
    price: number | Prisma.Decimal;
    location: {
      name: string;
    };
  };
}

/**
 * Creates a new booking request for a property
 * @param propertyId - ID of the property to book
 * @param studentId - ID of the student making the booking
 * @returns The created booking
 */
export async function createBookingRequest(
  propertyId: string,
  studentId: string
) {
  try {
    // Validate inputs
    if (!propertyId || !studentId) {
      throw new Error("Property ID and Student ID are required");
    }

    // Check if property exists and is approved
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new Error("Property not found");
    }

    if (property.status !== "APPROVED") {
      throw new Error("Property is not available for booking");
    }

    // Check if student already has a pending booking for this property
    const existingBooking = await prisma.booking.findFirst({
      where: {
        propertyId,
        studentId,
        status: {
          in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
        },
      },
    });

    if (existingBooking) {
      throw new Error("You already have an active booking for this property");
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        propertyId,
        studentId,
        status: BookingStatus.PENDING,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            location: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Revalidate relevant pages
    revalidatePath("/student");
    revalidatePath("/landlord");

    return { success: true, booking };
  } catch (error) {
    console.error("Error creating booking:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create booking"
    );
  }
}

/**
 * Fetches all bookings for a specific student
 * @param studentId - ID of the student
 * @returns Array of bookings with property details
 */
export async function getStudentBookings(
  studentId: string
): Promise<BookingWithRelations[]> {
  try {
    const bookings = await prisma.booking.findMany({
      where: { studentId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            location: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return bookings;
  } catch (error) {
    console.error("Error fetching student bookings:", error);
    throw new Error("Failed to fetch bookings");
  }
}

/**
 * Fetches all bookings for properties owned by a landlord
 * @param landlordId - ID of the landlord
 * @returns Array of bookings with student and property details
 */
export async function getLandlordBookings(
  landlordId: string
): Promise<BookingWithRelations[]> {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        property: {
          landlordId,
        },
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            location: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return bookings;
  } catch (error) {
    console.error("Error fetching landlord bookings:", error);
    throw new Error("Failed to fetch bookings");
  }
}

/**
 * Updates the status of a booking
 * @param bookingId - ID of the booking to update
 * @param status - New status (CONFIRMED or CANCELLED)
 * @returns The updated booking
 */
export async function updateBookingStatus(
  bookingId: string,
  status: "CONFIRMED" | "CANCELLED"
) {
  try {
    if (!bookingId || !status) {
      throw new Error("Booking ID and status are required");
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status:
          status === "CONFIRMED" ? BookingStatus.CONFIRMED : BookingStatus.CANCELLED,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            location: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Revalidate relevant pages
    revalidatePath("/student");
    revalidatePath("/landlord");

    return { success: true, booking };
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw new Error("Failed to update booking status");
  }
}
