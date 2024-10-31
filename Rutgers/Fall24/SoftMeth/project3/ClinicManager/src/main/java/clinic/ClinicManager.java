package clinic;

import util.List;
import util.Date;
import util.Timeslot;
import util.Sort;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;



/**
 * The ClinicManager class handles user commands and manages providers,
 * patients, and appointments.
 */
public class ClinicManager {
    private List<Provider> providers = new List<>();
    
    private List<Appointment> appointments = new List<>();
    private List<Technician> technicianRotation = new List<>();
    private int currentTechnicianIndex = 0; // Keep track of the current technician

   
    /**
     * Constructor: Loads the list of providers from the text file.
     */
    public ClinicManager() {
        loadProviders();
    }

    /**
     * Runs the clinic management system, processing user commands.
     */
    public void run() {
        System.out.println("Clinic Manager is running...");
        Scanner scanner = new Scanner(System.in);
        String command;
        
        while (!(command = scanner.nextLine()).equals("Q")) {
            
            processCommand(command);
            
        
        }

        System.out.println("Clinic Manager terminated.");
    }

    /**
     * Loads the list of providers from the "providers.txt" file.
     */
    private void loadProviders() {
        try {
            Scanner fileScanner = new Scanner(new File("src/providers.txt"));
            int lineNumber = 1;
            while (fileScanner.hasNextLine()) {
                String[] data = fileScanner.nextLine().split("\\s+");

                try {
                    // Create location from city name (column 5)
                    Location location = Location.createLocation(data[4]);

                    if (data[0].equals("D")) {
                        // Create Doctor
                        Profile profile = new Profile(data[1], data[2], Date.parse(data[3]));
                        Specialty specialty = Specialty.valueOf(data[5].toUpperCase());
                        String npi = data[6]; // Ensure this is numeric
                        Doctor doctor = new Doctor(profile, location, specialty, npi);
                        providers.add(doctor);
                    } else if (data[0].equals("T")) {
                        // Create Technician
                        Profile profile = new Profile(data[1], data[2], Date.parse(data[3]));
                        int rate = Integer.parseInt(data[5]); // Ensure rate is an integer
                        Technician technician = new Technician(profile, location, rate);
                        providers.add(technician);
                        technicianRotation.add(technician);
                    }
                } catch (NumberFormatException e) {
                    System.out.println("Error: Invalid integer value on line " + lineNumber + " in providers.txt: "
                            + e.getMessage());
                } catch (Exception e) {
                    System.out.println("Error processing provider on line " + lineNumber + ": " + e.getMessage());
                }

                lineNumber++; // Track line number
            }

         
            Sort.provider(providers, new char[]{'L', 'F', 'D'});

            displayProviders();
            Sort.reverseTechnicians(technicianRotation);
            displayRotationalTechnician();

        } catch (FileNotFoundException e) {
            System.out.println("Error: providers.txt not found.");
        }
    }
    
    private void displayRotationalTechnician() {
        if (technicianRotation.isEmpty()) {
            System.out.println("No technicians available in the rotation.");
            return;
        }

        System.out.println("Rotation list for the technicians:");

        for (int i = 0; i < technicianRotation.size(); i++) {
            Technician technician = technicianRotation.get(i);

            // Format and print the technician details
            System.out.print(technician.getProfile().getFirstName().toUpperCase() + " " +
                    technician.getProfile().getLastName().toUpperCase() + " (" +
                    technician.getLocation().getCity().toUpperCase() + ")");

            // Add arrow if there's a next technician in the list
            if (i < technicianRotation.size() - 1) {
                System.out.print(" --> ");
            }
        }

        // Add a new line at the end of the output
        System.out.println();
    }

    private void processCommand(String command) {
        String[] tokens = command.split(",");
        switch (tokens[0]) {
            case "D":
                scheduleOfficeAppointment(tokens); // Schedule office appointment
                break;
            case "T":
                scheduleImagingAppointment(tokens); // Schedule imaging appointment
                break;
            case "C":
                cancelAppointment(tokens); // Cancel appointment
                break;
            case "R":
                rescheduleAppointment(tokens); // Reschedule appointment
                break;
            case "PO":
                displayOfficeAppointments(); // Display office appointments
                break;
            case "PI":
                displayImagingAppointments(); // Display imaging appointments
                break;
            case "PC":
                displayProviderCredits(); // Display provider credits
                break;
            case "PA":
                displayAllAppointments(); // Display all appointments
                break;
            case "PP":
                printByPatient();// Display patient profile
                break;
            case "PL":
                printByLocation();
                break;
            case "PS":
                displayBillingStatements();
                break;
            case "Q":
                System.out.println("Exiting Clinic Manager...");
                break;
            default:
                System.out.println("Invalid command.");
        }
    }

    private void displayAllAppointments() {
        if (appointments.isEmpty()) {
            System.out.println("Schedule calendar is empty.");
            return;
        }

        // Sort appointments by date, time, and provider's profile
       // Sort.sortByDateTimeAndProvider(appointments);
        Sort.sortAppointments(appointments,new char[]  {'D', 'T', 'R'});
        System.out.println("Appointments sorted by date/time/provider:");

        for (Appointment appointment : appointments) {
            System.out.println(appointment + " " + appointment.provider); // Calls toString on Appointment class
        }
        System.out.println("** end of list **");
    }

    /**
     * Schedules a new office appointment.
     */
    private void scheduleOfficeAppointment(String[] tokens) {
        try {
            if (tokens.length != 7) {
                throw new IllegalArgumentException("Missing data tokens.");
            }

            // Step 1: Parse date and timeslot
            Date date = Date.parse(tokens[1].trim());
            Appointment.isValid(date); // Validate the date

            Timeslot timeslot = Timeslot.fromSlotString(tokens[2].trim()); // From string to Timeslot

            // Step 2: Find or create the patient
            Profile patientProfile = new Profile(tokens[3], tokens[4], Date.parse(tokens[5].trim()));
            Patient patient = findOrCreatePatient(patientProfile);

            // Step 3: Check if the patient already has an appointment at the same time
            if (hasPatientAppointment(patient, date, timeslot)) {
                throw new IllegalArgumentException(
                        patientProfile + " has an existing appointment at the same time slot.");
            }

            // Step 4: Find the provider using NPI
            String npi = tokens[6];
            if (!isNumeric(npi)) {
                throw new IllegalArgumentException(npi + " provider doesn't exist.");
            }

            Provider provider = findProviderByNPI(npi);

            // Step 5: Check if the provider is available at the given slot
            if (hasProviderAppointment(provider, date, timeslot)) {
                throw new IllegalArgumentException(
                        provider + " is not available at slot " + timeslot.getSlotNumber());
            }

            // Step 6: Add appointment to the list and confirm the booking
            if (provider instanceof Doctor) {
                Appointment appointment = new Appointment(date, timeslot, patient, provider);
                appointments.add(appointment);

                // Print confirmation
                System.out.printf("%s %s booked.\n", appointment, provider);
            } else {
                System.out.println(npi + " - provider doesn't exist.");
            }

        } catch (Exception e) {
            System.out.println(e.getMessage()); // Display the error message
        }
    }

    // Helper method to check if the input is numeric
    private boolean isNumeric(String str) {
        return str != null && str.matches("[0-9]+");
    }

    // Method to check if the patient already has an appointment at the same date
    // and timeslot
    private boolean hasPatientAppointment(Patient patient, Date date, Timeslot timeslot) {
        for (Appointment appointment : appointments) {
            if (appointment.getPatient().equals(patient) &&
                    appointment.getDate().equals(date) &&
                    appointment.getTimeslot().equals(timeslot)) {
                return true;
            }
        }
        return false;
    }

    // Method to check if the provider has an appointment at the same date and
    // timeslot
    private boolean hasProviderAppointment(Provider provider, Date date, Timeslot timeslot) {
        for (Appointment appointment : appointments) {
            if (appointment.getProvider().equals(provider) &&
                    appointment.getDate().equals(date) &&
                    appointment.getTimeslot().equals(timeslot)) {
                return true;
            }
        }
        return false;
    }

    private Patient findOrCreatePatient(Profile patientProfile) {
        // Check if a patient with the given profile already exists in any appointment
        for (Appointment appointment : appointments) {
            if (appointment.getPatient().getProfile().equals(patientProfile)) {
                return (Patient) appointment.getPatient(); // Return the existing patient
            }
        }

        // If not found, create and return a new patient
        return new Patient(patientProfile);
    }

    /**
     * Schedules a new imaging appointment.
     */
    private void scheduleImagingAppointment(String[] tokens) {
        try {
            // Step 1: Parse the date, timeslot, and patient profile
            Date date = Date.parse(tokens[1].trim());
            Appointment.isValid(date);

            Timeslot timeslot = Timeslot.fromSlotString(tokens[2].trim());


            Profile patientProfile = new Profile(tokens[3], tokens[4], Date.parse(tokens[5].trim()));
            Patient patient = findOrCreatePatient(patientProfile);

            // Step 2: Check if the patient already has an appointment at the same time
            if (hasPatientAppointment(patient, date, timeslot)) {
                throw new IllegalArgumentException(
                        patientProfile + " has an existing appointment at the same time slot.");
            }

            // Step 3: Parse and validate the room
            Radiology room;
            try {
                room = Radiology.valueOf(tokens[6].trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException(tokens[6] + " - imaging service not provided.");
            }

            // Step 4: Get the next available technician for the imaging appointment
            Technician technician = assignAvailableTechnician(room, date, timeslot);

            // Step 5: If a technician is found, book the appointment
            if (technician != null) {
                Imaging imaging = new Imaging(date, timeslot, patient, technician, room);
                appointments.add(imaging);
                System.out.printf("%s %s [%s] booked.\n", imaging, technician, room);
            }
        } catch (Exception e) {
            // Handle errors during the scheduling process
            System.out.println(e.getMessage());
        }
    }

    private Technician assignAvailableTechnician(Radiology room, Date date, Timeslot timeslot) {
        int originalTechnicianIndex = currentTechnicianIndex;
        Technician selectedTechnician = null;

        // First, we try to find a technician from the specified location (either Bridgewater or Piscataway)
        for (int i = 0; i < technicianRotation.size(); i++) {
            Technician currentTechnician = technicianRotation.get(currentTechnicianIndex);
            Location currentLocation = currentTechnician.getLocation();

                // Step 1: Check if the technician is available at the given timeslot
                if (isTechnicianAvailable(currentTechnician, room, date, timeslot)) {
                    // Step 2: Check if the room at this technician's location is available
                    if (isRoomAvailable(currentLocation, room, date, timeslot)) {
                        selectedTechnician = currentTechnician; // Assign the available technician
                        rotateTechnicianList(); // Rotate to the next technician for future bookings
                        return selectedTechnician;
                    }
                }

            // Rotate to the next technician in the list
            rotateTechnicianList();

            // If we've looped through the list, break out of the loop
            if (currentTechnicianIndex == originalTechnicianIndex) {
                break;
            }
        }

        // If no technician was found, print the error
        System.out.printf("Cannot find an available technician at all locations for %s at slot %d.\n", room.name(),
                timeslot.getSlotNumber());

        return selectedTechnician;
    }

    /**
     * Rotates to the next technician in the circular list.
     */
    private void rotateTechnicianList() {
        currentTechnicianIndex = (currentTechnicianIndex + 1) % technicianRotation.size(); // Move to the next
                                                                                           // technician
    }

    private boolean isTechnicianAvailable(Technician currentTechnician, Radiology room, Date date, Timeslot timeslot) {
        // Check if the technician is already booked at the given timeslot
        for (Appointment appointment : appointments) {
            if (appointment instanceof Imaging) {
                Imaging imagingAppointment = (Imaging) appointment;

                // Check if the technician is booked at the same timeslot, date, and room
                if (imagingAppointment.getProvider().equals(currentTechnician) &&
                        imagingAppointment.getDate().equals(date) &&
                        imagingAppointment.getTimeslot().equals(timeslot)) {
                    return false; // Technician is already booked
                }
            }
        }
        return true; // Technician is available
    }

    
    private boolean isRoomAvailable(Location location, Radiology room, Date date, Timeslot timeslot) {
        // Loop through all existing appointments
        for (Appointment appointment : appointments) {
            // Check if the appointment is an Imaging appointment
            if (appointment instanceof Imaging) {
                Imaging imagingAppointment = (Imaging) appointment;

                // Retrieve the technician associated with this imaging appointment
                Technician technician = (Technician) imagingAppointment.getProvider();

                // Check if the appointment matches the location, room, date, and timeslot
                if (technician.getLocation().getCity().equals(location.getCity()) &&
                        imagingAppointment.getRoom().equals(room) &&
                        imagingAppointment.getDate().equals(date) &&
                        imagingAppointment.getTimeslot().equals(timeslot)) {
                    return false; // Room is already booked at this location for the specified time
                }
            }
        }
        return true; // No conflicting appointment found, the room is available
    }

    /**
     * Cancels an appointment based on date, timeslot, and patient profile.
     * 
     * @param tokens Input tokens containing the details for cancellation.
     *               tokens[1]: Date of the appointment
     *               tokens[2]: Timeslot of the appointment
     *               tokens[3]: Patient's first name
     *               tokens[4]: Patient's last name
     *               tokens[5]: Patient's date of birth
     */
    private void cancelAppointment(String[] tokens) {
        try {
            if (tokens.length != 6) {
                throw new IllegalArgumentException("Missing data tokens.");
            }
            // Step 1: Parse the date, timeslot, and patient profile
            Date date = Date.parse(tokens[1].trim());
            Timeslot timeslot = Timeslot.fromSlotNumber(Integer.parseInt(tokens[2].trim()));
            Profile patientProfile = new Profile(tokens[3].toLowerCase(), tokens[4].toLowerCase(),
                    Date.parse(tokens[5].trim()));

            boolean appointmentFound = false;

            // Step 2: Iterate through the appointments to find the matching one
            for (Appointment appointment : appointments) {
                Profile existingProfile = appointment.getPatient().getProfile();

                // Use equals method to compare profiles directly
                if (appointment.getDate().equals(date) &&
                        appointment.getTimeslot().equals(timeslot) &&
                        existingProfile.equals(patientProfile)) {

                    // Remove the appointment and print confirmation
                    appointments.remove(appointment);
                    System.out.println(timeslot + " " + date + " " + patientProfile.getFirstName() + " "
                            + patientProfile.getLastName() + " " + patientProfile.getDob()
                            + " - appointment has been canceled.");
                    appointmentFound = true;
                    break;
                }
            }

            // If no matching appointment was found
            if (!appointmentFound) {
                System.out.println(timeslot + " " + date + " " + patientProfile.getFirstName() + " "
                        + patientProfile.getLastName() + " - appointment does not exist.");
            }
        } catch (Exception e) {
            // Handle any parsing or other errors that may occur
            System.out.println(e.getMessage());
        }
    }

    /**
     * Reschedules an appointment.
     */
    private void rescheduleAppointment(String[] tokens) {
        try {
            // Ensure the correct number of tokens (R, date, oldTimeslot, firstName,
            // lastName, dob, newTimeslot)
            if (tokens.length != 7) {
                throw new IllegalArgumentException("Missing data tokens.");
            }

            // Step 1: Parse the date, timeslot, and patient profile
            Date date = Date.parse(tokens[1].trim()); // Parse the current appointment date
            Timeslot oldTimeslot = Timeslot.fromSlotNumber(Integer.parseInt(tokens[2].trim())); // Old timeslot
            Timeslot newTimeslot = Timeslot.fromSlotNumber(Integer.parseInt(tokens[6].trim())); // New timeslot
            Profile patientProfile = new Profile(tokens[3], tokens[4], Date.parse(tokens[5].trim())); // Parse the
                                                                                                      // profile

            boolean appointmentFound = false;

            // Step 2: Iterate through the appointments to find the matching one
            for (Appointment appointment : appointments) {
                Profile existingProfile = appointment.getPatient().getProfile();

                // Check if the appointment matches the date, old timeslot, and patient profile
                if (appointment.getDate().equals(date) &&
                        appointment.getTimeslot().equals(oldTimeslot) &&
                        existingProfile.equals(patientProfile)) {

                    // Step 3: Check if the patient already has an appointment at the new timeslot
                    if (hasPatientAppointment(appointment.getPatient(), date, newTimeslot)) {
                        System.out.println(patientProfile.getFirstName() + " " + patientProfile.getLastName()
                                + " has an existing appointment at " + date + " " + newTimeslot + ".");
                        return;
                    }

                    // Step 4: Reschedule the appointment to the new timeslot
                    appointment.setTimeslot(newTimeslot); // Assuming setTimeslot method exists
                    System.out.println("Rescheduled to " + appointment + " " + appointment.provider);
                    appointmentFound = true;
                    break;
                }
            }

            // If no matching appointment was found
            if (!appointmentFound) {
                System.out.println(date + " " + oldTimeslot + " " + patientProfile.getFirstName() + " "
                        + patientProfile.getLastName() + " does not exist.");
            }

        } catch (Exception e) {
            // Handle any parsing or other errors that may occur
            System.out.println(e.getMessage());
        }
    }

    private boolean hasPatientAppointment(Person patient, Date newDate, Timeslot newTimeslot) {
        // Iterate through the list of appointments
        for (Appointment appointment : appointments) {
            // Check if the appointment matches the patient, date, and timeslot
            if (appointment.getPatient().equals(patient) &&
                    appointment.getDate().equals(newDate) &&
                    appointment.getTimeslot().equals(newTimeslot)) {
                return true; // Patient has an appointment at the specified date and timeslot
            }
        }
        return false; // No matching appointment found for the patient
    }

    /**
     * Displays the list of providers ordered by last name.
     */
    private void displayProviders() {
        // Sort providers by profile (last name, first name, and date of birth)

        System.out.println("Providers loaded to the list.");

        // Iterate through sorted providers and print them
        for (Provider provider : providers) {
            if (provider instanceof Doctor) {
                System.out.printf("%s\n", provider.toString()); // Doctor's toString will format properly
            } else if (provider instanceof Technician) {
                System.out.printf("%s\n", provider.toString()); // Technician's toString will format properly
            }
        }
    }

    private void displayOfficeAppointments() {
        if (appointments.isEmpty()) {
            System.out.println("Schedule calendar is empty.");
            return;
        }

        System.out.println("** List of office appointments ordered by county/date/time.");

        // Filter only office appointments (those not instances of Imaging)
        List<Appointment> officeAppointments = new List<>();
        for (Appointment appointment : appointments) {
            if (!(appointment instanceof Imaging)) {
                officeAppointments.add(appointment);
            }
        }

        // Sort the office appointments by county, date, and time using the compareAppointments method
       // Sort.sortByCountyDateAndTime(officeAppointments);
        Sort.sortAppointments(officeAppointments, new char[] { 'L', 'D', 'T' });

        // Print the sorted list
        for (Appointment appointment : officeAppointments) {
            System.out.println(appointment + " " + appointment.provider);
        }

        System.out.println("** end of list **");
    }

    private void displayImagingAppointments() {
        if (appointments.isEmpty()) {
            System.out.println("Schedule calendar is empty.");
            return;
        }

        System.out.println("List of radiology appointments ordered by county/date/time.");

        // Filter only Imaging appointments
        List<Appointment> imagingAppointments = new List<>();
        for (Appointment appointment : appointments) {
            if (appointment instanceof Imaging) {
                imagingAppointments.add(appointment);
            }
        }

        // Sort the imaging appointments by county, date, and time
            Sort.sortAppointments(imagingAppointments, new char[] { 'L', 'D', 'T' });

        // Print the sorted list
        for (Appointment appointment : imagingAppointments) {
            Imaging imagingAppointment = (Imaging) appointment; // Cast to Imaging to access specific fields
            System.out.println(appointment +" " +appointment.provider + " ["+imagingAppointment.getRoom()+"]");
        }

        System.out.println("** end of list **");
    }

    /**
     * Displays provider credits.
     */
    private void displayProviderCredits() {
        if (appointments.isEmpty()) {
            System.out.println("Schedule calendar is empty.");
            return;
        }
        System.out.println("Provider Credits:");

        List<Provider> processedProviders = new List<>();
        List<Double> totalCredits = new List<>();

        // Accumulate credits per provider
        for (Appointment appointment : appointments) {
            Provider provider = (Provider)appointment.getProvider();
            double rate = provider.rate();

            int index = -1;
            // Check if the provider is already in the processedProviders list
            for (int i = 0; i < processedProviders.size(); i++) {
                if (processedProviders.get(i).equals(provider)) {
                    index = i;
                    break;
                }
            }
            if (index != -1) {
                // Provider already in the list, add to their total
                double currentTotal = totalCredits.get(index);
                totalCredits.set(index, currentTotal + rate);
            } else {
                // New provider, add to the list
                processedProviders.add(provider);
                totalCredits.add(rate);
            }
        }

        // Sort providers and credits
        char[] keys = { 'L', 'D' }; // Sort by last name and date of birth
        Sort.provider(processedProviders, totalCredits, keys);
        

        // Print out the providers and their total credits
        for (int i = 0; i < processedProviders.size(); i++) {
            Provider provider = processedProviders.get(i);
            double credits = totalCredits.get(i);
            System.out.printf("%s %s [credit amount: $%.2f]\n",
                    provider.getProfile().getFirstName() + " " + provider.getProfile().getLastName(),
                    provider.getProfile().getDob(), credits);
        }
        System.out.println("** end of list **");
    }

    /**
     * Finds a provider by their NPI.
     */
    private Provider findProviderByNPI(String npi) {
        for (Provider provider : providers) {
            if (provider instanceof Doctor && ((Doctor) provider).getNpi().equals(npi)) {
                return provider;
            }
        }
        return null;
    }

    private void printByPatient() {
        if (appointments.isEmpty()) {
            System.out.println("Schedule calendar is empty.");
            return;
        }

        // Sort appointments by patient profile
      //  Sort.sortByPatientDateAndTime(appointments); // Sorts by patient (last name, first name, dob), date, and time)
        Sort.sortAppointments(appointments, new char[] { 'P', 'D', 'T' });

        System.out.println("Appointments sorted by patient/date/time.:");
        for (Appointment appointment : appointments) {
            System.out.println(appointment + " " + appointment.provider); // Calls toString on Appointment class
        }
        System.out.println("** end of list **");
    }

    private void printByLocation() {
        if (appointments.isEmpty()) {
            System.out.println("Schedule calendar is empty.");
            return;
        }

        // Sort appointments by county and then date and time
       // Sort.sortByCountyDateAndTime(appointments);
        Sort.sortAppointments(appointments, new char[] { 'L', 'D', 'T' });

        System.out.println("Appointments sorted by county/date/time:");
        for (Appointment appointment : appointments) {
            System.out.println(appointment + " " + appointment.provider); // Calls toString on Appointment class
        }
        System.out.println("** end of list **");
    }

    private void displayBillingStatements() {
        if (appointments.isEmpty()) {
            System.out.println("Schedule calendar is empty.");
            return;
        }

        System.out.println("Billing Statements:");

        List<Profile> processedProfiles = new List<>();
        Sort.sortAppointments(appointments, new char[] { 'P', 'D', 'T' });

        for (int i = 0; i < appointments.size(); i++) {
            Appointment currentAppointment = appointments.get(i);
            Profile patientProfile = currentAppointment.getPatient().getProfile();

            // Check if we've already processed this patient profile
            boolean isProcessed = false;
            for (int j = 0; j < processedProfiles.size(); j++) {
                if (processedProfiles.get(j).equals(patientProfile)) {
                    isProcessed = true;
                    break;
                }
            }
            if (isProcessed) {
                continue;
            }

            // Accumulate charges for this unique patient
            double totalCharge = 0.0;
            for (int k = 0; k < appointments.size(); k++) {
                Appointment appointment = appointments.get(k);
                Profile appointmentProfile = appointment.getPatient().getProfile();
                if (appointmentProfile.equals(patientProfile)) {
                    Provider provider =(Provider) appointment.getProvider();
                    totalCharge += provider.rate();
                }
                
            }
           
            // Print the billing statement for this patient
            System.out.printf("%s %s %s - Total Charges: $%.2f\n",
                    patientProfile.getFirstName(),
                    patientProfile.getLastName(),
                    patientProfile.getDob(),
                    totalCharge);

            // Mark this patient profile as processed
            processedProfiles.add(patientProfile);
          
        }

        appointments =  new List<>();
        
        System.out.println("** end of billing statements **");
    }
}
