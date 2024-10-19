#include <iostream>

int main() {
    int sum = 0;
    for (int i = 1; i <= 20; ++i) {
        sum += i;
    }
    std::cout << "Sum from 1 to 20: " << sum << std::endl;
    return 0;
}
