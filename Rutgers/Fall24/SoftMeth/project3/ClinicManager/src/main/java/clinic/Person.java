package clinic;

public class Person implements Comparable<Person> {
    protected Profile profile;

    public Person(Profile profile) {
        this.profile = profile;
    }

    @Override
    public int compareTo(Person other) {
        return this.profile.compareTo(other.profile);
    }

    @Override
    public String toString() {
        return profile.toString();
    }

    public Profile getProfile(){
        return profile;
    }
}
