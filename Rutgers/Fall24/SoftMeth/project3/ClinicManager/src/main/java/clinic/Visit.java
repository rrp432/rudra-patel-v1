package clinic;

/**
 * The Visit class defines a node in a singly linked list that maintains a list
 * of visits.
 * Each visit represents a completed appointment.
 * The class contains a reference to an Appointment object and a pointer to the
 * next Visit in the list.
 * This class will be used in the Patient class to keep track of the patient's
 * completed appointments.
 * 
 * @author Rudra Patel
 */
public class Visit {
    private Appointment appointment; // Reference to an appointment object
    private Visit next; // Reference to the next visit in the linked list

    /**
     * Constructor for creating a new Visit object.
     * Initializes the visit with the given Appointment and sets the next reference
     * to null.
     * 
     * @param appointment - The completed appointment associated with this visit.
     */
    public Visit(Appointment appointment) {
        this.appointment = appointment;
        this.next = null;
    }

    /**
     * Retrieves the appointment associated with this visit.
     * 
     * @return The appointment object.
     */
    public Appointment getAppointment() {
        return appointment;
    }

    /**
     * Retrieves the next Visit in the linked list.
     * 
     * @return The next Visit object.
     */
    public Visit getNext() {
        return next;
    }

    /**
     * Sets the next Visit in the linked list.
     * 
     * @param next - The Visit object to set as the next node.
     */
    public void setNext(Visit next) {
        this.next = next;
    }

    /**
     * Overrides the toString() method to provide a textual representation of the
     * visit.
     * Displays the appointment details for this visit.
     * 
     * @return The string representation of the visit.
     */
    @Override
    public String toString() {
        return "Visit: " + appointment.toString();
    }

    // Main method to test the Visit class functionality.
}
