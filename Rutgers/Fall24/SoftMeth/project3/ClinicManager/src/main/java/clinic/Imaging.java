package clinic;

import util.Date;
import util.Timeslot;

public class Imaging extends Appointment {
    private Radiology room; // Type of imaging service (e.g., X-ray, Ultrasound, etc.)

    /**
     * Constructor for the Imaging appointment.
     * 
     * @param date     The date of the appointment.
     * @param timeslot The timeslot for the appointment.
     * @param patient  The patient for the appointment.
     * @param provider The technician assigned to the appointment.
     * @param room     The imaging room (Radiology type) for the appointment.
     */
    public Imaging(Date date, Timeslot timeslot, Person patient, Technician provider, Radiology room) {
        super(date, timeslot, patient, provider);
        this.room = room;
    }

    public Radiology getRoom(){
        return this.room;
    }

    /**
     * Overrides the toString() method to provide details about the imaging
     * appointment.
     * Includes the date, time, patient details, provider details, and room type.
     *
     * @return A formatted string representing the imaging appointment.
     */
    @Override
    public String toString() {
        return super.toString() ;
    }

  
}
