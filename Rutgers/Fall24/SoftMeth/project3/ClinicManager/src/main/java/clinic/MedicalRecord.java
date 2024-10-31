package clinic;
/**
 * The MedicalRecord class represents a collection (bag) of patient records.
 * Each record stores a list of completed visits for each patient.
 * This class provides methods to add a patient, get the list of patients, and
 * print the records.
 * The class maintains a dynamic array of Patient objects and manages the size
 * automatically.
 *
 * @author Rudra Patel
 */
public class MedicalRecord {
    private static final int INITIAL_CAPACITY = 4; // Initial capacity of the patient array
    private static final int GROWTH_FACTOR = 4; // Growth factor for resizing the array

    private Patient[] patients; // Array to hold patient records
    private int size; // Number of patients in the array

    /**
     * Constructor to initialize an empty MedicalRecord with the initial capacity.
     */
    public MedicalRecord() {
        this.patients = new Patient[INITIAL_CAPACITY];
        this.size = 0;
    }

    /**
     * Adds a new patient to the medical record.
     * If the array is full, it automatically grows the capacity.
     *
     * @param patient - The patient to be added.
     */
    public void add(Patient patient) {
        if (contains(patient)) {
            return; // Do not add if the patient already exists
        }
        if (size == patients.length) {
            grow(); // Grow the array capacity if it is full
        }
        patients[size++] = patient; // Add the new patient and increase size
    }

    /**
     * Grows the array capacity by the GROWTH_FACTOR.
     */
    private void grow() {
        Patient[] newPatients = new Patient[patients.length + GROWTH_FACTOR];
        System.arraycopy(patients, 0, newPatients, 0, size);
        patients = newPatients;
    }

    /**
     * Checks if the given patient exists in the medical record.
     *
     * @param patient - The patient to check.
     * @return true if the patient exists, false otherwise.
     */
    public boolean contains(Patient patient) {
        for (int i = 0; i < size; i++) {
            if (patients[i].equals(patient)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Retrieves a sorted array of all patients in the medical record.
     * The array is a copy of the internal array, limited to the current size.
     *
     * @return An array of Patient objects.
     */
    public Patient[] getPatients() {
        return patients; // Return the copy of the array
    }

    /**
     * Prints the details of all patients in the medical record.
     */
    public void printAllRecords() {
        System.out.println("** All Patient Medical Records **");
        for (int i = 0; i < size; i++) {
            System.out.println(patients[i].toString());
        }
        System.out.println("** End of Medical Records **");
    }

    /**
     * Retrieves a patient object given the profile details.
     *
     * @param profile - The profile of the patient to find.
     * @return The Patient object if found, null otherwise.
     */
    public Patient getPatient(Profile profile) {
        for (int i = 0; i < size; i++) {
            if (patients[i].getProfile().equals(profile)) {
                return patients[i];
            }
        }
        return null; // Patient not found
    }


    /**
     * Sorts the array of patients in the medical record by last name.
     * If two patients have the same last name, they are sorted by their first names.
     */
    public void sortPatientsByLastName() {
        if (size < 2) {
            return; // No need to sort if there's one or zero patients
        }

        // Simple Bubble Sort based on last name, and first name as secondary criteria
        for (int i = 0; i < size - 1; i++) {
            for (int j = 0; j < size - i - 1; j++) {
                // Get last names of the current and next patient
                int comparison = patients[j].getProfile().getLastName()
                        .compareToIgnoreCase(patients[j + 1].getProfile().getLastName());

                // If the last names are the same, compare by first names
                if (comparison > 0 ||
                        (comparison == 0 && patients[j].getProfile().getFirstName()
                                .compareToIgnoreCase(patients[j + 1].getProfile().getFirstName()) > 0)) {
                    // Swap the patients
                    swap(j, j + 1);
                }
            }
        }
    }

    /**
     * Helper method to swap two patients in the array.
     *
     * @param i - Index of the first patient.
     * @param j - Index of the second patient.
     */
    private void swap(int i, int j) {
        Patient temp = patients[i];
        patients[i] = patients[j];
        patients[j] = temp;
    }

}