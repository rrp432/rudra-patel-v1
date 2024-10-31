package clinic;

public class Doctor extends Provider {
    private Specialty specialty;
    private String npi;

    /**
     * Constructor to initialize a Doctor with their profile, location, specialty,
     * and NPI.
     *
     * @param profile   The doctor's profile information.
     * @param location  The location where the doctor practices.
     * @param specialty The doctor's medical specialty.
     * @param npi       The doctor's National Provider Identifier (NPI).
     */
    public Doctor(Profile profile, Location location, Specialty specialty, String npi) {
        super(profile, location);
        this.specialty = specialty;
        this.npi = npi;
    }

    /**
     * Returns the charge rate for the doctor based on their specialty.
     *
     * @return The charge per visit based on the doctor's specialty.
     */
    @Override
    public int rate() {
        return specialty.getCharge(); // Use the charge associated with the specialty.
    }

    /**
     * Returns the specialty name as a string.
     *
     * @return The doctor's specialty as a string.
     */
    public String getSpecialty() {
        return specialty.name(); // Return the name of the specialty enum
    }

    /**
     * Provides a string representation of the doctor, including profile, specialty,
     * NPI, and formatted profile and location information.
     *
     * @return Formatted string displaying the doctor's profile, specialty, NPI.
     */
    @Override
    public String toString() {
        return super.toString() + String.format("[%s, #%s]",
                this.getSpecialty(),
                this.getNpi());
    }

    /**
     * Retrieves the doctor's National Provider Identifier (NPI).
     *
     * @return The NPI of the doctor.
     */
    public String getNpi() {
        return npi;
    }
}
