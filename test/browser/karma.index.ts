// Entry point for karma tests.
// Without this, karma+webpack generate full bundle for each test file.
// Not only this x times slower (where x is the number of test files),
// but it also breaks sourcemaps (breakpoints only work in tests, but not in the library code).

import "./hyperdomSpec.ts"
import "./routerSpec.ts"
import "./tsxSpec.tsx"
