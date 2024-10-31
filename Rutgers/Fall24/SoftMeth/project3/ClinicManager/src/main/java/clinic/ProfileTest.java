// package clinic;

// import org.junit.Test;
// import util.Date;

// import static org.junit.Assert.*;
// public class ProfileTest {
//     /**
//      * Test case #1: Last names differ, ("Brown" < "Smith" lexicographically) (returns -1)
//      */
//     @Test
//     public void testLastNameComparisonLessThan() {
//         Profile profile1 = new Profile("Karen", "Brown", new Date(10, 10, 1980));
//         Profile profile2 = new Profile("Markus", "Smith", new Date(5, 5, 1990));
//         assertEquals(-1, profile1.compareTo(profile2));
//     }
//     /**
//      * Test case #2: Same last names, but first names differ ("Markus" < "Sally") (returns -1)
//      */
//     @Test
//     public void testFirstNameComparisonLessThan() {
//         Profile profile1 = new Profile("Markus", "Smith", new Date(5, 5, 1990));
//         Profile profile2 = new Profile("Sally", "Smith", new Date(7, 7, 1999));
//         assertEquals(-1, profile1.compareTo(profile2));
//     }
//     /**
//      * Test case #3: Same first/last name but earlier DOB (1999 < 2003) (returns -1)
//      */
//     @Test
//     public void testDobComparisonLessThan() {
//         Profile profile1 = new Profile("Sally", "Smith", new Date(7, 7, 1999));
//         Profile profile2 = new Profile("Sally", "Smith", new Date(7, 7, 2003));
//         assertEquals(-1, profile1.compareTo(profile2));
//     }
//     /**
//      * Test case #4: Last name comparison reversed, "Smith" > "Brown" (returns 1)
//      */
//     @Test
//     public void testLastNameComparisonGreaterThan() {
//         Profile profile1 = new Profile("Markus", "Smith", new Date(5, 5, 1990));
//         Profile profile2 = new Profile("Karen", "Brown", new Date(10, 10, 1980));
//         assertEquals(1, profile1.compareTo(profile2));
//     }
//     /**
//      * Test case #5: Same last name, but first names differ ("Sally" > "Markus") (returns 1)
//      */
//     @Test
//     public void testFirstNameComparisonGreaterThan() {
//         Profile profile1 = new Profile("Sally", "Smith", new Date(7, 7, 1999));
//         Profile profile2 = new Profile("Markus", "Smith", new Date(5, 5, 1990));
//         assertEquals(1, profile1.compareTo(profile2));
//     }
//     /**
//      * Test case #6: Same first/last name but later DOB (2003 > 1999) (returns 1)
//      */
//     @Test
//     public void testDobComparisonGreaterThan() {
//         Profile profile1 = new Profile("Sally", "Smith", new Date(7, 7, 2003));
//         Profile profile2 = new Profile("Sally", "Smith", new Date(7, 7, 1999));
//         assertEquals(1, profile1.compareTo(profile2));
//     }
//     /**
//      * Test case #7: Identical profiles (returns 0)
//      */
//     @Test
//     public void testIdenticalProfiles() {
//         Profile profile1 = new Profile("Sally", "Smith", new Date(7, 7, 2003));
//         Profile profile2 = new Profile("Sally", "Smith", new Date(7, 7, 2003));
//         assertEquals(0, profile1.compareTo(profile2));
//     }
// }