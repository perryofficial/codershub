public class Main {
    public static void main(String[] args) {
        int number = 4; // The number for which to print the multiplication table
        int limit = 10; // You can change this limit as needed

        System.out.println("Multiplication Table of " + number + ":");
        for (int i = 1; i <= limit; i++) {
            System.out.println(number + " x " + i + " = " + (number * i));
        }
    }
}
