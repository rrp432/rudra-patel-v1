package clinic;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.stage.FileChooser;
import javafx.stage.Stage;
import util.Date;
import util.Timeslot;
import util.List;
import util.Sort;

import java.io.File;
import java.io.FileNotFoundException;
import java.time.LocalDate;
import java.util.Scanner;

public class ClinicManagerController {
    @FXML private DatePicker appointmentDatePicker;
    @FXML private TextField firstNameField;
    @FXML private TextField lastNameField;
    @FXML private DatePicker birthDatePicker;
    @FXML private RadioButton officeVisitRadio;
    @FXML private RadioButton imagingServiceRadio;
    @FXML private ComboBox<String> timeslotCombo;
    @FXML private ComboBox<String> providerCombo;
    @FXML private ComboBox<String> roomCombo;  // Imaging room type ComboBox
    @FXML private Button loadProvidersButton;
    @FXML private TextArea outputArea;

    private List<Provider> providers = new List<>();
    private List<Technician> technicianRotation = new List<>();
    private int currentTechnicianIndex = 0;

    @FXML
    public void initialize() {
        populateTimeslotCombo();
        setupRoomCombo();
        providerCombo.getItems().clear();
        setupRadioButtonBehavior();
    }

    private void populateTimeslotCombo() {
        int slotNumber = 1;
        while (slotNumber <= 12) {
            Timeslot timeslot = Timeslot.fromSlotNumber(slotNumber);
            timeslotCombo.getItems().add(timeslot.toString());
            slotNumber++;
        }
    }

    private void setupRoomCombo() {
        // Add room types for imaging services
        roomCombo.getItems().addAll("X-RAY", "ULTRASOUND", "CAT-SCAN");
        roomCombo.setDisable(true); // Initially disabled until Imaging Service is selected
    }

    private void setupRadioButtonBehavior() {
        ToggleGroup appointmentTypeGroup = new ToggleGroup();
        officeVisitRadio.setToggleGroup(appointmentTypeGroup);
        imagingServiceRadio.setToggleGroup(appointmentTypeGroup);

        officeVisitRadio.setOnAction(event -> {
            providerCombo.setDisable(false); // Enable provider selection for office visits
            roomCombo.setDisable(true); // Disable room selection for office visits
        });

        imagingServiceRadio.setOnAction(event -> {
            providerCombo.setDisable(true); // Disable provider selection for imaging services
            roomCombo.setDisable(false); // Enable room selection for imaging services
        });
    }

    @FXML
    private void handleLoadProviders() {
        FileChooser fileChooser = new FileChooser();
        fileChooser.setTitle("Open Providers File");
        fileChooser.getExtensionFilters().add(new FileChooser.ExtensionFilter("Text Files", "*.txt"));

        File file = fileChooser.showOpenDialog(new Stage());
        if (file != null) {
            loadProvidersFromFile(file);
            loadProvidersButton.setDisable(true); // Disable button after loading
        }
    }

    private void loadProvidersFromFile(File file) {
        providerCombo.getItems().clear();

        try (Scanner scanner = new Scanner(file)) {
            while (scanner.hasNextLine()) {
                String[] data = scanner.nextLine().split("\\s+");
                try {
                    Location location = Location.createLocation(data[4]);

                    if (data[0].equals("D")) {
                        Profile profile = new Profile(data[1], data[2], Date.parse(data[3]));
                        Specialty specialty = Specialty.valueOf(data[5].toUpperCase());
                        String npi = data[6];
                        Doctor doctor = new Doctor(profile, location, specialty, npi);
                        providers.add(doctor);
                        providerCombo.getItems().add(doctor.getProfile().getFullName());
                    } else if (data[0].equals("T")) {
                        Profile profile = new Profile(data[1], data[2], Date.parse(data[3]));
                        int rate = Integer.parseInt(data[5]);
                        Technician technician = new Technician(profile, location, rate);
                        providers.add(technician);
                        technicianRotation.add(technician);
                    }
                } catch (Exception e) {
                    outputArea.appendText("Error processing provider: " + e.getMessage() + "\n");
                }
            }

            Sort.provider(providers, new char[]{'L', 'F', 'D'});
            Sort.reverseTechnicians(technicianRotation);

            outputArea.appendText("Providers loaded successfully.\nProviders List:\n");
            for (Provider provider : providers) {
                outputArea.appendText(provider.toString() + "\n");
            }
            outputArea.appendText("Rotation List:\n");
            displayRotationalTechnician();
        } catch (FileNotFoundException e) {
            outputArea.appendText("File not found: " + e.getMessage() + "\n");
        }
    }


    private void displayRotationalTechnician() {
        if (technicianRotation.isEmpty()) {
            outputArea.appendText("No technicians available in the rotation.");
            return;
        }

        System.out.println("Rotation list for the technicians:");

        for (int i = 0; i < technicianRotation.size(); i++) {
            Technician technician = technicianRotation.get(i);

            // Format and print the technician details
            outputArea.appendText(technician.getProfile().getFirstName().toUpperCase() + " " +
                    technician.getProfile().getLastName().toUpperCase() + " (" +
                    technician.getLocation().getCity().toUpperCase() + ")");

            // Add arrow if there's a next technician in the list
            if (i < technicianRotation.size() - 1) {
                outputArea.appendText(" --> ");
            }
        }

        // Add a new line at the end of the output
        outputArea.appendText("\n");

    }



    @FXML
    private void handleSchedule(ActionEvent actionEvent) {
        try {
            // Extract date values
            LocalDate localDate = appointmentDatePicker.getValue();
            Date appointmentDate = new Date(localDate.getMonthValue(), localDate.getDayOfMonth(), localDate.getYear());
            String firstName = firstNameField.getText();
            String lastName = lastNameField.getText();
            LocalDate birthLocalDate = birthDatePicker.getValue();
            Date birthDate = new Date(birthLocalDate.getMonthValue(), birthLocalDate.getDayOfMonth(), birthLocalDate.getYear());
            String timeslotStr = timeslotCombo.getValue();

            // Check if required fields are filled
            if (appointmentDate == null || firstName.isEmpty() || lastName.isEmpty() ||
                    birthDate == null || timeslotStr == null) {
                outputArea.appendText("Please complete all fields.\n");
                return;
            }

            // Convert the selected time string into the appropriate slot number
            Timeslot timeslot;
            try {
                timeslot = Timeslot.fromSlotString(timeslotStr); // Adjusted to handle formatted times directly
            } catch (IllegalArgumentException e) {
                outputArea.appendText("Error scheduling appointment: Invalid time selected: " + timeslotStr + "\n");
                return;
            }

            // Set up patient profile and proceed with appointment scheduling based on type
            Profile patientProfile = new Profile(firstName, lastName, birthDate);
            Patient patient = new Patient(patientProfile);

            if (officeVisitRadio.isSelected()) {
                // Office visit scheduling
                String providerName = providerCombo.getValue();
                Provider selectedProvider = findProviderByName(providerName);
                if (selectedProvider == null) {
                    outputArea.appendText("Selected provider not found.\n");
                    return;
                }
                Appointment appointment = new Appointment(appointmentDate, timeslot, patient, selectedProvider);
                outputArea.appendText("Scheduled appointment for " + patient.getProfile().getFullName() +
                        " with " + selectedProvider.getProfile().getFullName() + " at " + timeslotStr + ".\n");
            } else if (imagingServiceRadio.isSelected()) {
                // Imaging service scheduling
                String roomType = roomCombo.getValue();
                if (roomType == null) {
                    outputArea.appendText("Please select an imaging room type.\n");
                    return;
                }
                Technician technician = assignAvailableTechnician(appointmentDate, timeslot);
                if (technician == null) {
                    outputArea.appendText("No technician available for the selected timeslot.\n");
                    return;
                }
                Radiology room = Radiology.valueOf(roomType.replace("-", "_"));
                Imaging imaging = new Imaging(appointmentDate, timeslot, patient, technician, room);
                outputArea.appendText("Scheduled imaging appointment for " + patient.getProfile().getFullName() +
                        " with technician " + technician.getProfile().getFullName() + " at " + timeslotStr +
                        " in room " + room + ".\n");
            }
        } catch (Exception e) {
            outputArea.appendText("Error scheduling appointment: " + e.getMessage() + "\n");
        }
    }

    private Provider findProviderByName(String name) {
        for (Provider provider : providers) {
            if (provider instanceof Doctor && provider.getProfile().getFullName().equals(name)) {
                return provider;
            }
        }
        return null;
    }

    private Technician assignAvailableTechnician(Date date, Timeslot timeslot) {
        int originalIndex = currentTechnicianIndex;

        for (int i = 0; i < technicianRotation.size(); i++) {
            Technician technician = technicianRotation.get(currentTechnicianIndex);
            if (isTechnicianAvailable(technician, date, timeslot)) {
                rotateTechnicianList();
                return technician;
            }
            rotateTechnicianList();
            if (currentTechnicianIndex == originalIndex) break;
        }

        return null;
    }

    private void rotateTechnicianList() {
        currentTechnicianIndex = (currentTechnicianIndex + 1) % technicianRotation.size();
    }

    private boolean isTechnicianAvailable(Technician technician, Date date, Timeslot timeslot) {
        // Placeholder for availability check
        return true;
    }

    @FXML
    private void handleClear(ActionEvent event) {
        appointmentDatePicker.setValue(null);
        firstNameField.clear();
        lastNameField.clear();
        birthDatePicker.setValue(null);
        officeVisitRadio.setSelected(false);
        imagingServiceRadio.setSelected(false);
        timeslotCombo.getSelectionModel().clearSelection();
        providerCombo.getSelectionModel().clearSelection();
        roomCombo.getSelectionModel().clearSelection();
        outputArea.clear();
        outputArea.appendText("Form cleared.\n");
    }

    public void handleAppointmentTypeSelection(ActionEvent actionEvent) {}

    public void handleCancel(ActionEvent actionEvent) {}
}
