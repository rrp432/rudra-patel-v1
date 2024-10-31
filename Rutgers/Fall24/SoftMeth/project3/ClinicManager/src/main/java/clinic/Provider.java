package clinic;

public abstract class Provider extends Person {
    private Location location;
   
    public Provider(Profile profile, Location location) {
        super(profile);
        this.location = location;
    }

    public Location getLocation() {
        return location;
    }

    // New method to access the profile's name directly from Provider
    public String getName() {
        return profile.getFirstName() + " "+ profile.getLastName();
    }

    public abstract int rate();

    @Override
   
   
    public String toString() {
        return String.format("[%s %s %s, %s, %s %s]",
                this.getProfile().getFirstName().toUpperCase(),
                this.getProfile().getLastName().toUpperCase(),
                this.getProfile().getDob(),
                this.getLocation().getCity().toUpperCase(),
                this.getLocation().getCounty(),
                this.getLocation().getZipCode());
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (!(obj instanceof Provider))
            return false;
        Provider other = (Provider) obj;
        // Assuming that the provider's profile uniquely identifies them
        return this.getProfile().equals(other.getProfile());
    }

}
