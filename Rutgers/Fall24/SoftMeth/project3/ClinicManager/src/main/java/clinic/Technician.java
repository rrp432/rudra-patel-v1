package clinic;

public class Technician extends Provider {
    private int ratePerVisit;

    public Technician(Profile profile, Location location, int ratePerVisit) {
        super(profile, location);
        this.ratePerVisit = ratePerVisit;
    }

    @Override
    public int rate() {
        return ratePerVisit;
    }

    @Override
    public String toString() {
        return super.toString() + String.format("[rate: $%.2f]", (double)this.rate());
    }

}
