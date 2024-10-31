package clinic;

import util.Date;
import util.List;
import util.Timeslot;

/**
 * Appointment class represents both office and imaging appointments.
 */
public class Appointment implements Comparable<Appointment> {
    protected Date date;
    protected Timeslot timeslot;
    protected Person patient;
    protected Person provider;

    /**
     * Constructor for creating a new Appointment object.
     * Validates the date before setting it to ensure that it is a valid appointment
     * date.
     * 
     * @param date     The date of the appointment.
     * @param timeslot The timeslot for the appointment.
     * @param patient  The patient for the appointment.
     * @param provider The provider for the appointment.
     */
    public Appointment(Date date, Timeslot timeslot, Person patient, Provider provider) {
        this.date = date;
        this.timeslot = timeslot;
        this.patient = patient;
        this.provider = provider;
    }

    /**
     * Sets and validates the appointment date.
     * 
     * @param date The date to validate and set.
     * @throws IllegalArgumentException if the date is invalid, falls on a weekend,
     *                                  or is not within six months.
     */
    public static void isValid(Date date) {
        if (!date.isValid()) {
            throw new IllegalArgumentException("Appointment date "+  date.toString() + " is not a valid calendar date.");
        }
        if (date.isBeforeToday()) {
            throw new IllegalArgumentException("Appointment date "+  date.toString() + " is today or a date before today.");
        }
        if (date.isWeekend()) {
            throw new IllegalArgumentException("Appointment date "+  date.toString() + " is Saturday or Sunday.");
        }
        if (!date.isWithinSixMonths()) {
            throw new IllegalArgumentException("Appointment date "+  date.toString() + " is not within six months.");
        }
        
    }

    public Date getDate() {
        return date;
    }

    public Timeslot getTimeslot() {
        return timeslot;
    }

    public Person getPatient() {
        return patient;
    }

    public Person getProvider() {
        return provider;
    }

    @Override
    public int compareTo(Appointment other) {
        int dateComparison = this.date.compareTo(other.date);
        if (dateComparison != 0) {
            return dateComparison;
        }
        return this.timeslot.compareTo(other.timeslot);
    }

    @Override

    public String toString() {
      return date + " "+ timeslot + " " + (Patient)patient ;
    }

    public void setTimeslot(Timeslot newTimeslot) {
        this.timeslot = newTimeslot;
    }

    public void setDate(Date newDate) {
this.date = newDate;
    }

   

   

   
}
