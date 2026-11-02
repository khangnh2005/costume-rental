# Graph Report - costume-rental  (2026-11-02)

## Corpus Check
- 34 files · ~9,090 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: .css 8, (none) 2, .ico 1)

## Summary
- 197 nodes · 261 edges · 12 communities (11 shown, 1 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `88bdc872`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- BackEnd/package.json
- next
- FrontEnd/package.json
- costume.controller.js
- compilerOptions
- costume.route.js
- category.controller.js
- layout.tsx
- uploadToCloudinary.js
- scripts
- README.md
- AGENTS.md

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `next` - 15 edges
3. `axios` - 10 edges
4. `react` - 10 edges
5. `createSelectTree()` - 6 edges
6. `mongoose` - 6 edges
7. `express` - 5 edges
8. `scripts` - 5 edges
9. `Project Conventions & Architecture Guidelines` - 5 edges
10. `2. Kiến trúc BackEnd (Node.js & Express)` - 5 edges

## Surprising Connections (you probably didn't know these)
- `2. Kiến trúc BackEnd (Node.js & Express)` --references--> `createSelectTree()`  [INFERRED]
  .agents/rules/project_conventions.md → BackEnd/helpers/createTree.js
- `2. Kiến trúc BackEnd (Node.js & Express)` --references--> `uploadSingle()`  [INFERRED]
  .agents/rules/project_conventions.md → BackEnd/middlewares/admin/uploadCloud.middleware.js
- `2. Kiến trúc BackEnd (Node.js & Express)` --references--> `uploadFields()`  [INFERRED]
  .agents/rules/project_conventions.md → BackEnd/middlewares/admin/uploadCloud.middleware.js
- `2. Kiến trúc BackEnd (Node.js & Express)` --references--> `createTree()`  [INFERRED]
  .agents/rules/project_conventions.md → BackEnd/helpers/createTree.js
- `create()` --calls--> `createSelectTree()`  [EXTRACTED]
  BackEnd/controllers/admin/costume.controller.js → BackEnd/helpers/createTree.js

## Import Cycles
- None detected.

## Communities (12 total, 1 thin omitted)

### Community 0 - "BackEnd/package.json"
Cohesion: 0.07
Nodes (34): app, cors, dotenv, express, author, dependencies, cloudinary@^2.11.0, cors@^2.8.6 (+26 more)

### Community 1 - "next"
Cohesion: 0.09
Nodes (8): CategoryDetailContent(), CategoryDetailPage(), CategoryEditContent(), CategoryEditPage(), nextConfig, axios, next, react

### Community 2 - "FrontEnd/package.json"
Cohesion: 0.09
Nodes (27): eslintConfig, dependencies, axios@^1.20.0, next@16.4.2, react@19.3.0, react-dom@19.3.0, devDependencies, eslint@^9 (+19 more)

### Community 3 - "costume.controller.js"
Cohesion: 0.11
Nodes (12): mongoose, create(), createPost(), createSelectTree(), Costume, costumeSchema, mongoose, slug (+4 more)

### Community 4 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 5 - "costume.route.js"
Cohesion: 0.17
Nodes (7): systemConfig, express, router, express, multer, router, upload

### Community 6 - "category.controller.js"
Cohesion: 0.18
Nodes (5): createPost(), Category, categorySchema, mongoose, slug

### Community 7 - "layout.tsx"
Cohesion: 0.33
Nodes (3): geistMono, geistSans, metadata

### Community 8 - "uploadToCloudinary.js"
Cohesion: 0.15
Nodes (12): 1. Ngôn ngữ & Giao tiếp (Language & Messages), 2. Kiến trúc BackEnd (Node.js & Express), 3. Kiến trúc FrontEnd (Next.js App Router), 4. Tối ưu Token & Tra cứu Sơ đồ (Graphify), Project Conventions & Architecture Guidelines, createTree(), dotenv, streamifier (+4 more)

### Community 9 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 10 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `FrontEnd/package.json`, `layout.tsx`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Should `BackEnd/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07301587301587302 - nodes in this community are weakly interconnected._
- **Why does `mongoose` connect `costume.controller.js` to `BackEnd/package.json`, `category.controller.js`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.08739495798319327 - nodes in this community are weakly interconnected._
- **Why does `express` connect `BackEnd/package.json` to `costume.route.js`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Should `FrontEnd/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09359605911330049 - nodes in this community are weakly interconnected._
- **Should `costume.controller.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10822510822510822 - nodes in this community are weakly interconnected._