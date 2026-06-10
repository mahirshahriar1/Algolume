import { callout, chapter, derive, heading, lesson, problem, prose, step, viz } from "../builder";

export const linkedLists = chapter(
  "linked-lists",
  "Linked lists",
  "Nodes connected by pointers — O(1) insertion, but no random access.",
  "Spline",
  [
    lesson(
      "pointers-cpp",
      "Pointers first (C++)",
      "The memory model behind linked lists: addresses, dereferencing, nullptr, and ownership.",
      9,
      [
        prose(
          "A linked list only makes sense once pointers make sense. In C++, a **pointer** is a variable whose value is a **memory address**. Instead of storing an object directly, it stores where that object lives.",
        ),
        heading("The three pointer ideas"),
        prose(
          "- `&x` means **address of x**. It asks: where in memory is this variable?\n- `int* p` means **p is a pointer to int**. It can store the address of an `int`.\n- `*p` means **dereference p**. It asks: go to the address inside `p` and read/write the value there.\n\nThat overloaded `*` is annoying at first: in a declaration (`int* p`) it means pointer type; in an expression (`*p`) it means dereference.",
        ),
        prose(
          "```cpp\nint x = 42;\nint* p = &x;      // p stores the address of x\n\ncout << x;        // 42\ncout << p;        // some address, e.g. 0x7ffee...\ncout << *p;       // 42, the value at that address\n\n*p = 99;          // write through the pointer\ncout << x;        // 99\n```",
        ),
        callout(
          "intuition",
          "A pointer is not the value; it is a route to the value. If `x` is a house, `p` is the address written on paper, and `*p` is walking to the house and opening the door.",
        ),
        heading("The arrow operator"),
        prose(
          "When a pointer points to a `struct` or `class`, C++ gives you a shortcut. These two lines mean the same thing:\n\n```cpp\n(*node).value = 10;\nnode->value = 10;\n```\n\nUse `->` when you have a pointer to an object. Linked-list code is full of it because each node points to another node.",
        ),
        heading("nullptr: pointing nowhere"),
        prose(
          "`nullptr` means the pointer does not point to a valid object. In linked lists, the last node's `next` pointer is `nullptr`, meaning \"there is no next node\".\n\n```cpp\nint* p = nullptr;\n\nif (p != nullptr) {\n    cout << *p;   // safe only if p points somewhere real\n}\n```\n\nDereferencing `nullptr` is a serious bug: the program is asking the CPU to read memory at no valid object.",
        ),
        callout(
          "warning",
          "Always ask before `*p` or `p->field`: **can p be nullptr here?** Many linked-list bugs are just missing that check.",
        ),
        heading("Dynamic allocation"),
        prose(
          "Linked-list nodes usually live on the heap because they must survive after the function that created them returns. In beginner DSA C++, you often see `new` to allocate and `delete` to release:\n\n```cpp\nint* p = new int(7);  // allocate one int on the heap\ncout << *p;          // 7\n\ndelete p;            // release the memory\np = nullptr;         // avoid a dangling pointer\n```\n\nModern production C++ often prefers smart pointers (`unique_ptr`, `shared_ptr`) or containers, but raw pointers are still the clearest way to learn how linked lists work under the hood.",
        ),
        heading("Pointer bugs to recognise"),
        prose(
          "- **Null pointer**: using `p->next` when `p == nullptr`.\n- **Dangling pointer**: using a pointer after `delete` freed the object.\n- **Memory leak**: losing the last pointer to heap memory without deleting it.\n- **Lost list**: moving `head` forward without saving the old node when you still need it.\n- **Cycle by mistake**: setting `node->next` to an earlier node unintentionally.",
        ),
        callout(
          "note",
          "For learning linked lists, draw boxes and arrows. Every assignment like `a->next = b` should visibly change one arrow in your drawing. If you cannot draw the pointer change, the code is not ready yet.",
        ),
      ],
    ),
    lesson(
      "linked-list-basics",
      "Linked lists",
      "How nodes and pointers trade away indexing for cheap insertion at the ends.",
      10,
      [
        prose(
          "A **linked list** stores each element in its own **node**. Each node has data plus a pointer to the next node. Unlike an array, nodes are not contiguous in memory — they can live anywhere, stitched together by `next` pointers. You keep one pointer called `head` that points to the first node.",
        ),
        heading("A node in C++"),
        prose(
          "```cpp\nstruct Node {\n    int value;\n    Node* next;\n\n    Node(int v) : value(v), next(nullptr) {}\n};\n```\n\nThis definition says: a node stores an integer and a pointer to another `Node`. The final node has `next == nullptr`.",
        ),
        heading("Walking a list"),
        prose(
          "Traversal is pointer-following. Start at `head`, read the current node, then move to `current->next`:\n\n```cpp\nvoid printList(Node* head) {\n    Node* current = head;\n\n    while (current != nullptr) {\n        cout << current->value << \" \";\n        current = current->next;\n    }\n}\n```\n\nThe loop stops at `nullptr`, which marks the end of the chain.",
        ),
        prose(
          "Insert at the head, then delete a value by walking to it and unlinking:",
        ),
        viz("linked-list", { title: "Insert at head, then delete a node" }),
        heading("Insert at the head"),
        prose(
          "Head insertion is constant time because it changes only two pointers:\n\n```cpp\nvoid pushFront(Node*& head, int x) {\n    Node* node = new Node(x);  // 1. allocate\n    node->next = head;         // 2. new node points to old first node\n    head = node;               // 3. head now points to new node\n}\n```\n\n`Node*& head` means **a reference to the head pointer**. Without the `&`, the function would receive a copy of the pointer and changing it would not update the caller's `head`.",
        ),
        heading("Delete a value"),
        prose(
          "Deletion has two cases: deleting the head, or deleting a later node. The important pointer move is: make the previous node skip over the deleted node.\n\n```cpp\nbool removeValue(Node*& head, int x) {\n    if (head == nullptr) return false;\n\n    if (head->value == x) {\n        Node* doomed = head;\n        head = head->next;\n        delete doomed;\n        return true;\n    }\n\n    Node* prev = head;\n    Node* cur = head->next;\n\n    while (cur != nullptr && cur->value != x) {\n        prev = cur;\n        cur = cur->next;\n    }\n\n    if (cur == nullptr) return false;\n\n    prev->next = cur->next;  // unlink cur\n    delete cur;\n    return true;\n}\n```",
        ),
        callout(
          "complexity",
          "Insert/delete at the **head**: `O(1)` — just repoint. But **access by index** is `O(n)`: there's no arithmetic shortcut, you must follow pointers from the head one at a time.",
        ),
        heading("Why access is linear"),
        derive(
          [
            step("node 0 is the head", "You know where the first node is."),
            step("node 1 is head.next", "The next address is stored inside the current node."),
            step("node i needs i pointer hops", "There is no formula like array address arithmetic."),
            step("worst case: i = n−1", "To reach the tail, you follow almost every pointer."),
          ],
          "O(n) access",
          "Pointers must be followed one by one",
        ),
        callout(
          "intuition",
          "Array vs linked list is a classic trade-off. Arrays give `O(1)` random access but `O(n)` middle-insert. Linked lists give `O(1)` end-insert but `O(n)` access. Pick by what your problem does most.",
        ),
        callout(
          "warning",
          "The order of pointer assignments matters. In `pushFront`, do `node->next = head` **before** `head = node`; otherwise you lose the old list. In deletion, save the node in `doomed`/`cur` before changing the link, so you can safely `delete` it.",
        ),
        prose(
          "Linked lists are the backbone of other structures: a **stack** and a **queue** can both be built from one, and hash tables chain collisions with them.",
        ),
        problem("reverse-linked-list"),
        problem("remove-nth-from-end"),
        problem("add-two-numbers"),
      ],
    ),
    lesson(
      "list-from-list",
      "Stacks & queues from a list",
      "The same nodes build two different structures — depending on which end you use.",
      5,
      [
        prose(
          "A linked list is a building block. Restrict *where* you add and remove, and you get the structures from the next chapter for free.",
        ),
        prose(
          "Only ever touch the **head** and you've built a **stack** — push and pop are both `O(1)` at the front:",
        ),
        viz("stack", { title: "A stack: only ever touch one end" }),
        prose(
          "Add at the **tail** and remove from the **head** (keeping a tail pointer) and you've built a **queue** — `O(1)` at both ends:",
        ),
        viz("queue", { title: "A queue: add at the rear, remove from the front" }),
        callout(
          "note",
          "This is why linked lists matter even though arrays index faster: they're the natural backbone for stacks, queues, adjacency lists, and hash-table chains.",
        ),
      ],
    ),
  ],
);
