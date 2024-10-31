package clinic;

import util.Date;

/**
 * The Profile class defines a person's profile using first name, last name, and
 * date of birth. It implements Comparable to define a natural ordering of
 * profiles based on last name, first name, and date of birth. This class is
 * used to uniquely identify a person in the system.
 * 
 * @author Rudra Patel, Yash Goswami
 */
public class Profile implements Comparable<Profile> {
    private String fname; // First name of the person
    private String lname; // Last name of the person
    private Date dob; // Date of birth of the person

    /**
     * Constructor for creating a new Profile object. Initializes the profile with
     * the given first name, last name, and date of birth.
     * 
     * @param fname - The first name of the person.
     * @param lname - The last name of the person.
     * @param dob   - The date of birth of the person.
     */
    public Profile(String fname, String lname, Date dob) {
        this.fname = fname;
        this.lname = lname;
        setDob(dob); // Set and validate the date of birth
    }

    /**
     * Validates the date of birth using the Date class methods and sets it if
     * valid.
     * 
     * @param dob The date of birth to validate and set.
     */
    private void setDob(Date dob) {
        if (!dob.isValid()) {
            throw new IllegalArgumentException("Patient dob: "+dob.toString() + " is not a valid calendar date.");
        } else if (dob.isAfterToday()) {
            throw new IllegalArgumentException("Patient dob: "+dob.toString() + " is today or a date after today.");
        }
        this.dob = dob;
    }

    /**
     * Gets the first name of the person.
     * 
     * @return The first name of the person.
     */
    public String getFirstName() {
        return fname;
    }

    /**
     * Gets the last name of the person.
     * 
     * @return The last name of the person.
     */
    public String getLastName() {
        return lname;
    }

    public String getFullName(){
        return lname +  " "+fname;
    }
    /**
     * Gets the date of birth of the person.
     * 
     * @return The date of birth of the person.
     */
    public Date getDob() {
        return dob;
    }

    /**
     * Validates the profile by ensuring that the first name, last name, and date of
     * birth are not empty or invalid.
     * 
     * @return true if the profile is valid; false otherwise.
     */
    public boolean isValid() {
        return !fname.isEmpty() && !lname.isEmpty() && dob != null && dob.isValid() && !dob.isAfterToday();
    }

    /**
     * Overrides the equals() method to check if two profiles are equal. Two
     * profiles are equal if they have the same last name, first name, and date of
     * birth.
     * 
     * @param obj - The other profile to compare.
     * @return true if the profiles are equal, false otherwise.
     */
    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        Profile other = (Profile) obj;
        return fname.equalsIgnoreCase(other.fname) &&
                lname.equalsIgnoreCase(other.lname) &&
                dob.equals(other.dob);
    }

    /**
     * Overrides the compareTo() method to define the natural ordering of profiles.
     * The comparison is based on the last name, first name, and then date of birth.
     * 
     * @param other - The other profile to compare.
     * @return a negative value if this profile is less, 0 if equal, positive if
     *         greater.
     */
    @Override
    public int compareTo(Profile other) {
        int lastNameComparison = this.lname.compareToIgnoreCase(other.lname);
        if (lastNameComparison != 0)
            return Integer.signum(lastNameComparison);

        int firstNameComparison = this.fname.compareToIgnoreCase(other.fname);
        if (firstNameComparison != 0)
            return Integer.signum(firstNameComparison);

        return Integer.signum(this.dob.compareTo(other.dob));
    }

    /**
     * Overrides the toString() method to provide a textual representation of the
     * profile. The format is: "FirstName LastName DateOfBirth".
     * 
     * @return The formatted string representation of the profile.
     */
    @Override
    public String toString() {
        return String.format("%s %s %s",
                fname,
                lname,
                dob); // Assuming Date has a proper toString() method
    }

}
