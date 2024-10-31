package clinic;

import util.Date;
import util.List;
import util.Timeslot;

/**
 * The Patient class extends the Person class and represents a patient in the
 * clinic system.
 * It keeps track of the patient's completed appointments through a singly
 * linked list of Visit objects.
 * 
 * @author Rudra Patel
 */
public class Patient extends Person {
    private Visit visitHead; // Head of the linked list of visits

    /**
     * Constructor for creating a new Patient object.
     * 
     * @param profile - The profile of the patient.
     */
    public Patient(Profile profile) {
        super(profile);
        this.visitHead = null; // Initially, there are no visits
    }


    /**
     * Adds a new visit to the patient's list of completed visits.
     * Appends the new visit to the end of the linked list.
     * 
     * @param appointment - The appointment to be added as a visit.
     */
    public void addVisit(Appointment appointment) {
        Visit newVisit = new Visit(appointment);
        if (visitHead == null) {
            visitHead = newVisit; // If no visits exist, set the new visit as the head
        } else {
            Visit current = visitHead;
            // Traverse to the end of the linked list
            while (current.getNext() != null) {
                current = current.getNext();
            }
            current.setNext(newVisit); // Add the new visit at the end of the list
        }
    }

    /**
     * Checks if the patient has a conflicting appointment (same date and timeslot).
     * 
     * @param date     The date of the new appointment.
     * @param timeslot The timeslot of the new appointment.
     * @return true if there is a conflict; false otherwise.
     */
    public boolean hasConflictingAppointment(Date date, Timeslot timeslot) {
        Visit current = visitHead;
        // Traverse through the linked list of visits
        while (current != null) {
            Appointment appointment = current.getAppointment();
            if (appointment.getDate().equals(date) && appointment.getTimeslot().equals(timeslot)) {
                System.out.println(profile.getFirstName() + " " + profile.getLastName() + " " + profile.getDob() +
                        " has an existing appointment at the same time slot.");
                return true; // Conflict found
            }
            current = current.getNext();
        }
        return false; // No conflict
    }

    /**
     * Returns the number of visits the patient has completed.
     * 
     * @return The total number of visits.
     */
    public int getVisitCount() {
        int count = 0;
        Visit current = visitHead;
        // Count the number of visits by traversing the linked list
        while (current != null) {
            count++;
            current = current.getNext();
        }
        return count;
    }

    /**
     * Provides a textual representation of the patient, including their profile and
     * the number of visits.
     * 
     * @return A formatted string representing the patient.
     */
    @Override
    public String toString() {
        return  profile.getFirstName() + " " + profile.getLastName() + " " +profile.getDob();
    }
}
