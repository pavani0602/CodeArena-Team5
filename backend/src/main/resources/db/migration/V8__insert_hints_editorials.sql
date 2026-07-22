-- Add editorial for Two Sum
UPDATE problems
SET editorial_md = '### Approach: Hash Map
To solve this in O(n) time, we can use a Hash Map. 
As we iterate through the array, we check if the complement (`target - current_element`) exists in our map.
If it does, we found our pair! If not, we add the current element and its index to the map.

**Complexity Analysis**
- **Time Complexity:** O(n) because we traverse the list containing n elements exactly once.
- **Space Complexity:** O(n) because the hash table stores at most n elements.'
WHERE title = 'Two Sum';

-- Add editorial for Reverse String
UPDATE problems
SET editorial_md = '### Approach: Two Pointers
To reverse a string in-place, we can use the Two Pointers approach.
We initialize one pointer at the start (left) and one at the end (right) of the string.
We then swap the characters at these pointers and move them towards each other until they meet in the middle.

**Complexity Analysis**
- **Time Complexity:** O(N) to swap N/2 elements.
- **Space Complexity:** O(1) as it is done in-place.'
WHERE title = 'Reverse String';

-- Add hints for Two Sum
INSERT INTO problem_hints (problem_id, hint_number, hint_text)
SELECT id, 1, 'A really brute force way would be to search for all possible pairs of numbers but that would be too slow.'
FROM problems WHERE title = 'Two Sum'
AND NOT EXISTS (SELECT 1 FROM problem_hints WHERE problem_id = problems.id AND hint_number = 1);

INSERT INTO problem_hints (problem_id, hint_number, hint_text)
SELECT id, 2, 'So, if we fix one of the numbers, say x, we have to scan the entire array to find the next number y which is target - x. Can we change our array keeping a track of the elements to improve our runtime complexity?'
FROM problems WHERE title = 'Two Sum'
AND NOT EXISTS (SELECT 1 FROM problem_hints WHERE problem_id = problems.id AND hint_number = 2);

INSERT INTO problem_hints (problem_id, hint_number, hint_text)
SELECT id, 3, 'The second train of thought is, without changing the array, can we use additional space somehow? Like maybe a hash map to speed up the search?'
FROM problems WHERE title = 'Two Sum'
AND NOT EXISTS (SELECT 1 FROM problem_hints WHERE problem_id = problems.id AND hint_number = 3);

-- Add hints for Reverse String
INSERT INTO problem_hints (problem_id, hint_number, hint_text)
SELECT id, 1, 'The entire logic for reversing a string is based on using the opposite directional two-pointer approach!'
FROM problems WHERE title = 'Reverse String'
AND NOT EXISTS (SELECT 1 FROM problem_hints WHERE problem_id = problems.id AND hint_number = 1);

-- Add Starter Code for Two Sum
INSERT INTO problem_starter_codes (problem_id, language, code_template)
SELECT id, 'PYTHON', 'def twoSum(nums, target):
    # Write your code here
    pass

if __name__ == "__main__":
    nums = list(map(int, input().split()))
    target = int(input())
    ans = twoSum(nums, target)
    print(ans[0], ans[1])'
FROM problems WHERE title = 'Two Sum'
AND NOT EXISTS (SELECT 1 FROM problem_starter_codes WHERE problem_id = problems.id AND language = 'PYTHON');

INSERT INTO problem_starter_codes (problem_id, language, code_template)
SELECT id, 'JAVA', 'import java.util.*;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().split(" ");
        int[] nums = new int[parts.length];
        for(int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);
        int target = Integer.parseInt(sc.nextLine());
        int[] ans = twoSum(nums, target);
        System.out.println(ans[0] + " " + ans[1]);
    }
}'
FROM problems WHERE title = 'Two Sum'
AND NOT EXISTS (SELECT 1 FROM problem_starter_codes WHERE problem_id = problems.id AND language = 'JAVA');

INSERT INTO problem_starter_codes (problem_id, language, code_template)
SELECT id, 'CPP', '#include <iostream>
#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your code here
    return {};
}

int main() {
    vector<int> nums;
    int num, target;
    while(cin >> num) {
        nums.push_back(num);
        if (cin.peek() == ''\n'') break;
    }
    cin >> target;
    vector<int> ans = twoSum(nums, target);
    cout << ans[0] << " " << ans[1] << endl;
    return 0;
}'
FROM problems WHERE title = 'Two Sum'
AND NOT EXISTS (SELECT 1 FROM problem_starter_codes WHERE problem_id = problems.id AND language = 'CPP');
