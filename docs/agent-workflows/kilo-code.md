# Kilo Workflow Notes

- `.kilo/` artifacts are workspace-specific and may coexist with repository planning docs.
- Repository implementation should not depend on `.kilo/` internals.
- Agent-driven changes should keep `.kilo/` changes isolated unless the task explicitly targets them.
