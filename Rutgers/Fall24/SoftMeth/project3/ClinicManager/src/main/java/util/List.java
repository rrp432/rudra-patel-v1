package util;
import java.util.Iterator;
import java.util.NoSuchElementException;

public class List<E> implements Iterable<E> {
    private E[] objects;
    private int size;

    // Default constructor with an initial capacity of 4
    public List() {
        objects = (E[]) new Object[4]; // Cast to E[]
        size = 0;
    }

    // Grows the internal array if capacity is reached
    private void grow() {
        E[] newObjects = (E[]) new Object[objects.length * 2]; // Double the capacity
        System.arraycopy(objects, 0, newObjects, 0, objects.length);
        objects = newObjects;
    }

    // Finds the index of a given element, returns -1 if not found
    private int find(E e) {
        for (int i = 0; i < size; i++) {
            if (objects[i].equals(e)) {
                return i;
            }
        }
        return -1; // Element not found
    }

    // Checks if the list contains a specific element
    public boolean contains(E e) {
        return find(e) != -1;
    }

    // Adds an element to the list, grows the list if needed
    public void add(E e) {
        if (size == objects.length) {
            grow(); // Grow the list if it is full
        }
        objects[size++] = e;
    }

    // Removes an element from the list, if it exists
    public void remove(E e) {
        int index = find(e);
        if (index != -1) {
            for (int i = index; i < size - 1; i++) {
                objects[i] = objects[i + 1]; // Shift elements to the left
            }
            size--;
            objects[size] = null; // Clear the last element
        }
    }

    // Checks if the list is empty
    public boolean isEmpty() {
        return size == 0;
    }

    // Returns the size of the list
    public int size() {
        return size;
    }

    // Returns the element at a given index
    public E get(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException("Index out of bounds: " + index);
        }
        return objects[index];
    }

    // Sets an element at a given index
    public void set(int index, E e) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException("Index out of bounds: " + index);
        }
        objects[index] = e;
    }

    // Returns the index of the given element, or -1 if not found
    public int indexOf(E e) {
        return find(e);
    }

    // Returns an iterator for the list
    @Override
    public Iterator<E> iterator() {
        return new ListIterator();
    }

    // Inner class for the list iterator
    private class ListIterator implements Iterator<E> {
        private int currentIndex = 0;

        @Override
        public boolean hasNext() {
            return currentIndex < size;
        }

        @Override
        public E next() {
            if (!hasNext()) {
                throw new NoSuchElementException();
            }
            return objects[currentIndex++];
        }
    }
}
