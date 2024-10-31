package util;

/**
 * Represents a timeslot for scheduling appointments.
 * Each timeslot includes a specific hour and minute, defined using a 24-hour
 * format.
 * The class provides functionality to display the timeslot in a user-friendly
 * 12-hour AM/PM format.
 *
 * @author Yash Goswami
 */
public class Timeslot implements Comparable<Timeslot> {
    private final int hour; // Hour of the timeslot (24-hour format)
    private final int minute; // Minute of the timeslot

    // Constants representing morning and afternoon start times
    public static final int MORNING_START_HOUR = 9;
    public static final int AFTERNOON_START_HOUR = 14;
    public static final int SLOT_DURATION_MINUTES = 30;

    /**
     * Constructor to create a new timeslot with a specific hour and minute.
     *
     * @param hour   The hour of the timeslot (24-hour format).
     * @param minute The minute of the timeslot.
     */
    public Timeslot(int hour, int minute) {
        this.hour = hour;
        this.minute = minute;
    }

    /**
     * Gets the hour of the timeslot.
     *
     * @return The hour in 24-hour format.
     */
    public int getHour() {
        return hour;
    }

    /**
     * Gets the minute of the timeslot.
     *
     * @return The minute of the timeslot.
     */
    public int getMinute() {
        return minute;
    }

    /**
     * Returns a string representation of the timeslot in 12-hour AM/PM format.
     * 
     * @return A formatted string representing the timeslot in 12-hour format.
     */
    @Override
    public String toString() {
        String period = hour >= 12 ? "PM" : "AM"; // Determine AM/PM
        int displayHour = (hour == 12 || hour == 0) ? 12 : (hour % 12); // Convert to 12-hour format
        return String.format("%d:%02d %s", displayHour, minute, period);
    }

    /**
     * Compares this timeslot with another timeslot.
     * 
     * @param other The other timeslot to compare with.
     * @return A negative integer, zero, or a positive integer as this timeslot is
     *         less than,
     *         equal to, or greater than the specified timeslot.
     */
    @Override
    public int compareTo(Timeslot other) {
        if (this.hour != other.hour) {
            return Integer.compare(this.hour, other.hour);
        }
        return Integer.compare(this.minute, other.minute);
    }

    /**
     * Checks if two timeslots are equal based on their hour and minute values.
     * 
     * @param obj The object to compare with.
     * @return true if the timeslots are equal, false otherwise.
     */
    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        Timeslot other = (Timeslot) obj;
        return this.hour == other.hour && this.minute == other.minute;
    }


    /**
     * Factory method to create a Timeslot from a slot number (1 to 12).
     * 
     * @param slotNumber The timeslot number (1-12).
     * @return The corresponding Timeslot.
     * @throws IllegalArgumentException if the slot number is invalid.
     */
    public static Timeslot fromSlotNumber(int slotNumber) throws IllegalArgumentException {
        switch (slotNumber) {
            case 1:
                return new Timeslot(9, 0);
            case 2:
                return new Timeslot(9, 30);
            case 3:
                return new Timeslot(10, 0);
            case 4:
                return new Timeslot(10, 30);
            case 5:
                return new Timeslot(11, 0);
            case 6:
                return new Timeslot(11, 30);
            case 7:
                return new Timeslot(14, 0);
            case 8:
                return new Timeslot(14, 30);
            case 9:
                return new Timeslot(15, 0);
            case 10:
                return new Timeslot(15, 30);
            case 11:
                return new Timeslot(16, 0);
            case 12:
                return new Timeslot(16, 30);
            default:
                throw new IllegalArgumentException(slotNumber + " is not a valid time slot.");
        }
    }

    /**
     * Factory method to parse a string and return the corresponding timeslot.
     * 
     * @param slotString The string representing the timeslot.
     * @return The corresponding Timeslot.
     * @throws IllegalArgumentException if the slot number is invalid or not a
     *                                  number.
     */
    public static Timeslot fromSlotString(String slotString) throws IllegalArgumentException {
        try {
            int slotNumber = Integer.parseInt(slotString);
            return fromSlotNumber(slotNumber);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException(slotString + " is not a valid time slot.");
        }
    }

    public int getSlotNumber() {
        // Define the possible timeslots in an array
        int[][] timeSlots = {
                { 9, 0 }, { 9, 30 }, { 10, 0 }, { 10, 30 }, { 11, 0 }, { 11, 30 },
                { 14, 0 }, { 14, 30 }, { 15, 0 }, { 15, 30 }, { 16, 0 }, { 16, 30 }
        };

        // Loop through the timeslots and find the matching one
        for (int i = 0; i < timeSlots.length; i++) {
            if (timeSlots[i][0] == hour && timeSlots[i][1] == minute) {
                return i + 1; // Return the slot number (1-based index)
            }
        }

        // If no match is found, throw an exception
        throw new IllegalArgumentException("Invalid timeslot: " + toString());
    }

    public static int getSlotNumberFromFormattedTime(String formattedTime) {
        switch (formattedTime) {
            case "09:00 AM": return 1;
            case "10:00 AM": return 2;
            case "11:00 AM": return 3;
            case "12:00 PM": return 4;
            case "01:00 PM": return 5;
            case "02:00 PM": return 6;
            case "03:00 PM": return 7;
            case "04:00 PM": return 8;
            case "05:00 PM": return 9;
            case "06:00 PM": return 10;
            case "07:00 PM": return 11;
            case "08:00 PM": return 12;
            default: throw new IllegalArgumentException("Invalid time selected: " + formattedTime);
        }
    }




}
