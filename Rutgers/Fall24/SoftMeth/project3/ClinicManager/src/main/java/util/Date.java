package util;

import java.util.Calendar;

/**
 * The Date class represents a specific date and provides functionality for
 * date validation and comparison.
 */
public class Date implements Comparable<Date> {
    private int year;
    private int month; // 1-based (1 = January, 12 = December)
    private int day;

    public static final int QUADRENNIAL = 4;
    public static final int CENTENNIAL = 100;
    public static final int QUATERCENTENNIAL = 400;

    /**
     * Constructor to initialize a Date object with the specified month, day, and
     * year.
     *
     * @param month - Month of the year (1-12)
     * @param day   - Day of the month
     * @param year  - Year of the date
     */
    public Date(int month, int day, int year) {
        this.year = year;
        this.month = month;
        this.day = day;
    }

    /**
     * Parses a string in the format "MM/DD/YYYY" and returns a Date object.
     * 
     * @param dateStr The string representation of the date.
     * @return A Date object
     * @throws IllegalArgumentException If the date format is invalid or if the
     *                                  date itself is invalid.
     */
    public static Date parse(String dateStr) throws IllegalArgumentException {
        String[] parts = dateStr.split("/");
        if (parts.length != 3) {
            throw new IllegalArgumentException("Invalid date format. Expected MM/DD/YYYY.");
        }

        try {
            int month = Integer.parseInt(parts[0]);
            int day = Integer.parseInt(parts[1]);
            int year = Integer.parseInt(parts[2]);

            return new Date(month, day, year);


            } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid date components. Please provide valid numbers.");
        }
    }

    /**
     * Checks if the current date is valid.
     *
     * @return true if the date is valid; false otherwise.
     */
    public boolean isValid() {
        return isValidMonth() && isValidDay();
    }

    private boolean isValidMonth() {
        return month >= 1 && month <= 12;
    }

    private boolean isValidDay() {
        if (day < 1) {
            return false;
        }

        switch (month) {
            case 1: // January
            case 3: // March
            case 5: // May
            case 7: // July
            case 8: // August
            case 10: // October
            case 12: // December
                return day <= 31;

            case 4: // April
            case 6: // June
            case 9: // September
            case 11: // November
                return day <= 30;

            case 2: // February
                return isLeapYear() ? day <= 29 : day <= 28;

            default:
                return false;
        }
    }

    private boolean isLeapYear() {
        return (year % QUADRENNIAL == 0 && year % CENTENNIAL != 0) || (year % QUATERCENTENNIAL == 0);
    }

    /**
     * Checks if this date is after today's date.
     *
     * @return true if this date is after today, false otherwise.
     */
    public boolean isAfterToday() {
        return this.compareTo(getToday()) > 0;
    }

    /**
     * Checks if this date is before today's date.
     *
     * @return true if this date is before today, false otherwise.
     */
    public boolean isBeforeToday() {
        return this.compareTo(getToday()) < 0;
    }

    /**
     * Checks if this date falls on a weekend.
     *
     * @return true if this date falls on a Saturday or Sunday, false otherwise.
     */
    public boolean isWeekend() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(year, month - 1, day); // Calendar months are 0-based
        int dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);
        return dayOfWeek == Calendar.SATURDAY || dayOfWeek == Calendar.SUNDAY;
    }

    /**
     * Checks if this date is within six months from today.
     *
     * @return true if this date is within six months from today, false otherwise.
     */
    public boolean isWithinSixMonths() {
        Calendar sixMonthsFromNow = Calendar.getInstance();
        sixMonthsFromNow.add(Calendar.MONTH, 6);
        Date sixMonthsDate = new Date(
                sixMonthsFromNow.get(Calendar.MONTH) + 1,
                sixMonthsFromNow.get(Calendar.DAY_OF_MONTH),
                sixMonthsFromNow.get(Calendar.YEAR));
        return this.compareTo(sixMonthsDate) <= 0;
    }

    /**
     * Compares this date to another date.
     * 
     * @param other The other date to compare to.
     * @return A negative integer, zero, or a positive integer as this date is
     *         before, equal to, or after the specified date.
     */
    @Override
    public int compareTo(Date other) {
        if (this.year != other.year) {
            return this.year - other.year;
        } else if (this.month != other.month) {
            return this.month - other.month;
        } else {
            return this.day - other.day;
        }
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        Date other = (Date) obj;
        return year == other.year && month == other.month && day == other.day;
    }

    @Override
    public String toString() {
        return month + "/" + day + "/" + year;
    }

    /**
     * Returns today's date.
     *
     * @return The current date.
     */
    private Date getToday() {
        Calendar today = Calendar.getInstance();
        return new Date(
                today.get(Calendar.MONTH) + 1,
                today.get(Calendar.DAY_OF_MONTH),
                today.get(Calendar.YEAR));
    }
}
