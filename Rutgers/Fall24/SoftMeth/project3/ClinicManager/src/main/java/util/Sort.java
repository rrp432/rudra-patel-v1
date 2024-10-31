package util;

import clinic.Appointment;
import clinic.Patient;
import clinic.Provider;
import clinic.Technician;

public class Sort {

    public static final int LESSTHAN = -1;
    public static final int EQUAL = 0;
    public static final int MORETHAN = 1;

    // Appointment sorting methods...

    /**
     * Sorts providers along with their corresponding credits based on specified
     * keys.
     *
     * @param providers The list of providers to sort.
     * @param credits   The list of credits corresponding to each provider.
     * @param keys      An array of characters representing the sorting priority.
     *                  For example, {'L', 'D'} sorts by Last Name, then Date of
     *                  Birth.
     */
    public static void provider(List<Provider> providers, List<Double> credits, char[] keys) {
        int n = providers.size();
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                Provider current = providers.get(j);
                Provider minElement = providers.get(minIdx);
                if (compareProviders(current, minElement, keys) < 0) {
                    minIdx = j;
                }
            }
            // Swap providers and their corresponding credits if a smaller element is found
            if (minIdx != i) {
                Provider tempProvider = providers.get(i);
                providers.set(i, providers.get(minIdx));
                providers.set(minIdx, tempProvider);

                Double tempCredit = credits.get(i);
                credits.set(i, credits.get(minIdx));
                credits.set(minIdx, tempCredit);
            }
        }
    }

    /**
     * Sorts providers based on specified keys without considering credits.
     *
     * @param providers The list of providers to sort.
     * @param keys      An array of characters representing the sorting priority.
     *                  For example, {'L', 'D', 'F'} sorts by Last Name, Date of
     *                  Birth, then First Name.
     */
    public static void provider(List<Provider> providers, char[] keys) {
        int n = providers.size();
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                Provider current = providers.get(j);
                Provider minElement = providers.get(minIdx);
                if (compareProviders(current, minElement, keys) < 0) {
                    minIdx = j;
                }
            }
            // Swap providers if a smaller element is found
            if (minIdx != i) {
                Provider tempProvider = providers.get(i);
                providers.set(i, providers.get(minIdx));
                providers.set(minIdx, tempProvider);
            }
        }
    }

    /**
     * Compares two providers based on multiple keys.
     *
     * @param p1   The first provider.
     * @param p2   The second provider.
     * @param keys The array of keys determining the sorting priority.
     *             For example, {'L', 'D'} sorts by Last Name, then Date of Birth.
     * @return -1 if p1 < p2, 1 if p1 > p2, 0 if equal based on the keys.
     */
    private static int compareProviders(Provider p1, Provider p2, char[] keys) {
        for (char key : keys) {
            int comparison = compareProvidersByKey(p1, p2, key);
            if (comparison != 0) {
                return comparison;
            }
        }
        return EQUAL; // All keys are equal
    }

    /**
     * Compares two providers based on a single key.
     *
     * @param p1  The first provider.
     * @param p2  The second provider.
     * @param key The key determining the sorting criterion.
     * @return -1 if p1 < p2, 1 if p1 > p2, 0 if equal based on the key.
     */
    private static int compareProvidersByKey(Provider p1, Provider p2, char key) {
        switch (key) {
            case 'L': // Last Name
                return p1.getProfile().getLastName().compareToIgnoreCase(p2.getProfile().getLastName());
            case 'F': // First Name
                return p1.getProfile().getFirstName().compareToIgnoreCase(p2.getProfile().getFirstName());
            case 'D': // Date of Birth
                return p1.getProfile().getDob().compareTo(p2.getProfile().getDob());
            default:
                throw new IllegalArgumentException("Invalid key for comparison: " + key);
        }
    }

    /**
     * Convenience method to sort providers by Last Name and Date of Birth.
     *
     * @param providers The list of providers to sort.
     * @param credits   The list of credits corresponding to each provider.
     */
    public static void sortProvidersByLastNameDob(List<Provider> providers, List<Double> credits) {
        char[] keys = { 'L', 'D' };
        provider(providers, credits, keys);
    }

    /**
     * Convenience method to sort providers by Last Name, First Name, and Date of
     * Birth.
     *
     * @param providers The list of providers to sort.
     * @param credits   The list of credits corresponding to each provider.
     */
    public static void sortProvidersByProfile(List<Provider> providers, List<Double> credits) {
        char[] keys = { 'L', 'F', 'D' };
        provider(providers, credits, keys);
    }

    // Appointment sorting methods...

    /**
     * Convenience method to sort appointments by Date, Time, and Provider's
     * Profile.
     *
     * @param list The list of appointments to sort.
     */
    public static void sortAppointmentsByDateTimeProvider(List<Appointment> list) {
        char[] keys = { 'D', 'T', 'R' };
        sortAppointments(list, keys);
    }

    /**
     * Convenience method to sort appointments by Patient, Date, and Time.
     *
     * @param list The list of appointments to sort.
     */
    public static void sortAppointmentsByPatientDateTime(List<Appointment> list) {
        char[] keys = { 'P', 'D', 'T' };
        sortAppointments(list, keys);
    }

    /**
     * Convenience method to sort appointments by County, Date, and Time.
     *
     * @param list The list of appointments to sort.
     */
    public static void sortAppointmentsByCountyDateTime(List<Appointment> list) {
        char[] keys = { 'L', 'D', 'T' };
        sortAppointments(list, keys);
    }

    /**
     * Sorts appointments based on specified keys.
     *
     * @param list The list of appointments to sort.
     * @param keys An array of characters representing the sorting priority.
     *             For example, {'D', 'T', 'R'} sorts by Date, then Time, then
     *             Provider's Profile.
     */
    public static void sortAppointments(List<Appointment> list, char[] keys) {
        int n = list.size();
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                Appointment current = list.get(j);
                Appointment minElement = list.get(minIdx);
                if (compareAppointments(current, minElement, keys) < 0) {
                    minIdx = j;
                }
            }
            // Swap if a smaller element is found
            if (minIdx != i) {
                Appointment temp = list.get(i);
                list.set(i, list.get(minIdx));
                list.set(minIdx, temp);
            }
        }
    }

    /**
     * Compares two appointments based on multiple keys.
     *
     * @param a1   The first appointment.
     * @param a2   The second appointment.
     * @param keys The array of keys determining the sorting priority.
     *             For example, {'D', 'T', 'R'} sorts by Date, then Time, then
     *             Provider's Profile.
     * @return -1 if a1 < a2, 1 if a1 > a2, 0 if equal based on the keys.
     */
    private static int compareAppointments(Appointment a1, Appointment a2, char[] keys) {
        for (char key : keys) {
            int comparison = compareAppointmentsByKey(a1, a2, key);
            if (comparison != 0) {
                return comparison;
            }
        }
        return EQUAL; // All keys are equal
    }

    /**
     * Compares two appointments based on a single key.
     *
     * @param a1  The first appointment.
     * @param a2  The second appointment.
     * @param key The key determining the sorting criterion.
     * @return -1 if a1 < a2, 1 if a1 > a2, 0 if equal based on the key.
     */
    private static int compareAppointmentsByKey(Appointment a1, Appointment a2, char key) {
        switch (key) {
            case 'D': // Date
                return a1.getDate().compareTo(a2.getDate());
            case 'T': // Timeslot
                return a1.getTimeslot().compareTo(a2.getTimeslot());
            case 'P': // Patient Profile
                Patient p1 = (Patient) a1.getPatient();
                Patient p2 = (Patient) a2.getPatient();
                return p1.compareTo(p2);
            case 'L': // Provider Location (County)
                String county1 = ((Provider) a1.getProvider()).getLocation().getCounty();
                String county2 = ((Provider) a2.getProvider()).getLocation().getCounty();
                return county1.compareToIgnoreCase(county2);
            case 'R': // Provider Profile
                Provider prov1 = (Provider) a1.getProvider();
                Provider prov2 = (Provider) a2.getProvider();
                return prov1.getProfile().compareTo(prov2.getProfile());
            default:
                throw new IllegalArgumentException("Invalid key for comparison: " + key);
        }
    }

    // Technician sorting methods...

    /**
     * Reverse the list of technicians.
     *
     * @param list The list of technicians to reverse.
     */
    public static void reverseTechnicians(List<Technician> list) {
        int n = list.size();
        for (int i = 0; i < n / 2; i++) {
            Technician temp = list.get(i);
            list.set(i, list.get(n - i - 1));
            list.set(n - i - 1, temp);
        }
    }

    // Additional sorting methods can be added here as needed without redundancy.
}
