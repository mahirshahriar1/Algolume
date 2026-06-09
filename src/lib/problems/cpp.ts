import type { Problem } from "./types";

type CppSnippet = Pick<Problem, "cppSolution">;

export const CPP_SNIPPETS: Record<string, CppSnippet> = {
  "two-sum": {
    cppSolution: `vector<int> two_sum(vector<int> nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < (int)nums.size(); i++) {
        int need = target - nums[i];
        if (seen.count(need)) return {seen[need], i};
        seen[nums[i]] = i;
    }
    return {};
}
`,
  },
  "running-sum": {
    cppSolution: `vector<int> running_sum(vector<int> nums) {
    vector<int> out;
    int total = 0;
    for (int x : nums) {
        total += x;
        out.push_back(total);
    }
    return out;
}
`,
  },
  "max-subarray": {
    cppSolution: `int max_subarray(vector<int> nums) {
    int best = nums[0], cur = nums[0];
    for (int i = 1; i < (int)nums.size(); i++) {
        cur = max(nums[i], cur + nums[i]);
        best = max(best, cur);
    }
    return best;
}
`,
  },
  "move-zeroes": {
    cppSolution: `vector<int> move_zeroes(vector<int> nums) {
    vector<int> out;
    int zeros = 0;
    for (int x : nums) {
        if (x == 0) zeros++;
        else out.push_back(x);
    }
    while (zeros--) out.push_back(0);
    return out;
}
`,
  },
  "product-except-self": {
    cppSolution: `vector<int> product_except_self(vector<int> nums) {
    int n = nums.size();
    vector<int> res(n, 1);
    int left = 1;
    for (int i = 0; i < n; i++) {
        res[i] = left;
        left *= nums[i];
    }
    int right = 1;
    for (int i = n - 1; i >= 0; i--) {
        res[i] *= right;
        right *= nums[i];
    }
    return res;
}
`,
  },
  "trapping-rain-water": {
    cppSolution: `int trap(vector<int> height) {
    if (height.empty()) return 0;
    int lo = 0, hi = (int)height.size() - 1;
    int leftMax = height[lo], rightMax = height[hi];
    int total = 0;
    while (lo < hi) {
        if (leftMax <= rightMax) {
            lo++;
            leftMax = max(leftMax, height[lo]);
            total += leftMax - height[lo];
        } else {
            hi--;
            rightMax = max(rightMax, height[hi]);
            total += rightMax - height[hi];
        }
    }
    return total;
}
`,
  },

  "binary-search": {
    cppSolution: `int binary_search(vector<int> nums, int target) {
    int lo = 0, hi = (int)nums.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}
`,
  },
  "search-insert-position": {
    cppSolution: `int search_insert(vector<int> nums, int target) {
    int lo = 0, hi = (int)nums.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return lo;
}
`,
  },
  "search-rotated": {
    cppSolution: `int search_rotated(vector<int> nums, int target) {
    int lo = 0, hi = (int)nums.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[lo] <= nums[mid]) {
            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}
`,
  },
  "median-two-sorted": {
    cppSolution: `double find_median_sorted(vector<int> a, vector<int> b) {
    vector<int> merged;
    int i = 0, j = 0;
    while (i < (int)a.size() && j < (int)b.size()) {
        if (a[i] <= b[j]) merged.push_back(a[i++]);
        else merged.push_back(b[j++]);
    }
    while (i < (int)a.size()) merged.push_back(a[i++]);
    while (j < (int)b.size()) merged.push_back(b[j++]);
    int n = merged.size(), mid = n / 2;
    if (n % 2) return (double)merged[mid];
    return (merged[mid - 1] + merged[mid]) / 2.0;
}
`,
  },

  "contains-duplicate": {
    cppSolution: `bool contains_duplicate(vector<int> nums) {
    unordered_set<int> seen;
    for (int x : nums) {
        if (seen.count(x)) return true;
        seen.insert(x);
    }
    return false;
}
`,
  },
  "valid-anagram": {
    cppSolution: `bool is_anagram(string s, string t) {
    if (s.size() != t.size()) return false;
    vector<int> count(256, 0);
    for (char c : s) count[(unsigned char)c]++;
    for (char c : t) {
        if (--count[(unsigned char)c] < 0) return false;
    }
    return true;
}
`,
  },
  "first-unique-char": {
    cppSolution: `int first_uniq_char(string s) {
    vector<int> count(256, 0);
    for (char c : s) count[(unsigned char)c]++;
    for (int i = 0; i < (int)s.size(); i++) {
        if (count[(unsigned char)s[i]] == 1) return i;
    }
    return -1;
}
`,
  },
  "top-k-frequent": {
    cppSolution: `vector<int> top_k_frequent(vector<int> nums, int k) {
    unordered_map<int, int> freq;
    for (int x : nums) freq[x]++;
    vector<pair<int, int>> items;
    for (auto [value, count] : freq) items.push_back({count, value});
    sort(items.rbegin(), items.rend());
    vector<int> ans;
    for (int i = 0; i < k; i++) ans.push_back(items[i].second);
    return ans;
}
`,
  },
  "longest-consecutive": {
    cppSolution: `int longest_consecutive(vector<int> nums) {
    unordered_set<int> seen(nums.begin(), nums.end());
    int best = 0;
    for (int x : seen) {
        if (!seen.count(x - 1)) {
            int y = x;
            while (seen.count(y)) y++;
            best = max(best, y - x);
        }
    }
    return best;
}
`,
  },

  factorial: {
    cppSolution: `long long factorial(int n) {
    if (n <= 1) return 1;
    return 1LL * n * factorial(n - 1);
}
`,
  },
  fibonacci: {
    cppSolution: `int fib(int n) {
    int a = 0, b = 1;
    for (int i = 0; i < n; i++) {
        int next = a + b;
        a = b;
        b = next;
    }
    return a;
}
`,
  },
  "sum-digits": {
    cppSolution: `int sum_digits(int n) {
    if (n == 0) return 0;
    return n % 10 + sum_digits(n / 10);
}
`,
  },
  "generate-parentheses": {
    cppSolution: `vector<string> generate_parenthesis(int n) {
    vector<string> res;
    string cur;
    function<void(int,int)> dfs = [&](int open, int close) {
        if ((int)cur.size() == 2 * n) {
            res.push_back(cur);
            return;
        }
        if (open < n) {
            cur.push_back('(');
            dfs(open + 1, close);
            cur.pop_back();
        }
        if (close < open) {
            cur.push_back(')');
            dfs(open, close + 1);
            cur.pop_back();
        }
    };
    dfs(0, 0);
    return res;
}
`,
  },
  permutations: {
    cppSolution: `vector<vector<int>> permute(vector<int> nums) {
    vector<vector<int>> res;
    vector<int> path;
    vector<int> used(nums.size(), 0);
    function<void()> dfs = [&]() {
        if (path.size() == nums.size()) {
            res.push_back(path);
            return;
        }
        for (int i = 0; i < (int)nums.size(); i++) {
            if (used[i]) continue;
            used[i] = 1;
            path.push_back(nums[i]);
            dfs();
            path.pop_back();
            used[i] = 0;
        }
    };
    dfs();
    return res;
}
`,
  },

  "valid-parentheses": {
    cppSolution: `bool is_valid(string s) {
    unordered_map<char, char> pairs = {{')', '('}, {']', '['}, {'}', '{'}};
    vector<char> st;
    for (char ch : s) {
        if (ch == '(' || ch == '[' || ch == '{') st.push_back(ch);
        else {
            if (st.empty() || st.back() != pairs[ch]) return false;
            st.pop_back();
        }
    }
    return st.empty();
}
`,
  },
  "reverse-string": {
    cppSolution: `string reverse_string(string s) {
    reverse(s.begin(), s.end());
    return s;
}
`,
  },
  "daily-temperatures": {
    cppSolution: `vector<int> daily_temperatures(vector<int> temperatures) {
    vector<int> ans(temperatures.size(), 0);
    vector<int> st;
    for (int i = 0; i < (int)temperatures.size(); i++) {
        while (!st.empty() && temperatures[st.back()] < temperatures[i]) {
            int j = st.back();
            st.pop_back();
            ans[j] = i - j;
        }
        st.push_back(i);
    }
    return ans;
}
`,
  },
  "largest-rectangle-histogram": {
    cppSolution: `int largest_rectangle(vector<int> heights) {
    vector<int> st;
    heights.push_back(0);
    int best = 0;
    for (int i = 0; i < (int)heights.size(); i++) {
        while (!st.empty() && heights[st.back()] >= heights[i]) {
            int h = heights[st.back()];
            st.pop_back();
            int width = st.empty() ? i : i - st.back() - 1;
            best = max(best, h * width);
        }
        st.push_back(i);
    }
    return best;
}
`,
  },

  "valid-spanning-tree": {
    cppSolution: `bool valid_spanning_tree(int n, vector<vector<int>> edges) {
    if ((int)edges.size() != n - 1) return false;
    vector<int> parent(n);
    iota(parent.begin(), parent.end(), 0);
    function<int(int)> find = [&](int x) {
        if (parent[x] == x) return x;
        return parent[x] = find(parent[x]);
    };
    for (auto &e : edges) {
        int a = find(e[0]), b = find(e[1]);
        if (a == b) return false;
        parent[b] = a;
    }
    return true;
}
`,
  },
  "minimum-connection-cost": {
    cppSolution: `int minimum_connection_cost(int n, vector<vector<int>> edges) {
    vector<int> parent(n), sz(n, 1);
    iota(parent.begin(), parent.end(), 0);
    function<int(int)> find = [&](int x) {
        if (parent[x] == x) return x;
        return parent[x] = find(parent[x]);
    };
    auto unite = [&](int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;
        if (sz[a] < sz[b]) swap(a, b);
        parent[b] = a;
        sz[a] += sz[b];
        return true;
    };
    sort(edges.begin(), edges.end(), [](auto &a, auto &b) {
        return a[2] < b[2];
    });
    int total = 0, used = 0;
    for (auto &e : edges) {
        if (unite(e[0], e[1])) {
            total += e[2];
            used++;
        }
    }
    return used == n - 1 ? total : -1;
}
`,
  },
  "second-best-mst": {
    cppSolution: `int second_best_mst(int n, vector<vector<int>> edges) {
    int m = edges.size();
    vector<int> weights;
    for (int mask = 0; mask < (1 << m); mask++) {
        if (__builtin_popcount((unsigned)mask) != max(0, n - 1)) continue;
        vector<int> parent(n);
        iota(parent.begin(), parent.end(), 0);
        function<int(int)> find = [&](int x) {
            if (parent[x] == x) return x;
            return parent[x] = find(parent[x]);
        };
        bool ok = true;
        int total = 0;
        for (int i = 0; i < m; i++) if (mask & (1 << i)) {
            int a = find(edges[i][0]), b = find(edges[i][1]);
            if (a == b) ok = false;
            parent[b] = a;
            total += edges[i][2];
        }
        if (!ok) continue;
        int root = n ? find(0) : 0;
        for (int i = 0; i < n; i++) ok = ok && find(i) == root;
        if (ok) weights.push_back(total);
    }
    if (weights.empty()) return -1;
    int best = *min_element(weights.begin(), weights.end());
    int ans = INT_MAX;
    for (int w : weights) if (w > best) ans = min(ans, w);
    return ans == INT_MAX ? -1 : ans;
}
`,
  },
};
