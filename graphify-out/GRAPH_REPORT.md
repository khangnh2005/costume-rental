# Graph Report - costume-rental  (2026-11-09)

## Corpus Check
- 69 files · ~22,474 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 16 file(s) not represented in the graph (top: .css 13, (none) 2, .ico 1)

## Summary
- 293 nodes · 457 edges · 13 communities (11 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2f0fc468`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- BackEnd/package.json
- (client)/layout.jsx
- FrontEnd/package.json
- 2. Kiến trúc BackEnd (Node.js & Express)
- compilerOptions
- index.js
- admin/costume.controller.js
- app/context/AuthContext.jsx
- user.model.js
- react
- README.md
- AGENTS.md

## God Nodes (most connected - your core abstractions)
1. `next` - 29 edges
2. `react` - 22 edges
3. `axios` - 16 edges
4. `compilerOptions` - 16 edges
5. `CostumeCard()` - 9 edges
6. `express` - 8 edges
7. `mongoose` - 8 edges
8. `CostumeDetailModal()` - 7 edges
9. `ClientHomePage()` - 7 edges
10. `useAuth()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `2. Kiến trúc BackEnd (Node.js & Express)` --references--> `createTree()`  [INFERRED]
  .agents/rules/project_conventions.md → BackEnd/helpers/createTree.js
- `2. Kiến trúc BackEnd (Node.js & Express)` --references--> `createSelectTree()`  [INFERRED]
  .agents/rules/project_conventions.md → BackEnd/helpers/createTree.js
- `2. Kiến trúc BackEnd (Node.js & Express)` --references--> `uploadSingle()`  [INFERRED]
  .agents/rules/project_conventions.md → BackEnd/middlewares/admin/uploadCloud.middleware.js
- `2. Kiến trúc BackEnd (Node.js & Express)` --references--> `uploadFields()`  [INFERRED]
  .agents/rules/project_conventions.md → BackEnd/middlewares/admin/uploadCloud.middleware.js
- `create()` --calls--> `createSelectTree()`  [EXTRACTED]
  BackEnd/controllers/admin/costume.controller.js → BackEnd/helpers/createTree.js

## Import Cycles
- None detected.

## Communities (13 total, 2 thin omitted)

### Community 0 - "BackEnd/package.json"
Cohesion: 0.09
Nodes (27): dotenv, streamifier, streamUpload(), uploadImage(), author, dependencies, cloudinary@^2.11.0, dotenv@^18.0.9 (+19 more)

### Community 1 - "(client)/layout.jsx"
Cohesion: 0.11
Nodes (12): LoginForm(), RegisterForm(), metadata, LoginPage(), metadata, metadata, RegisterPage(), Footer() (+4 more)

### Community 2 - "FrontEnd/package.json"
Cohesion: 0.08
Nodes (32): eslintConfig, dependencies, axios@^1.20.0, next@16.4.2, react@19.3.0, react-dom@19.3.0, devDependencies, eslint@^9 (+24 more)

### Community 3 - "2. Kiến trúc BackEnd (Node.js & Express)"
Cohesion: 0.25
Nodes (7): 1. Ngôn ngữ & Giao tiếp (Language & Messages), 2. Kiến trúc BackEnd (Node.js & Express), 3. Kiến trúc FrontEnd (Next.js App Router), 4. Tối ưu Token & Tra cứu Sơ đồ (Graphify), Project Conventions & Architecture Guidelines, uploadFields(), uploadSingle()

### Community 4 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 5 - "index.js"
Cohesion: 0.07
Nodes (20): systemConfig, app, cors, dotenv, express, cors@^2.8.6, multer@^2.5.0, express (+12 more)

### Community 6 - "admin/costume.controller.js"
Cohesion: 0.05
Nodes (25): mongoose, createPost(), create(), createPost(), mongoose, getAllDescendantCategoryIds(), index(), createSelectTree() (+17 more)

### Community 7 - "app/context/AuthContext.jsx"
Cohesion: 0.19
Nodes (10): API_BASE_URLS, apiGet(), apiPost(), AuthContext, AuthProvider(), geistMono, geistSans, metadata (+2 more)

### Community 8 - "user.model.js"
Cohesion: 0.22
Nodes (3): crypto, mongoose, userSchema

### Community 9 - "react"
Cohesion: 0.07
Nodes (23): CategoryDetailContent(), CategoryDetailPage(), CategoryEditContent(), CategoryEditPage(), CategorySection(), CostumeCard(), CostumeDetailModal(), CostumeFilters() (+15 more)

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `react` to `(client)/layout.jsx`, `FrontEnd/package.json`, `admin/layout.jsx`, `app/context/AuthContext.jsx`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Should `BackEnd/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08866995073891626 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `(client)/layout.jsx`, `FrontEnd/package.json`, `app/context/AuthContext.jsx`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Should `(client)/layout.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10826210826210826 - nodes in this community are weakly interconnected._
- **Why does `mongoose` connect `admin/costume.controller.js` to `user.model.js`, `BackEnd/package.json`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Should `FrontEnd/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0766488413547237 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._