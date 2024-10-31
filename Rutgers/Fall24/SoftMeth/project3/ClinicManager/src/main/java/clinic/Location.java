package clinic;

public class Location {
    private String city;
    private String county;
    private String zipCode;

    public Location(String city, String county, String zipCode) {
        this.city = city;
        this.county = county;
        this.zipCode = zipCode;
    }

    public String getCity() {
        return city;
    }

    public String getCounty() {
        return county;
    }

    public String getZipCode() {
        return zipCode;
    }

    @Override
    public String toString() {
        return String.format("%s, %s %s", city, county, zipCode);
    }

    // Static method to map city to county and zip code
    public static Location createLocation(String city) {
        switch (city.toUpperCase()) {
            case "BRIDGEWATER":
                return new Location("Bridgewater", "Somerset", "08807");
            case "EDISON":
                return new Location("Edison", "Middlesex", "08817");
            case "CLARK":
                return new Location("Clark", "Union", "07066");
            case "PISCATAWAY":
                return new Location("Piscataway", "Middlesex", "08854");
            case "PRINCETON":
                return new Location("Princeton", "Mercer", "08542");
            case "MORRISTOWN":
                return new Location("Morristown", "Morris", "07960");
            default:
                return new Location(city, "Unknown", "00000"); // Fallback for unknown city
        }
    }
}
