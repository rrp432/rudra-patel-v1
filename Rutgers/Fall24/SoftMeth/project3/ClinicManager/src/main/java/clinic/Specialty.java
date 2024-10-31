package clinic;

/**
 * Enum representing different medical specialties and their associated charges
 * per visit.
 * Each specialty has a fixed charge that is billed to the patient.
 * 
 * @author Yash Goswami
 */
public enum Specialty {

    FAMILY(250), // General family practitioner, $250 per visit
    PEDIATRICIAN(300), // Specialist for children, $300 per visit
    ALLERGIST(350); // Specialist for allergies, $350 per visit

    private final int charge; // Charge amount in dollars for each visit

    /**
     * Initializes a Specialty with the specified charge amount.
     *
     * @param charge The fixed charge per visit for this specialty.
     */
    Specialty(int charge) {
        this.charge = charge;
    }

    /**
     * Returns the charge associated with this specialty.
     *
     * @return Charge amount per visit.
     */
    public int getCharge() {
        return charge;
    }

    /**
     * Static method to get the Specialty from a string value.
     * This method ignores case and handles possible string mismatches.
     *
     * @param specialtyStr The string value representing a specialty.
     * @return The corresponding Specialty, or null if no match is found.
     */
    public static Specialty getSpecialty(String specialtyStr) {
        for (Specialty specialty : Specialty.values()) {
            if (specialty.name().equalsIgnoreCase(specialtyStr)) {
                return specialty;
            }
        }
        throw new IllegalArgumentException("Invalid specialty: " + specialtyStr);
    }


    /**
     * Provides a string representation of the specialty and its charge.
     * The format is: "Specialty Name, Charge per visit: $Charge".
     *
     * @return Formatted string displaying the specialty and charge.
     */
    @Override
    public String toString() {
        return String.format("%s, Charge per visit: $%d", this.name(), charge);
    }
}
