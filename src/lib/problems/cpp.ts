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
  "merge-two-sorted": {
    cppSolution: `vector<int> merge_sorted(vector<int> a, vector<int> b) {
    vector<int> out;
    int i = 0, j = 0;
    while (i < (int)a.size() && j < (int)b.size()) {
        if (a[i] <= b[j]) out.push_back(a[i++]);
        else              out.push_back(b[j++]);
    }
    while (i < (int)a.size()) out.push_back(a[i++]);
    while (j < (int)b.size()) out.push_back(b[j++]);
    return out;
}
`,
  },
  "kth-largest": {
    cppSolution: `int find_kth_largest(vector<int> nums, int k) {
    // nth_element puts the k-th largest at its sorted position in O(n) average.
    nth_element(nums.begin(), nums.begin() + (k - 1), nums.end(), greater<int>());
    return nums[k - 1];
}
`,
  },
  "count-inversions": {
    cppSolution: `long long count_inversions(vector<int> nums) {
    // Merge sort, counting cross-inversions during each merge.
    function<long long(int,int)> solve = [&](int lo, int hi) -> long long {
        if (hi - lo <= 1) return 0;
        int mid = (lo + hi) / 2;
        long long inv = solve(lo, mid) + solve(mid, hi);
        vector<int> merged;
        int i = lo, j = mid;
        while (i < mid && j < hi) {
            if (nums[i] <= nums[j]) merged.push_back(nums[i++]);
            else { merged.push_back(nums[j++]); inv += mid - i; }
        }
        while (i < mid) merged.push_back(nums[i++]);
        while (j < hi) merged.push_back(nums[j++]);
        copy(merged.begin(), merged.end(), nums.begin() + lo);
        return inv;
    };
    return solve(0, nums.size());
}
`,
  },
  "bst-search-path": {
    cppSolution: `struct Node { int v; Node *l = nullptr, *r = nullptr; Node(int x):v(x){} };

vector<int> bst_search_path(vector<int> values, int target) {
    Node* root = nullptr;
    for (int v : values) {
        if (!root) { root = new Node(v); continue; }
        Node* cur = root;
        while (true) {
            if (v < cur->v) { if (!cur->l) { cur->l = new Node(v); break; } cur = cur->l; }
            else if (v > cur->v) { if (!cur->r) { cur->r = new Node(v); break; } cur = cur->r; }
            else break;
        }
    }
    vector<int> path;
    for (Node* cur = root; cur; ) {
        path.push_back(cur->v);
        if (target == cur->v) break;
        cur = target < cur->v ? cur->l : cur->r;
    }
    return path;
}
`,
  },
  "kth-smallest-bst": {
    cppSolution: `struct Node { int v; Node *l = nullptr, *r = nullptr; Node(int x):v(x){} };

int kth_smallest_bst(vector<int> values, int k) {
    Node* root = nullptr;
    for (int v : values) {
        if (!root) { root = new Node(v); continue; }
        Node* cur = root;
        while (true) {
            if (v < cur->v) { if (!cur->l) { cur->l = new Node(v); break; } cur = cur->l; }
            else if (v > cur->v) { if (!cur->r) { cur->r = new Node(v); break; } cur = cur->r; }
            else break;
        }
    }
    vector<int> out;
    function<void(Node*)> in = [&](Node* n) {
        if (!n) return;
        in(n->l); out.push_back(n->v); in(n->r);
    };
    in(root);
    return out[k - 1];
}
`,
  },
  "lca-bst": {
    cppSolution: `struct Node { int v; Node *l = nullptr, *r = nullptr; Node(int x):v(x){} };

int lca_bst(vector<int> values, int a, int b) {
    Node* root = nullptr;
    for (int v : values) {
        if (!root) { root = new Node(v); continue; }
        Node* cur = root;
        while (true) {
            if (v < cur->v) { if (!cur->l) { cur->l = new Node(v); break; } cur = cur->l; }
            else if (v > cur->v) { if (!cur->r) { cur->r = new Node(v); break; } cur = cur->r; }
            else break;
        }
    }
    Node* cur = root;
    while (cur) {
        if (a < cur->v && b < cur->v) cur = cur->l;
        else if (a > cur->v && b > cur->v) cur = cur->r;
        else return cur->v;
    }
    return -1;
}
`,
  },
  "inorder-traversal": {
    cppSolution: `// Tree given level-order with nulls; here as a vector<optional<int>>.
struct TreeNode { int val; TreeNode *left = nullptr, *right = nullptr; TreeNode(int v):val(v){} };

TreeNode* build(const vector<optional<int>>& a) {
    if (a.empty() || !a[0]) return nullptr;
    TreeNode* root = new TreeNode(*a[0]);
    queue<TreeNode*> q; q.push(root);
    size_t i = 1;
    while (i < a.size()) {
        TreeNode* n = q.front(); q.pop();
        if (i < a.size()) { if (a[i]) { n->left = new TreeNode(*a[i]); q.push(n->left); } i++; }
        if (i < a.size()) { if (a[i]) { n->right = new TreeNode(*a[i]); q.push(n->right); } i++; }
    }
    return root;
}

vector<int> inorder(vector<optional<int>> arr) {
    vector<int> out;
    function<void(TreeNode*)> go = [&](TreeNode* n) {
        if (!n) return;
        go(n->left); out.push_back(n->val); go(n->right);
    };
    go(build(arr));
    return out;
}
`,
  },
  "level-order-traversal": {
    cppSolution: `struct TreeNode { int val; TreeNode *left = nullptr, *right = nullptr; TreeNode(int v):val(v){} };
// (build() as in Inorder Traversal)

vector<vector<int>> level_order(TreeNode* root) {
    vector<vector<int>> res;
    if (!root) return res;
    queue<TreeNode*> q; q.push(root);
    while (!q.empty()) {
        int sz = q.size();
        vector<int> level;
        for (int i = 0; i < sz; i++) {
            TreeNode* n = q.front(); q.pop();
            level.push_back(n->val);
            if (n->left) q.push(n->left);
            if (n->right) q.push(n->right);
        }
        res.push_back(level);
    }
    return res;
}
`,
  },
  "zigzag-traversal": {
    cppSolution: `struct TreeNode { int val; TreeNode *left = nullptr, *right = nullptr; TreeNode(int v):val(v){} };
// (build() as in Inorder Traversal)

vector<vector<int>> zigzag(TreeNode* root) {
    vector<vector<int>> res;
    if (!root) return res;
    queue<TreeNode*> q; q.push(root);
    bool ltr = true;
    while (!q.empty()) {
        int sz = q.size();
        vector<int> level(sz);
        for (int i = 0; i < sz; i++) {
            TreeNode* n = q.front(); q.pop();
            int idx = ltr ? i : sz - 1 - i;
            level[idx] = n->val;
            if (n->left) q.push(n->left);
            if (n->right) q.push(n->right);
        }
        res.push_back(level);
        ltr = !ltr;
    }
    return res;
}
`,
  },
  "reverse-linked-list": {
    cppSolution: `vector<int> reverse_list(vector<int> vals) {
    // With real nodes: rewire each next pointer to prev as you walk.
    reverse(vals.begin(), vals.end());
    return vals;
}
`,
  },
  "remove-nth-from-end": {
    cppSolution: `vector<int> remove_nth_from_end(vector<int> vals, int n) {
    vals.erase(vals.begin() + (int)vals.size() - n);
    return vals;
}
`,
  },
  "add-two-numbers": {
    cppSolution: `vector<int> add_two_numbers(vector<int> a, vector<int> b) {
    vector<int> res;
    int carry = 0;
    for (size_t i = 0; i < a.size() || i < b.size() || carry; i++) {
        int s = carry + (i < a.size() ? a[i] : 0) + (i < b.size() ? b[i] : 0);
        res.push_back(s % 10);
        carry = s / 10;
    }
    return res;
}
`,
  },
  "number-of-islands": {
    cppSolution: `int num_islands(vector<vector<int>> grid) {
    if (grid.empty()) return 0;
    int R = grid.size(), C = grid[0].size(), count = 0;
    int dx[] = {1, -1, 0, 0}, dy[] = {0, 0, 1, -1};
    for (int i = 0; i < R; i++)
        for (int j = 0; j < C; j++)
            if (grid[i][j] == 1) {
                count++;
                queue<pair<int,int>> q; q.push({i, j}); grid[i][j] = 0;
                while (!q.empty()) {
                    auto [x, y] = q.front(); q.pop();
                    for (int d = 0; d < 4; d++) {
                        int nx = x + dx[d], ny = y + dy[d];
                        if (nx >= 0 && nx < R && ny >= 0 && ny < C && grid[nx][ny] == 1) {
                            grid[nx][ny] = 0; q.push({nx, ny});
                        }
                    }
                }
            }
    return count;
}
`,
  },
  "shortest-grid-path": {
    cppSolution: `int shortest_grid_path(vector<vector<int>> grid) {
    if (grid.empty() || grid[0][0] == 1) return -1;
    int R = grid.size(), C = grid[0].size();
    if (grid[R-1][C-1] == 1) return -1;
    int dx[] = {1, -1, 0, 0}, dy[] = {0, 0, 1, -1};
    queue<tuple<int,int,int>> q; q.push({0, 0, 1});
    vector<vector<bool>> seen(R, vector<bool>(C, false)); seen[0][0] = true;
    while (!q.empty()) {
        auto [x, y, d] = q.front(); q.pop();
        if (x == R-1 && y == C-1) return d;
        for (int k = 0; k < 4; k++) {
            int nx = x + dx[k], ny = y + dy[k];
            if (nx >= 0 && nx < R && ny >= 0 && ny < C && grid[nx][ny] == 0 && !seen[nx][ny]) {
                seen[nx][ny] = true; q.push({nx, ny, d + 1});
            }
        }
    }
    return -1;
}
`,
  },
  "rotting-oranges": {
    cppSolution: `int oranges_rotting(vector<vector<int>> grid) {
    int R = grid.size(), C = grid[0].size(), fresh = 0, t = 0;
    int dx[] = {1, -1, 0, 0}, dy[] = {0, 0, 1, -1};
    queue<tuple<int,int,int>> q;
    for (int i = 0; i < R; i++)
        for (int j = 0; j < C; j++) {
            if (grid[i][j] == 2) q.push({i, j, 0});
            else if (grid[i][j] == 1) fresh++;
        }
    while (!q.empty()) {
        auto [x, y, tt] = q.front(); q.pop(); t = tt;
        for (int k = 0; k < 4; k++) {
            int nx = x + dx[k], ny = y + dy[k];
            if (nx >= 0 && nx < R && ny >= 0 && ny < C && grid[nx][ny] == 1) {
                grid[nx][ny] = 2; fresh--; q.push({nx, ny, tt + 1});
            }
        }
    }
    return fresh > 0 ? -1 : t;
}
`,
  },
  "valid-palindrome": {
    cppSolution: `bool is_palindrome(string s) {
    int i = 0, j = (int)s.size() - 1;
    auto ok = [](char c) { return isalnum((unsigned char)c); };
    while (i < j) {
        while (i < j && !ok(s[i])) i++;
        while (i < j && !ok(s[j])) j--;
        if (tolower(s[i]) != tolower(s[j])) return false;
        i++; j--;
    }
    return true;
}
`,
  },
  "longest-substring-no-repeat": {
    cppSolution: `int length_of_longest_substring(string s) {
    vector<int> last(256, -1);
    int start = 0, best = 0;
    for (int i = 0; i < (int)s.size(); i++) {
        if (last[(unsigned char)s[i]] >= start)
            start = last[(unsigned char)s[i]] + 1;
        last[(unsigned char)s[i]] = i;
        best = max(best, i - start + 1);
    }
    return best;
}
`,
  },
  "group-anagrams": {
    cppSolution: `vector<vector<string>> group_anagrams(vector<string> strs) {
    map<string, vector<string>> groups;
    for (auto& w : strs) {
        string key = w;
        sort(key.begin(), key.end());
        groups[key].push_back(w);
    }
    vector<vector<string>> res;
    for (auto& [k, g] : groups) {
        sort(g.begin(), g.end());
        res.push_back(g);
    }
    return res;
}
`,
  },
  "last-stone-weight": {
    cppSolution: `int last_stone_weight(vector<int> stones) {
    priority_queue<int> pq(stones.begin(), stones.end()); // max-heap
    while (pq.size() > 1) {
        int x = pq.top(); pq.pop();
        int y = pq.top(); pq.pop();
        if (x != y) pq.push(x - y);
    }
    return pq.empty() ? 0 : pq.top();
}
`,
  },
  "k-smallest": {
    cppSolution: `vector<int> k_smallest(vector<int> nums, int k) {
    nth_element(nums.begin(), nums.begin() + k, nums.end());
    vector<int> res(nums.begin(), nums.begin() + k);
    sort(res.begin(), res.end());
    return res;
}
`,
  },
  "merge-k-sorted": {
    cppSolution: `vector<int> merge_k_sorted(vector<vector<int>> lists) {
    // min-heap of (value, listIndex, elemIndex)
    using T = tuple<int,int,int>;
    priority_queue<T, vector<T>, greater<T>> pq;
    for (int i = 0; i < (int)lists.size(); i++)
        if (!lists[i].empty()) pq.push({lists[i][0], i, 0});
    vector<int> out;
    while (!pq.empty()) {
        auto [val, i, j] = pq.top(); pq.pop();
        out.push_back(val);
        if (j + 1 < (int)lists[i].size()) pq.push({lists[i][j+1], i, j+1});
    }
    return out;
}
`,
  },
  "climbing-stairs": {
    cppSolution: `int climbing_stairs(int n) {
    long long a = 1, b = 1;
    for (int i = 0; i < n; i++) { long long t = a + b; a = b; b = t; }
    return (int)a;
}
`,
  },
  "coin-change": {
    cppSolution: `int coin_change(vector<int> coins, int amount) {
    const int INF = 1e9;
    vector<int> dp(amount + 1, INF);
    dp[0] = 0;
    for (int a = 1; a <= amount; a++)
        for (int c : coins)
            if (c <= a) dp[a] = min(dp[a], dp[a - c] + 1);
    return dp[amount] >= INF ? -1 : dp[amount];
}
`,
  },
  "longest-common-subsequence": {
    cppSolution: `int longest_common_subsequence(string a, string b) {
    int m = a.size(), n = b.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            dp[i][j] = (a[i-1] == b[j-1]) ? dp[i-1][j-1] + 1
                                          : max(dp[i-1][j], dp[i][j-1]);
    return dp[m][n];
}
`,
  },
  "single-number": {
    cppSolution: `int single_number(vector<int> nums) {
    int result = 0;
    for (int x : nums) result ^= x;
    return result;
}
`,
  },
  "counting-bits": {
    cppSolution: `vector<int> counting_bits(int n) {
    vector<int> dp(n + 1, 0);
    for (int i = 1; i <= n; i++) dp[i] = dp[i >> 1] + (i & 1);
    return dp;
}
`,
  },
  "min-assignment-cost": {
    cppSolution: `int min_assignment_cost(vector<vector<int>> cost) {
    int n = cost.size();
    const int INF = 1e9;
    vector<int> dp(1 << n, INF);
    dp[0] = 0;
    for (int mask = 0; mask < (1 << n); mask++) {
        if (dp[mask] == INF) continue;
        int w = __builtin_popcount(mask);   // next worker
        if (w == n) continue;
        for (int j = 0; j < n; j++)
            if (!(mask & (1 << j)))
                dp[mask | (1 << j)] = min(dp[mask | (1 << j)], dp[mask] + cost[w][j]);
    }
    return dp[(1 << n) - 1];
}
`,
  },
  "gcd": {
    cppSolution: `long long gcd(long long a, long long b) {
    while (b) { a %= b; swap(a, b); }
    return a;
}
`,
  },
  "mod-pow": {
    cppSolution: `long long mod_pow(long long base, long long exp, long long mod) {
    if (mod == 1) return 0;
    long long result = 1; base %= mod;
    while (exp > 0) {
        if (exp & 1) result = result * base % mod;
        base = base * base % mod;
        exp >>= 1;
    }
    return result;
}
`,
  },
  "ncr-mod": {
    cppSolution: `long long mod_pow(long long b, long long e, long long m); // as above

long long ncr_mod(long long n, long long r, long long p) {
    if (r < 0 || r > n) return 0;
    long long num = 1, den = 1;
    for (long long i = 0; i < r; i++) {
        num = num * ((n - i) % p) % p;
        den = den * ((i + 1) % p) % p;
    }
    return num * mod_pow(den, p - 2, p) % p;  // Fermat inverse
}
`,
  },
  "tsp-held-karp": {
    cppSolution: `int held_karp(vector<vector<int>> dist) {
    int n = dist.size();
    if (n == 1) return 0;
    const int INF = 1e9;
    vector<vector<int>> dp(1 << n, vector<int>(n, INF));
    dp[1][0] = 0;                       // mask {0}, ending at 0
    for (int mask = 0; mask < (1 << n); mask++) {
        if (!(mask & 1)) continue;
        for (int i = 0; i < n; i++) {
            if (dp[mask][i] == INF) continue;
            for (int j = 0; j < n; j++) {
                if (mask & (1 << j)) continue;
                int nm = mask | (1 << j);
                dp[nm][j] = min(dp[nm][j], dp[mask][i] + dist[i][j]);
            }
        }
    }
    int full = (1 << n) - 1, best = INF;
    for (int i = 1; i < n; i++) best = min(best, dp[full][i] + dist[i][0]);
    return best;
}
`,
  },
  "activity-selection": {
    cppSolution: `int max_activities(vector<vector<int>> intervals) {
    sort(intervals.begin(), intervals.end(),
         [](auto& a, auto& b){ return a[1] < b[1]; });
    int count = 0, last = INT_MIN;
    for (auto& iv : intervals)
        if (iv[0] >= last) { count++; last = iv[1]; }
    return count;
}
`,
  },
  "jump-game": {
    cppSolution: `bool can_jump(vector<int> nums) {
    int reach = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (i > reach) return false;
        reach = max(reach, i + nums[i]);
    }
    return true;
}
`,
  },
  "min-arrows": {
    cppSolution: `int min_arrows(vector<vector<int>> points) {
    if (points.empty()) return 0;
    sort(points.begin(), points.end(),
         [](auto& a, auto& b){ return a[1] < b[1]; });
    int arrows = 1, end = points[0][1];
    for (auto& p : points)
        if (p[0] > end) { arrows++; end = p[1]; }
    return arrows;
}
`,
  },
  "max-product-subarray": {
    cppSolution: `int max_product_subarray(vector<int> nums) {
    int best = nums[0], curMax = nums[0], curMin = nums[0];
    for (int i = 1; i < (int)nums.size(); i++) {
        int x = nums[i];
        if (x < 0) swap(curMax, curMin);
        curMax = max(x, curMax * x);
        curMin = min(x, curMin * x);
        best = max(best, curMax);
    }
    return best;
}
`,
  },
  "str-str": {
    cppSolution: `int str_str(string haystack, string needle) {
    if (needle.empty()) return 0;
    size_t pos = haystack.find(needle);   // or implement KMP
    return pos == string::npos ? -1 : (int)pos;
}
`,
  },
  "count-occurrences": {
    cppSolution: `int count_occurrences(string text, string pattern) {
    if (pattern.empty()) return 0;
    int count = 0;
    size_t i = 0;
    while ((i = text.find(pattern, i)) != string::npos) {
        count++; i++;           // +1 so overlaps are counted
    }
    return count;
}
`,
  },
  "longest-happy-prefix": {
    cppSolution: `string longest_happy_prefix(string s) {
    int n = s.size();
    if (n == 0) return "";
    vector<int> pi(n, 0);
    for (int i = 1, k = 0; i < n; i++) {
        while (k > 0 && s[i] != s[k]) k = pi[k - 1];
        if (s[i] == s[k]) k++;
        pi[i] = k;
    }
    return s.substr(0, pi[n - 1]);
}
`,
  },
  "count-components": {
    cppSolution: `int count_components(int n, vector<vector<int>> edges) {
    vector<int> parent(n);
    iota(parent.begin(), parent.end(), 0);
    function<int(int)> find = [&](int x){ while (parent[x]!=x){ parent[x]=parent[parent[x]]; x=parent[x]; } return x; };
    int count = n;
    for (auto& e : edges) {
        int ra = find(e[0]), rb = find(e[1]);
        if (ra != rb) { parent[ra] = rb; count--; }
    }
    return count;
}
`,
  },
  "course-schedule": {
    cppSolution: `bool course_schedule(int n, vector<vector<int>> prerequisites) {
    vector<vector<int>> g(n);
    vector<int> indeg(n, 0);
    for (auto& p : prerequisites) { g[p[1]].push_back(p[0]); indeg[p[0]]++; }
    queue<int> q;
    for (int i = 0; i < n; i++) if (!indeg[i]) q.push(i);
    int seen = 0;
    while (!q.empty()) {
        int u = q.front(); q.pop(); seen++;
        for (int v : g[u]) if (--indeg[v] == 0) q.push(v);
    }
    return seen == n;
}
`,
  },
  "topo-order": {
    cppSolution: `vector<int> topo_order(int n, vector<vector<int>> edges) {
    vector<vector<int>> g(n);
    vector<int> indeg(n, 0);
    for (auto& e : edges) { g[e[0]].push_back(e[1]); indeg[e[1]]++; }
    priority_queue<int, vector<int>, greater<int>> pq;   // min-heap → lexicographically smallest
    for (int i = 0; i < n; i++) if (!indeg[i]) pq.push(i);
    vector<int> out;
    while (!pq.empty()) {
        int u = pq.top(); pq.pop(); out.push_back(u);
        for (int v : g[u]) if (--indeg[v] == 0) pq.push(v);
    }
    return (int)out.size() == n ? out : vector<int>{};
}
`,
  },
  "my-pow": {
    cppSolution: `double my_pow(double x, long long n) {
    if (n < 0) { x = 1 / x; n = -n; }
    double result = 1.0;
    while (n) {
        if (n & 1) result *= x;
        x *= x; n >>= 1;
    }
    return result;
}
`,
  },
  "majority-element": {
    cppSolution: `int majority_element(vector<int> nums) {
    int count = 0, candidate = 0;
    for (int x : nums) {
        if (count == 0) candidate = x;
        count += (x == candidate) ? 1 : -1;
    }
    return candidate;
}
`,
  },
  "count-primes": {
    cppSolution: `int count_primes(int n) {
    if (n < 3) return 0;
    vector<bool> sieve(n, true);
    sieve[0] = sieve[1] = false;
    for (long long p = 2; p * p < n; p++)
        if (sieve[p])
            for (long long q = p * p; q < n; q += p)
                sieve[q] = false;
    return count(sieve.begin(), sieve.end(), true);
}
`,
  },
  "nim-winner": {
    cppSolution: `bool nim_winner(vector<int> piles) {
    int x = 0;
    for (int p : piles) x ^= p;
    return x != 0;          // first player wins iff nim-sum != 0
}
`,
  },
  "subtraction-game": {
    cppSolution: `bool can_win_subtraction(int n, vector<int> moves) {
    vector<char> win(n + 1, false);
    for (int i = 1; i <= n; i++)
        for (int m : moves)
            if (m <= i && !win[i - m]) { win[i] = true; break; }
    return win[n];
}
`,
  },
  "grundy-number": {
    cppSolution: `int grundy_number(int n, vector<int> moves) {
    vector<int> g(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        set<int> reachable;
        for (int m : moves) if (m <= i) reachable.insert(g[i - m]);
        int mex = 0;
        while (reachable.count(mex)) mex++;
        g[i] = mex;
    }
    return g[n];
}
`,
  },
};
