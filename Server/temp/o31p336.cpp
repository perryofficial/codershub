#include <stdio.h>

int main() {
    int sum = 0;
    for (int i = 1; i <= 20; ++i) {
        sum += i;
    }
    printf("Sum from 1 to 20: %d\n", sum);
    return 0;
}
