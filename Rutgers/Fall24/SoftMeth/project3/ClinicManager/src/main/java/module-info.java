module org.example.clinicmanager {
    requires javafx.controls;
    requires javafx.fxml;

    opens clinic to javafx.fxml;
    exports clinic;
}
