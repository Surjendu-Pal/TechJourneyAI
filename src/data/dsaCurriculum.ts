import { DSATopic } from '../types';

export const DSA_TOPICS: DSATopic[] = [
  {
    id: 'arrays',
    title: 'Arrays & Dynamic Arrays',
    category: 'Linear Data Structures',
    difficulty: 'Beginner',
    simpleExplanation: 'An Array is a contiguous block of memory holding elements of the same type. Accessing an element by its index is lightning fast O(1) because memory address = base_address + (index * element_size).',
    visualAscii: `
Index:     [ 0 ]    [ 1 ]    [ 2 ]    [ 3 ]    [ 4 ]
Memory:   0x1000   0x1004   0x1008   0x100C   0x1010
Values:  |  42  |  |  17  |  |  99  |  |   8  |  |  23  |
          ↑
   Instant O(1) jump directly to any slot!
`,
    example: 'Think of numbered lockers in a hallway. If you know locker #3, you walk directly to it without opening lockers 0, 1, or 2.',
    timeComplexity: 'Access: O(1) | Search: O(N) | Insertion (end): O(1) amortized | Insertion (middle): O(N)',
    spaceComplexity: 'O(N) to store N items',
    codeSnippets: {
      Python: `# Finding max element and prefix sums
def max_subarray_sum(nums):
    max_so_far = nums[0]
    curr_max = nums[0]
    for x in nums[1:]:
        curr_max = max(x, curr_max + x)
        max_so_far = max(max_so_far, curr_max)
    return max_so_far`,
      JavaScript: `// Prefix sum array
function runningSum(nums) {
  const result = [];
  let currentSum = 0;
  for (const n of nums) {
    currentSum += n;
    result.push(currentSum);
  }
  return result;
}`,
    },
    practiceProblems: [
      {
        id: 'array-two-sum',
        title: 'Two Sum Problem',
        difficulty: 'Easy',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may not use the same element twice.',
        starterCode: {
          JavaScript: `function twoSum(nums, target) {\n  // Write your solution here\n}`,
          Python: `def two_sum(nums, target):\n    # Write your solution here\n    pass`,
        },
        testCases: [
          { input: 'nums = [2, 7, 11, 15], target = 9', expected: '[0, 1]' },
          { input: 'nums = [3, 2, 4], target = 6', expected: '[1, 2]' },
        ],
        hints: [
          'Brute force checks every pair in O(N^2). Can we remember numbers we already visited?',
          'If current number is X, we need (target - X). What data structure checks existence in O(1)?',
          'Use a Hash Map storing value -> index as you iterate through the array once.',
        ],
        solutionApproach: 'One-pass Hash Table: As we iterate, check if target - num exists in map. If yes, return [map[target-num], currentIndex]. Otherwise store map[num] = currentIndex. Time O(N), Space O(N).',
      },
    ],
    quiz: [
      {
        id: 'arr-q1',
        question: 'What is the time complexity of inserting an item at the beginning of an array of length N?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
        correctIndex: 2,
        explanation: 'Every existing element must be shifted one position to the right to make room at index 0, taking O(N) operations.',
        conceptTag: 'Array shifting',
      },
      {
        id: 'arr-q2',
        question: 'Why does accessing an element in an array by index take O(1) time?',
        options: ['Arrays are cached in CPU registers', 'Memory is contiguous so index arithmetic directly computes address', 'The array creates a binary search tree internally', 'Hash functions map indices instantly'],
        correctIndex: 1,
        explanation: 'Address = base + (index * element_size). A single multiplication and addition calculates the physical RAM address immediately.',
        conceptTag: 'Memory indexing',
      },
    ],
    revisionTips: [
      'Remember boundary checks: 0 <= index < len(arr).',
      'Look out for Off-by-One errors when looping.',
      'Consider two pointers or prefix sums before resorting to nested loops.',
    ],
  },
  {
    id: 'strings',
    title: 'Strings & Character Manipulation',
    category: 'Linear Data Structures',
    difficulty: 'Beginner',
    simpleExplanation: 'Strings are sequences of characters. In languages like Python and JavaScript/Java, strings are immutable, meaning modifying a string creates a new copy O(N). Always use arrays or StringBuilder when doing repeated concatenations.',
    visualAscii: `
String: "C  O  D  E"
Index:   0  1  2  3
ASCII:  67 79 68 69

In memory: [ 'C' ] -> [ 'O' ] -> [ 'D' ] -> [ 'E' ]
Immutable: "CODE" + "R" allocates a fresh 5-character string!
`,
    example: 'Checking whether a phrase reads the same backward as forward (Palindrome) is solved by placing one pointer at the start and one at the end.',
    timeComplexity: 'Length check: O(1) | Character access: O(1) | Concatenation (+): O(N + M)',
    spaceComplexity: 'O(N) for string representations',
    codeSnippets: {
      JavaScript: `function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
      Python: `def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t): return False
    counts = {}
    for c in s: counts[c] = counts.get(c, 0) + 1
    for c in t:
        if c not in counts or counts[c] == 0: return False
        counts[c] -= 1
    return True`,
    },
    practiceProblems: [
      {
        id: 'string-valid-palindrome',
        title: 'Valid Palindrome',
        difficulty: 'Easy',
        description: 'A phrase is a palindrome if, after converting all uppercase letters to lowercase and removing non-alphanumeric characters, it reads the same forward and backward.',
        starterCode: {
          JavaScript: `function isPalindrome(s) {\n  // Code here\n}`,
          Python: `def is_palindrome(s: str) -> bool:\n    # Code here\n    pass`,
        },
        testCases: [
          { input: 's = "A man, a plan, a canal: Panama"', expected: 'true' },
          { input: 's = "race a car"', expected: 'false' },
        ],
        hints: [
          'Can you ignore spaces and punctuation while comparing characters?',
          'Use two pointers: one starting from index 0, one from index len - 1.',
          'Skip non-alphanumeric characters with pointer increments before comparing.',
        ],
        solutionApproach: 'Two pointer technique with in-place skipping of non-alphanumeric characters. Time O(N), Space O(1).',
      },
    ],
    quiz: [
      {
        id: 'str-q1',
        question: 'In Python and Java, what is the complexity of repeatedly doing `s += char` inside an N-iteration loop?',
        options: ['O(N)', 'O(N log N)', 'O(N^2)', 'O(1)'],
        correctIndex: 2,
        explanation: 'Because strings are immutable, each concatenation allocates a new string copy of growing size 1 + 2 + ... + N = O(N^2). Use a list or StringBuilder instead!',
        conceptTag: 'String immutability',
      },
    ],
    revisionTips: [
      'Character frequency tables with 26 letters (int[26]) are much faster than HashMaps.',
      'Check string emptiness and single-char edge cases.',
    ],
  },
  {
    id: 'searching',
    title: 'Searching & Binary Search',
    category: 'Algorithms',
    difficulty: 'Beginner',
    simpleExplanation: 'Linear search scans every element O(N). When data is sorted, Binary Search repeatedly divides the search space in half by comparing the middle element with the target. This gives phenomenal O(log N) speed.',
    visualAscii: `
Target: 23
Array: [ 2, 5, 8, 12, 16, 23, 38, 56, 72, 91 ]
Step 1: mid = 16 (23 > 16) -> Search right half [ 23, 38, 56, 72, 91 ]
Step 2: mid = 56 (23 < 56) -> Search left half  [ 23, 38 ]
Step 3: mid = 23 (Match!) -> Found in 3 steps instead of 6!
`,
    example: 'Finding a word in a printed 1000-page physical dictionary by opening to the middle rather than turning page by page.',
    timeComplexity: 'Linear Search: O(N) | Binary Search: O(log N)',
    spaceComplexity: 'Iterative Binary Search: O(1) | Recursive: O(log N) stack',
    codeSnippets: {
      JavaScript: `function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    // Avoid integer overflow
    const mid = Math.floor(low + (high - low) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
    },
    practiceProblems: [
      {
        id: 'bs-search-insert',
        title: 'Search Insert Position',
        difficulty: 'Easy',
        description: 'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.',
        starterCode: {
          JavaScript: `function searchInsert(nums, target) {\n  // Code here\n}`,
        },
        testCases: [
          { input: 'nums = [1, 3, 5, 6], target = 5', expected: '2' },
          { input: 'nums = [1, 3, 5, 6], target = 2', expected: '1' },
          { input: 'nums = [1, 3, 5, 6], target = 7', expected: '4' },
        ],
        hints: [
          'The array is sorted, which strongly suggests Binary Search.',
          'What happens to the `low` pointer when `low > high` terminates the loop?',
          'The `low` pointer will end up exactly at the correct insertion index!',
        ],
        solutionApproach: 'Standard binary search. When element is not found, low points to the exact first element greater than target, which is the insertion index.',
      },
    ],
    quiz: [
      {
        id: 'bs-q1',
        question: 'How many maximum comparisons does Binary Search need for an array of 1,000,000 sorted elements?',
        options: ['1,000,000', '500,000', '~20', '~100'],
        correctIndex: 2,
        explanation: 'log2(1,000,000) ≈ 19.93. In at most 20 comparisons, binary search finds the element or proves it is absent!',
        conceptTag: 'Logarithmic growth',
      },
    ],
    revisionTips: [
      'Calculate mid with `low + (high - low) / 2` to prevent 32-bit integer overflow.',
      'Check loop condition: `low <= high` vs `low < high`.',
    ],
  },
  {
    id: 'sorting',
    title: 'Sorting Algorithms',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    simpleExplanation: 'Sorting arranges elements in a specified order. Elementary sorts (Bubble, Selection, Insertion) take O(N^2). Divide-and-Conquer algorithms like Merge Sort and Quick Sort achieve O(N log N).',
    visualAscii: `
Merge Sort (Divide & Conquer):
               [ 38, 27, 43, 3, 9, 82, 10 ]
             /                             \\
     [ 38, 27, 43, 3 ]              [ 9, 82, 10 ]
       /          \\                   /         \\
  [ 38, 27 ]    [ 43, 3 ]          [ 9, 82 ]    [ 10 ]
   (DIVIDE down to single elements, then MERGE in sorted order!)
`,
    example: 'Organizing a hand of playing cards: you can insert each card into its correct position (Insertion Sort) or split the deck (Merge Sort).',
    timeComplexity: 'Merge Sort: O(N log N) always | Quick Sort: O(N log N) avg, O(N^2) worst | Bubble/Insert: O(N^2)',
    spaceComplexity: 'Merge Sort: O(N) auxiliary | Quick Sort: O(log N) stack | In-place sorts: O(1)',
    codeSnippets: {
      JavaScript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const sorted = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) sorted.push(left[i++]);
    else sorted.push(right[j++]);
  }
  return sorted.concat(left.slice(i)).concat(right.slice(j));
}`,
    },
    practiceProblems: [
      {
        id: 'sort-merge-intervals',
        title: 'Merge Intervals',
        difficulty: 'Medium',
        description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals.',
        starterCode: {
          JavaScript: `function mergeIntervals(intervals) {\n  // Code here\n}`,
        },
        testCases: [
          { input: '[[1,3],[2,6],[8,10],[15,18]]', expected: '[[1,6],[8,10],[15,18]]' },
          { input: '[[1,4],[4,5]]', expected: '[[1,5]]' },
        ],
        hints: [
          'If intervals are unordered, you must check every interval with every other. What happens if you sort them first?',
          'Sort intervals by their start time.',
          'Iterate through sorted intervals: if current start <= previous end, merge them by setting previous end = max(previous end, current end).',
        ],
        solutionApproach: 'Sort intervals by start times in O(N log N). Single pass merge in O(N). Total Time O(N log N), Space O(N).',
      },
    ],
    quiz: [
      {
        id: 'sort-q1',
        question: 'Which sorting algorithm guarantees O(N log N) worst-case time complexity while being stable?',
        options: ['Quick Sort', 'Merge Sort', 'Heap Sort', 'Selection Sort'],
        correctIndex: 1,
        explanation: 'Merge Sort guarantees O(N log N) in all cases (worst, best, average) and maintains the relative order of duplicate items (stable).',
        conceptTag: 'Sorting stability',
      },
    ],
    revisionTips: [
      'Stability matters when sorting records by multiple keys.',
      'JavaScript Array.prototype.sort() uses Timsort (hybrid merge/insertion sort).',
    ],
  },
  {
    id: 'hashing',
    title: 'Hashing & Hash Tables',
    category: 'Data Structures',
    difficulty: 'Beginner',
    simpleExplanation: 'A Hash Table maps keys to values using a Hash Function. A good hash function uniformly distributes keys across buckets to achieve average O(1) insertion, deletion, and lookup.',
    visualAscii: `
Key: "apple" -> Hash Function -> Index: 3
Key: "banana" -> Hash Function -> Index: 7

Bucket Array:
[ 0 ] -> null
[ 3 ] -> [ "apple" : $1.20 ]
[ 7 ] -> [ "banana" : $0.75 ]
`,
    example: 'Looking up a friend contact by name in a phone contacts app takes constant time due to hashing.',
    timeComplexity: 'Average: Insert O(1), Delete O(1), Lookup O(1) | Worst (Collision collapse): O(N)',
    spaceComplexity: 'O(N) to store key-value pairs',
    codeSnippets: {
      JavaScript: `// Frequency Counter Pattern
function topKFrequent(nums, k) {
  const map = new Map();
  for (const n of nums) map.set(n, (map.get(n) || 0) + 1);
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(entry => entry[0]);
}`,
    },
    practiceProblems: [
      {
        id: 'hash-contains-duplicate',
        title: 'Contains Duplicate',
        difficulty: 'Easy',
        description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
        starterCode: {
          JavaScript: `function containsDuplicate(nums) {\n  // Code here\n}`,
        },
        testCases: [
          { input: 'nums = [1, 2, 3, 1]', expected: 'true' },
          { input: 'nums = [1, 2, 3, 4]', expected: 'false' },
        ],
        hints: [
          'What happens if you insert numbers into a Set?',
          'A Set only stores unique values. Check if item already exists before adding.',
          'If set.has(n) is true, return true immediately. Time O(N), Space O(N).',
        ],
        solutionApproach: 'Hash Set lookup. If current element in set, return true. Otherwise add to set.',
      },
    ],
    quiz: [
      {
        id: 'hash-q1',
        question: 'What is a Hash Collision?',
        options: ['When memory runs out', 'When two different keys generate the same bucket index', 'When a key is null', 'When the hash table is sorted'],
        correctIndex: 1,
        explanation: 'When hash(key1) == hash(key2), a collision occurs, handled by chaining (linked lists) or open addressing.',
        conceptTag: 'Collisions',
      },
    ],
    revisionTips: [
      'Load factor = items / buckets. Re-hashing occurs when load factor exceeds ~0.75.',
      'Remember Javascript object keys convert to strings; use `Map` for arbitrary key types.',
    ],
  },
  {
    id: 'two-pointers',
    title: 'Two Pointers Technique',
    category: 'Algorithmic Patterns',
    difficulty: 'Intermediate',
    simpleExplanation: 'The Two Pointers pattern uses two indices to traverse a data structure simultaneously, typically converging from opposite ends or moving at different speeds (fast & slow), reducing O(N^2) checks to O(N).',
    visualAscii: `
Sorted Array: [ 1,  2,  4,  6,  8,  11,  15 ]   Target = 14
                ↑                         ↑
             Left (1)                 Right (15)   Sum = 16 > 14 (Too big! Right--)

Sorted Array: [ 1,  2,  4,  6,  8,  11,  15 ]
                ↑                   ↑
             Left (1)            Right (11)        Sum = 12 < 14 (Too small! Left++)
`,
    example: 'Two people walking towards each other from opposite ends of a bridge until they meet.',
    timeComplexity: 'O(N) single-pass traversal',
    spaceComplexity: 'O(1) auxiliary space (in-place)',
    codeSnippets: {
      JavaScript: `function twoSumSorted(numbers, target) {
  let left = 0, right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    if (sum < target) left++;
    else right--;
  }
  return [];
}`,
    },
    practiceProblems: [
      {
        id: 'tp-container-water',
        title: 'Container With Most Water',
        difficulty: 'Medium',
        description: 'You are given an integer array height of length n. Find two lines that together with the x-axis form a container, such that the container contains the most water.',
        starterCode: {
          JavaScript: `function maxArea(height) {\n  // Code here\n}`,
        },
        testCases: [
          { input: 'height = [1,8,6,2,5,4,8,3,7]', expected: '49' },
          { input: 'height = [1,1]', expected: '1' },
        ],
        hints: [
          'Area = width * min(height[left], height[right]).',
          'Start with the maximum width: left = 0, right = len - 1.',
          'To possibly find a larger area, which pointer should move? The shorter one!',
        ],
        solutionApproach: 'Two pointers at ends. Compute area, update max, move the pointer pointing to the shorter vertical bar.',
      },
    ],
    quiz: [
      {
        id: 'tp-q1',
        question: 'When is the converging Two Pointers technique applicable?',
        options: ['Only on unsorted graphs', 'Primarily on sorted arrays or palindromic strings', 'Only on binary trees', 'Only with negative numbers'],
        correctIndex: 1,
        explanation: 'Because monotonic order allows deciding deterministically whether to move left++ (increase sum) or right-- (decrease sum).',
        conceptTag: 'Monotonicity',
      },
    ],
    revisionTips: [
      'Check while loop condition: `left < right` for distinct pairs, `left <= right` if checking single center element.',
    ],
  },
  {
    id: 'sliding-window',
    title: 'Sliding Window',
    category: 'Algorithmic Patterns',
    difficulty: 'Intermediate',
    simpleExplanation: 'Sliding Window maintains a subarray (window) that expands and contracts as it slides across an array or string. It converts expensive re-computations from O(N * K) to O(N).',
    visualAscii: `
Array: [ 2, 1, 5, 1, 3, 2 ], Window size K = 3
Step 1: [ 2, 1, 5 ] 1  3  2  -> Sum = 8
Step 2:   2 [ 1, 5, 1 ] 3  2  -> Sum = 8 - 2 + 1 = 7  (Add right, subtract left!)
Step 3:   2  1 [ 5, 1, 3 ] 2  -> Sum = 7 - 1 + 3 = 9
`,
    example: 'Looking through the moving viewfinder of a camera across a panoramic photo.',
    timeComplexity: 'O(N) since each element enters and leaves the window at most once',
    spaceComplexity: 'O(1) or O(K) for character frequency map',
    codeSnippets: {
      JavaScript: `function maxSubArrayLen(nums, k) {
  let maxSum = 0, windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i];
  maxSum = windowSum;
  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}`,
    },
    practiceProblems: [
      {
        id: 'sw-longest-substring',
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'Medium',
        description: 'Given a string s, find the length of the longest substring without repeating characters.',
        starterCode: {
          JavaScript: `function lengthOfLongestSubstring(s) {\n  // Code here\n}`,
        },
        testCases: [
          { input: 's = "abcabcbb"', expected: '3' },
          { input: 's = "bbbbb"', expected: '1' },
          { input: 's = "pwwkew"', expected: '3' },
        ],
        hints: [
          'Use a dynamic sliding window: [left, right].',
          'Use a Set or Map to store characters inside the current window.',
          'When you see a duplicate at s[right], contract window from left until duplicate is removed.',
        ],
        solutionApproach: 'Sliding window with Set. Expand right pointer. If char in set, delete s[left] and increment left. Track max(maxLength, right - left + 1). Time O(N), Space O(min(N, alphabet size)).',
      },
    ],
    quiz: [
      {
        id: 'sw-q1',
        question: 'Why is the time complexity of dynamic sliding window O(N) even with a nested while loop?',
        options: ['Because it is an approximation', 'Each element is added once by right and removed at most once by left', 'Because strings are small', 'It is actually O(N^2) in worst case'],
        correctIndex: 1,
        explanation: 'Amortized analysis: both left and right pointers only move forward up to N times. 2N operations = O(N).',
        conceptTag: 'Amortized O(N)',
      },
    ],
    revisionTips: [
      'Two types: Fixed-size window (size K) and Dynamic-size window (find longest/shortest condition).',
    ],
  },
  {
    id: 'linked-lists',
    title: 'Linked Lists',
    category: 'Linear Data Structures',
    difficulty: 'Beginner',
    simpleExplanation: 'A Linked List is a linear collection of data elements called nodes, where each node points to the next node via a pointer. Unlike arrays, nodes are not stored contiguously in memory.',
    visualAscii: `
[ Head: 12 | •-]--->[ Val: 99 | •-]--->[ Val: 37 | null ]
       Node 1              Node 2              Node 3
`,
    example: 'A treasure hunt where each clue contains a hint leading to the location of the next clue.',
    timeComplexity: 'Access: O(N) | Insertion at Head: O(1) | Insertion in Middle: O(N)',
    spaceComplexity: 'O(N) with extra pointer overhead per node',
    codeSnippets: {
      JavaScript: `class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseList(head) {
  let prev = null, curr = head;
  while (curr !== null) {
    const nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}`,
    },
    practiceProblems: [
      {
        id: 'll-reverse',
        title: 'Reverse Linked List',
        difficulty: 'Easy',
        description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
        starterCode: {
          JavaScript: `function reverseList(head) {\n  // Code here\n}`,
        },
        testCases: [
          { input: 'head = [1,2,3,4,5]', expected: '[5,4,3,2,1]' },
          { input: 'head = [1,2]', expected: '[2,1]' },
        ],
        hints: [
          'You need three pointers: prev, curr, and nextTemp.',
          'Save curr.next before changing it, otherwise you lose the rest of the list!',
          'Point curr.next = prev, then slide prev and curr forward.',
        ],
        solutionApproach: 'Iterative 3-pointer approach. Time O(N), Space O(1).',
      },
    ],
    quiz: [
      {
        id: 'll-q1',
        question: 'What is the Floyd Cycle Detection (Tortoise and Hare) algorithm used for in Linked Lists?',
        options: ['Sorting nodes in O(N)', 'Detecting if a loop/cycle exists in O(N) time and O(1) space', 'Reversing doubly linked lists', 'Balancing binary search trees'],
        correctIndex: 1,
        explanation: 'A slow pointer moves 1 step and a fast pointer moves 2 steps. If there is a cycle, they are guaranteed to meet inside the loop.',
        conceptTag: 'Floyd Cycle Detection',
      },
    ],
    revisionTips: [
      'Always consider Dummy/Sentinel head nodes to simplify edge cases with head insertions/deletions.',
      'Check for null pointer exceptions when accessing curr.next.next.',
    ],
  },
  {
    id: 'stacks',
    title: 'Stacks (LIFO)',
    category: 'Linear Data Structures',
    difficulty: 'Beginner',
    simpleExplanation: 'A Stack follows the Last-In, First-Out (LIFO) principle. The last item pushed onto the stack is the first item popped off. Essential for undo/redo, call stacks, syntax parsing, and monotonic stacks.',
    visualAscii: `
Push(30)       Pop() -> Returns 30!
  |              |
  v              v
| 30 |  <-- Top of stack
| 20 |
| 10 |
+----+
`,
    example: 'A stack of dinner plates in a cafeteria. You take the top plate off first.',
    timeComplexity: 'Push: O(1) | Pop: O(1) | Peek/Top: O(1) | Search: O(N)',
    spaceComplexity: 'O(N) to store N items',
    codeSnippets: {
      JavaScript: `function isValidParentheses(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else if (stack.length === 0 || stack.pop() !== map[char]) {
      return false;
    }
  }
  return stack.length === 0;
}`,
    },
    practiceProblems: [
      {
        id: 'stack-valid-brackets',
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        starterCode: {
          JavaScript: `function isValid(s) {\n  // Code here\n}`,
        },
        testCases: [
          { input: 's = "()"', expected: 'true' },
          { input: 's = "()[]{}"', expected: 'true' },
          { input: 's = "(]"', expected: 'false' },
        ],
        hints: [
          'When you encounter an opening bracket, push it onto the stack.',
          'When you encounter a closing bracket, check if top of stack matches.',
          'If stack is empty at the end, parentheses were properly closed and nested.',
        ],
        solutionApproach: 'Stack matching. Push openers, pop and compare on closers. Return stack.length === 0.',
      },
    ],
    quiz: [
      {
        id: 'stack-q1',
        question: 'What is a Monotonic Stack used for?',
        options: ['Sorting random arrays in O(1)', 'Finding the Next Greater / Smaller Element in O(N)', 'Reversing a graph in O(log N)', 'Encrypting passwords'],
        correctIndex: 1,
        explanation: 'A monotonic stack maintains elements in either increasing or decreasing order, allowing Next Greater Element problems in linear O(N) time.',
        conceptTag: 'Monotonic Stack',
      },
    ],
    revisionTips: [
      'Always verify `stack.length > 0` before calling peek or pop.',
    ],
  },
  {
    id: 'queues',
    title: 'Queues & Deques (FIFO)',
    category: 'Linear Data Structures',
    difficulty: 'Beginner',
    simpleExplanation: 'A Queue follows First-In, First-Out (FIFO). The first item enqueued is the first item dequeued. Core to Breadth-First Search (BFS), task scheduling, and buffering.',
    visualAscii: `
Enqueue(40) ---> [ 40 | 30 | 20 | 10 ] ---> Dequeue() -> Returns 10!
                (Rear / Back)        (Front / Head)
`,
    example: 'A checkout line at a grocery store. The first customer in line gets served first.',
    timeComplexity: 'Enqueue: O(1) | Dequeue: O(1) with pointer/doubly-linked | Peek: O(1)',
    spaceComplexity: 'O(N)',
    codeSnippets: {
      JavaScript: `// Queue using array pointers for O(1) dequeue
class FastQueue {
  constructor() {
    this.items = [];
    this.head = 0;
  }
  enqueue(val) { this.items.push(val); }
  dequeue() {
    if (this.isEmpty()) return null;
    return this.items[this.head++];
  }
  isEmpty() { return this.head >= this.items.length; }
}`,
    },
    practiceProblems: [
      {
        id: 'queue-stack-impl',
        title: 'Implement Queue using Stacks',
        difficulty: 'Easy',
        description: 'Implement a first in first out (FIFO) queue using only two stacks.',
        starterCode: {
          JavaScript: `class MyQueue {\n  constructor() {}\n  push(x) {}\n  pop() {}\n  peek() {}\n  empty() {}\n}`,
        },
        testCases: [
          { input: 'push(1), push(2), peek(), pop(), empty()', expected: 'peek=1, pop=1, empty=false' },
        ],
        hints: [
          'Stack is LIFO. Reversing a reverse gives the original order!',
          'Use two stacks: inStack for push, and outStack for pop/peek.',
          'Only transfer elements from inStack to outStack when outStack is empty.',
        ],
        solutionApproach: 'Two stacks: push into inStack. For pop/peek, if outStack is empty, pop all from inStack to outStack. Amortized O(1) per operation.',
      },
    ],
    quiz: [
      {
        id: 'queue-q1',
        question: 'Why is `Array.prototype.shift()` inefficient for implementing large queues in JavaScript?',
        options: ['It crashes Chrome', 'It re-indexes all remaining N-1 elements, making dequeue O(N)', 'It can only store numbers', 'It mutates the memory address'],
        correctIndex: 1,
        explanation: 'shift() removes element 0 and shifts every subsequent element left, taking O(N) time per dequeue.',
        conceptTag: 'Queue efficiency',
      },
    ],
    revisionTips: [
      'In BFS graph/tree traversals, always track queue length at the start of each level loop.',
    ],
  },
  {
    id: 'recursion',
    title: 'Recursion & Call Stacks',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    simpleExplanation: 'Recursion is a programming technique where a function calls itself to solve smaller subproblems of the same type. Every recursive function must have at least one Base Case to stop infinite loops.',
    visualAscii: `
factorial(3)
  └── 3 * factorial(2)
            └── 2 * factorial(1)
                      └── Base case: 1!
                      Returns 1
            Returns 2 * 1 = 2
  Returns 3 * 2 = 6
`,
    example: 'Russian Matryoshka nesting dolls: opening a doll reveals a smaller identical doll until the tiny solid core (base case) is reached.',
    timeComplexity: 'Depends on branches^depth. Single branch = O(N), Binary tree = O(2^N) without memoization',
    spaceComplexity: 'O(depth) memory on the call stack',
    codeSnippets: {
      JavaScript: `function fibonacciMemo(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n] !== undefined) return memo[n];
  memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
  return memo[n];
}`,
    },
    practiceProblems: [
      {
        id: 'rec-power',
        title: 'Pow(x, n) - Fast Exponentiation',
        difficulty: 'Medium',
        description: 'Implement pow(x, n), which calculates x raised to the power n (i.e., x^n) in O(log n) time.',
        starterCode: {
          JavaScript: `function myPow(x, n) {\n  // Code here\n}`,
        },
        testCases: [
          { input: 'x = 2.00000, n = 10', expected: '1024.00000' },
          { input: 'x = 2.10000, n = 3', expected: '9.26100' },
        ],
        hints: [
          'Linear multiplication x * x * ... * x takes O(N) which times out for large n.',
          'Notice that x^10 = (x^5)^2. And x^5 = x * (x^2)^2.',
          'Divide n by 2 at each step to achieve O(log N) depth.',
        ],
        solutionApproach: 'Binary exponentiation: if n % 2 === 0, return myPow(x*x, n/2). Else return x * myPow(x*x, (n-1)/2). Handle negative n with 1/x.',
      },
    ],
    quiz: [
      {
        id: 'rec-q1',
        question: 'What error occurs when a recursive function lacks a valid base case?',
        options: ['Memory leak in heap', 'Stack Overflow (Maximum call stack size exceeded)', 'SyntaxError', 'Null Pointer Exception'],
        correctIndex: 1,
        explanation: 'Each function invocation allocates a stack frame on the execution call stack until reserved thread stack memory is exhausted.',
        conceptTag: 'Stack overflow',
      },
    ],
    revisionTips: [
      'Write the base case first before writing any recursive logic.',
      'Trust the recursive leap of faith: assume the recursive call works for subproblem N-1.',
    ],
  },
  {
    id: 'backtracking',
    title: 'Backtracking',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    simpleExplanation: 'Backtracking is an algorithmic paradigm that systematically searches for solutions by trying partial candidates, abandoning ("backtracking") as soon as it determines the candidate cannot lead to a valid solution.',
    visualAscii: `
Choices: Pick subsets of [1, 2]
                [ ]
             /       \\
         Include 1   Exclude 1
          [ 1 ]         [ ]
         /     \\       /    \\
      +2       no2   +2      no2
    [ 1, 2 ]  [ 1 ] [ 2 ]    [ ]
`,
    example: 'Navigating a physical hedge maze: when you hit a dead end, you retrace your steps to the last junction and try a different corridor.',
    timeComplexity: 'Combinatorial: Permutations O(N!), Subsets O(2^N)',
    spaceComplexity: 'O(N) recursion call stack depth',
    codeSnippets: {
      JavaScript: `function subsets(nums) {
  const result = [];
  function backtrack(start, currentPath) {
    result.push([...currentPath]);
    for (let i = start; i < nums.length; i++) {
      currentPath.push(nums[i]);      // Choose
      backtrack(i + 1, currentPath);   // Explore
      currentPath.pop();              // Un-choose (Backtrack!)
    }
  }
  backtrack(0, []);
  return result;
}`,
    },
    practiceProblems: [
      {
        id: 'bt-permutations',
        title: 'Permutations',
        difficulty: 'Medium',
        description: 'Given an array nums of distinct integers, return all the possible permutations in any order.',
        starterCode: {
          JavaScript: `function permute(nums) {\n  // Code here\n}`,
        },
        testCases: [
          { input: 'nums = [1,2,3]', expected: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]' },
        ],
        hints: [
          'Choose an element that has not been used yet.',
          'Explore deeper with the chosen element added to path.',
          'Un-choose by popping the element so sibling branches can use it.',
        ],
        solutionApproach: 'State-space tree exploration with a boolean used[] array. Push complete permutations when path.length === nums.length.',
      },
    ],
    quiz: [
      {
        id: 'bt-q1',
        question: 'What are the three core steps in the Backtracking template?',
        options: ['Compile, Run, Debug', 'Choose, Explore, Un-choose (Backtrack)', 'Map, Filter, Reduce', 'Enqueue, Dequeue, Peek'],
        correctIndex: 1,
        explanation: '1. Make a choice (add to path), 2. Recursively explore, 3. Revert choice (pop from path) so future branches start fresh.',
        conceptTag: 'Backtracking 3-step pattern',
      },
    ],
    revisionTips: [
      'Remember to create a copy of the path when adding to results: `result.push([...path])`.',
    ],
  },
  {
    id: 'trees',
    title: 'Trees & Binary Trees',
    category: 'Hierarchical Structures',
    difficulty: 'Intermediate',
    simpleExplanation: 'A Tree is a hierarchical non-linear data structure with a root node and child subtrees. In a Binary Tree, each node has at most two children: left and right. Fundamental for DOM trees, file systems, and decision engines.',
    visualAscii: `
         1 (Root)
       /   \\
      2     3
     / \\     \\
    4   5     6
Traversals:
Pre-order (Root, Left, Right): 1 -> 2 -> 4 -> 5 -> 3 -> 6
In-order  (Left, Root, Right): 4 -> 2 -> 5 -> 1 -> 3 -> 6
Post-order(Left, Right, Root): 4 -> 5 -> 2 -> 6 -> 3 -> 1
Level-order (BFS Queue):       1 -> 2 -> 3 -> 4 -> 5 -> 6
`,
    example: 'Company organizational chart: CEO at the top, VP below CEO, Directors below VPs.',
    timeComplexity: 'Traversal: O(N) visits every node | Height: O(log N) balanced, O(N) skewed',
    spaceComplexity: 'O(H) recursion stack where H is tree height',
    codeSnippets: {
      JavaScript: `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    },
    practiceProblems: [
      {
        id: 'tree-max-depth',
        title: 'Maximum Depth of Binary Tree',
        difficulty: 'Easy',
        description: 'Given the root of a binary tree, return its maximum depth (number of nodes along longest path from root to furthest leaf).',
        starterCode: {
          JavaScript: `function maxDepth(root) {\n  // Code here\n}`,
        },
        testCases: [
          { input: 'root = [3,9,20,null,null,15,7]', expected: '3' },
        ],
        hints: [
          'If the tree is empty (root === null), what is depth? 0.',
          'Otherwise, the depth is 1 + max(depth of left subtree, depth of right subtree).',
        ],
        solutionApproach: 'Post-order DFS: compute maxDepth(root.left) and maxDepth(root.right), return 1 + Math.max(left, right). Time O(N), Space O(H).',
      },
    ],
    quiz: [
      {
        id: 'tree-q1',
        question: 'Which tree traversal yields elements in non-decreasing sorted order for a Binary Search Tree?',
        options: ['Pre-order', 'In-order', 'Post-order', 'Level-order BFS'],
        correctIndex: 1,
        explanation: 'In-order visits Left, Root, Right. Since Left < Root < Right in a BST, it produces strictly sorted values.',
        conceptTag: 'In-order BST property',
      },
    ],
    revisionTips: [
      'Most tree problems are solved recursively by dividing work into left and right subtrees.',
    ],
  },
  {
    id: 'bst',
    title: 'Binary Search Trees (BST)',
    category: 'Hierarchical Structures',
    difficulty: 'Intermediate',
    simpleExplanation: 'A Binary Search Tree enforces the BST Invariant: for every node, all values in its left subtree are strictly LESS than the node, and all values in its right subtree are strictly GREATER.',
    visualAscii: `
          8
        /   \\
       3     10
      / \\      \\
     1   6      14
        / \\     /
       4   7   13
Look for 4: 4 < 8 (go left) -> 4 > 3 (go right) -> 4 < 6 (go left) -> Found!
`,
    example: 'Fast binary search on a dynamic, mutable structure without shifting arrays on insert.',
    timeComplexity: 'Balanced BST: Search/Insert/Delete O(log N) | Degenerate/Skewed: O(N)',
    spaceComplexity: 'O(N) to store nodes',
    codeSnippets: {
      JavaScript: `function searchBST(root, val) {
  if (!root || root.val === val) return root;
  return val < root.val ? searchBST(root.left, val) : searchBST(root.right, val);
}`,
    },
    practiceProblems: [
      {
        id: 'bst-validate',
        title: 'Validate Binary Search Tree',
        difficulty: 'Medium',
        description: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST).',
        starterCode: {
          JavaScript: `function isValidBST(root) {\n  // Code here\n}`,
        },
        testCases: [
          { input: 'root = [2,1,3]', expected: 'true' },
          { input: 'root = [5,1,4,null,null,3,6]', expected: 'false' },
        ],
        hints: [
          'Checking only root.val > root.left.val is not enough! Every node in left subtree must be less than root.',
          'Pass down a valid range [min, max] that narrows as you descend.',
        ],
        solutionApproach: 'DFS with range validation: isValid(node, min, max). Recurse left with (node.left, min, node.val) and right with (node.right, node.val, max).',
      },
    ],
    quiz: [
      {
        id: 'bst-q1',
        question: 'What causes an unbalanced BST to degrade to O(N) linear search time?',
        options: ['Inserting keys in random order', 'Inserting already sorted keys (e.g., 1, 2, 3, 4, 5)', 'Using negative integers', 'Too many leaf nodes'],
        correctIndex: 1,
        explanation: 'Inserting sorted items produces a single chain (linked list) without left children, giving height N.',
        conceptTag: 'Skewed BST',
      },
    ],
    revisionTips: [
      'Self-balancing BSTs like AVL and Red-Black trees prevent skewing by performing tree rotations.',
    ],
  },
  {
    id: 'heaps',
    title: 'Heaps & Priority Queues',
    category: 'Advanced Data Structures',
    difficulty: 'Intermediate',
    simpleExplanation: 'A Heap is a complete binary tree satisfying the Heap Property: in a Min-Heap, parent <= children (root is minimum); in a Max-Heap, parent >= children. Ideal for Top-K items and Dijkstra algorithm.',
    visualAscii: `
Min-Heap:
          [ 2 ]  <-- Root is always minimum!
        /       \\
     [ 5 ]     [ 8 ]
    /     \\    /
  [ 12 ] [ 9 ][ 15 ]
Stored compact in array: [ 2, 5, 8, 12, 9, 15 ]
Left child = 2*i + 1, Right child = 2*i + 2, Parent = Math.floor((i-1)/2)
`,
    example: 'Hospital emergency room triage: patients with highest medical urgency are treated first regardless of arrival order.',
    timeComplexity: 'Find Min/Max: O(1) | Insert (Push): O(log N) | Extract Min/Max: O(log N) | Heapify: O(N)',
    spaceComplexity: 'O(N) contiguous array storage',
    codeSnippets: {
      JavaScript: `class MinHeap {
  constructor() { this.heap = []; }
  push(val) {
    this.heap.push(val);
    this._bubbleUp(this.heap.length - 1);
  }
  pop() {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this._sinkDown(0);
    }
    return min;
  }
  _bubbleUp(i) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.heap[i] >= this.heap[p]) break;
      [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
      i = p;
    }
  }
  _sinkDown(i) {
    // Sift down logic
  }
}`,
    },
    practiceProblems: [
      {
        id: 'heap-kth-largest',
        title: 'Kth Largest Element in an Array',
        difficulty: 'Medium',
        description: 'Given an integer array nums and an integer k, return the kth largest element in the array.',
        starterCode: {
          JavaScript: `function findKthLargest(nums, k) {\n  // Code here\n}`,
        },
        testCases: [
          { input: 'nums = [3,2,1,5,6,4], k = 2', expected: '5' },
          { input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', expected: '4' },
        ],
        hints: [
          'Sorting takes O(N log N). Can we do better with a Heap?',
          'Maintain a Min-Heap of size K.',
          'Whenever heap size exceeds K, pop the smallest element. The top will be the Kth largest!',
        ],
        solutionApproach: 'Min-heap of capacity K. Time O(N log K), Space O(K).',
      },
    ],
    quiz: [
      {
        id: 'heap-q1',
        question: 'What is the time complexity of building a heap from an unsorted array of N elements (Heapify)?',
        options: ['O(N log N)', 'O(N)', 'O(1)', 'O(N^2)'],
        correctIndex: 1,
        explanation: 'Bottom-up sift-down heap construction takes mathematical sum bounded by O(N), not O(N log N).',
        conceptTag: 'Linear heapify',
      },
    ],
    revisionTips: [
      'Min-Heap for K largest elements; Max-Heap for K smallest elements.',
    ],
  },
  {
    id: 'graphs',
    title: 'Graphs & Graph Algorithms',
    category: 'Non-Linear Data Structures',
    difficulty: 'Advanced',
    simpleExplanation: 'A Graph is a network of vertices (nodes) connected by edges. Represented via Adjacency Lists or Adjacency Matrices. Solved using Breadth-First Search (shortest path in unweighted graph), Depth-First Search, Dijkstra, and Topological Sort.',
    visualAscii: `
      (A)-------(B)
       |         | \\
       |         |  (E)
       |         | /
      (C)-------(D)
Adjacency List:
A: [B, C]
B: [A, D, E]
C: [A, D]
D: [B, C, E]
`,
    example: 'Social networks (users and friendships), Google Maps (intersections and roads), web link crawlers.',
    timeComplexity: 'BFS/DFS: O(V + E) | Dijkstra: O((V + E) log V)',
    spaceComplexity: 'O(V + E) adjacency list + visited set',
    codeSnippets: {
      JavaScript: `function bfsShortestPath(graph, start, target) {
  const queue = [[start, 0]];
  const visited = new Set([start]);
  while (queue.length > 0) {
    const [curr, dist] = queue.shift();
    if (curr === target) return dist;
    for (const neighbor of graph[curr] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, dist + 1]);
      }
    }
  }
  return -1;
}`,
    },
    practiceProblems: [
      {
        id: 'graph-num-islands',
        title: 'Number of Islands',
        difficulty: 'Medium',
        description: "Given an m x n 2D binary grid grid where '1's (land) and '0's (water), count the number of islands.",
        starterCode: {
          JavaScript: `function numIslands(grid) {\n  // Code here\n}`,
        },
        testCases: [
          { input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]', expected: '2' },
        ],
        hints: [
          'Iterate through every cell in the grid.',
          "When you find a '1', increment island count and trigger a DFS/BFS to sink the entire island by marking connected lands as '0'.",
        ],
        solutionApproach: 'Grid DFS traversal. Visit all 4 cardinal directions, flip visited land to 0 to prevent cycles. Time O(M * N), Space O(M * N) call stack.',
      },
    ],
    quiz: [
      {
        id: 'graph-q1',
        question: 'Which algorithm finds the single-source shortest path in a graph with non-negative edge weights?',
        options: ['Dijkstra Algorithm', 'Prim Algorithm', 'Kruskal Algorithm', 'Floyd-Warshall for all pairs'],
        correctIndex: 0,
        explanation: 'Dijkstra algorithm uses a priority queue / min-heap to greedily expand the closest unexplored vertex.',
        conceptTag: 'Dijkstra',
      },
    ],
    revisionTips: [
      'Always remember a `visited` set to avoid infinite loops in graphs with cycles.',
    ],
  },
  {
    id: 'greedy',
    title: 'Greedy Algorithms',
    category: 'Algorithmic Paradigms',
    difficulty: 'Intermediate',
    simpleExplanation: 'A Greedy algorithm makes the locally optimal choice at each step with the hope that these local choices lead to a globally optimal solution. Requires Greedy-Choice Property and Optimal Substructure.',
    visualAscii: `
Coin Change for $36 using coins [25, 10, 1]:
Step 1: Pick largest coin <= 36 -> 25¢  (Remaining: 11¢)
Step 2: Pick largest coin <= 11 -> 10¢  (Remaining: 1¢)
Step 3: Pick largest coin <= 1  -> 1¢   (Remaining: 0¢)
Total: 3 coins. (Works for canonical coin systems!)
`,
    example: 'Cashier giving change with minimum coins or scheduling intervals that finish earliest.',
    timeComplexity: 'Usually O(N log N) dominated by sorting the input',
    spaceComplexity: 'O(1) or O(N)',
    codeSnippets: {
      JavaScript: `// Activity Selection / Interval Scheduling
function eraseOverlapIntervals(intervals) {
  if (intervals.length === 0) return 0;
  intervals.sort((a, b) => a[1] - b[1]); // Sort by end time!
  let count = 0, prevEnd = intervals[0][1];
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < prevEnd) count++; // Overlap
    else prevEnd = intervals[i][1];
  }
  return count;
}`,
    },
    practiceProblems: [
      {
        id: 'greedy-jump-game',
        title: 'Jump Game',
        difficulty: 'Medium',
        description: 'You are given an integer array nums. You are initially positioned at index 0, and each element represents your maximum jump length. Return true if you can reach the last index.',
        starterCode: {
          JavaScript: `function canJump(nums) {\n  // Code here\n}`,
        },
        testCases: [
          { input: 'nums = [2,3,1,1,4]', expected: 'true' },
          { input: 'nums = [3,2,1,0,4]', expected: 'false' },
        ],
        hints: [
          'Track the furthest index you can reach so far.',
          'Iterate through the array: if current index > maxReach, you are stuck!',
          'Update maxReach = max(maxReach, i + nums[i]).',
        ],
        solutionApproach: 'Greedy max reach tracking in single pass. Time O(N), Space O(1).',
      },
    ],
    quiz: [
      {
        id: 'greedy-q1',
        question: 'When does a greedy algorithm fail to find the global optimum?',
        options: ['When numbers are odd', 'When local optimal choices preclude a better global choice (lacks optimal substructure)', 'When arrays are sorted', 'When using floating point numbers'],
        correctIndex: 1,
        explanation: 'If a locally greedy decision locks out a superior future combination, greedy fails and Dynamic Programming is required.',
        conceptTag: 'Greedy limits',
      },
    ],
    revisionTips: [
      'Check if sorting by start time, end time, ratio, or weight unlocks the greedy choice.',
    ],
  },
  {
    id: 'dp',
    title: 'Dynamic Programming (DP)',
    category: 'Algorithmic Paradigms',
    difficulty: 'Advanced',
    simpleExplanation: 'Dynamic Programming solves complex problems by breaking them down into simpler overlapping subproblems and storing the answers in memory (Memoization / Tabulation) to avoid re-calculating them.',
    visualAscii: `
Overlapping Subproblems in Fibonacci:
                   fib(5)
              /              \\
         fib(4)               fib(3)
        /      \\             /      \\
     fib(3)    fib(2)     fib(2)    fib(1)
       |
  Without DP: Exponential 2^N calls!
  With DP (Cache): Store fib(3) once, reuse immediately -> Linear O(N)!
`,
    example: 'Saving your completed game progress at checkpoints rather than restarting from level 1 every time you die.',
    timeComplexity: 'Number of unique states * Transitions per state (e.g., O(N) or O(N*W))',
    spaceComplexity: 'O(N) or O(N*M) table, optimizable to O(1) or O(M)',
    codeSnippets: {
      JavaScript: `// Climbing Stairs (Tabulation)
function climbStairs(n) {
  if (n <= 2) return n;
  let prev2 = 1, prev1 = 2;
  for (let i = 3; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}`,
    },
    practiceProblems: [
      {
        id: 'dp-coin-change',
        title: 'Coin Change (Minimum Coins)',
        difficulty: 'Medium',
        description: 'Given an integer array coins and integer amount, return the fewest number of coins needed to make up that amount. If impossible, return -1.',
        starterCode: {
          JavaScript: `function coinChange(coins, amount) {\n  // Code here\n}`,
        },
        testCases: [
          { input: 'coins = [1,2,5], amount = 11', expected: '3' },
          { input: 'coins = [2], amount = 3', expected: '-1' },
        ],
        hints: [
          'Let dp[i] be the minimum coins to make amount i.',
          'Base case: dp[0] = 0. All other dp values initialized to Infinity.',
          'For each amount i from 1 to amount, try every coin c: dp[i] = min(dp[i], 1 + dp[i - c]).',
        ],
        solutionApproach: 'Bottom-up 1D DP table. Time O(amount * coins.length), Space O(amount).',
      },
    ],
    quiz: [
      {
        id: 'dp-q1',
        question: 'What are the two key ingredients required for Dynamic Programming to apply?',
        options: ['Fast CPU and GPU', 'Optimal Substructure and Overlapping Subproblems', 'Recursion and Pointers', 'Sorting and Hashing'],
        correctIndex: 1,
        explanation: 'Optimal substructure (global solution built from optimal sub-solutions) and Overlapping subproblems (same subproblems solved repeatedly).',
        conceptTag: 'DP Prerequisites',
      },
    ],
    revisionTips: [
      'Define state clearly: "What does dp[i] represent in plain English?"',
      'Look for space optimization: if dp[i] only depends on dp[i-1], use two variables instead of an array.',
    ],
  },
  {
    id: 'bit-manipulation',
    title: 'Bit Manipulation & Bitmasks',
    category: 'Computer Systems',
    difficulty: 'Intermediate',
    simpleExplanation: 'Bit manipulation operates directly on binary digits (0 and 1) at the processor level using AND (&), OR (|), XOR (^), NOT (~), and bit shifts (<<, >>). It is blazingly fast and enables compact set representations.',
    visualAscii: `
Bitwise XOR (^) Truth Table:
  0 ^ 0 = 0
  1 ^ 1 = 0   (Same bits cancel out to 0!)
  1 ^ 0 = 1
Key Trick: x ^ x = 0  and  x ^ 0 = x
Example: [ 4, 1, 2, 1, 2 ]
4 ^ 1 ^ 2 ^ 1 ^ 2 = 4 ^ (1^1) ^ (2^2) = 4 ^ 0 ^ 0 = 4! (Single Number in O(1) space!)
`,
    example: 'RGB colors packed into a single 32-bit integer: (r << 16) | (g << 8) | b.',
    timeComplexity: 'All bitwise operations are single-cycle O(1) CPU instructions',
    spaceComplexity: 'O(1) registers',
    codeSnippets: {
      JavaScript: `// Count set bits (Hamming Weight) using Brian Kernighan algorithm
function hammingWeight(n) {
  let count = 0;
  while (n !== 0) {
    n = n & (n - 1); // Clears the lowest set bit!
    count++;
  }
  return count;
}`,
    },
    practiceProblems: [
      {
        id: 'bit-single-number',
        title: 'Single Number',
        difficulty: 'Easy',
        description: 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one in O(N) time and O(1) memory.',
        starterCode: {
          JavaScript: `function singleNumber(nums) {\n  // Code here\n}`,
        },
        testCases: [
          { input: 'nums = [2,2,1]', expected: '1' },
          { input: 'nums = [4,1,2,1,2]', expected: '4' },
        ],
        hints: [
          'What happens when you XOR a number with itself? A ^ A = 0.',
          'What happens when you XOR any number with 0? A ^ 0 = A.',
          'XOR is commutative and associative. XOR all elements in nums together!',
        ],
        solutionApproach: 'XOR accumulator over array. Duplicates cancel to zero, leaving the unique number.',
      },
    ],
    quiz: [
      {
        id: 'bit-q1',
        question: 'What does the expression `(n & (n - 1)) === 0` test for a positive integer n?',
        options: ['If n is even', 'If n is a power of two', 'If n is prime', 'If n is negative'],
        correctIndex: 1,
        explanation: 'Powers of two have exactly one bit set (e.g. 8 is 1000). n - 1 is 0111. 1000 & 0111 = 0000.',
        conceptTag: 'Power of Two trick',
      },
    ],
    revisionTips: [
      'Check bit k: (num >> k) & 1',
      'Set bit k: num | (1 << k)',
      'Clear bit k: num & ~(1 << k)',
    ],
  },
  {
    id: 'advanced-problem-solving',
    title: 'Advanced Problem Solving & System Design Basics',
    category: 'Architectural & Advanced Patterns',
    difficulty: 'Advanced',
    simpleExplanation: 'Bridging algorithms with production software: Tries for prefix search, Union-Find (Disjoint Set) for connectivity, Segment Trees for range queries, and System Design fundamentals (scalability, caching, load balancers, database sharding, CAP theorem).',
    visualAscii: `
Trie (Prefix Tree) for words: ["cat", "car", "dog"]
         (root)
        /      \\
      'c'      'd'
       |        |
      'a'      'o'
     /   \\      |
   't'*  'r'*  'g'*
Fast O(L) autocomplete search where L is word length!
`,
    example: 'Search engine autocomplete suggestion engine matching billions of search queries in milliseconds.',
    timeComplexity: 'Trie Insert/Search: O(L) where L is string length | Union-Find with Path Compression: O(α(N)) nearly O(1)',
    spaceComplexity: 'Tries: O(ALPHABET_SIZE * L * N)',
    codeSnippets: {
      JavaScript: `class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}

class Trie {
  constructor() { this.root = new TrieNode(); }
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = new TrieNode();
      node = node.children[ch];
    }
    node.isEnd = true;
  }
  startsWith(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return true;
  }
}`,
    },
    practiceProblems: [
      {
        id: 'adv-implement-trie',
        title: 'Implement Trie (Prefix Tree)',
        difficulty: 'Medium',
        description: 'Implement a trie with insert, search, and startsWith methods.',
        starterCode: {
          JavaScript: `class Trie {\n  constructor() {}\n  insert(word) {}\n  search(word) {}\n  startsWith(prefix) {}\n}`,
        },
        testCases: [
          { input: 'insert("apple"), search("apple"), startsWith("app")', expected: 'true, true' },
        ],
        hints: [
          'Each node contains a map/object of child characters and an isEndOfWord boolean flag.',
          'Iterate through the characters of the word, creating or traversing child nodes.',
        ],
        solutionApproach: 'Tree of prefix characters. Search returns true only if last node has isEnd === true. StartsWith returns true if path exists.',
      },
    ],
    quiz: [
      {
        id: 'adv-q1',
        question: 'In System Design, what does the CAP Theorem state?',
        options: ['Cores, Access, and Power cannot be maximized together', 'A distributed data store can simultaneously provide at most two of Consistency, Availability, and Partition Tolerance', 'Caching, Asynchronous, and Polling are mandatory', 'CPU, Architecture, and Performance scale linearly'],
        correctIndex: 1,
        explanation: 'In the presence of a network partition (P), a distributed system must choose between Consistency (C) and Availability (A).',
        conceptTag: 'CAP Theorem',
      },
    ],
    revisionTips: [
      'In technical interviews, always clarify constraints (scale, read/write ratio, latency requirements) before coding.',
    ],
  },
];
