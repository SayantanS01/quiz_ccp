# Git Workflow

When you modify the codebase:
1. Always ask the user for explicit permission to commit and push the changes.
2. Once the user approves, automatically execute `git add`, `git commit` (with a descriptive message), and `git push` to save and deploy the changes.
3. If the push gets stuck due to an interactive authentication prompt, safely cancel the task and ask the user to run `git push` manually.
