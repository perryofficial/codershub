#include <stdio.h>

int main() {
    int n = 10; // Change this to get more Fibonacci numbers
    int a = 0, b = 1;

    printf("Fibonacci Series: %d, %d", a, b);
    for (int i = 2; i < n; i++) {
        int c = a + b;
        printf(", %d", c);
        a = b;
        b = c;
    }
    printf("\n");
    return 0;
}
